-- ============================================================
-- Destinyra — OPTIONAL sample content
-- Run this AFTER supabase/schema.sql, in the Supabase SQL editor.
-- Safe to re-run (uses ON CONFLICT / WHERE NOT EXISTS).
-- Delete/edit any of this later from the Admin panel.
-- ============================================================

-- ---------- Categories ----------
insert into public.categories (name, slug, description, icon_name, color, gradient, sort_order, visible, featured) values
  ('Self Growth',  'self-growth',  'Become a stronger, calmer, more intentional version of yourself.', 'Sprout',  '#22c55e', 'from-emerald-500 to-teal-500',  0, true, true),
  ('Relationships','relationships','Love, connection, and the art of understanding people.',           'Heart',   '#f43f5e', 'from-rose-500 to-pink-600',     1, true, false),
  ('Career',       'career',       'Work with purpose and build a path that fits who you are.',        'Briefcase','#3b82f6','from-blue-500 to-indigo-600',   2, true, false),
  ('Numerology',   'numerology',   'Decode the meaning hidden inside your numbers.',                   'Hash',    '#8b5cf6', 'from-violet-600 to-purple-700', 3, true, true),
  ('Tarot',        'tarot',        'Ancient cards, modern guidance for the questions you carry.',      'Layers',  '#d946ef', 'from-purple-600 to-fuchsia-600',4, true, false),
  ('Mindset',      'mindset',      'Train your thinking and master your inner game.',                  'Brain',   '#f59e0b', 'from-amber-500 to-orange-600',  5, true, false)
on conflict (slug) do nothing;

-- ---------- Authors ----------
insert into public.authors (name, role, bio, visible, featured)
select 'Luna Vega', 'Spirituality Editor', 'Luna writes about intuition, energy, and the quiet practices that change a life.', true, true
where not exists (select 1 from public.authors where name = 'Luna Vega');

insert into public.authors (name, role, bio, visible)
select 'Noah Bennett', 'Career & Productivity', 'Noah covers work, focus, and building a career that actually fits you.', true
where not exists (select 1 from public.authors where name = 'Noah Bennett');

insert into public.authors (name, role, bio, visible)
select 'Iris Calderon', 'Self Growth Writer', 'Iris explores mindset, habits, and the science of becoming who you want to be.', true
where not exists (select 1 from public.authors where name = 'Iris Calderon');

-- ---------- Tools ----------
insert into public.tools (name, slug, description, icon_name, gradient, button_text, button_link, status, visible, featured, sort_order) values
  ('Life Path Calculator', 'life-path',      'Reveal your core Life Path number and the personality blueprint behind your birth date.', 'Orbit',         'from-violet-600 to-purple-700', 'Discover Your Life Path', '/tools/life-path',      'published', true, true,  0),
  ('Love Compatibility',   'compatibility',  'Compare two birth dates to see how your numbers harmonize in love and friendship.',        'HeartHandshake','from-rose-500 to-pink-600',    'Check Compatibility',     '/tools/compatibility',  'published', true, false, 1),
  ('Tarot Reading',        'tarot',          'Pull a card and receive focused guidance for the question on your mind right now.',        'Layers',        'from-purple-600 to-fuchsia-600','Draw Your Card',          '/tools/tarot',          'published', true, false, 2),
  ('Angel Number Decoder', 'angel-number',   'Enter a repeating number you keep seeing and decode the message behind it.',               'Feather',       'from-cyan-500 to-sky-600',     'Decode Your Number',      '/tools/angel-number',   'published', true, false, 3)
on conflict (slug) do nothing;

-- ---------- Articles ----------
insert into public.articles
  (title, slug, excerpt, content, category_id, author_id, status, reading_time,
   featured, editors_pick, trending, related_tool, icon_name, gradient, views, published_at,
   seo_title, seo_description)
select
  'What Your Life Path Number Really Says About You',
  'what-your-life-path-number-says-about-you',
  'Your birth date hides a single number that maps your strengths, your blind spots, and the work you''re here to do.',
  '## How the Life Path is calculated

