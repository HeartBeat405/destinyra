import { z } from "zod";

export const CategoryInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is too short.").max(80),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only."),
  description: z.string().max(300).optional().default(""),
  iconName: z.string().default("Sparkles"),
  color: z.string().max(20).optional().default("#6C63FF"),
  gradient: z.string().default("from-fuchsia-500 to-purple-600"),
  parentId: z.string().nullable().optional(),
  featured: z.boolean().optional().default(false),
  visible: z.boolean().optional().default(true),
  order: z.number().int().min(0).optional().default(0),
  seoTitle: z.string().max(70).optional().default(""),
  seoDescription: z.string().max(200).optional().default(""),
});

export type CategoryInput = z.infer<typeof CategoryInputSchema>;
