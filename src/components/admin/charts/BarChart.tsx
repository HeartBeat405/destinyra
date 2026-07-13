import type { LabelValue } from "../../../lib/analytics";

// Lightweight vertical bar chart (div-based, responsive, accessible).
// Uses the brand token — no external chart library.
export default function BarChart({
  data,
  height = 160,
}: {
  data: LabelValue[];
  height?: number;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-500">No data yet.</p>;
  }

  return (
    <div
      className="flex items-end gap-3"
      style={{ height }}
      role="img"
      aria-label={`Bar chart: ${data.map((d) => `${d.label} ${d.value}`).join(", ")}`}
    >
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center justify-end gap-2">
          <span className="text-xs font-semibold text-gray-300">{d.value}</span>
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-purple-600 to-cyan-400"
            style={{ height: `${(d.value / max) * (height - 40)}px`, minHeight: 4 }}
          />
          <span className="w-full truncate text-center text-[10px] text-gray-500">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}
