import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
};

export default function SectionHeading({
  title,
  subtitle,
  href,
  hrefLabel = "View all",
}: Props) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-600"
        >
          {hrefLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
