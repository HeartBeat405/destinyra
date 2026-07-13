import { z } from "zod";

// Single source of truth for article input validation. Imported by the
// server actions (validation) and the editor (TS type via z.infer).

export const ARTICLE_STATUSES = [
  "draft",
  "scheduled",
  "published",
  "archived",
] as const;

export const RELATED_TOOLS = [
  "none",
  "life-path",
  "tarot",
  "angel-number",
  "compatibility",
] as const;

const optionalUrl = z
  .union([z.string().url(), z.literal("")])
  .optional()
  .default("");

export const ArticleInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title is too short.").max(160),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and hyphens."),
  excerpt: z.string().max(320).optional().default(""),
  content: z.string().optional().default(""),
  categoryId: z.string().nullable().optional(),
  authorId: z.string().nullable().optional(),
  iconName: z.string().default("Sparkles"),
  gradient: z.string().default("from-violet-600 to-purple-700"),
  status: z.enum(ARTICLE_STATUSES).default("draft"),
  relatedTool: z.enum(RELATED_TOOLS).default("none"),
  tags: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  editorsPick: z.boolean().optional().default(false),
  trending: z.boolean().optional().default(false),
  pinned: z.boolean().optional().default(false),
  seoTitle: z.string().max(70).optional().default(""),
  seoDescription: z.string().max(200).optional().default(""),
  focusKeyword: z.string().optional().default(""),
  canonicalUrl: optionalUrl,
  ogImageUrl: z.string().optional().default(""),
  scheduledAt: z.string().optional().nullable(),
});

export type ArticleInput = z.infer<typeof ArticleInputSchema>;

export type BulkAction = "publish" | "draft" | "archive" | "delete";

// Result type shared between server actions and client UI (kept out of the
// "use server" module, which may only export async functions).
export type ActionResult<T = undefined> = {
  ok: boolean;
  message?: string;
  devMode?: boolean;
  fieldErrors?: Record<string, string>;
  data?: T;
};
