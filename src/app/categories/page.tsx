import type { Metadata } from "next";

import { categoryService } from "../../lib/services/category.service";
import CategoryCard from "../../components/categories/CategoryCard";

export const metadata: Metadata = {
  title: "Categories — Destinyra",
  description:
    "Browse Destinyra by topic: self-growth, lifestyle, relationships, career, numerology, tarot, angel numbers, spirituality, mindset, and productivity.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await categoryService.getPopular(100);

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">
          Explore by Category
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Pick a path. Every category is a doorway into a different part of
          the self-discovery journey.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} count={c.count} />
        ))}
      </div>
    </main>
  );
}
