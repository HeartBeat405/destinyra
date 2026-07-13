import { z } from "zod";

const optionalUrl = z
  .union([z.string().url(), z.literal("")])
  .optional()
  .default("");

export const AuthorInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is too short.").max(80),
  role: z.string().max(80).optional().default(""),
  bio: z.string().max(600).optional().default(""),
  avatarUrl: optionalUrl,
  website: optionalUrl,
  twitter: z.string().max(80).optional().default(""),
  instagram: z.string().max(80).optional().default(""),
  linkedin: z.string().max(80).optional().default(""),
  featured: z.boolean().optional().default(false),
  visible: z.boolean().optional().default(true),
  order: z.number().int().min(0).optional().default(0),
  seoTitle: z.string().max(70).optional().default(""),
  seoDescription: z.string().max(200).optional().default(""),
});

export type AuthorInput = z.infer<typeof AuthorInputSchema>;
