import Link from "next/link";
import React from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-card hover:bg-brand-600 focus-visible:outline-brand",
  secondary: "bg-ink text-white hover:bg-ink/90",
  outline:
    "border border-line bg-surface text-ink hover:bg-canvas",
  ghost: "text-ink hover:bg-black/[0.04]",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

const base =
  "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  ...props
}: CommonProps &
  { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link
      href={href}
      className={`${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
