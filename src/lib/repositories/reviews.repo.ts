import type { Review } from "../types";
import { supabase, isSupabaseConfigured, createAdminClient } from "../supabase";

function mapRow(r: any): Review {
  return {
    id: r.id,
    name: r.name,
    rating: Number(r.rating ?? 5),
    comment: r.comment ?? "",
    createdAt: String(r.created_at ?? "").slice(0, 10),
  };
}

export const reviewsRepo = {
  // Public read (anon client; RLS allows approved rows).
  async listApproved(limit = 12): Promise<Review[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (data) return data.map(mapRow);
    }
    return [];
  },

  // Submit (service-role; bypasses RLS).
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
};
