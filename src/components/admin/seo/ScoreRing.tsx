import { scoreTone } from "../../../lib/seo-analyzer";

const COLOR = {
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
};

// Circular SEO score indicator (reusable).
export default function ScoreRing({
  score,
  size = 64,
  stroke = 6,
}: {
  score: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, score)) / 100) * c;
  const color = COLOR[scoreTone(score)];

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`SEO score ${score} of 100`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-sm font-black"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const tone = scoreTone(score);
  const cls =
    tone === "success"
      ? "bg-emerald-500/15 text-emerald-300"
      : tone === "warning"
        ? "bg-amber-500/15 text-amber-300"
        : "bg-rose-500/15 text-rose-300";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}>
      {score}
    </span>
  );
}
