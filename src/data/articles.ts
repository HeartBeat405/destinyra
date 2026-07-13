import type { Article } from "../lib/types";

// The seed shape omits relations + status; the articles repository attaches
// `category`/`author` and synthesizes `status: "published"` at load time.
export type SeedArticle = Omit<Article, "category" | "author" | "status">;

// Seed articles — mirror the `articles` table in Supabase.
// `content` uses lightweight markdown rendered by ArticleContent.
export const articles: SeedArticle[] = [
  {
    id: "art-life-path-meaning",
    title: "What Your Life Path Number Really Says About You",
    slug: "what-your-life-path-number-says-about-you",
    excerpt:
      "Your birth date hides a single number that maps your strengths, your blind spots, and the work you're here to do. Here's how to read it.",
    categorySlug: "numerology",
    authorId: "author-mara",
    publishedAt: "2026-06-24",
    readingTime: 7,
    tags: ["numerology", "life path", "self discovery"],
    relatedTool: "life-path",
    featured: true,
    trending: true,
    editorsPick: true,
    views: 18420,
    iconName: "Hash",
    gradient: "from-violet-600 to-purple-700",
    seoTitle:
      "Life Path Number Meaning: What Your Number Says About You",
    seoDescription:
      "Learn what your Life Path number reveals about your personality, strengths, and destiny — and how to calculate it from your birth date.",
    content: `Your Life Path number is the single most important number in numerology. It's calculated from your full date of birth, and it describes the core theme of your life — the lessons you keep meeting and the gifts you're meant to share.

## How the Life Path is calculated

You reduce every digit of your birth date down to a single number (with the exception of the Master Numbers 11, 22, and 33). For example, someone born on **1990-04-12** adds up to 1+9+9+0+0+4+1+2 = 26, then 2+6 = **8**.

That final number is your Life Path.

## A quick tour of the nine paths

- **1 — The Leader:** independent, ambitious, built to start things.
- **2 — The Peacemaker:** sensitive, diplomatic, deeply relational.
- **3 — The Creator:** expressive, social, full of ideas.
- **4 — The Builder:** disciplined, grounded, reliable.
- **5 — The Explorer:** restless, curious, hungry for freedom.
- **6 — The Nurturer:** caring, responsible, family-centered.
- **7 — The Seeker:** analytical, spiritual, introspective.
- **8 — The Powerhouse:** driven, strategic, success-oriented.
- **9 — The Humanitarian:** compassionate, idealistic, generous.

## Why it matters

Knowing your Life Path won't make decisions for you, but it gives you language for patterns you already feel. When you understand your number, you stop fighting your nature and start working with it.

> Numerology isn't fortune-telling. It's a mirror — and mirrors are useful when you're trying to grow.

Ready to find yours? Run your birth date through the calculator below and read the full breakdown.`,
  },
  {
    id: "art-angel-number-1111",
    title: "Seeing 11:11 Everywhere? Here's What It Might Mean",
    slug: "seeing-1111-everywhere-meaning",
    excerpt:
      "1111 is the most talked-about angel number for a reason. It shows up at thresholds — the moments right before something changes.",
    categorySlug: "angel-numbers",
    authorId: "author-luna",
    publishedAt: "2026-06-20",
    readingTime: 5,
    tags: ["angel numbers", "1111", "synchronicity"],
    relatedTool: "angel-number",
    featured: true,
    trending: true,
    views: 24190,
    iconName: "Feather",
    gradient: "from-cyan-500 to-sky-600",
    seoTitle: "Angel Number 1111 Meaning: Why You Keep Seeing It",
    seoDescription:
      "Discover the spiritual meaning of angel number 1111, why it keeps appearing, and what to do when you notice it.",
    content: `You glance at the clock and it's 11:11. Again. Then it's on a receipt, a license plate, a page number. When a number follows you like that, numerology calls it an angel number.

## What 1111 represents

1111 is associated with **new beginnings and alignment**. The repeated 1s amplify the energy of the number one — initiative, independence, and fresh starts. Many people report seeing it during transitions: a new job, a new relationship, a decision they've been avoiding.

## Three common interpretations

- **A green light.** You're on the right track; keep going.
- **A nudge to pay attention.** Your thoughts are manifesting quickly — choose them carefully.
- **A reminder you're not alone.** A sign of support during change.

## What to actually do with it

You don't have to believe in anything mystical for this to be useful. The next time you catch 1111, pause and ask: *what was I just thinking about?* The number becomes a bookmark for your own attention.

> Synchronicity is less about the universe sending mail and more about you finally reading it.`,
  },
  {
    id: "art-morning-routine",
    title: "The 20-Minute Morning Routine That Resets Your Whole Day",
    slug: "20-minute-morning-routine-reset",
    excerpt:
      "You don't need a four-hour ritual. You need twenty intentional minutes that put you back in the driver's seat.",
    categorySlug: "self-growth",
    authorId: "author-iris",
    publishedAt: "2026-06-18",
    readingTime: 6,
    tags: ["habits", "morning routine", "self growth"],
    relatedTool: "none",
    trending: true,
    editorsPick: true,
    views: 15730,
    iconName: "Sprout",
    gradient: "from-emerald-500 to-teal-500",
    seoDescription:
      "A simple, science-backed 20-minute morning routine to lower stress, sharpen focus, and start every day with intention.",
    content: `Most morning-routine advice is built for people with no job, no kids, and infinite willpower. This one isn't. It's twenty minutes, and it works because it's small enough to actually keep.

## Minute 0–5: Light and water

Open a window or step outside. Morning light tells your body the day has started and steadies your energy for hours. Drink a full glass of water before coffee.

## Minute 5–12: Move

Not a workout — just movement. Stretch, walk, or do a few rounds of breathing. The goal is to wake the body, not exhaust it.

## Minute 12–18: Write one line

Open a notebook and answer a single question: *what's the one thing that would make today a win?* One sentence. This is the difference between reacting to your day and directing it.

## Minute 18–20: Decide your first action

Pick the very first task you'll do and start it. Momentum is easier to keep than to create.

> Discipline isn't doing more. It's protecting the small things that quietly run your life.`,
  },
  {
    id: "art-love-compatibility-numbers",
    title: "Numerology Compatibility: Which Numbers Actually Match",
    slug: "numerology-compatibility-which-numbers-match",
    excerpt:
      "Some Life Path pairings feel effortless and others feel like homework. Here's the cheat sheet to who clicks with whom.",
    categorySlug: "relationships",
    authorId: "author-mara",
    publishedAt: "2026-06-15",
    readingTime: 8,
    tags: ["relationships", "compatibility", "numerology"],
    relatedTool: "compatibility",
    featured: true,
    views: 12880,
    iconName: "Heart",
    gradient: "from-rose-500 to-pink-600",
    seoDescription:
      "A practical guide to numerology compatibility — which Life Path numbers naturally match in love, and how to make any pairing work.",
    content: `Compatibility in numerology isn't about good numbers and bad numbers. It's about energy that flows easily versus energy that needs translation.

## The easy-flow pairings

Some numbers share a natural rhythm:

- **1 and 5** — two independent spirits who give each other room.
- **2 and 6** — both nurturing, both relational, deeply tender.
- **3 and 7** — the creative and the thinker balance each other.
- **4 and 8** — grounded ambition; they build empires together.

## The growth pairings

Other combinations create friction — which isn't bad, it's just work:

- **1 and 8** — two strong wills; magnetic but competitive.
- **4 and 5** — stability meets freedom; they stretch each other.

## The real secret

The number tells you the *tendencies*. The relationship tells you the *truth*. Two people with a "difficult" pairing who communicate well will outlast two "perfect" numbers who don't.

> Compatibility isn't a score you're stuck with. It's a starting map you learn to read together.

Curious about your pairing? Compare two birth dates with the compatibility tool.`,
  },
  {
    id: "art-career-numerology",
    title: "Find a Career That Fits Your Numbers, Not Just Your Resume",
    slug: "career-that-fits-your-numbers",
    excerpt:
      "When your work matches your natural energy, effort stops feeling like a fight. Here's how numerology can point you there.",
    categorySlug: "career",
    authorId: "author-noah",
    publishedAt: "2026-06-11",
    readingTime: 6,
    tags: ["career", "numerology", "purpose"],
    relatedTool: "life-path",
    views: 9420,
    iconName: "Briefcase",
    gradient: "from-blue-500 to-indigo-600",
    seoDescription:
      "Use your Life Path number to find work that fits your natural strengths — a numerology guide to career direction.",
    content: `The most exhausting jobs aren't the hardest ones. They're the ones that ask you to be someone you're not, all day, every day. Numerology can hint at the kind of work where you'd thrive instead of just survive.

## Match the number to the work

- **1, 8:** leadership, founding, anything you can own.
- **2, 6:** care, teaching, design, people-first roles.
- **3:** writing, media, branding, performance.
- **4:** systems, engineering, operations, finance.
- **5:** sales, travel, media, anything that changes often.
- **7:** research, analysis, strategy, deep work.
- **9:** mission-driven work, nonprofits, the arts.

## How to use this without quitting tomorrow

You don't have to overhaul your life. Look at your current role and ask which parts light you up. Then aim your next move toward more of that energy.

> A good career doesn't drain you to fund your real life. It *is* part of your real life.`,
  },
  {
    id: "art-tarot-beginners",
    title: "Tarot for Beginners: How to Read a Card Without Memorizing 78 Meanings",
    slug: "tarot-for-beginners-how-to-read",
    excerpt:
      "Forget the giant guidebook. Reading tarot is a skill of observation, and you can start today with a single card.",
    categorySlug: "tarot",
    authorId: "author-luna",
    publishedAt: "2026-06-08",
    readingTime: 7,
    tags: ["tarot", "beginners", "intuition"],
    relatedTool: "tarot",
    trending: true,
    views: 11210,
    iconName: "Layers",
    gradient: "from-purple-600 to-fuchsia-600",
    seoDescription:
      "A beginner-friendly guide to reading tarot cards using intuition and observation instead of memorizing every meaning.",
    content: `People think learning tarot means memorizing 78 cards. It doesn't. The best readers treat each card as a picture to describe, not a definition to recite.

## Start with one card a day

Shuffle, pull a single card, and look at it. Before you check any meaning, ask:

- What's happening in the image?
- How does it make me feel?
- What in my life looks like this scene?

## Then check the keywords

Now read the traditional meaning and notice where it overlaps with what you already saw. Over weeks, your own readings and the tradition start to merge.

## The three-card spread

When you're ready, pull three cards for **past, present, future** — or **situation, action, outcome**. Tell the story left to right.

> Tarot doesn't predict a fixed future. It reflects the present clearly enough that the future gets easier to choose.`,
  },
  {
    id: "art-overthinking",
    title: "How to Stop Overthinking Every Small Decision",
    slug: "how-to-stop-overthinking-decisions",
    excerpt:
      "Overthinking feels like being careful. Usually it's just fear wearing a smart-looking costume. Here's how to cut through it.",
    categorySlug: "mindset",
    authorId: "author-iris",
    publishedAt: "2026-06-05",
    readingTime: 5,
    tags: ["mindset", "decisions", "anxiety"],
    relatedTool: "none",
    views: 13990,
    iconName: "Brain",
    gradient: "from-amber-500 to-orange-600",
    seoDescription:
      "Practical, psychology-backed strategies to stop overthinking small decisions and act with more confidence.",
    content: `Overthinking promises certainty and delivers exhaustion. The cure isn't thinking harder — it's changing how you decide.

## Sort the decision first

Most decisions are reversible. Author and founders call these "two-way doors": if you're wrong, you walk back through. For those, speed beats perfection. Save your deep deliberation for the rare one-way doors.

## Set a timer

Give a small decision a small budget — two minutes, five at most. When the timer ends, choose. The quality rarely improves after that; only the anxiety grows.

## Lower the stakes out loud

Ask: *what's the realistic worst case?* Said plainly, most worst cases are survivable and small.

> You can't think your way to confidence. You act, you survive, and confidence follows.`,
  },
  {
    id: "art-digital-minimalism",
    title: "Digital Minimalism: Reclaim Your Attention in One Weekend",
    slug: "digital-minimalism-reclaim-attention",
    excerpt:
      "Your focus is the most valuable thing you own, and a dozen apps are spending it for you. Take it back in two days.",
    categorySlug: "productivity",
    authorId: "author-noah",
    publishedAt: "2026-06-02",
    readingTime: 6,
    tags: ["productivity", "focus", "digital minimalism"],
    relatedTool: "none",
    views: 8650,
    iconName: "Zap",
    gradient: "from-yellow-500 to-amber-600",
    seoDescription:
      "A weekend plan for digital minimalism — declutter your phone, rebuild your focus, and use technology on your terms.",
    content: `You didn't choose to check your phone 90 times a day. It was designed to happen. Digital minimalism is choosing, on purpose, what earns a place in your attention.

## Saturday: the audit

Open your screen-time report — really look. Then delete the three apps that took the most time and gave the least back. You can reinstall anything in thirty seconds, which is the point: friction restores choice.

## Saturday night: the cleanup

Turn off every non-human notification. Move social apps off your home screen. Set your phone to grayscale for a day and watch how much less it pulls at you.

## Sunday: the replacement

Attention abhors a vacuum. Decide what fills the freed-up time *before* boredom decides for you — a book, a walk, a project, a person.

> Minimalism isn't about owning less. It's about making room for more of what matters.`,
  },
];
