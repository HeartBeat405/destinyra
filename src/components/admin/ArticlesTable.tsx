"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowUpDown,
  Copy,
  Trash2,
  Send,
  Archive,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Article, ArticleStatus } from "../../lib/types";
import {
  ARTICLE_STATUSES,
  type BulkAction,
} from "../../lib/validation/article.schema";
import StatusBadge from "./StatusBadge";
import Thumbnail from "../articles/Thumbnail";
import { formatDate } from "../../lib/seo";
import {
  duplicateArticleAction,
  deleteArticleAction,
  setArticleStatusAction,
  bulkArticleAction,
} from "../../lib/actions/article.actions";

type SortKey = "title" | "status" | "views" | "publishedAt";
const PAGE_SIZE = 8;

export default function ArticlesTable({
  articles,
  devMode,
}: {
  articles: Article[];
  devMode: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | ArticleStatus>("all");
  const [sortKey, setSortKey] = useState<SortKey>("publishedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = articles.filter((a) => {
      const matchesQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q);
      const matchesStatus = status === "all" || a.status === status;
      return matchesQuery && matchesStatus;
    });
    rows.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "title") cmp = a.title.localeCompare(b.title);
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      else if (sortKey === "views") cmp = a.views - b.views;
      else cmp = a.publishedAt.localeCompare(b.publishedAt);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [articles, query, status, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const rows = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function toggleRow(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allOnPageSelected =
    rows.length > 0 && rows.every((r) => selected.has(r.id));

  function toggleAllOnPage() {
    setSelected((s) => {
      const next = new Set(s);
      if (allOnPageSelected) rows.forEach((r) => next.delete(r.id));
      else rows.forEach((r) => next.add(r.id));
      return next;
    });
  }

  function run(promise: Promise<{ ok: boolean; message?: string; devMode?: boolean }>) {
    startTransition(async () => {
      const res = await promise;
      setToast(res.message ?? (res.ok ? "Done." : "Failed."));
      if (res.ok) {
        setSelected(new Set());
        router.refresh();
      }
      setTimeout(() => setToast(null), 3500);
    });
  }

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <button
      onClick={() => toggleSort(k)}
      className="inline-flex items-center gap-1 hover:text-white"
    >
      {label}
      <ArrowUpDown className="h-3 w-3 opacity-50" />
    </button>
  );

  return (
    <div>
      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search articles…"
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-gray-600"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as typeof status);
            setPage(0);
          }}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm capitalize outline-none"
        >
          <option value="all" className="bg-[#0b0b18]">All status</option>
          {ARTICLE_STATUSES.map((s) => (
            <option key={s} value={s} className="bg-[#0b0b18]">
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-sm">
          <span className="font-medium">{selected.size} selected</span>
          <div className="ml-auto flex flex-wrap gap-2">
            {([
              ["publish", "Publish", Send],
              ["draft", "Draft", ArrowUpDown],
              ["archive", "Archive", Archive],
              ["delete", "Trash", Trash2],
            ] as const).map(([action, label, Icon]) => (
              <button
                key={action}
                disabled={pending}
                onClick={() =>
                  run(bulkArticleAction([...selected], action as BulkAction))
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10 disabled:opacity-50"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <div className="mb-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200">
          {toast}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleAllOnPage}
                    className="accent-purple-500"
                  />
                </th>
                <th className="px-4 py-3 font-semibold"><SortHeader label="Title" k="title" /></th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold"><SortHeader label="Status" k="status" /></th>
                <th className="px-4 py-3 font-semibold"><SortHeader label="Views" k="views" /></th>
                <th className="px-4 py-3 font-semibold"><SortHeader label="Date" k="publishedAt" /></th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(a.id)}
                      onChange={() => toggleRow(a.id)}
                      className="accent-purple-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Thumbnail
                        iconName={a.iconName}
                        gradient={a.gradient}
                        image={a.image}
                        alt={a.title}
                        size="sm"
                        className="h-9 w-9 shrink-0 rounded-lg"
                      />
                      <Link
                        href={`/admin/articles/${a.slug}`}
                        className="min-w-0"
                      >
                        <p className="line-clamp-1 font-semibold hover:text-purple-200">
                          {a.title}
                        </p>
                        <p className="text-xs text-gray-500">/{a.slug}</p>
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{a.category?.name ?? "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 text-gray-300">{a.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-400">{formatDate(a.publishedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {a.status !== "published" && (
                        <IconBtn
                          title="Publish"
                          onClick={() => run(setArticleStatusAction(a.id, "published"))}
                          disabled={pending}
                        >
                          <Send className="h-4 w-4" />
                        </IconBtn>
                      )}
                      <IconBtn
                        title="Duplicate"
                        onClick={() => run(duplicateArticleAction(a.id))}
                        disabled={pending}
                      >
                        <Copy className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn
                        title="Trash"
                        onClick={() => run(deleteArticleAction(a.id, false))}
                        disabled={pending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                    No articles match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <span>
          {filtered.length} article{filtered.length === 1 ? "" : "s"}
          {devMode && " · dev mode (actions won't persist)"}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={current === 0}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span>
            {current + 1} / {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={current >= pageCount - 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  title,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-40"
    >
      {children}
    </button>
  );
}
