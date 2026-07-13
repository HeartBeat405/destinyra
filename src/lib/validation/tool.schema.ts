import { z } from "zod";

export const TOOL_STATUSES = ["published", "future", "disabled"] as const;

export const ToolInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is too short.").max(80),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only."),
  description: z.string().max(400).optional().default(""),
  iconName: z.string().default("Sparkles"),
  gradient: z.string().default("from-violet-600 to-purple-700"),
  color: z.string().max(20).optional().default("#6C63FF"),
  buttonText: z.string().max(60).optional().default("Open"),
  buttonLink: z.string().max(200).optional().default(""),
  status: z.enum(TOOL_STATUSES).default("future"),
  categoryId: z.string().nullable().optional(),
  featured: z.boolean().optional().default(false),
  visible: z.boolean().optional().default(true),
  order: z.number().int().min(0).optional().default(0),
  seoTitle: z.string().max(70).optional().default(""),
  seoDescription: z.string().max(200).optional().default(""),
});

export type ToolInput = z.infer<typeof ToolInputSchema>;
