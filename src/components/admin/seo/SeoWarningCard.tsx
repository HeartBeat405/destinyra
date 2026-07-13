import { AlertTriangle, CheckCircle2 } from "lucide-react";

// Reusable SEO issue card. Neutral/green when count is 0, amber otherwise.
export default function SeoWarningCard({
  label,
  count,
  info = false,
}: {
  label: string;
  count: number;
  info?: boolean;
}) {
  const clean = count === 0;
  return (
    <div
      className={`rounded-2xl border p-4 ${
        info
          ? "border-white/10 bg-white/[0.03]"
          : clean
            ? "border-emerald-500/15 bg-emerald-500/[0.06]"
            : "border-amber-500/20 bg-amber-500/[0.06]"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-300">{label}</p>
        {info ? (
          <span className="text-xs text-gray-500">—</span>
        ) : clean ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-amber-400" />
        )}
      </div>
      {info ? (
        <p className="mt-1 text-xs text-gray-600">Managed in editor</p>
      ) : (
        <p
          className={`mt-1 text-2xl font-black ${
            clean ? "text-emerald-300" : "text-amber-300"
          }`}
        >
          {count}
        </p>
      )}
    </div>
  );
}
