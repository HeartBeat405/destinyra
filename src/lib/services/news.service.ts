import type { NewsItem } from "../types";
import { newsRepo } from "../repositories/news.repo";
import { fetchNews } from "../news/fetchNews";

export const newsService = {
  getLatest(limit = 24): Promise<NewsItem[]> {
    return newsRepo.list(limit);
  },

  // Pull fresh headlines from the provider and store them. Returns how many
  // new rows were inserted. Called by the cron route (and a manual refresh).
  async refresh(): Promise<{ fetched: number; inserted: number }> {
    const items = await fetchNews();
    const inserted = await newsRepo.upsertMany(items);
    return { fetched: items.length, inserted };
  },
};
