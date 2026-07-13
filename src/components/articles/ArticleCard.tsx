import Link from "next/link";
import { Clock } from "lucide-react";
import type { Article } from "../../lib/types";
import { formatDate } from "../../lib/seo";
import Thumbnail from "./Thumbnail";
import Icon from "../ui/Icon";

type Props = {
  article: Article;
  variant?: "card" | "row";
};

export default function ArticleCard({ article, variant = "card" }: Props) {
  const category = article.category;

  if (variant === "row") {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group flex gap-4 rounded-2xl p-2 transition-colors hover:bg-canvas"
      >
        <Thumbnail
          iconName={article.iconName}
          gradient={article.gradient}
          size="sm"
          className="h-16 w-16 shrink-0 rounded-xl"
        />
        <div className="min-w-0">
          {category && (
            <span className="text-xs font-semibold text-brand-700">
              {category.name}
            </span>
          )}
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-brand-700">
            {article.title}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <Thumbnail
        iconName={article.iconName}
        gradient={article.gradient}
        className="h-44 w-full"
      />
      <div className="flex flex-1 flex-col p-5">
        {category && (
          <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
            <Icon name={category.iconName} className="h-3.5 w-3.5" />
            {category.name}
          </span>
        )}
        <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-brand-700">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-muted">
          {article.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs text-muted">
          <span>{formatDate(article.publishedAt)}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readingTime} min
          </span>
        </div>
      </div>
    </Link>
  );
}
