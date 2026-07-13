import type { ArticleStatus } from "../../lib/types";

const STYLES: Record<string, string> = {
  published: "bg-emerald-500/15 text-emerald-300",
  draft: "bg-gray-500/15 text-gray-300",
  scheduled: "bg-amber-500/15 text-amber-300",
  archived: "bg-rose-500/15 text-rose-300",
  future: "bg-amber-500/15 text-amber-300",
  live: "bg-emerald-500/15 text-emerald-300",
};

export default function StatusBadge({
  status,
}: {
  status: ArticleStatus | string;
}) {
  const cls = STYLES[status] ?? "bg-white/10 text-gray-300";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${cls}`}
    >
      {status}
    </span>
  );
}
