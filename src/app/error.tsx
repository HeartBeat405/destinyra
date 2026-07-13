"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for monitoring; replace with a real logger in production.
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-black tracking-tight text-ink">
        Something went wrong
      </h1>
      <p className="mt-3 text-muted">
        An unexpected error occurred. You can try again.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-card transition-colors hover:bg-brand-600"
      >
        <RotateCcw className="h-4 w-4" />
        Try again
      </button>
    </main>
  );
}
