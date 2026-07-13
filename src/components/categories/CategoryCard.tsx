import Link from "next/link";
import type { Category } from "../../lib/types";
import Icon from "../ui/Icon";

type Props = {
  category: Category;
  count?: number;
};

export default function CategoryCard({ category, count }: Props) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${category.gradient} text-white shadow-card`}
      >
        <Icon name={category.iconName} className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold tracking-tight text-ink transition-colors group-hover:text-brand-700">
        {category.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted">
        {category.description}
      </p>
      {typeof count === "number" && (
        <p className="mt-4 text-xs font-medium text-muted">
          {count} {count === 1 ? "article" : "articles"}
        </p>
      )}
    </Link>
  );
}
