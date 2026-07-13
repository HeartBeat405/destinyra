-- ============================================================
-- DESTINYRA — Supabase Schema (V3)
-- ------------------------------------------------------------
-- Scalable, CMS-ready schema designed to grow to 50k+ articles.
-- Run this in the Supabase SQL editor (or via `supabase db push`).
--
-- Conventions:
--   * UUID primary keys, generated server-side.
--   * created_at / updated_at on every mutable table.
--   * Public read for published content via RLS; writes gated by role.
--   * Full-text search on articles via a generated tsvector + GIN index.
-- ============================================================

create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "unaccent";    -- better search

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------
do $$ begin
  create type user_role as enum ('guest', 'member', 'editor', 'admin', 'super_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type article_status as enum ('draft', 'scheduled', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tool_status as enum ('published', 'future', 'disabled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type comment_status as enum ('pending', 'approved', 'spam', 'deleted');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------
-- PROFILES  (extends auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique,
  full_name   text,
  avatar_url  text,
  bio         text,
  role        user_role not null default 'member',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- ROLE HELPERS
-- Defined early because policies below (e.g. the media storage
-- bucket) reference them. security definer lets them read
-- profiles without tripping RLS.
-- ------------------------------------------------------------
create or replace function public.is_staff()
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('editor', 'admin', 'super_admin')
  );
$$;

create or replace function public.my_role()
returns user_role language sql stable security definer as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ------------------------------------------------------------
-- AUTHORS  (public byline; may or may not map to a profile)
-- ------------------------------------------------------------
create table if not exists public.authors (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid references public.profiles(id) on delete set null,
  name            text not null,
  role            text,
  avatar_url      text,
  bio             text,
  website         text,
  twitter         text,
  instagram       text,
  linkedin        text,
  featured        boolean not null default false,
  visible         boolean not null default true,
  seo_title       text,
  seo_description text,
  sort_order      int not null default 0,
  deleted_at      timestamptz,
  created_at      timestamptz not null default now()
);

-- ------------------------------------------------------------
-- CATEGORIES
-- ------------------------------------------------------------
create table if not exists public.categories (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique,
  description     text,
  icon_name       text,                   -- lucide icon name (e.g. "Sprout")
  color           text,                   -- accent hex
  gradient        text,                   -- tailwind gradient classes
  parent_id       uuid references public.categories(id) on delete set null,
  featured        boolean not null default false,
  visible         boolean not null default true,
  seo_title       text,
  seo_description text,
  sort_order      int not null default 0,
  deleted_at      timestamptz,
  created_at      timestamptz not null default now()
);

-- ------------------------------------------------------------
-- TAGS  +  ARTICLE_TAGS (many-to-many)
-- ------------------------------------------------------------
create table if not exists public.tags (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique,
  description     text,
  featured        boolean not null default false,
  visible         boolean not null default true,
  seo_title       text,
  seo_description text,
  sort_order      int not null default 0,
  deleted_at      timestamptz
);

-- ------------------------------------------------------------
-- MEDIA  (uploaded assets — images, video, docs)
-- ------------------------------------------------------------
create table if not exists public.media (
  id           uuid primary key default gen_random_uuid(),
  url          text not null,
  storage_path text,                              -- path within the 'media' bucket
  name         text,                              -- display / original filename
  type         text not null default 'image',     -- image | video | document
  alt          text,
  caption      text,
  width        int,
  height       int,
  size_bytes   bigint,
  checksum     text,                              -- for duplicate detection
  folder       text default 'uploads',
  uploaded_by  uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now()
);

create index if not exists idx_media_folder on public.media (folder, created_at desc);
create index if not exists idx_media_checksum on public.media (checksum);

-- ------------------------------------------------------------
-- STORAGE: 'media' bucket (public read, staff write)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('media', 'media', true)
  on conflict (id) do nothing;

drop policy if exists "public read media bucket" on storage.objects;
create policy "public read media bucket" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "staff insert media bucket" on storage.objects;
create policy "staff insert media bucket" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "staff update media bucket" on storage.objects;
create policy "staff update media bucket" on storage.objects
  for update using (bucket_id = 'media' and public.is_staff());

drop policy if exists "staff delete media bucket" on storage.objects;
create policy "staff delete media bucket" on storage.objects
  for delete using (bucket_id = 'media' and public.is_staff());

-- ------------------------------------------------------------
-- TOOLS
-- ------------------------------------------------------------
create table if not exists public.tools (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique,
  description     text,
  icon_name       text,
  image_url       text,
  gradient        text,
  color           text,
  button_text     text,
  button_link     text,
  status          tool_status not null default 'future',
  category_id     uuid references public.categories(id) on delete set null,
  featured        boolean not null default false,
  visible         boolean not null default true,
  seo_title       text,
  seo_description text,
  sort_order      int not null default 0,
  deleted_at      timestamptz,
  created_at      timestamptz not null default now()
);

-- ------------------------------------------------------------
-- ARTICLES
-- ------------------------------------------------------------
create table if not exists public.articles (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  excerpt         text,
  content         text,                    -- markdown / rich text
  category_id     uuid references public.categories(id) on delete set null,
  author_id       uuid references public.authors(id) on delete set null,
  thumbnail_id    uuid references public.media(id) on delete set null,
  icon_name       text,                    -- fallback glyph when no thumbnail
  gradient        text,
  status          article_status not null default 'draft',
  reading_time    int default 1,
  views           bigint not null default 0,
  featured        boolean not null default false,
  editors_pick    boolean not null default false,
  trending        boolean not null default false,
  related_tool    text default 'none',     -- tool slug or 'none'
  seo_title       text,
  seo_description text,
  canonical_url   text,
  og_image_url    text,
  published_at    timestamptz,
  deleted_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- Full-text search vector (title^A, excerpt^B, content^C)
  search_tsv tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
  ) stored
);

