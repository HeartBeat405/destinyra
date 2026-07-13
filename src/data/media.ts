// Media library configuration (constants only — no seed content).

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
