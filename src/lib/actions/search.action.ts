"use server";

import { articleService } from "../services/article.service";
import { categoryService } from "../services/category.service";
import { tagService } from "../services/tag.service";
import { authorService } from "../services/author.service";
import { toolService } from "../services/tool.service";
import { EMPTY_RESULTS, type SearchResults } from "../search-types";

const PAGES = [
  { title: "Articles", href: "/articles" },
  { title: "Categories", href: "/categories" },
  { title: "Tools", href: "/tools" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
  { title: "Privacy", href: "/privacy" },
];

// Global search — composes EXISTING services only (no repo/service changes).
export async function globalSearchAction(
  raw: string
): Promise<SearchResults> {
  const q = raw.trim();
  if (q.length < 2) return EMPTY_RESULTS;
  const lc = q.toLowerCase();
  const reSearch = (s: string) => `/search?q=${encodeURIComponent(s)}`;

  const [articles, categories, tags, authors, tools] = await Promise.all([
    articleService.search(q),
    categoryService.getAll(),
    tagService.getAll(),
    authorService.getAll(),
    toolService.getAll(),
  ]);

  return {
    articles: articles.slice(0, 6).map((a) => ({
      title: a.title,
      href: `/articles/${a.slug}`,
      sub: a.category?.name,
      iconName: a.iconName,
    })),
    categories: categories
      .filter((c) => c.name.toLowerCase().includes(lc))
      .slice(0, 5)
      .map((c) => ({
        title: c.name,
        href: `/categories/${c.slug}`,
        iconName: c.iconName,
      })),
    tools: tools
      .filter((t) => t.status !== "disabled" && t.name.toLowerCase().includes(lc))
      .slice(0, 5)
      .map((t) => ({
        title: t.name,
        href: t.buttonLink || `/tools/${t.slug}`,
        iconName: t.iconName,
      })),
    tags: tags
      .filter((t) => t.name.toLowerCase().includes(lc))
      .slice(0, 6)
      .map((t) => ({ title: `#${t.name}`, href: reSearch(t.name) })),
    authors: authors
      .filter((a) => a.name.toLowerCase().includes(lc))
      .slice(0, 4)
      .map((a) => ({ title: a.name, href: reSearch(a.name), sub: a.role })),
    pages: PAGES.filter((p) => p.title.toLowerCase().includes(lc)).map((p) => ({
      title: p.title,
      href: p.href,
    })),
  };
}
