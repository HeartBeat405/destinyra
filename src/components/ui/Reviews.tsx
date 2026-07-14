import { Star } from "lucide-react";
import { reviewsRepo } from "../../lib/repositories/reviews.repo";
import ReviewForm from "./ReviewForm";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= n ? "fill-amber-400 text-amber-400" : "fill-transparent text-line"
          }`}
        />
      ))}
    </div>
  );
}

// Public reviews block: recent testimonials + a submit form (name, star
// rating, comment). Replaces the old newsletter signup.
export default async function Reviews() {
  const reviews = await reviewsRepo.listForPublic(6);

  return (
    <section className="overflow-hidden rounded-4xl border border-line bg-brand-50 p-8 sm:p-12">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
          What people are saying
        </h2>
        <p className="mt-3 text-muted">
          Loved Destinyra? Leave a rating and a comment — we&apos;d love to hear
          from you.
        </p>
      </div>

      {reviews.length > 0 && (
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-line bg-surface p-5 text-left shadow-card"
            >
              <Stars n={r.rating} />
              <p className="mt-3 line-clamp-5 text-sm leading-6 text-ink/85">
                “{r.comment}”
              </p>
              <p className="mt-3 text-xs font-semibold text-muted">— {r.name}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 border-t border-line pt-8">
        <ReviewForm />
      </div>
    </section>
  );
}