create table if not exists public.article_tags (
  article_id uuid references public.articles(id) on delete cascade,
  tag_id     uuid references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- ------------------------------------------------------------
-- RELATED ARTICLES (manual curation; auto-related can use category)
-- ------------------------------------------------------------
create table if not exists public.related_articles (
  article_id  uuid references public.articles(id) on delete cascade,
  related_id  uuid references public.articles(id) on delete cascade,
  primary key (article_id, related_id),
  check (article_id <> related_id)
);

-- ------------------------------------------------------------
-- PAGES (static/legal content: about, privacy, etc.)
-- ------------------------------------------------------------
create table if not exists public.pages (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  content     text,
  seo_title   text,
  seo_description text,
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- NEWSLETTER
-- ------------------------------------------------------------
create table if not exists public.newsletter (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,
  confirmed    boolean not null default false,
  source       text default 'website',
  created_at   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- COMMENTS  (threaded; future-facing)
-- ------------------------------------------------------------
create table if not exists public.comments (
  id          uuid primary key default gen_random_uuid(),
  article_id  uuid references public.articles(id) on delete cascade,
  user_id     uuid references public.profiles(id) on delete set null,
  parent_id   uuid references public.comments(id) on delete cascade,
  body        text not null,
  status      comment_status not null default 'pending',
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- BOOKMARKS / READING HISTORY / LIKES
-- ------------------------------------------------------------
create table if not exists public.bookmarks (
  user_id     uuid references public.profiles(id) on delete cascade,
  article_id  uuid references public.articles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, article_id)
);

create table if not exists public.reading_history (
  user_id      uuid references public.profiles(id) on delete cascade,
  article_id   uuid references public.articles(id) on delete cascade,
  progress     numeric default 0,          -- 0..1 scroll progress
  last_read_at timestamptz not null default now(),
  primary key (user_id, article_id)
);

create table if not exists public.likes (
  user_id     uuid references public.profiles(id) on delete cascade,
  article_id  uuid references public.articles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, article_id)
);

-- ------------------------------------------------------------
-- ANALYTICS (lightweight event log; heavy metrics belong in GA)
-- ------------------------------------------------------------
create table if not exists public.analytics (
  id          bigint generated always as identity primary key,
  event       text not null,              -- view | share | tool_use | ...
  article_id  uuid references public.articles(id) on delete set null,
  path        text,
  referrer    text,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- SETTINGS (key/value site config managed from admin)
-- ------------------------------------------------------------
create table if not exists public.settings (
  key         text primary key,
  value       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- AUDIT LOGS (who changed what, when)
-- ------------------------------------------------------------
create table if not exists public.audit_logs (
  id           bigint generated always as identity primary key,
  actor_id     uuid references public.profiles(id) on delete set null,
  actor_name   text,
  action       text not null,              -- create | update | delete | publish | archive | restore | duplicate
  resource     text not null,              -- articles | categories | tools | ...
  resource_id  text,
  summary      text,
  meta         jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists idx_audit_created on public.audit_logs (created_at desc);
create index if not exists idx_audit_resource on public.audit_logs (resource, resource_id);

-- ------------------------------------------------------------
-- ARTICLE REVISIONS (version history — used by 2C restore/compare)
-- ------------------------------------------------------------
create table if not exists public.article_revisions (
  id           bigint generated always as identity primary key,
  article_id   uuid references public.articles(id) on delete cascade,
  editor_id    uuid references public.profiles(id) on delete set null,
  title        text,
  excerpt      text,
  content      text,
  meta         jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists idx_revisions_article
  on public.article_revisions (article_id, created_at desc);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_articles_status_pub
  on public.articles (status, published_at desc);
create index if not exists idx_articles_category
  on public.articles (category_id);
create index if not exists idx_articles_featured
  on public.articles (featured) where featured = true;
create index if not exists idx_articles_trending
  on public.articles (trending) where trending = true;
create index if not exists idx_articles_views
  on public.articles (views desc);
create index if not exists idx_articles_search
  on public.articles using gin (search_tsv);
create index if not exists idx_comments_article
  on public.comments (article_id, status);

-- ============================================================
-- updated_at trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_articles_updated on public.articles;
create trigger trg_articles_updated before update on public.articles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ROLE HELPER
-- ============================================================
create or replace function public.is_staff()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('editor', 'admin', 'super_admin')
  );
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles        enable row level security;
alter table public.authors         enable row level security;
alter table public.categories      enable row level security;
alter table public.tags            enable row level security;
alter table public.media           enable row level security;
alter table public.tools           enable row level security;
alter table public.articles        enable row level security;
alter table public.article_tags    enable row level security;
alter table public.related_articles enable row level security;
alter table public.pages           enable row level security;
alter table public.newsletter      enable row level security;
alter table public.comments        enable row level security;
alter table public.bookmarks       enable row level security;
alter table public.reading_history enable row level security;
alter table public.likes           enable row level security;
alter table public.analytics       enable row level security;
alter table public.settings        enable row level security;

-- Public read for published content & public taxonomy ---------
drop policy if exists "public read published articles" on public.articles;
create policy "public read published articles" on public.articles
  for select using (status = 'published' or public.is_staff());

drop policy if exists "staff write articles" on public.articles;
create policy "staff write articles" on public.articles
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);
drop policy if exists "staff write categories" on public.categories;
create policy "staff write categories" on public.categories
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "public read tools" on public.tools;
create policy "public read tools" on public.tools for select using (true);
drop policy if exists "staff write tools" on public.tools;
create policy "staff write tools" on public.tools
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "public read authors" on public.authors;
create policy "public read authors" on public.authors for select using (true);
drop policy if exists "public read tags" on public.tags;
create policy "public read tags" on public.tags for select using (true);
drop policy if exists "public read article_tags" on public.article_tags;
create policy "public read article_tags" on public.article_tags for select using (true);
drop policy if exists "public read related" on public.related_articles;
create policy "public read related" on public.related_articles for select using (true);
drop policy if exists "public read pages" on public.pages;
create policy "public read pages" on public.pages for select using (true);
drop policy if exists "public read media" on public.media;
create policy "public read media" on public.media for select using (true);

-- Comments: anyone can read approved; members write their own ---
drop policy if exists "read approved comments" on public.comments;
create policy "read approved comments" on public.comments
  for select using (status = 'approved' or public.is_staff() or user_id = auth.uid());
drop policy if exists "member insert comments" on public.comments;
create policy "member insert comments" on public.comments
  for insert with check (auth.uid() = user_id);

-- Newsletter: anyone can subscribe (insert), only staff read ----
drop policy if exists "anyone subscribe" on public.newsletter;
create policy "anyone subscribe" on public.newsletter for insert with check (true);
drop policy if exists "staff read newsletter" on public.newsletter;
create policy "staff read newsletter" on public.newsletter for select using (public.is_staff());

-- Per-user private data -----------------------------------------
drop policy if exists "own bookmarks" on public.bookmarks;
create policy "own bookmarks" on public.bookmarks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own history" on public.reading_history;
create policy "own history" on public.reading_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own likes" on public.likes;
create policy "own likes" on public.likes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Profiles: read all; users edit own profile but NOT their own role;
-- only super_admins may change roles / manage other profiles.
drop policy if exists "read profiles" on public.profiles;
create policy "read profiles" on public.profiles for select using (true);

create or replace function public.my_role()
returns user_role language sql stable security definer as $$
  select role from public.profiles where id = auth.uid();
$$;

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = public.my_role());

drop policy if exists "super admin manage profiles" on public.profiles;
create policy "super admin manage profiles" on public.profiles
  for all using (public.my_role() = 'super_admin')
  with check (public.my_role() = 'super_admin');

-- Settings: public read (display config like homepage layout/theme),
-- staff write. Keep secrets in env vars, NOT in this table.
drop policy if exists "staff settings" on public.settings;
drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings for select using (true);
drop policy if exists "staff write settings" on public.settings;
create policy "staff write settings" on public.settings
  for all using (public.is_staff()) with check (public.is_staff());
drop policy if exists "staff analytics" on public.analytics;
create policy "staff analytics read" on public.analytics for select using (public.is_staff());
drop policy if exists "insert analytics" on public.analytics;
create policy "insert analytics" on public.analytics for insert with check (true);

-- Audit logs + revisions: staff only
alter table public.audit_logs enable row level security;
drop policy if exists "staff read audit" on public.audit_logs;
create policy "staff read audit" on public.audit_logs for select using (public.is_staff());
drop policy if exists "staff write audit" on public.audit_logs;
create policy "staff write audit" on public.audit_logs for insert with check (public.is_staff());

alter table public.article_revisions enable row level security;
drop policy if exists "staff revisions" on public.article_revisions;
create policy "staff revisions" on public.article_revisions
  for all using (public.is_staff()) with check (public.is_staff());
