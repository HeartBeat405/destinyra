import type { Article } from "./types";

// Pure SEO analysis (read-only orchestration). No repository/service changes.

export type SeoCheck = { key: string; label: string; done: boolean; weight: number };

export type ArticleSeo = {
  id: string;
  title: string;
  slug: string;
  status: string;
  score: number;
  words: number;
  checks: SeoCheck[];
  warnings: string[];
  recommendations: string[];
  updatedAt: string;
};

export type SeoIssue = { key: string; label: string; count: number };

export type SeoDashboardData = {
  totals: { total: number; published: number; drafts: number; archived: number };
  avgScore: number;
  issues: SeoIssue[];
  best: ArticleSeo[];
  worst: ArticleSeo[];
  recent: ArticleSeo[];
  missingMeta: ArticleSeo[];
  articles: ArticleSeo[];
};

export function analyzeArticle(a: Article, duplicateSlug: boolean): ArticleSeo {
  const content = a.content ?? "";
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const hasInternalLink = /\]\(\/[^)]/.test(content);
  const seoTitle = (a.seoTitle ?? "").trim();
  const metaDesc = (a.seoDescription ?? "").trim();

  const checks: SeoCheck[] = [
    { key: "seoTitle", label: "SEO title set", done: seoTitle.length > 0, weight: 15 },
    { key: "metaDesc", label: "Meta description set", done: metaDesc.length > 0, weight: 15 },
    { key: "excerpt", label: "Excerpt written", done: (a.excerpt ?? "").trim().length > 0, weight: 8 },
    { key: "category", label: "Category assigned", done: Boolean(a.categorySlug || a.category), weight: 12 },
    { key: "author", label: "Author assigned", done: Boolean(a.authorId || a.author), weight: 8 },
    { key: "tags", label: "At least one tag", done: (a.tags?.length ?? 0) > 0, weight: 12 },
    { key: "words", label: "300+ words", done: words >= 300, weight: 15 },
    { key: "slug", label: "Unique slug", done: !duplicateSlug, weight: 10 },
    { key: "tool", label: "Related tool linked", done: a.relatedTool !== "none", weight: 5 },
  ];

  const score = checks.reduce((s, c) => s + (c.done ? c.weight : 0), 0);
  const warnings = checks.filter((c) => !c.done).map((c) => c.label);

  const recommendations: string[] = [];
  if (!hasInternalLink) recommendations.push("Add at least one internal link.");
  if (seoTitle && seoTitle.length > 60)
    recommendations.push("SEO title is long (> 60 chars).");
  if (metaDesc && (metaDesc.length < 70 || metaDesc.length > 160))
    recommendations.push("Meta description ideally 70–160 chars.");
  if (words > 0 && words < 300)
    recommendations.push("Article is short — aim for 300+ words.");

  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    status: a.status,
    score,
    words,
    checks,
    warnings,
    recommendations,
    updatedAt: a.updatedAt ?? a.publishedAt,
  };
}

const ISSUE_LABELS: Record<string, string> = {
  seoTitle: "Missing SEO title",
  metaDesc: "Missing meta description",
  excerpt: "Missing excerpt",
  category: "No category",
  author: "No author",
  tags: "No tags",
  words: "Short content (< 300 words)",
  slug: "Duplicate slug",
  tool: "No related tool",
};

export function buildSeoDashboard(articles: Article[]): SeoDashboardData {
  const slugCounts = new Map<string, number>();
  for (const a of articles) {
    slugCounts.set(a.slug, (slugCounts.get(a.slug) ?? 0) + 1);
  }

  const analyzed = articles.map((a) =>
    analyzeArticle(a, (slugCounts.get(a.slug) ?? 0) > 1)
  );

  const byScoreDesc = [...analyzed].sort((x, y) => y.score - x.score);
  const byRecent = [...analyzed].sort((x, y) =>
    y.updatedAt.localeCompare(x.updatedAt)
  );

  const issues: SeoIssue[] = Object.keys(ISSUE_LABELS).map((key) => ({
    key,
    label: ISSUE_LABELS[key],
    count: analyzed.filter((a) => a.checks.find((c) => c.key === key && !c.done))
      .length,
  }));

  const avgScore = analyzed.length
    ? Math.round(analyzed.reduce((s, a) => s + a.score, 0) / analyzed.length)
    : 0;

  const byStatus = (s: string) => articles.filter((a) => a.status === s).length;

  return {
    totals: {
      total: articles.length,
      published: byStatus("published"),
      drafts: byStatus("draft"),
      archived: byStatus("archived"),
    },
    avgScore,
    issues,
    best: byScoreDesc.slice(0, 5),
    worst: [...byScoreDesc].reverse().slice(0, 5),
    recent: byRecent.slice(0, 5),
    missingMeta: analyzed
      .filter((a) => a.warnings.includes("SEO title set") || a.warnings.includes("Meta description set"))
      .slice(0, 8),
    articles: byScoreDesc,
  };
}

export function scoreTone(score: number): "success" | "warning" | "danger" {
  return score >= 80 ? "success" : score >= 50 ? "warning" : "danger";
}
