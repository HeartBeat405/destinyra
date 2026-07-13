import type { Media, MediaType } from "../types";
import { isSupabaseConfigured } from "../supabase";
import { createServerSupabase } from "../db/supabase-server";
import { media as seedMedia } from "../../data/media";

const BUCKET = "media";

function mapRow(r: any): Media {
  return {
    id: r.id,
    url: r.url,
    storagePath: r.storage_path ?? undefined,
    name: r.name ?? r.url?.split("/").pop() ?? "file",
    type: (r.type ?? "image") as MediaType,
    alt: r.alt ?? "",
    caption: r.caption ?? "",
    folder: r.folder ?? "uploads",
    width: r.width ?? undefined,
    height: r.height ?? undefined,
    sizeBytes: r.size_bytes ?? undefined,
    uploadedBy: r.uploaded_by ?? null,
    createdAt: String(r.created_at ?? "").slice(0, 10),
  };
}

export type NewMedia = {
  url: string;
  storagePath: string;
  name: string;
  type: MediaType;
  folder: string;
  alt?: string;
  caption?: string;
  sizeBytes?: number;
  checksum?: string;
  uploadedBy?: string | null;
};

export const mediaRepo = {
  async findAll(limit = 500): Promise<Media[]> {
    if (!isSupabaseConfigured) return seedMedia;
    const db = await createServerSupabase();
    const { data } = await db
      .from("media")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data ?? []).map(mapRow);
  },

  async findById(id: string): Promise<Media | null> {
    if (!isSupabaseConfigured) {
      return seedMedia.find((m) => m.id === id) ?? null;
    }
    const db = await createServerSupabase();
    const { data } = await db.from("media").select("*").eq("id", id).single();
    return data ? mapRow(data) : null;
  },

  async existsByChecksum(checksum: string): Promise<Media | null> {
    if (!isSupabaseConfigured || !checksum) return null;
    const db = await createServerSupabase();
    const { data } = await db
      .from("media")
      .select("*")
      .eq("checksum", checksum)
      .limit(1)
      .maybeSingle();
    return data ? mapRow(data) : null;
  },

  // --- Storage object operations ---
  async uploadObject(
    path: string,
    file: File | Blob,
    contentType: string
  ): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const db = await createServerSupabase();
    const { error } = await db.storage
      .from(BUCKET)
      .upload(path, file, { contentType, upsert: false });
    return !error;
  },

  async removeObject(path: string): Promise<void> {
    if (!isSupabaseConfigured || !path) return;
    const db = await createServerSupabase();
    await db.storage.from(BUCKET).remove([path]);
  },

  publicUrl(path: string): string {
    // Built lazily; the storage client resolves the project URL.
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
  },

  // --- Table row operations ---
  async create(input: NewMedia): Promise<Media | null> {
    if (!isSupabaseConfigured) return null;
    const db = await createServerSupabase();
    const { data, error } = await db
      .from("media")
      .insert({
        url: input.url,
        storage_path: input.storagePath,
        name: input.name,
        type: input.type,
        folder: input.folder,
        alt: input.alt ?? "",
        caption: input.caption ?? "",
        size_bytes: input.sizeBytes ?? null,
        checksum: input.checksum ?? null,
        uploaded_by: input.uploadedBy ?? null,
      })
      .select("*")
      .single();
    if (error || !data) return null;
    return mapRow(data);
  },

  async update(
    id: string,
    patch: Partial<Pick<Media, "name" | "alt" | "caption" | "folder">>
  ): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const db = await createServerSupabase();
    const { error } = await db.from("media").update(patch).eq("id", id);
    return !error;
  },

  async remove(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const target = await this.findById(id);
    const db = await createServerSupabase();
    if (target?.storagePath) await this.removeObject(target.storagePath);
    const { error } = await db.from("media").delete().eq("id", id);
    return !error;
  },
};
