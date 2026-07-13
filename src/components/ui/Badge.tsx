import React from "react";

type Tone =
  | "brand"
  | "neutral"
  | "success"
  | "warning"
  | "danger";

const TONES: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700",
  neutral: "bg-canvas text-muted border border-line",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-[#b45309]",
  danger: "bg-danger/10 text-danger",
};

export default function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
