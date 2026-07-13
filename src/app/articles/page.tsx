import type { Metadata } from "next";
import Link from "next/link";

import { articleService } from "../../lib/services/article.service";
import { categoryService } from "../../lib/services/category.service";
import ArticleCard from "../../components/articles/ArticleCard";
import Newsletter from "../../components/ui/Newsletter";
import Icon from "../../components/ui/Icon";

export const metadata: Metadata = {
  title: "Articles — Destinyra",
  description:
    "Explore Destinyra's library of articles on self-growth, relationships, numerology, tarot, spirituality, and more.",
  alternates: { canonical: "/articles" },
};

export default async function ArticlesPage() {
  const [articles, categories] = await Promise.all([
    articleService.getAll(),
    categoryService.getAll(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">
          All Articles
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Thoughtful writing to help you grow, connect, and understand
          yourself a little better.
        </p>
      </header>

      <div className="mb-12 flex flex-wrap justify-center gap-2">
        <Link
          href="/articles"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-brand hover:text-brand"
          >
            <Icon name={c.iconName} className="h-3.5 w-3.5" />
            {c.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>

      <div className="mt-20">
        <Newsletter />
      </div>
    </main>
  );
}
