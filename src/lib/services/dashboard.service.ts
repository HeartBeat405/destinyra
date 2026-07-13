import type { Article } from "../types";
import { articlesRepo } from "../repositories/articles.repo";
import { categoriesRepo } from "../repositories/categories.repo";
import { toolsRepo } from "../repositories/tools.repo";
import { authorsRepo } from "../repositories/authors.repo";

export type CategoryStat = {
  name: string;
  slug: string;
  iconName: string;
  gradient: string;
  count: number;
};

export type DashboardOverview = {
  counts: {
    articles: number;
    published: number;
    drafts: number;
    scheduled: number;
    archived: number;
    categories: number;
    tools: number;
    authors: number;
    totalViews: number;
  };
  topArticles: Article[];
  topCategories: CategoryStat[];
  recentArticles: Article[];
  drafts: Article[];
  scheduled: Article[];
};

// Composes repositories into the admin dashboard view-model. No data
// access in the UI — the page just renders what this returns.
export const dashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    const [articles, categories, tools, authors] = await Promise.all([
      articlesRepo.findAll(),
      categoriesRepo.findAll(),
      toolsRepo.findAll(),
      authorsRepo.findAll(),
    ]);

    const byStatus = (s: Article["status"]) =>
      articles.filter((a) => a.status === s);

    const topArticles = [...articles]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const topCategories: CategoryStat[] = categories
      .map((c) => ({
        name: c.name,
        slug: c.slug,
        iconName: c.iconName,
        gradient: c.gradient,
        count: articles.filter((a) => a.categorySlug === c.slug).length,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const recentArticles = [...articles]
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .slice(0, 6);

    return {
      counts: {
        articles: articles.length,
        published: byStatus("published").length,
        drafts: byStatus("draft").length,
        scheduled: byStatus("scheduled").length,
        archived: byStatus("archived").length,
        categories: categories.length,
        tools: tools.length,
        authors: authors.length,
        totalViews: articles.reduce((sum, a) => sum + a.views, 0),
      },
      topArticles,
      topCategories,
      recentArticles,
      drafts: byStatus("draft").slice(0, 5),
      scheduled: byStatus("scheduled").slice(0, 5),
    };
  },
};
