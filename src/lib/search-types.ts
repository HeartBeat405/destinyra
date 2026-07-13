// Shared search types (kept out of the "use server" action module).

export type SearchHit = {
  title: string;
  href: string;
  sub?: string;
  iconName?: string;
};

export type SearchResults = {
  articles: SearchHit[];
  categories: SearchHit[];
  tools: SearchHit[];
  tags: SearchHit[];
  authors: SearchHit[];
  pages: SearchHit[];
};

export const EMPTY_RESULTS: SearchResults = {
  articles: [],
  categories: [],
  tools: [],
  tags: [],
  authors: [],
  pages: [],
};

export const SEARCH_GROUPS: Array<{
  key: keyof SearchResults;
  label: string;
  defaultIcon: string;
}> = [
  { key: "articles", label: "Articles", defaultIcon: "FileText" },
  { key: "categories", label: "Categories", defaultIcon: "FolderTree" },
  { key: "tools", label: "Tools", defaultIcon: "Wrench" },
  { key: "tags", label: "Tags", defaultIcon: "Tag" },
  { key: "authors", label: "Authors", defaultIcon: "Users" },
  { key: "pages", label: "Pages", defaultIcon: "File" },
];

export function totalHits(r: SearchResults): number {
  return (
    r.articles.length +
    r.categories.length +
    r.tools.length +
    r.tags.length +
    r.authors.length +
    r.pages.length
  );
}
