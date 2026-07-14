import PageHeader from "../../../components/admin/PageHeader";
import StatCard from "../../../components/admin/StatCard";
import ReviewsAdmin from "../../../components/admin/ReviewsAdmin";
import { reviewsRepo } from "../../../lib/repositories/reviews.repo";

export const metadata = { title: "Reviews — Admin" };
export const dynamic = "force-dynamic";

export default async function ReviewsAdminPage() {
  const reviews = await reviewsRepo.listAll();
  const featured = reviews.filter((r) => r.featured).length;
  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "—";

  return (
    <div>
      <PageHeader
        title="Reviews"
        description="Every submitted review. Feature the best ones to show them on the site."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Reviews"
          value={String(reviews.length)}
          iconName="Star"
        />
        <StatCard
          label="Featured"
          value={String(featured)}
          iconName="Sparkles"
          gradient="from-amber-500 to-orange-600"
        />
        <StatCard
          label="Average Rating"
          value={avg}
          iconName="TrendingUp"
          gradient="from-emerald-500 to-teal-500"
        />
      </div>

      <ReviewsAdmin reviews={reviews} />

      <p className="mt-4 text-center text-xs text-gray-600">
        “Feature” shows a review on the homepage / article / tool pages. If none
        are featured, the most recent visible reviews show instead. “Hide”
        removes a review from the site without deleting it.
      </p>
    </div>
  );
}
