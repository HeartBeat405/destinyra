import Link from "next/link";
import { articlesRepo } from "../../../lib/repositories/articles.repo";
import { categoryService } from "../../../lib/services/category.service";
import { tagService } from "../../../lib/services/tag.service";
import { authorService } from "../../../lib/services/author.service";
import { toolService } from "../../../lib/services/tool.service";
import { buildAnalytics, type LabelValue, type RankedArticle } from "../../../lib/analytics";

import PageHeader from "../../../components/admin/PageHeader";
import StatCard from "../../../components/admin/StatCard";
import BarChart from "../../../components/admin/charts/BarChart";
import ProgressCard from "../../../components/admin/charts/ProgressCard";
import TrendCard from "../../../components/admin/charts/TrendCard";

export const metadata = { title: "Analytics — Admin" };

export default async function AdminAnalyticsPage() {
  const [articles, categories, tags, authors, tools] = await Promise.all([
    articlesRepo.findAll(),
    categoryService.getAll(),
    tagService.getAllAdmin(),
    authorService.getAll(),
    toolService.getAll(),
  ]);

  const d = buildAnalytics({ articles, categories, tags, authors, tools });
  const monthValues = d.publishingByMonth.map((m) => m.value);

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Content performance and editorial insights."
      />

      {/* Totals */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Articles" value={d.totals.total} iconName="FileText" hint={`${d.totals.published} published`} />
        <StatCard label="Categories" value={d.totals.categories} iconName="FolderTree" gradient="from-blue-500 to-indigo-600" />
        <StatCard label="Tags" value={d.totals.tags} iconName="Tag" gradient="from-fuchsia-500 to-purple-600" />
        <StatCard label="Authors" value={d.totals.authors} iconName="Users" gradient="from-amber-500 to-orange-600" />
      </div>

      {/* Averages / trend */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TrendCard label="Avg SEO Score" value={d.averages.seoScore} values={monthValues} />
        <TrendCard label="Avg Reading Time" value={d.averages.readingTime} suffix="min" values={monthValues} />
        <TrendCard label="Avg Word Count" value={d.averages.wordCount.toLocaleString()} values={monthValues} />
        <StatCard label="Tools" value={d.totals.tools} iconName="Wrench" gradient="from-emerald-500 to-teal-500" />
      </div>

      {/* Publishing activity + popular categories */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Publishing Activity" subtitle="Articles published per month">
          <BarChart data={d.publishingByMonth} />
        </ChartCard>
        <ChartCard title="Most Popular Categories" subtitle="Articles per category">
          <BarChart data={d.popularCategories} />
        </ChartCard>
      </div>

      {/* Insight widgets */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <RankWidget title="Most Read" items={d.mostRead} unit="views" />
        <RankWidget title="Longest Articles" items={d.longest} unit="words" />
        <UpdatedWidget title="Recently Updated" items={d.mostUpdated} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ListWidget title="Most Popular Tags" items={d.popularTags} />
        <ListWidget title="Most Used Tools" items={d.mostUsedTools} />
        <ListWidget title="Top Authors" items={d.topAuthors} />
      </div>

      {/* Content quality */}
      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Content Quality
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ProgressCard label="Avg SEO Score" value={d.averages.seoScore} max={100} suffix="/100" />
        <ProgressCard label="Avg Word Count" value={d.averages.wordCount} max={1200} hint="Target ~1200" />
        <ProgressCard label="Missing Meta" value={d.quality.missingMeta} max={Math.max(1, d.totals.total)} hint="Articles without meta description" />
        <ProgressCard label="Without Category" value={d.quality.noCategory} max={Math.max(1, d.totals.total)} />
      </div>

      {/* Placeholders */}
      <p className="mt-8 text-center text-xs text-gray-600">
        Most Read uses stored view counts. Most Shared and real-time traffic
        populate once an analytics pipeline is connected.
      </p>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      {subtitle && <p className="mb-4 text-xs text-gray-500">{subtitle}</p>}
      {children}
    </div>
  );
}

function RankWidget({
  title,
  items,
  unit,
}: {
  title: string;
  items: RankedArticle[];
  unit: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h3 className="mb-4 text-sm font-bold text-white">{title}</h3>
      <ol className="space-y-2.5">
        {items.map((a, i) => (
          <li key={a.slug} className="flex items-center gap-3">
            <span className="text-sm font-black text-white/20">{i + 1}</span>
            <Link
              href={`/admin/articles/${a.slug}`}
              className="line-clamp-1 min-w-0 flex-1 text-sm text-gray-200 hover:text-purple-200"
            >
              {a.title}
            </Link>
            <span className="shrink-0 text-xs text-gray-500">
              {a.value.toLocaleString()} {unit}
            </span>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-gray-500">No data.</li>}
      </ol>
    </div>
  );
}

function UpdatedWidget({
  title,
  items,
}: {
  title: string;
  items: { title: string; slug: string; updatedAt: string }[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h3 className="mb-4 text-sm font-bold text-white">{title}</h3>
      <ul className="space-y-2.5">
        {items.map((a) => (
          <li key={a.slug} className="flex items-center gap-3">
            <Link
              href={`/admin/articles/${a.slug}`}
              className="line-clamp-1 min-w-0 flex-1 text-sm text-gray-200 hover:text-purple-200"
            >
              {a.title}
            </Link>
            <span className="shrink-0 text-xs text-gray-500">{a.updatedAt}</span>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-gray-500">No data.</li>}
      </ul>
    </div>
  );
}

function ListWidget({ title, items }: { title: string; items: LabelValue[] }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h3 className="mb-4 text-sm font-bold text-white">{title}</h3>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="truncate text-gray-200">{it.label}</span>
              <span className="text-xs text-gray-500">{it.value}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                style={{ width: `${(it.value / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-gray-500">No data.</li>}
      </ul>
    </div>
  );
}
