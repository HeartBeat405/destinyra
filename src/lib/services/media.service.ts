import type { Media } from "../types";
import { mediaRepo, type NewMedia } from "../repositories/media.repo";
import { articlesRepo } from "../repositories/articles.repo";
import { auditRepo } from "../repositories/audit.repo";
import { ALLOWED_MIME, MAX_UPLOAD_BYTES } from "../../data/media";
import { slugifyFileName } from "../validation/media.schema";

type Actor = { id: string; name: string };

export type UploadResult = {
  ok: boolean;
  media?: Media;
  error?: string;
  duplicate?: Media;
};

async function sha256(buffer: ArrayBuffer): Promise<string> {
  // Web Crypto is available in the Node/Edge runtime used by server actions.
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const mediaService = {
  list(): Promise<Media[]> {
    return mediaRepo.findAll();
  },

  getById(id: string): Promise<Media | null> {
    return mediaRepo.findById(id);
  },

  async upload(
    file: File,
    folder: string,
    actor: Actor
  ): Promise<UploadResult> {
    // Validate type + size before touching storage.
    const type = ALLOWED_MIME[file.type];
    if (!type) return { ok: false, error: `Unsupported file type: ${file.type}` };
    if (file.size > MAX_UPLOAD_BYTES) {
      return { ok: false, error: "File exceeds the 10 MB limit." };
    }

    const buffer = await file.arrayBuffer();
    const checksum = await sha256(buffer);

    // Prevent duplicate uploads.
    const existing = await mediaRepo.existsByChecksum(checksum);
    if (existing) return { ok: false, error: "This file already exists.", duplicate: existing };

    const safeName = slugifyFileName(file.name || "file");
    const stamp = Date.now().toString(36);
    const path = `${folder}/${stamp}-${safeName}`;

    const uploaded = await mediaRepo.uploadObject(path, file, file.type);
    if (!uploaded) return { ok: false, error: "Storage upload failed." };

    const created = await mediaRepo.create({
      url: mediaRepo.publicUrl(path),
      storagePath: path,
      name: file.name || safeName,
      type,
      folder,
      sizeBytes: file.size,
      checksum,
      uploadedBy: actor.id,
    } as NewMedia);

    if (!created) {
      // Roll back the orphaned storage object.
      await mediaRepo.removeObject(path);
      return { ok: false, error: "Could not save media record." };
    }

    await auditRepo.log({
      actorId: actor.id,
      actorName: actor.name,
      action: "create",
      resource: "media",
      resourceId: created.id,
      summary: `Uploaded ${created.name}`,
    });

    return { ok: true, media: created };
  },

  async updateMeta(
    id: string,
    patch: Partial<Pick<Media, "name" | "alt" | "caption" | "folder">>,
    actor: Actor
  ): Promise<boolean> {
    const ok = await mediaRepo.update(id, patch);
    if (ok) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: "update",
        resource: "media",
        resourceId: id,
        summary: patch.folder ? `Moved/updated media` : "Updated media metadata",
      });
    }
    return ok;
  },

  async remove(id: string, actor: Actor): Promise<boolean> {
    const ok = await mediaRepo.remove(id);
    if (ok) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: "delete",
        resource: "media",
        resourceId: id,
        summary: "Deleted media",
      });
    }
    return ok;
  },

  // Best-effort "unused" detection: media whose URL isn't referenced by any
  // article content, thumbnail gradient/icon, or OG image.
  async getUnusedIds(): Promise<Set<string>> {
    const [all, articles] = await Promise.all([
      mediaRepo.findAll(),
      articlesRepo.findAll(),
    ]);
    const haystack = articles
      .map((a) => `${a.content} ${a.seoTitle ?? ""} ${a.seoDescription ?? ""}`)
      .join(" ");
    const unused = new Set<string>();
    for (const m of all) {
      if (!haystack.includes(m.url)) unused.add(m.id);
    }
    return unused;
  },
};
