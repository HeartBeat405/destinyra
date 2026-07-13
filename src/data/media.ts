import type { Media } from "../lib/types";

// Default folder taxonomy for the media library (admins can also type new ones).
export const MEDIA_FOLDERS = [
  "uploads",
  "articles",
  "categories",
  "authors",
  "tools",
  "homepage",
  "banners",
  "seo",
] as const;

// Upload constraints (validated in the service).
export const ALLOWED_MIME: Record<string, "image" | "video" | "document"> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/gif": "image",
  "image/svg+xml": "image",
  "image/avif": "image",
  "video/mp4": "video",
  "video/webm": "video",
  "application/pdf": "document",
};

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

// Seed media — mirrors the `media` table. Points at an existing public asset
// so the library is demonstrable in dev mode (no Storage required).
export const media: Media[] = [
  {
    id: "media-og-banner",
    url: "/image/og-banner.png",
    storagePath: undefined,
    name: "og-banner.png",
    type: "image",
    alt: "Destinyra Open Graph banner",
    caption: "Default social sharing image",
    folder: "seo",
    width: 1200,
    height: 630,
    sizeBytes: 0,
    uploadedBy: null,
    createdAt: "2026-06-01",
  },
];
