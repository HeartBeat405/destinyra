// Fetches fresh headlines from the GNews API (https://gnews.io). We keep
// ONLY the title, short description, image, and source link — never the full
// article — so displaying it stays copyright-safe (aggregator model).

export type FetchedNews = {
  title: string;
  excerpt: string;
  url: string;
  imageUrl: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  category: string;
};

const DEFAULT_QUERY =
  "spirituality OR wellness OR mindfulness OR astrology OR self improvement";

export function isNewsConfigured(): boolean {
  return Boolean(process.env.NEWS_API_KEY);
}

export async function fetchNews(): Promise<FetchedNews[]> {
  const key = process.env.NEWS_API_KEY;
  if (!key) return [];

  const q = process.env.NEWS_QUERY || DEFAULT_QUERY;
  const lang = process.env.NEWS_LANG || "en";
  const url =
    `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}` +
    `&lang=${encodeURIComponent(lang)}&max=10&sortby=publishedAt&apikey=${key}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const articles: any[] = Array.isArray(data?.articles) ? data.articles : [];

    return articles
      .filter((a) => a?.url && a?.title)
      .map((a) => ({
        title: String(a.title),
        excerpt: String(a.description ?? "").slice(0, 300),
        url: String(a.url),
        imageUrl: String(a.image ?? ""),
        sourceName: String(a.source?.name ?? "Source"),
        sourceUrl: String(a.source?.url ?? ""),
        publishedAt: a.publishedAt
          ? new Date(a.publishedAt).toISOString()
          : new Date().toISOString(),
        category: "news",
      }));
  } catch {
    return [];
  }
}
