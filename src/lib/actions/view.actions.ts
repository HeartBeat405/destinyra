"use server";

import { articlesRepo } from "../repositories/articles.repo";
import { isSupabaseConfigured } from "../supabase";

// Public, unauthenticated: called from the article page when a real
// browser mounts it, so `views` reflects actual reads (not SSR/prefetch).
export async function trackArticleView(id: string): Promise<void> {
  if (!isSupabaseConfigured || !id) return;
  await articlesRepo.incrementViews(id);
}
