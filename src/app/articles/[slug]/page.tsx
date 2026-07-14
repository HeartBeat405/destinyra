import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, CalendarDays, RefreshCw } from "lucide-react";

import { cache } from "react";
import { articleService } from "../../../lib/services/article.service";
import { categoryService } from "../../../lib/services/category.service";
import {
  articleMetadata,
  articleJsonLd,
  breadcrumbJsonLd,
  formatDate,
  absoluteUrl,
} from "../../../lib/seo";
import { extractHeadings } from "../../../lib/util/toc";

import Breadcrumb from "../../../components/ui/Breadcrumb";
import Thumbnail from "../../../components/articles/Thumbnail";
import ArticleContent from "../../../components/articles/ArticleContent";
import ToolCTA from "../../../components/articles/ToolCTA";
import ShareButtons from "../../../components/articles/ShareButtons";
import ArticleCard from "../../../components/articles/ArticleCard";
import AuthorCard from "../../../components/articles/AuthorCard";
import ReadingProgress from "../../../components/articles/ReadingProgress";
import ViewTracker from "../../../components/articles/ViewTracker";
import TableOfContents from "../../../components/articles/TableOfContents";
import BackToTop from "../../../components/articles/BackToTop";
import Reviews from "../../../components/ui/Reviews";
import Icon from "../../../components/ui/Icon";
import AdSlotRenderer from "../../../components/ads/AdSlotRenderer";

type Params = { params: Promise<{ slug: string }> };

// Request-cached so generateMetadata + the page share one lookup.
const loadArticle = cache((slug: string) => articleService.getBySlug(slug));

export async function generateStaticParams() {
  const articles = await articleService.getAll();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) return { title: "Article not found — Destinyra" };
  return articleMetadata(article, article.author);
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) notFound();

  const author = article.author;
  const category = article.category;
  const [related, allCategories] = await Promise.all([
    articleService.getRelated(article, 3),
    categoryService.getAll(),
  ]);
  const url = absoluteUrl(`/articles/${article.slug}`);
  const headings = extractHeadings(article.content);
  const moreCategories = allCategories
    .filter((c) => c.slug !== category?.slug)
    .slice(0, 4);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Articles", path: "/articles" },
    ...(category
      ? [{ name: category.name, path: `/categories/${category.slug}` }]
      : []),
    { name: article.title, path: `/articles/${article.slug}` },
  ];

  return (
    <>
      <ReadingProgress />
      <ViewTracker articleId={article.id} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd(article, author, category)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(crumbs)),
        }}
      />

      <article>
        {/* ===== Hero ===== */}
        <header className="border-b border-line bg-surface">
          <div className="mx-auto max-w-3xl px-6 pb-10 pt-10">
            <Breadcrumb items={crumbs} />

            {category && (
              <Link
                href={`/categories/${category.slug}`}
                className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
              >
                <Icon name={category.iconName} className="h-3.5 w-3.5" />
                {category.name}
              </Link>
            )}

            <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.12] text-ink sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-5 text-xl leading-8 text-muted">
              {article.excerpt}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted">
              {author && (
                <span className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                    {author.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">
                      {author.name}
                    </span>
                    {author.role && (
                      <span className="text-xs">{author.role}</span>
                    )}
                  </span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatDate(article.publishedAt)}
              </span>
              {article.updatedAt && article.updatedAt !== article.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Updated {formatDate(article.updatedAt)}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {article.readingTime} min read
              </span>
            </div>
          </div>
        </header>

        {/* ===== Large featured image ===== */}
        <div className="mx-auto max-w-5xl px-6">
          <Thumbnail
            iconName={article.iconName}
            gradient={article.gradient}
            image={article.image}
            alt={article.title}
            size="lg"
            className="-mb-6 mt-8 h-72 w-full rounded-4xl border border-line sm:h-96"
          />
        </div>

        {/* ===== Body + TOC ===== */}
        <div className="mx-auto max-w-6xl px-6 pt-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="min-w-0">
              {/* Mobile TOC */}
              <div className="lg:hidden">
                <TableOfContents items={headings} mode="mobile" />
              </div>

              <div className="mx-auto max-w-reading">
                <AdSlotRenderer placement="article-top" />
                <ArticleContent content={article.content} />
                <AdSlotRenderer placement="article-middle" />

                <ToolCTA tool={article.relatedTool} />

                {article.tags.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-8 border-t border-line pt-6">
                  <ShareButtons url={url} title={article.title} />
                </div>

                {author && <AuthorCard author={author} />}
              </div>
            </div>

            {/* Desktop sticky TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents items={headings} mode="desktop" />
              </div>
            </aside>
          </div>
        </div>

        {/* ===== Related categories ===== */}
        {moreCategories.length > 0 && (
          <div className="mx-auto max-w-6xl px-6 pt-16">
            <p className="mb-4 text-sm font-semibold text-ink">
              Continue exploring
            </p>
            <div className="flex flex-wrap gap-2">
              {moreCategories.map((c) => (
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
          </div>
        )}

        {/* ===== Related articles ===== */}
        {related.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 pt-16">
            <h2 className="mb-6 text-2xl font-black tracking-tight text-ink">
              Related Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}

        {/* ===== Bottom ad + Newsletter CTA ===== */}
        <div className="mx-auto max-w-6xl px-6">
          <AdSlotRenderer placement="article-bottom" />
        </div>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reviews />
        </div>
      </article>

      <BackToTop />
    </>
  );
}
