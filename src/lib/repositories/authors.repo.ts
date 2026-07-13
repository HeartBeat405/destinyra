import type { Author } from "../types";
import { supabase, isSupabaseConfigured } from "../supabase";
import { createServerSupabase } from "../db/supabase-server";
import type { AuthorInput } from "../validation/author.schema";

function mapRow(a: any): Author {
  return {
    id: a.id,
    name: a.name,
    role: a.role ?? "",
    avatar: a.avatar_url ?? "",
    bio: a.bio ?? "",
    avatarUrl: a.avatar_url ?? "",
    website: a.website ?? "",
    twitter: a.twitter ?? "",
    instagram: a.instagram ?? "",
    linkedin: a.linkedin ?? "",
    featured: a.featured ?? false,
    visible: a.visible ?? true,
    order: a.sort_order ?? 0,
    seoTitle: a.seo_title ?? "",
    seoDescription: a.seo_description ?? "",
    archived: Boolean(a.deleted_at),
  };
}

function toRow(input: AuthorInput) {
  return {
    name: input.name,
    role: input.role || null,
    bio: input.bio || null,
    avatar_url: input.avatarUrl || null,
    website: input.website || null,
    twitter: input.twitter || null,
    instagram: input.instagram || null,
    linkedin: input.linkedin || null,
    featured: input.featured,
    visible: input.visible,
    sort_order: input.order ?? 0,
    seo_title: input.seoTitle || null,
    seo_description: input.seoDescription || null,
  };
}

export const authorsRepo = {
  async findAll(): Promise<Author[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from("authors")
        .select("*")
        .eq("visible", true)
        .is("deleted_at", null)
        .order("sort_order", { ascending: true });
      if (data) return data.map(mapRow);
    }
    return [];
  },

  async findById(id: string): Promise<Author | null> {
    if (!isSupabaseConfigured) return null;
    const db = await createServerSupabase();
    const { data } = await db.from("authors").select("*").eq("id", id).single();
    return data ? mapRow(data) : null;
  },

  async findAllAdmin(): Promise<Author[]> {
    if (isSupabaseConfigured && supabase) {
      const db = await createServerSupabase();
      const { data } = await db
        .from("authors")
        .select("*")
        .order("sort_order", { ascending: true });
      if (data) return data.map(mapRow);
    }
    return [];
  },

  async create(input: AuthorInput): Promise<Author | null> {
    if (!isSupabaseConfigured) return null;
    const db = await createServerSupabase();
    const { data, error } = await db
      .from("authors")
      .insert(toRow(input))
      .select("*")
      .single();
    return error || !data ? null : mapRow(data);
  },

  async update(id: string, input: AuthorInput): Promise<Author | null> {
    if (!isSupabaseConfigured) return null;
    const db = await createServerSupabase();
    const { data, error } = await db
      .from("authors")
      .update(toRow(input))
      .eq("id", id)
      .select("*")
      .single();
    return error || !data ? null : mapRow(data);
  },

  async setArchived(id: string, archived: boolean): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const db = await createServerSupabase();
    const { error } = await db
      .from("authors")
      .update({ deleted_at: archived ? new Date().toISOString() : null })
      .eq("id", id);
    return !error;
  },

  async remove(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const db = await createServerSupabase();
    const { error } = await db.from("authors").delete().eq("id", id);
    return !error;
  },
};
