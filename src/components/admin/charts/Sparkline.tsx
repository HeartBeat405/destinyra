// Lightweight line/sparkline (SVG). No external chart library.
export default function Sparkline({
  values,
  width = 120,
  height = 36,
  color = "#8b7dff",
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (values.length < 2) {
    return <div style={{ width, height }} aria-hidden />;
  }
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1);
  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / span) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label={`Trend: ${values.join(", ")}`}
      className="overflow-visible"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
