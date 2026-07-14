// ============================================================
// Destinyra V2 — Domain Types
// ------------------------------------------------------------
// These types model the CMS-ready architecture. The seed data
// in /src/data conforms to them, and the Supabase tables we add
// later will map 1:1 onto these shapes so the UI never changes.
// ============================================================

export type RelatedTool =
  | "none"
  | "life-path"
  | "tarot"
  | "angel-number"
  | "compatibility";

export type ToolStatus = "published" | "future" | "disabled";

export type ArticleStatus =
  | "draft"
  | "scheduled"
  | "published"
  | "archived";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** lucide icon name resolved by <Icon /> (e.g. "Sprout") */
  iconName: string;
  /** Accent hex color (used for borders/glows) */
  color: string;
  /** Tailwind gradient classes, e.g. "from-purple-600 to-fuchsia-500" */
  gradient: string;
  // --- Optional CMS fields (extended incrementally; safe defaults) ---
  order?: number;
  featured?: boolean;
  visible?: boolean;
  parentId?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  archived?: boolean;
};

export type Author = {
  id: string;
  name: string;
  role: string;
  /** Emoji or initials avatar */
  avatar: string;
  bio: string;
  // --- Optional CMS fields (extended incrementally; safe defaults) ---
  avatarUrl?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  featured?: boolean;
  visible?: boolean;
  order?: number;
  seoTitle?: string;
  seoDescription?: string;
  archived?: boolean;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  /** Lightweight markdown (## h2, ### h3, > quote, - list, **bold**) */
  content: string;
  categorySlug: string;
  authorId: string;
  /** ISO date string, e.g. "2026-06-12" */
  publishedAt: string;
  /** ISO date string for last update (optional) */
  updatedAt?: string;
  /** Minutes */
  readingTime: number;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  relatedTool: RelatedTool;
  status: ArticleStatus;
  featured?: boolean;
  editorsPick?: boolean;
  trending?: boolean;
  pinned?: boolean;
  views: number;
  /** Banner / cover image URL (also used for social sharing). Empty = use placeholder tile. */
  image?: string;
  /** Hero/banner text color: "auto" | "light" | "dark". */
  heroTextColor?: "auto" | "light" | "dark";
  /** lucide icon name for the thumbnail glyph (fallback when no image) */
  iconName: string;
  /** Tailwind gradient classes for the thumbnail (fallback when no image) */
  gradient: string;

  // --- Denormalized relations (attached by the repository layer) ---
  // Populated from a join (Supabase) or a seed lookup. Components read
  // these directly so the UI never performs its own data access.
  category?: Category;
  author?: Author;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order?: number;
  featured?: boolean;
  visible?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  archived?: boolean;
  usageCount: number;
};

export type Tool = {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** lucide icon name resolved by <Icon /> */
  iconName: string;
  gradient: string;
  buttonText: string;
  buttonLink: string;
  status: ToolStatus;
  // --- Optional CMS fields (extended incrementally; safe defaults) ---
  color?: string;
  order?: number;
  featured?: boolean;
  visible?: boolean;
  categoryId?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  archived?: boolean;
};

// Aggregated external news headline (snippet + image + link to source).
export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  imageUrl: string;
  sourceName: string;
  sourceUrl?: string;
  category: string;
  publishedAt: string;
};

// ------------------------------------------------------------
// Media Library
// ------------------------------------------------------------
export type MediaType = "image" | "video" | "document";

export type Media = {
  id: string;
  url: string;
  storagePath?: string;
  name: string;
  type: MediaType;
  alt: string;
  caption: string;
  folder: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
  uploadedBy?: string | null;
  createdAt: string;
};

export type MediaListResult = {
  items: Media[];
  total: number;
};

// ------------------------------------------------------------
// Site Settings
// ------------------------------------------------------------
export type SiteSettings = {
  general: {
    siteName: string;
    tagline: string;
    logoUrl: string;
    faviconUrl: string;
    language: string;
    timezone: string;
    copyright: string;
    footerText: string;
  };
  brand: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    buttonRadius: string;
    containerWidth: string;
    theme: "light";
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    twitterCard: "summary" | "summary_large_image";
    canonicalDomain: string;
    organizationName: string;
  };
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    x: string;
    youtube: string;
    tiktok: string;
    github: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    supportUrl: string;
  };
};

// ------------------------------------------------------------
// Advertisement slots
// ------------------------------------------------------------
export type AdType = "adsense" | "html" | "affiliate" | "image" | "script";

export type AdPlacement =
  | "home-hero"
  | "home-sidebar"
  | "home-footer"
  | "article-top"
  | "article-middle"
  | "article-bottom"
  | "category"
  | "search"
  | "tool"
  | "custom";

export type AdSlot = {
  id: string;
  name: string;
  type: AdType;
  placement: AdPlacement;
  enabled: boolean;
  priority: number;
  publisherId?: string;
  slotId?: string;
  html?: string;
  imageUrl?: string;
  link?: string;
};

// ------------------------------------------------------------
// Homepage Builder
// ------------------------------------------------------------
export type WidgetType =
  | "hero"
  | "featured"
  | "editors-choice"
  | "trending"
  | "latest"
  | "popular"
  | "categories"
  | "tools"
  | "news"
  | "newsletter"
  | "advertisement"
  | "quote"
  | "banner"
  | "custom-html";

export type WidgetBackground = "default" | "muted" | "gradient";

export type HomepageWidget = {
  id: string;
  type: WidgetType;
  enabled: boolean;
  order: number;
  title?: string;
  subtitle?: string;
  maxItems?: number;
  background?: WidgetBackground;
  animation?: boolean;
  // type-specific
  html?: string;
  quote?: string;
  quoteAuthor?: string;
  bannerText?: string;
  bannerCtaLabel?: string;
  bannerHref?: string;
  adSlot?: string;
};
