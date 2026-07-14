"use client";

import { useState, useTransition } from "react";
import { Star, Check, AlertCircle } from "lucide-react";
import { Button } from "./Button";
import { submitReviewAction } from "../../lib/actions/review.actions";

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const res = await submitReviewAction({ name, rating, comment });
      if (res.ok) {
        setMessage(res.message);
        setDone(true);
      } else {
        setError(res.message);
      }
    });
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-2 rounded-2xl border border-success/20 bg-success/10 px-6 py-5 text-center">
        <Check className="h-6 w-6 text-success" />
        <p className="font-semibold text-success">
          {message ?? "Thank you for your review!"}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4">
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-full border border-line bg-surface px-5 py-3 text-ink outline-none placeholder:text-muted focus:border-brand"
      />

      {/* Star rating */}
      <div className="flex items-center justify-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = (hover || rating) >= n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 ${
                  filled
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-line"
                }`}
              />
            </button>
          );
        })}
      </div>

      <textarea
        required
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with Destinyra…"
        rows={3}
        className="w-full resize-none rounded-2xl border border-line bg-surface px-5 py-3 text-ink outline-none placeholder:text-muted focus:border-brand"
      />

      <div className="text-center">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Posting…" : "Post Review"}
        </Button>
      </div>

      {error && (
        <p className="flex items-center justify-center gap-1.5 text-sm text-danger">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </form>
  );
}
