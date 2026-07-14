-- ============================================================
-- Destinyra — Reviews / testimonials table
-- Run this in the Supabase SQL editor (after schema.sql).
-- Anyone can submit a name + star rating + comment. Safe to re-run.
-- ============================================================

create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  rating     int not null check (rating between 1 and 5),
  comment    text not null,
  approved   boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_reviews_created on public.reviews (created_at desc);

alter table public.reviews enable row level security;

-- Public can read approved reviews. Inserts come from the server action
-- via the service-role key (bypasses RLS).
drop policy if exists "public read reviews" on public.reviews;
create policy "public read reviews" on public.reviews
  for select using (approved);
