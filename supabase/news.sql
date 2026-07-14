-- ============================================================
-- Destinyra — News aggregator table
-- Run this in the Supabase SQL editor (after schema.sql).
-- Stores ONLY headline + short snippet + image + link to the
-- original source (aggregator model — never the full article),
-- so it stays copyright-safe. Safe to re-run.
-- ============================================================

create table if not exists public.news (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  excerpt      text,                       -- short snippet only (NOT full text)
  url          text not null unique,       -- original source URL (dedup key + link-out)
  image_url    text,
  source_name  text,
  source_url   text,
  category     text default 'news',
  published_at timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists idx_news_published on public.news (published_at desc);

alter table public.news enable row level security;

-- Public can read; writes come from the cron job via the service-role
-- key (which bypasses RLS), so no public write policy is needed.
drop policy if exists "public read news" on public.news;
create policy "public read news" on public.news for select using (true);
