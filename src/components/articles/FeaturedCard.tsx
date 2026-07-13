import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import type { Article } from "../../lib/types";
import { formatDate } from "../../lib/seo";
import Thumbnail from "./Thumbnail";
import Icon from "../ui/Icon";

// Large editorial hero card for the homepage Featured slot.
export default function FeaturedCard({ article }: { article: Article }) {
  const category = article.category;
  const author = article.author;

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group grid overflow-hidden rounded-4xl border border-line bg-surface shadow-card transition-all duration-300 hover:shadow-lift lg:grid-cols-2"
    >
      <Thumbnail
        iconName={article.iconName}
        gradient={article.gradient}
        size="lg"
        className="h-64 w-full lg:h-full"
      />
      <div className="flex flex-col justify-center p-8 lg:p-12">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Featured
          </span>
          {category && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-700">
              <Icon name={category.iconName} className="h-3.5 w-3.5" />
              {category.name}
            </span>
          )}
        </div>
        <h2 className="font-serif text-3xl font-bold leading-[1.15] text-ink transition-colors group-hover:text-brand-700 sm:text-4xl">
          {article.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-base leading-7 text-muted">
          {article.excerpt}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
          {author && (
            <span className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                {author.name.charAt(0)}
              </span>
              {author.name}
            </span>
          )}
          <span aria-hidden>·</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readingTime} min
          </span>
        </div>
        <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
          Read story
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
