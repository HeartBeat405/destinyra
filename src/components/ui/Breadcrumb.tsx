import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { name: string; path: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1 text-sm text-muted"
    >
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={item.path} className="flex items-center gap-1">
            {last ? (
              <span className="line-clamp-1 text-ink">{item.name}</span>
            ) : (
              <Link
                href={item.path}
                className="transition-colors hover:text-ink"
              >
                {item.name}
              </Link>
            )}
            {!last && <ChevronRight className="h-4 w-4 text-line" />}
          </span>
        );
      })}
    </nav>
  );
}
