import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { categoryService } from "../../../lib/services/category.service";
import { articleService } from "../../../lib/services/article.service";
import { breadcrumbJsonLd } from "../../../lib/seo";

import Breadcrumb from "../../../components/ui/Breadcrumb";
import ArticleCard from "../../../components/articles/ArticleCard";
import Icon from "../../../components/ui/Icon";
import AdSlotRenderer from "../../../components/ads/AdSlotRenderer";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const categories = await categoryService.getAll();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = await categoryService.getBySlug(slug);
  if (!category) return { title: "Category not found — Destinyra" };
  return {
    title: `${category.name} — Destinyra`,
    description: category.description,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: {
      title: `${category.name} — Destinyra`,
      description: category.description,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = await categoryService.getBySlug(slug);
  if (!category) notFound();

  const articles = await articleService.getByCategory(slug);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: category.name, path: `/categories/${category.slug}` },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(crumbs)),
        }}
      />

      <Breadcrumb items={crumbs} />

      {/* Category header */}
      <header className="mt-8 overflow-hidden rounded-4xl border border-line bg-surface p-10 text-center shadow-card">
        <div
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${category.gradient} text-white shadow-card`}
        >
          <Icon name={category.iconName} className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-ink">
          {category.name}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          {category.description}
        </p>
        <p className="mt-4 text-sm text-muted">
          {articles.length}{" "}
          {articles.length === 1 ? "article" : "articles"}
        </p>
      </header>

      <AdSlotRenderer placement="category" />

      {/* Articles */}
      {articles.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted">
          No articles in this category yet — check back soon.
        </p>
      )}
    </main>
  );
}