You reduce every digit of your birth date down to a single number (except the Master Numbers 11, 22, and 33). Someone born on **1990-04-12** adds up to 1+9+9+0+0+4+1+2 = 26, then 2+6 = **8**.

## A quick tour of the nine paths

- **1 — The Leader:** independent, ambitious, built to start things.
- **2 — The Peacemaker:** sensitive, diplomatic, deeply relational.
- **3 — The Creator:** expressive, social, full of ideas.
- **7 — The Seeker:** analytical, spiritual, introspective.

> Numerology isn''t fortune-telling. It''s a mirror — and mirrors are useful when you''re trying to grow.

Run your birth date through the calculator below and read the full breakdown.',
  (select id from public.categories where slug = 'numerology'),
  (select id from public.authors where name = 'Luna Vega' limit 1),
  'published', 7, true, true, true, 'life-path', 'Hash', 'from-violet-600 to-purple-700', 1840, now(),
  'Life Path Number Meaning: What Your Number Says About You',
  'Learn what your Life Path number reveals about your personality, strengths, and destiny — and how to calculate it.'
where not exists (select 1 from public.articles where slug = 'what-your-life-path-number-says-about-you');

insert into public.articles
  (title, slug, excerpt, content, category_id, author_id, status, reading_time,
   featured, trending, related_tool, icon_name, gradient, views, published_at,
   seo_title, seo_description)
select
  'The 20-Minute Morning Routine That Resets Your Whole Day',
  '20-minute-morning-routine-reset',
  'You don''t need a four-hour ritual. You need twenty intentional minutes that put you back in the driver''s seat.',
  '## Minute 0–5: Light and water

Open a window or step outside. Morning light steadies your energy for hours. Drink a full glass of water before coffee.

## Minute 5–12: Move

Not a workout — just movement. Stretch, walk, or breathe. Wake the body, don''t exhaust it.

## Minute 12–18: Write one line

Answer a single question: *what''s the one thing that would make today a win?*

> Discipline isn''t doing more. It''s protecting the small things that quietly run your life.',
  (select id from public.categories where slug = 'self-growth'),
  (select id from public.authors where name = 'Iris Calderon' limit 1),
  'published', 6, false, true, 'none', 'Sprout', 'from-emerald-500 to-teal-500', 1573, now() - interval '2 days',
  'A 20-Minute Morning Routine to Reset Your Day',
  'A simple, science-backed 20-minute morning routine to lower stress, sharpen focus, and start every day with intention.'
where not exists (select 1 from public.articles where slug = '20-minute-morning-routine-reset');

insert into public.articles
  (title, slug, excerpt, content, category_id, author_id, status, reading_time,
   featured, related_tool, icon_name, gradient, views, published_at,
   seo_title, seo_description)
select
  'Find a Career That Fits Your Numbers, Not Just Your Resume',
  'career-that-fits-your-numbers',
  'When your work matches your natural energy, effort stops feeling like a fight.',
  '## Match the number to the work

- **1, 8:** leadership, founding, anything you can own.
- **2, 6:** care, teaching, design, people-first roles.
- **4:** systems, engineering, operations, finance.
- **7:** research, analysis, strategy, deep work.

## How to use this without quitting tomorrow

Look at your current role and ask which parts light you up. Then aim your next move toward more of that energy.

> A good career doesn''t drain you to fund your real life. It *is* part of your real life.',
  (select id from public.categories where slug = 'career'),
  (select id from public.authors where name = 'Noah Bennett' limit 1),
  'published', 6, false, 'life-path', 'Briefcase', 'from-blue-500 to-indigo-600', 942, now() - interval '5 days',
  'Find a Career That Fits Your Numbers',
  'Use your Life Path number to find work that fits your natural strengths — a numerology guide to career direction.'
where not exists (select 1 from public.articles where slug = 'career-that-fits-your-numbers');
