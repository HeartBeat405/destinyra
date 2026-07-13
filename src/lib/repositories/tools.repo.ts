import type { Tool } from "../types";
import { supabase, isSupabaseConfigured } from "../supabase";
import { createServerSupabase } from "../db/supabase-server";
import type { ToolInput } from "../validation/tool.schema";
import { tools as seed } from "../../data/tools";

function mapRow(t: any): Tool {
  return {
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description ?? "",
    iconName: t.icon_name ?? "Sparkles",
    gradient: t.gradient ?? "from-violet-600 to-purple-700",
    buttonText: t.button_text ?? "Open",
    buttonLink: t.button_link ?? `/tools/${t.slug}`,
    status: t.status ?? "future",
    color: t.color ?? "#6C63FF",
    order: t.sort_order ?? 0,
    featured: t.featured ?? false,
    visible: t.visible ?? true,
    categoryId: t.category_id ?? null,
    seoTitle: t.seo_title ?? "",
    seoDescription: t.seo_description ?? "",
    archived: Boolean(t.deleted_at),
  };
}

function toRow(input: ToolInput) {
  return {
    name: input.name,
    slug: input.slug,
    description: input.description ?? "",
    icon_name: input.iconName,
    gradient: input.gradient,
    color: input.color ?? null,
    button_text: input.buttonText || "Open",
    button_link: input.buttonLink || `/tools/${input.slug}`,
    status: input.status,
    category_id: input.categoryId || null,
    featured: input.featured,
    visible: input.visible,
    sort_order: input.order ?? 0,
    seo_title: input.seoTitle || null,
    seo_description: input.seoDescription || null,
  };
}

export const toolsRepo = {
  // Public: visible, non-archived.
  async findAll(): Promise<Tool[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from("tools")
        .select("*")
        .eq("visible", true)
        .is("deleted_at", null)
        .order("sort_order", { ascending: true });
      if (data) return data.map(mapRow);
    }
    return seed;
  },

  async findBySlug(slug: string): Promise<Tool | null> {
    const all = await this.findAll();
    return all.find((t) => t.slug === slug) ?? null;
  },

  async findAllAdmin(): Promise<Tool[]> {
    if (isSupabaseConfigured && supabase) {
      const db = await createServerSupabase();
      const { data } = await db
        .from("tools")
        .select("*")
        .order("sort_order", { ascending: true });
      if (data) return data.map(mapRow);
    }
    return seed;
  },

  async findById(id: string): Promise<Tool | null> {
    if (!isSupabaseConfigured) return seed.find((t) => t.id === id) ?? null;
    const db = await createServerSupabase();
    const { data } = await db.from("tools").select("*").eq("id", id).single();
    return data ? mapRow(data) : null;
  },

  async create(input: ToolInput): Promise<Tool | null> {
    if (!isSupabaseConfigured) return null;
    const db = await createServerSupabase();
    const { data, error } = await db
      .from("tools")
      .insert(toRow(input))
      .select("*")
      .single();
    return error || !data ? null : mapRow(data);
  },

  async update(id: string, input: ToolInput): Promise<Tool | null> {
    if (!isSupabaseConfigured) return null;
    const db = await createServerSupabase();
    const { data, error } = await db
      .from("tools")
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
      .from("tools")
      .update({ deleted_at: archived ? new Date().toISOString() : null })
      .eq("id", id);
    return !error;
  },

  async remove(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const db = await createServerSupabase();
    const { error } = await db.from("tools").delete().eq("id", id);
    return !error;
  },
};
