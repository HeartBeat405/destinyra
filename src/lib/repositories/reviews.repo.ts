import type { Review } from "../types";
import { supabase, isSupabaseConfigured, createAdminClient } from "../supabase";

function mapRow(r: any): Review {
  return {
    id: r.id,
    name: r.name,
    rating: Number(r.rating ?? 5),
    comment: r.comment ?? "",
    approved: r.approved ?? true,
    featured: r.featured ?? false,
    createdAt: String(r.created_at ?? "").slice(0, 10),
  };
}

export const reviewsRepo = {
  // Public: prefer curated (featured) reviews; fall back to recent approved
  // ones so the section isn't empty before anything is featured.
  async listForPublic(limit = 6): Promise<Review[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data: feat } = await supabase
      .from("reviews")
      .select("*")
      .eq("featured", true)
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (feat && feat.length > 0) return feat.map(mapRow);

    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data ?? []).map(mapRow);
  },

  // Admin: every review (approved or not), via service-role.
  async listAll(limit = 300): Promise<Review[]> {
    if (!isSupabaseConfigured) return [];
    const db = createAdminClient();
    if (!db) return [];
    const { data } = await db
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data ?? []).map(mapRow);
  },

  async create(input: {
    name: string;
    rating: number;
    comment: string;
  }): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const db = createAdminClient();
    if (!db) return false;
    const { error } = await db.from("reviews").insert({
      name: input.name,
      rating: input.rating,
      comment: input.comment,
    });
    return !error;
  },

  async setFlags(
    id: string,
    patch: { featured?: boolean; approved?: boolean }
  ): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const db = createAdminClient();
    if (!db) return false;
    const { error } = await db.from("reviews").update(patch).eq("id", id);
    return !error;
  },

  async remove(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const db = createAdminClient();
    if (!db) return false;
    const { error } = await db.from("reviews").delete().eq("id", id);
    return !error;
  },
};
