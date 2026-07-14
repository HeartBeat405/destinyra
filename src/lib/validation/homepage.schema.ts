import { z } from "zod";

export const WIDGET_TYPES = [
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

export const HomepageWidgetSchema = z.object({
  id: z.string().min(1),
  type: z.enum(WIDGET_TYPES),
  enabled: z.boolean(),
  order: z.number().int().min(0),
  title: z.string().max(120).optional(),
  subtitle: z.string().max(200).optional(),
  maxItems: z.number().int().min(1).max(24).optional(),
  background: z.enum(["default", "muted", "gradient"]).optional(),
  animation: z.boolean().optional(),
  html: z.string().max(20000).optional(),
  quote: z.string().max(500).optional(),
  quoteAuthor: z.string().max(120).optional(),
  bannerText: z.string().max(300).optional(),
  bannerCtaLabel: z.string().max(60).optional(),
  bannerHref: z.string().max(500).optional(),
  adSlot: z.string().max(120).optional(),
});

export const HomepageWidgetsSchema = z.array(HomepageWidgetSchema).max(40);

export type HomepageWidgetInput = z.infer<typeof HomepageWidgetSchema>;
