import Sparkline from "./Sparkline";

// Reusable metric + trend card.
export default function TrendCard({
  label,
  value,
  values,
  suffix = "",
}: {
  label: string;
  value: string | number;
  values: number[];
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm text-gray-400">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-3xl font-black tracking-tight text-white">
          {value}
          {suffix && <span className="ml-1 text-sm font-medium text-gray-500">{suffix}</span>}
        </p>
        <Sparkline values={values} />
      </div>
    </div>
  );
}
