import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { globalSearchAction } from "../../lib/actions/search.action";
import { SEARCH_GROUPS, totalHits, EMPTY_RESULTS } from "../../lib/search-types";
import Icon from "../../components/ui/Icon";
import AdSlotRenderer from "../../components/ads/AdSlotRenderer";

export const metadata: Metadata = {
  title: "Search — Destinyra",
  robots: { index: false, follow: true },
};

type Params = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Params) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query.length >= 2 ? await globalSearchAction(query) : EMPTY_RESULTS;
  const count = totalHits(results);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl font-bold text-ink">Search</h1>

      <form action="/search" className="mt-6 flex items-center gap-2 rounded-full border border-line bg-surface px-4 shadow-card">
        <Search className="h-5 w-5 text-muted" />
        <input
          name="q"
          defaultValue={query}
          placeholder="Search articles, categories, tools…"
          className="w-full bg-transparent py-3.5 text-ink outline-none placeholder:text-muted"
          aria-label="Search"
          autoFocus
        />
      </form>

      <AdSlotRenderer placement="search" />

      {query.length < 2 ? (
        <p className="mt-10 text-center text-muted">
          Enter a search term, or press{" "}
          <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 text-xs">
            ⌘K
          </kbd>{" "}
          anywhere.
        </p>
      ) : count === 0 ? (
        <p className="mt-10 text-center text-muted">
          No results for “{query}”.
        </p>
      ) : (
        <div className="mt-10 space-y-8">
          <p className="text-sm text-muted">
            {count} result{count === 1 ? "" : "s"} for “{query}”
          </p>
          {SEARCH_GROUPS.map((g) => {
            const hits = results[g.key];
            if (hits.length === 0) return null;
            return (
              <section key={g.key}>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                  {g.label}
                </h2>
                <div className="space-y-2">
                  {hits.map((hit) => (
                    <Link
                      key={`${g.key}-${hit.href}`}
                      href={hit.href}
                      className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-card transition-colors hover:border-brand"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand">
                        <Icon name={hit.iconName ?? g.defaultIcon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-ink">
                          {hit.title}
                        </span>
                        {hit.sub && (
                          <span className="block truncate text-sm text-muted">
                            {hit.sub}
                          </span>
                        )}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
