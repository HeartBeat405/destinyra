import type { NewsItem } from "../types";
import { supabase, isSupabaseConfigured, createAdminClient } from "../supabase";
import type { FetchedNews } from "../news/fetchNews";

function mapRow(r: any): NewsItem {
  return {
    id: r.id,
    title: r.title,
    excerpt: r.excerpt ?? "",
    url: r.url,
    imageUrl: r.image_url ?? "",
    sourceName: r.source_name ?? "Source",
    sourceUrl: r.source_url ?? undefined,
    category: r.category ?? "news",
    publishedAt: String(r.published_at ?? r.created_at ?? ""),
  };
}

export const newsRepo = {
  // Public read (anon client; RLS allows select).
  async list(limit = 30): Promise<NewsItem[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(limit);
      if (data) return data.map(mapRow);
    }
    return [];
  },

  // Cron write (service-role; bypasses RLS). Dedupes on url.
  async upsertMany(items: FetchedNews[]): Promise<number> {
    if (!isSupabaseConfigured || items.length === 0) return 0;
    const db = createAdminClient();
    if (!db) return 0;
    const rows = items.map((i) => ({
      title: i.title,
      excerpt: i.excerpt,
      url: i.url,
      image_url: i.imageUrl || null,
      source_name: i.sourceName,
      source_url: i.sourceUrl || null,
      category: i.category,
      published_at: i.publishedAt,
    }));
    const { data, error } = await db
      .from("news")
      .upsert(rows, { onConflict: "url", ignoreDuplicates: true })
      .select("id");
    if (error) return 0;
    return data?.length ?? 0;
  },
};
