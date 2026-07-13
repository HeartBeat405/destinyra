import { z } from "zod";

export const MediaMetaSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(160).optional(),
  alt: z.string().max(300).optional(),
  caption: z.string().max(500).optional(),
  folder: z.string().min(1).max(80).optional(),
});

export type MediaMetaInput = z.infer<typeof MediaMetaSchema>;

export const slugifyFileName = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
