import { z } from "zod";

export const AD_TYPE_VALUES = ["adsense", "html", "affiliate", "image", "script"] as const;
export const AD_PLACEMENT_VALUES = [
  "home-hero",
  "home-sidebar",
  "home-footer",
  "article-top",
  "article-middle",
  "article-bottom",
  "category",
  "search",
  "tool",
  "custom",
] as const;

export const AdSlotSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2, "Name is too short.").max(80),
  type: z.enum(AD_TYPE_VALUES),
  placement: z.enum(AD_PLACEMENT_VALUES),
  enabled: z.boolean(),
  priority: z.number().int().min(0).max(100),
  publisherId: z.string().max(80).optional(),
  slotId: z.string().max(80).optional(),
  html: z.string().max(20000).optional(),
  imageUrl: z.string().max(500).optional(),
  link: z.string().max(500).optional(),
});

export const AdSlotsSchema = z.array(AdSlotSchema).max(60);

export type AdSlotInput = z.infer<typeof AdSlotSchema>;
