import type { Category } from "../types";
import { supabase, isSupabaseConfigured } from "../supabase";
import { createServerSupabase } from "../db/supabase-server";
import type { CategoryInput } from "../validation/category.schema";

// Data access for categories (Supabase only).
function mapRow(c: any): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
    iconName: c.icon_name ?? "Sparkles",
    color: c.color ?? "#a855f7",
    gradient: c.gradient ?? "from-fuchsia-500 to-purple-600",
    order: c.sort_order ?? 0,
    featured: c.featured ?? false,
    visible: c.visible ?? true,
    parentId: c.parent_id ?? null,
    seoTitle: c.seo_title ?? "",
    seoDescription: c.seo_description ?? "",
    archived: Boolean(c.deleted_at),
  };
}

function toRow(input: CategoryInput) {
  return {
    name: input.name,
    slug: input.slug,
    description: input.description ?? "",
    icon_name: input.iconName,
    color: input.color ?? null,
    gradient: input.gradient,
    parent_id: input.parentId || null,
    featured: input.featured,
    visible: input.visible,
    sort_order: input.order ?? 0,
    seo_title: input.seoTitle || null,
    seo_description: input.seoDescription || null,
  };
}

export const categoriesRepo = {
  // Public: visible, non-archived.
  async findAll(): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("visible", true)
        .is("deleted_at", null)
        .order("sort_order", { ascending: true });
      if (data) return data.map(mapRow);
    }
    return [];
  },

  async findBySlug(slug: string): Promise<Category | null> {
    const all = await this.findAll();
    return all.find((c) => c.slug === slug) ?? null;
  },

  // Admin: everything, including hidden/archived.
  async findAllAdmin(): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      const db = await createServerSupabase();
      const { data } = await db
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (data) return data.map(mapRow);
    }
    return [];
  },

  async findById(id: string): Promise<Category | null> {
    if (!isSupabaseConfigured) return null;
    const db = await createServerSupabase();
    const { data } = await db
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();
    return data ? mapRow(data) : null;
  },

  async create(input: CategoryInput): Promise<Category | null> {
    if (!isSupabaseConfigured) return null;
    const db = await createServerSupabase();
    const { data, error } = await db
      .from("categories")
      .insert(toRow(input))
      .select("*")
      .single();
    return error || !data ? null : mapRow(data);
  },

  async update(id: string, input: CategoryInput): Promise<Category | null> {
    if (!isSupabaseConfigured) return null;
    const db = await createServerSupabase();
    const { data, error } = await db
      .from("categories")
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
      .from("categories")
      .update({ deleted_at: archived ? new Date().toISOString() : null })
      .eq("id", id);
    return !error;
  },

  async remove(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const db = await createServerSupabase();
    const { error } = await db.from("categories").delete().eq("id", id);
    return !error;
  },
};
