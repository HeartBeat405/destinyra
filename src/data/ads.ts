import type { AdType, AdPlacement, AdSlot } from "../lib/types";

// Persisted in the `settings` table under this key (Homepage Builder pattern).
export const AD_SLOTS_KEY = "ad_slots";

export const AD_TYPES: { value: AdType; label: string }[] = [
  { value: "adsense", label: "Google AdSense" },
  { value: "html", label: "Manual HTML" },
  { value: "affiliate", label: "Affiliate Banner" },
  { value: "image", label: "Image Banner" },
  { value: "script", label: "Custom Script" },
];

export const AD_PLACEMENTS: { value: AdPlacement; label: string }[] = [
  { value: "home-hero", label: "Homepage Hero" },
  { value: "home-sidebar", label: "Homepage Sidebar" },
  { value: "home-footer", label: "Homepage Footer" },
  { value: "article-top", label: "Article Top" },
  { value: "article-middle", label: "Article Middle" },
  { value: "article-bottom", label: "Article Bottom" },
  { value: "category", label: "Category Page" },
  { value: "search", label: "Search Page" },
  { value: "tool", label: "Tool Page" },
  { value: "custom", label: "Custom Widget" },
];

export const AD_TYPE_LABEL: Record<AdType, string> = Object.fromEntries(
  AD_TYPES.map((t) => [t.value, t.label])
) as Record<AdType, string>;

export const AD_PLACEMENT_LABEL: Record<AdPlacement, string> = Object.fromEntries(
  AD_PLACEMENTS.map((p) => [p.value, p.label])
) as Record<AdPlacement, string>;

// No default slots — the admin creates them.
export const DEFAULT_AD_SLOTS: AdSlot[] = [];
