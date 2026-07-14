import type { HomepageWidget } from "../lib/types";

// Default homepage layout — used when no config is stored in `settings`.
// Mirrors the original hardcoded homepage so nothing changes until an
// admin customizes it. Persisted config (Supabase) overrides this.
export const DEFAULT_HOMEPAGE_WIDGETS: HomepageWidget[] = [
  { id: "w-hero", type: "hero", enabled: true, order: 0 },
  {
    id: "w-news",
    type: "news",
    enabled: true,
    order: 1,
    title: "Latest News",
    subtitle: "Fresh headlines, updated daily",
    maxItems: 4,
  },
  {
    id: "w-featured",
    type: "featured",
    enabled: true,
    order: 2,
    title: "Featured Stories",
    subtitle: "Editor's picks worth your time this week",
  },
  {
    id: "w-trending",
    type: "trending",
    enabled: true,
    order: 3,
    title: "Trending Now",
    subtitle: "What everyone's reading right now",
    maxItems: 4,
  },
  {
    id: "w-categories",
    type: "categories",
    enabled: true,
    order: 4,
    title: "Popular Categories",
    subtitle: "Find the topics that speak to you",
    maxItems: 8,
  },
  {
    id: "w-latest",
    type: "latest",
    enabled: true,
    order: 5,
    title: "Latest Articles",
    maxItems: 6,
  },
  {
    id: "w-popular",
    type: "popular",
    enabled: true,
    order: 6,
    title: "Popular This Week",
    maxItems: 5,
  },
  {
    id: "w-tools",
    type: "tools",
    enabled: true,
    order: 7,
    title: "Explore Our Tools",
    subtitle: "Turn insight into action with interactive tools",
    maxItems: 3,
  },
  { id: "w-newsletter", type: "newsletter", enabled: true, order: 8 },
];

// Metadata for the admin builder: label + whether a widget pulls article data.
export const WIDGET_META: Record<
  string,
  { label: string; description: string; configurable: boolean }
> = {
  hero: { label: "Hero Carousel", description: "Full-width rotating banner (articles or news)", configurable: true },
  featured: { label: "Featured Story", description: "Large editor's pick + two cards", configurable: true },
  "editors-choice": { label: "Editor's Choice", description: "Highlighted editor's pick", configurable: true },
  trending: { label: "Trending", description: "Most-viewed trending articles", configurable: true },
  latest: { label: "Latest Articles", description: "Newest published articles", configurable: true },
  popular: { label: "Popular Articles", description: "Ranked by views", configurable: true },
  categories: { label: "Popular Categories", description: "Category cards", configurable: true },
  tools: { label: "Tools", description: "Interactive tool cards", configurable: true },
  news: { label: "Latest News", description: "Fresh aggregated headlines", configurable: true },
  newsletter: { label: "Reviews", description: "Visitor reviews + submit form", configurable: false },
  advertisement: { label: "Advertisement", description: "Ad slot placeholder", configurable: true },
  quote: { label: "Quote", description: "A featured quote", configurable: true },
  banner: { label: "Custom Banner", description: "CTA banner with link", configurable: true },
  "custom-html": { label: "Custom HTML", description: "Raw HTML block", configurable: true },
};

export const ADDABLE_WIDGET_TYPES = [
  "hero",
  "featured",
  "editors-choice",
  "trending",
  "latest",
  "popular",
  "categories",
  "tools",
  "news",
  "newsletter",
  "advertisement",
  "quote",
  "banner",
  "custom-html",
] as const;
