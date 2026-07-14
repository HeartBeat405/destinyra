import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { newsService } from "../../lib/services/news.service";
import NewsCard from "../../components/news/NewsCard";

// Re-render the listing periodically so newly-ingested headlines show up.
export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Latest News — Destinyra",
  description:
    "Fresh headlines on spirituality, wellness, and self-discovery — updated automatically, with a link to every source.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage() {
  const items = await newsService.getLatest(48);

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-12 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-card">
          <Newspaper className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">
          Latest News
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Fresh headlines from around the web, updated automatically. Tap any
          story to read it at its original source.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="mx-auto max-w-lg rounded-4xl border border-line bg-surface p-10 text-center shadow-card">
          <Newspaper className="mx-auto mb-4 h-10 w-10 text-muted" />
          <h2 className="text-lg font-bold text-ink">No headlines yet</h2>
          <p className="mt-2 text-sm text-muted">
            The news feed populates automatically once the source is connected.
            Check back shortly.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
