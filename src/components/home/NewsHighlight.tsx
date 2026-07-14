import Link from "next/link";
import { Newspaper, ArrowRight } from "lucide-react";
import { newsService } from "../../lib/services/news.service";
import NewsCard from "../news/NewsCard";

// Compact "Latest News" band for the top of the homepage. Renders nothing
// until the news feed has content, so it never clutters the homepage early on.
export default async function NewsHighlight() {
  const items = await newsService.getLatest(4);
  if (items.length === 0) return null;

  return (
    <section className="border-b border-line bg-canvas">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-lg font-black tracking-tight text-ink">
            <Newspaper className="h-5 w-5 text-brand" />
            Latest News
          </h2>
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-600"
          >
            See all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
