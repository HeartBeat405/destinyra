import type { MetadataRoute } from "next";
import { articleService } from "../lib/services/article.service";
import { categoryService } from "../lib/services/category.service";
import { toolService } from "../lib/services/tool.service";
import { SITE_URL } from "../lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, tools] = await Promise.all([
    articleService.getAll(),
    categoryService.getAll(),
    toolService.getAll(),
  ]);

  const staticRoutes = [
    "",
    "/articles",
    "/categories",
    "/tools",
    "/about",
    "/contact",
    "/privacy",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date("2026-06-30"),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: new Date(a.publishedAt + "T00:00:00"),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${SITE_URL}/categories/${c.slug}`,
    lastModified: new Date("2026-06-30"),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const toolRoutes = tools.map((t) => ({
    url: `${SITE_URL}/tools/${t.slug}`,
    lastModified: new Date("2026-06-30"),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...articleRoutes,
    ...categoryRoutes,
    ...toolRoutes,
  ];
}
