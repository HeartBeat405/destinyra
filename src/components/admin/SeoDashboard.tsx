"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Search, ExternalLink } from "lucide-react";
import type { ArticleSeo, SeoDashboardData } from "../../lib/seo-analyzer";
import StatCard from "./StatCard";
import Drawer from "./Drawer";
import SeoWarningCard from "./seo/SeoWarningCard";
import ScoreRing, { ScoreBadge } from "./seo/ScoreRing";

const INFO_ISSUES = [
  "Featured image",
  "Open Graph image",
  "Canonical URL",
  "Image alt text",
];

export default function SeoDashboard({ data }: { data: SeoDashboardData }) {
  const [inspect, setInspect] = useState<ArticleSeo | null>(null);
  const [query, setQuery] = useState("");

  const rows = data.articles.filter(
    (a) => !query || a.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div>
      {/* Overview stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <ScoreRing score={data.avgScore} />
          <div>
            <p className="text-sm text-gray-400">Avg SEO Score</p>
            <p className="text-xs text-gray-500">across {data.totals.total} articles</p>
          </div>
        </div>
        <StatCard label="Total Articles" value={data.totals.total} iconName="FileText" />
        <StatCard label="Published" value={data.totals.published} iconName="CheckCircle2" gradient="from-emerald-500 to-teal-500" />
        <StatCard label="Drafts" value={data.totals.drafts} iconName="File" gradient="from-gray-500 to-gray-600" />
        <StatCard label="Archived" value={data.totals.archived} iconName="ScrollText" gradient="from-rose-500 to-pink-600" />
      </div>

      {/* Issues */}
      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Issues
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.issues.map((i) => (
          <SeoWarningCard key={i.key} label={i.label} count={i.count} />
        ))}
        {INFO_ISSUES.map((label) => (
          <SeoWarningCard key={label} label={label} count={0} info />
        ))}
      </div>

      {/* Widgets */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Widget title="Best Optimized" items={data.best} onInspect={setInspect} />
        <Widget title="Needs Work" items={data.worst} onInspect={setInspect} />
        <Widget title="Recently Updated" items={data.recent} onInspect={setInspect} showDate />
      </div>

      {/* Per-article table */}
      <div className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            All Articles
          </h2>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="bg-transparent py-2 text-sm text-white outline-none placeholder:text-gray-600"
            />
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3 font-semibold">Article</th>
                  <th className="px-4 py-3 font-semibold">Score</th>
                  <th className="px-4 py-3 font-semibold">Words</th>
                  <th className="px-4 py-3 font-semibold">Issues</th>
                  <th className="px-4 py-3 text-right font-semibold">Inspect</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                    <td className="px-4 py-3">
                      <p className="line-clamp-1 font-medium">{a.title}</p>
                      <p className="text-xs text-gray-500">/{a.slug}</p>
                    </td>
                    <td className="px-4 py-3"><ScoreBadge score={a.score} /></td>
                    <td className="px-4 py-3 text-gray-300">{a.words}</td>
                    <td className="px-4 py-3 text-gray-300">{a.warnings.length}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setInspect(a)}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10 hover:text-white"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No articles match.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SEO Inspector */}
      <Drawer
        open={Boolean(inspect)}
        onClose={() => setInspect(null)}
        title="SEO Inspector"
      >
        {inspect && (
          <div>
            <div className="flex items-center gap-4">
              <ScoreRing score={inspect.score} size={72} />
              <div className="min-w-0">
                <p className="line-clamp-2 font-semibold text-white">{inspect.title}</p>
                <Link
                  href={`/admin/articles/${inspect.slug}`}
                  className="mt-1 inline-flex items-center gap-1 text-xs text-purple-300 hover:text-purple-200"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open in editor
                </Link>
              </div>
            </div>

            <h4 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Checklist</h4>
            <ul className="space-y-2">
              {inspect.checks.map((c) => (
                <li key={c.key} className="flex items-center gap-2 text-sm">
                  {c.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-600" />
                  )}
                  <span className={c.done ? "text-gray-300" : "text-gray-500"}>{c.label}</span>
                  <span className="ml-auto text-xs text-gray-600">+{c.weight}</span>
                </li>
              ))}
            </ul>

            {inspect.recommendations.length > 0 && (
              <>
                <h4 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Recommendations</h4>
                <ul className="space-y-1.5">
                  {inspect.recommendations.map((r) => (
                    <li key={r} className="text-sm text-amber-300">• {r}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}

function Widget({
  title,
  items,
  onInspect,
  showDate = false,
}: {
  title: string;
  items: ArticleSeo[];
  onInspect: (a: ArticleSeo) => void;
  showDate?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h3 className="mb-4 text-sm font-bold text-white">{title}</h3>
      <ul className="space-y-2">
        {items.map((a) => (
          <li key={a.id}>
            <button
              onClick={() => onInspect(a)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/5"
            >
              <ScoreBadge score={a.score} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-gray-200">{a.title}</span>
                {showDate && <span className="text-xs text-gray-500">{a.updatedAt}</span>}
              </span>
            </button>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-gray-500">No data.</li>}
      </ul>
    </div>
  );
}
