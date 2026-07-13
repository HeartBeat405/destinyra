import { z } from "zod";

export const TagInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is too short.").max(60),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only."),
  description: z.string().max(240).optional().default(""),
  featured: z.boolean().optional().default(false),
  visible: z.boolean().optional().default(true),
  order: z.number().int().min(0).optional().default(0),
  seoTitle: z.string().max(70).optional().default(""),
  seoDescription: z.string().max(200).optional().default(""),
});

export type TagInput = z.infer<typeof TagInputSchema>;
