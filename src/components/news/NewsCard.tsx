import type { NewsItem } from "../../lib/types";
import { ExternalLink, Newspaper } from "lucide-react";
import { formatDate } from "../../lib/seo";

// Aggregator card: headline + snippet + thumbnail, linking OUT to the original
// source (copyright-safe — we never republish the full article).
export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative h-44 w-full overflow-hidden bg-[#f2f3f8]">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Newspaper className="h-8 w-8 text-muted" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold text-brand-700">
          {item.sourceName}
        </span>
        <h3 className="mt-1 line-clamp-2 text-base font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-brand-700">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-muted">
          {item.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <span>{item.publishedAt ? formatDate(item.publishedAt) : ""}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-brand-700">
            Read at source
            <ExternalLink className="h-3 w-3" />
          </span>
        </div>
      </div>
    </a>
  );
}
