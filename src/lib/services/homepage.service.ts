import type { Article, Tool, NewsItem } from "../types";
import type { CategoryWithCount } from "./category.service";
import { articlesRepo } from "../repositories/articles.repo";
import { categoriesRepo } from "../repositories/categories.repo";
import { toolsRepo } from "../repositories/tools.repo";
import { newsService } from "./news.service";

export type HomepageSections = {
  hero: Article | null;
  secondaryFeatured: Article[];
  trending: Article[];
  latest: Article[];
  popular: Article[];
  categories: CategoryWithCount[];
  tools: Tool[];
  news: NewsItem[];
};

// Single source of truth for the homepage. Fetches the article pool ONCE
// and derives every section in-memory — one round trip instead of many.
export const homepageService = {
  async getSections(): Promise<HomepageSections> {
    const [pool, allCats, tools, news] = await Promise.all([
      articlesRepo.findPublished(60),
      categoriesRepo.findAll(),
      toolsRepo.findAll(),
      newsService.getLatest(8),
    ]);

    const editorsPick = pool.find((a) => a.editorsPick) ?? null;
    const featured = pool.filter((a) => a.featured);
    const hero = editorsPick ?? featured[0] ?? pool[0] ?? null;
    const secondaryFeatured = featured
      .filter((a) => a.id !== hero?.id)
      .slice(0, 2);

    const trending = pool
      .filter((a) => a.trending)
      .sort((a, b) => b.views - a.views)
      .slice(0, 4);

    const latest = pool.slice(0, 6);
    const popular = [...pool].sort((a, b) => b.views - a.views).slice(0, 5);

    const categories: CategoryWithCount[] = allCats
      .map((c) => ({
        ...c,
        count: pool.filter((a) => a.categorySlug === c.slug).length,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      hero,
      secondaryFeatured,
      trending,
      latest,
      popular,
      categories,
      tools,
      news,
    };
  },
};
