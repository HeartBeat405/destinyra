import type { Article, Category, Tag, Author, Tool } from "./types";
import { buildSeoDashboard } from "./seo-analyzer";

// Pure read-only aggregation (orchestration). No repository/service changes.

export type LabelValue = { label: string; value: number };
export type RankedArticle = { title: string; slug: string; value: number };

export type AnalyticsData = {
  totals: {
    total: number;
    published: number;
    drafts: number;
    archived: number;
    categories: number;
    tags: number;
    authors: number;
    tools: number;
  };
  averages: { seoScore: number; readingTime: number; wordCount: number };
  mostRead: RankedArticle[];
  mostUpdated: { title: string; slug: string; updatedAt: string }[];
  longest: RankedArticle[];
  shortest: RankedArticle[];
  popularCategories: LabelValue[];
  popularTags: LabelValue[];
  mostUsedTools: LabelValue[];
  topAuthors: LabelValue[];
  publishingByMonth: LabelValue[];
  quality: {
    missingMeta: number;
    noCategory: number;
    noTags: number;
  };
};

function words(a: Article): number {
  return (a.content ?? "").trim().split(/\s+/).filter(Boolean).length;
}
function avg(nums: number[]): number {
  return nums.length ? Math.round(nums.reduce((s, n) => s + n, 0) / nums.length) : 0;
}

export function buildAnalytics(input: {
  articles: Article[];
  categories: Category[];
  tags: Tag[];
  authors: Author[];
  tools: Tool[];
}): AnalyticsData {
  const { articles, categories, tags, authors, tools } = input;
  const seo = buildSeoDashboard(articles);
  const byStatus = (s: string) => articles.filter((a) => a.status === s).length;

  const withWords = articles.map((a) => ({ a, w: words(a) }));

  const monthCounts = new Map<string, number>();
  for (const a of articles) {
    const m = a.publishedAt.slice(0, 7); // YYYY-MM
    if (m) monthCounts.set(m, (monthCounts.get(m) ?? 0) + 1);
  }
  const publishingByMonth = [...monthCounts.entries()]
    .sort((x, y) => x[0].localeCompare(y[0]))
    .slice(-8)
    .map(([label, value]) => ({ label, value }));

  const issue = (key: string) =>
    seo.issues.find((i) => i.key === key)?.count ?? 0;

  return {
    totals: {
      total: articles.length,
      published: byStatus("published"),
      drafts: byStatus("draft"),
      archived: byStatus("archived"),
      categories: categories.length,
      tags: tags.length,
      authors: authors.length,
      tools: tools.length,
    },
    averages: {
      seoScore: seo.avgScore,
      readingTime: avg(articles.map((a) => a.readingTime)),
      wordCount: avg(withWords.map((x) => x.w)),
    },
    mostRead: [...articles]
      .sort((a, b) => b.views - a.views)
      .slice(0, 6)
      .map((a) => ({ title: a.title, slug: a.slug, value: a.views })),
    mostUpdated: [...articles]
      .sort((a, b) =>
        (b.updatedAt ?? b.publishedAt).localeCompare(a.updatedAt ?? a.publishedAt)
      )
      .slice(0, 6)
      .map((a) => ({
        title: a.title,
        slug: a.slug,
        updatedAt: a.updatedAt ?? a.publishedAt,
      })),
    longest: [...withWords]
      .sort((x, y) => y.w - x.w)
      .slice(0, 5)
      .map((x) => ({ title: x.a.title, slug: x.a.slug, value: x.w })),
    shortest: [...withWords]
      .sort((x, y) => x.w - y.w)
      .slice(0, 5)
      .map((x) => ({ title: x.a.title, slug: x.a.slug, value: x.w })),
    popularCategories: categories
      .map((c) => ({
        label: c.name,
        value: articles.filter((a) => a.categorySlug === c.slug).length,
      }))
      .filter((v) => v.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6),
    popularTags: [...tags]
      .sort((a, b) => b.usageCount - a.usageCount)
      .filter((t) => t.usageCount > 0)
      .slice(0, 8)
      .map((t) => ({ label: t.name, value: t.usageCount })),
    mostUsedTools: tools
      .map((t) => ({
        label: t.name,
        value: articles.filter((a) => a.relatedTool === t.slug).length,
      }))
      .filter((v) => v.value > 0)
      .sort((a, b) => b.value - a.value),
    topAuthors: authors
      .map((au) => ({
        label: au.name,
        value: articles.filter((a) => a.authorId === au.id).length,
      }))
      .filter((v) => v.value > 0)
      .sort((a, b) => b.value - a.value),
    publishingByMonth,
    quality: {
      missingMeta: issue("metaDesc"),
      noCategory: issue("category"),
      noTags: issue("tags"),
    },
  };
}
