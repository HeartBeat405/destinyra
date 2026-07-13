// Reusable progress metric card (value vs target).
export default function ProgressCard({
  label,
  value,
  max,
  suffix = "",
  hint,
}: {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  hint?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-black text-white">
          {value.toLocaleString()}
          {suffix && <span className="ml-1 text-sm font-medium text-gray-500">{suffix}</span>}
        </p>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      {hint && <p className="mt-2 text-xs text-gray-600">{hint}</p>}
    </div>
  );
}
