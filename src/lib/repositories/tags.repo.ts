import type { Tag } from "../types";
import { supabase, isSupabaseConfigured } from "../supabase";
import { createServerSupabase } from "../db/supabase-server";
import type { TagInput } from "../validation/tag.schema";

function mapRow(t: any): Tag {
  const usage = Array.isArray(t.article_tags)
    ? Number(t.article_tags[0]?.count ?? 0)
    : (t.usage_count ?? 0);
  return {
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description ?? "",
    order: t.sort_order ?? 0,
    featured: t.featured ?? false,
    visible: t.visible ?? true,
    seoTitle: t.seo_title ?? "",
    seoDescription: t.seo_description ?? "",
    archived: Boolean(t.deleted_at),
    usageCount: usage,
  };
}

function toRow(input: TagInput) {
  return {
    name: input.name,
    slug: input.slug,
    description: input.description || null,
    featured: input.featured,
    visible: input.visible,
    sort_order: input.order ?? 0,
    seo_title: input.seoTitle || null,
    seo_description: input.seoDescription || null,
  };
}

const SELECT = "*, article_tags(count)";

export const tagsRepo = {
  async findAll(): Promise<Tag[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from("tags")
        .select(SELECT)
        .eq("visible", true)
        .is("deleted_at", null)
        .order("sort_order", { ascending: true });
      if (data) return data.map(mapRow);
    }
    return [];
  },

  async findAllAdmin(): Promise<Tag[]> {
    if (isSupabaseConfigured && supabase) {
      const db = await createServerSupabase();
      const { data } = await db
        .from("tags")
        .select(SELECT)
        .order("name", { ascending: true });
      if (data) return data.map(mapRow);
    }
    return [];
  },

  async create(input: TagInput): Promise<Tag | null> {
    if (!isSupabaseConfigured) return null;
    const db = await createServerSupabase();
    const { data, error } = await db
      .from("tags")
      .insert(toRow(input))
      .select("*")
      .single();
    return error || !data ? null : mapRow(data);
  },

  async update(id: string, input: TagInput): Promise<Tag | null> {
    if (!isSupabaseConfigured) return null;
    const db = await createServerSupabase();
    const { data, error } = await db
      .from("tags")
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
      .from("tags")
      .update({ deleted_at: archived ? new Date().toISOString() : null })
      .eq("id", id);
    return !error;
  },

  async remove(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const db = await createServerSupabase();
    const { error } = await db.from("tags").delete().eq("id", id);
    return !error;
  },

  // Merge source tags into a target: move article relations, then delete sources.
  async merge(sourceIds: string[], targetId: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const ids = sourceIds.filter((id) => id !== targetId);
    if (ids.length === 0) return false;
    const db = await createServerSupabase();

    const { data: rels } = await db
      .from("article_tags")
      .select("article_id")
      .in("tag_id", ids);
    const articleIds = [...new Set((rels ?? []).map((r: any) => r.article_id))];

    if (articleIds.length) {
      await db
        .from("article_tags")
        .upsert(
          articleIds.map((aid) => ({ article_id: aid, tag_id: targetId })),
          { onConflict: "article_id,tag_id", ignoreDuplicates: true }
        );
    }
    await db.from("article_tags").delete().in("tag_id", ids);
    const { error } = await db.from("tags").delete().in("id", ids);
    return !error;
  },
};
