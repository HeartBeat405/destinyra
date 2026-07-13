"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, CornerDownLeft } from "lucide-react";
import Icon from "../ui/Icon";
import { globalSearchAction } from "../../lib/actions/search.action";
import {
  EMPTY_RESULTS,
  SEARCH_GROUPS,
  totalHits,
  type SearchHit,
  type SearchResults,
} from "../../lib/search-types";

// Global command palette (Ctrl/Cmd + K). Instant, keyboard-accessible.
export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const reqId = useRef(0);

  // Open/close via keyboard + custom event.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  // Reset + focus on open.
  useEffect(() => {
    if (open) {
      setQ("");
      setResults(EMPTY_RESULTS);
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Debounced instant search.
  useEffect(() => {
    if (!open) return;
    const query = q.trim();
    if (query.length < 2) {
      setResults(EMPTY_RESULTS);
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = ++reqId.current;
    const t = setTimeout(async () => {
      const res = await globalSearchAction(query);
      if (id === reqId.current) {
        setResults(res);
        setActive(0);
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [q, open]);

  // Flattened hits for keyboard navigation (group order).
  const flat = useMemo(() => {
    const arr: SearchHit[] = [];
    for (const g of SEARCH_GROUPS) arr.push(...results[g.key]);
    return arr;
  }, [results]);

  const count = totalHits(results);

  function go(hit: SearchHit) {
    setOpen(false);
    router.push(hit.href);
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(flat.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flat[active]) go(flat[active]);
      else if (q.trim().length >= 2) {
        setOpen(false);
        router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  if (!open) return null;

  let runningIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 px-4 pt-[12vh]"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-line px-4">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted" />
          ) : (
            <Search className="h-4 w-4 text-muted" />
          )}
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search articles, categories, tools…"
            className="w-full bg-transparent py-4 text-[15px] text-ink outline-none placeholder:text-muted"
            role="combobox"
            aria-expanded={count > 0}
            aria-controls="cmdk-list"
            aria-autocomplete="list"
          />
          <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[11px] text-muted sm:block">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div id="cmdk-list" role="listbox" className="max-h-[60vh] overflow-y-auto p-2">
          {q.trim().length < 2 ? (
            <p className="px-3 py-10 text-center text-sm text-muted">
              Type at least 2 characters to search.
            </p>
          ) : count === 0 && !loading ? (
            <p className="px-3 py-10 text-center text-sm text-muted">
              No results for “{q.trim()}”.
            </p>
          ) : (
            SEARCH_GROUPS.map((g) => {
              const hits = results[g.key];
              if (hits.length === 0) return null;
              return (
                <div key={g.key} className="mb-1">
                  <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {g.label}
                  </p>
                  {hits.map((hit) => {
                    runningIndex += 1;
                    const idx = runningIndex;
                    const isActive = idx === active;
                    return (
                      <button
                        key={`${g.key}-${hit.href}-${idx}`}
                        role="option"
                        aria-selected={isActive}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => go(hit)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${
                          isActive ? "bg-brand-50" : "hover:bg-canvas"
                        }`}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-brand">
                          <Icon name={hit.iconName ?? g.defaultIcon} className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-ink">
                            {hit.title}
                          </span>
                          {hit.sub && (
                            <span className="block truncate text-xs text-muted">
                              {hit.sub}
                            </span>
                          )}
                        </span>
                        {isActive && (
                          <CornerDownLeft className="h-3.5 w-3.5 text-muted" />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-line px-4 py-2 text-[11px] text-muted">
          <span>↑↓ to navigate · ↵ to open</span>
          <span>⌘K</span>
        </div>
      </div>
    </div>
  );
}
