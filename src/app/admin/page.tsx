import Link from "next/link";
import { dashboardService } from "../../lib/services/dashboard.service";
import PageHeader from "../../components/admin/PageHeader";
import StatCard from "../../components/admin/StatCard";
import Icon from "../../components/ui/Icon";
import StatusBadge from "../../components/admin/StatusBadge";
import { formatDate } from "../../lib/seo";

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

export default async function AdminDashboard() {
  const data = await dashboardService.getOverview();
  const { counts } = data;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your content and platform health."
      />

      {/* Primary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Articles"
          value={fmt(counts.articles)}
          iconName="FileText"
          hint={`${fmt(counts.published)} published`}
        />
        <StatCard
          label="Total Views"
          value={fmt(counts.totalViews)}
          iconName="BarChart3"
          gradient="from-emerald-500 to-teal-500"
          hint="All-time article views"
        />
        <StatCard
          label="Categories"
          value={fmt(counts.categories)}
          iconName="FolderTree"
          gradient="from-blue-500 to-indigo-600"
        />
        <StatCard
          label="Tools"
          value={fmt(counts.tools)}
          iconName="Wrench"
          gradient="from-amber-500 to-orange-600"
        />
      </div>

      {/* Secondary stats */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Drafts" value={fmt(counts.drafts)} iconName="File" gradient="from-gray-500 to-gray-600" />
        <StatCard label="Scheduled" value={fmt(counts.scheduled)} iconName="ScrollText" gradient="from-amber-500 to-yellow-600" />
        <StatCard label="Authors" value={fmt(counts.authors)} iconName="Users" gradient="from-fuchsia-500 to-purple-600" />
        <StatCard label="Archived" value={fmt(counts.archived)} iconName="ScrollText" gradient="from-rose-500 to-pink-600" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Top articles */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="mb-4 text-lg font-bold">Top Articles</h2>
            <ol className="divide-y divide-white/5">
              {data.topArticles.map((a, i) => (
                <li key={a.id} className="flex items-center gap-4 py-3">
                  <span className="text-lg font-black text-white/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/articles/${a.slug}`}
                      target="_blank"
                      className="line-clamp-1 text-sm font-semibold hover:text-purple-200"
                    >
                      {a.title}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {a.category?.name ?? "Uncategorized"}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-gray-300">
                    {fmt(a.views)} views
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Top categories */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="mb-4 text-lg font-bold">Top Categories</h2>
          <ul className="space-y-3">
            {data.topCategories.map((c) => (
              <li key={c.slug} className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${c.gradient}`}
                >
                  <Icon name={c.iconName} className="h-4 w-4 text-white" />
                </span>
                <span className="flex-1 text-sm font-medium">{c.name}</span>
                <span className="text-xs text-gray-500">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h2 className="mb-4 text-lg font-bold">Recent Articles</h2>
        <ul className="divide-y divide-white/5">
          {data.recentArticles.map((a) => (
            <li key={a.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-medium">{a.title}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(a.publishedAt)}
                </p>
              </div>
              <StatusBadge status={a.status} />
            </li>
          ))}
        </ul>
      </div>

      {/* Analytics note */}
      <p className="mt-6 text-center text-xs text-gray-600">
        Visitor metrics (today / monthly / search keywords) populate from the
        internal analytics pipeline in a later milestone. Counts above are live
        from the content layer.
      </p>
    </div>
  );
}
