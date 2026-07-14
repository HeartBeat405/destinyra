"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2, Eye, EyeOff } from "lucide-react";
import type { Review } from "../../lib/types";
import {
  setReviewFlagsAction,
  deleteReviewAction,
} from "../../lib/actions/review.actions";

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= n ? "fill-amber-400 text-amber-400" : "fill-transparent text-gray-600"
          }`}
        />
      ))}
    </span>
  );
}

export default function ReviewsAdmin({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  function run(p: Promise<{ ok: boolean; message?: string }>, okMsg: string) {
    start(async () => {
      const res = await p;
      setToast(res.ok ? okMsg : res.message ?? "Failed");
      setTimeout(() => setToast(null), 2500);
      if (res.ok) router.refresh();
    });
  }

  if (reviews.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] py-16 text-center text-sm text-gray-500">
        <Star className="mb-3 h-8 w-8 text-gray-600" />
        No reviews yet. Submissions from the site review form will appear here.
      </div>
    );
  }

  return (
    <div className="mt-6">
      {toast && (
        <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200">
          {toast}
        </div>
      )}
      <div className="space-y-3">
        {reviews.map((r) => (
          <div
            key={r.id}
            className={`rounded-2xl border p-4 ${
              r.approved ? "border-white/10 bg-white/[0.04]" : "border-white/5 bg-white/[0.02] opacity-60"
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Stars n={r.rating} />
                  <span className="font-semibold">{r.name}</span>
                  <span className="text-xs text-gray-500">{r.createdAt}</span>
                  {r.featured && (
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                      Featured
                    </span>
                  )}
                  {!r.approved && (
                    <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-300">{r.comment}</p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <button
                  disabled={pending}
                  onClick={() =>
                    run(
                      setReviewFlagsAction(r.id, { featured: !r.featured }),
                      r.featured ? "Removed from featured" : "Featured — now shown on site"
                    )
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-40 ${
                    r.featured
                      ? "border-amber-400/40 bg-amber-500/10 text-amber-300"
                      : "border-white/10 hover:bg-white/10"
                  }`}
                >
                  <Star
                    className={`h-3.5 w-3.5 ${r.featured ? "fill-amber-400 text-amber-400" : ""}`}
                  />
                  {r.featured ? "Featured" : "Feature"}
                </button>
                <button
                  disabled={pending}
                  onClick={() =>
                    run(
                      setReviewFlagsAction(r.id, { approved: !r.approved }),
                      r.approved ? "Hidden from site" : "Shown on site"
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/10 disabled:opacity-40"
                >
                  {r.approved ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" /> Show
                    </>
                  )}
                </button>
                <button
                  disabled={pending}
                  onClick={() => run(deleteReviewAction(r.id), "Deleted")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-white/5 disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
