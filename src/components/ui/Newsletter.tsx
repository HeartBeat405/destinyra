"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { Button } from "./Button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: POST to /api/newsletter (Supabase `newsletter` table).
    setDone(true);
  }

  return (
    <section className="overflow-hidden rounded-4xl border border-line bg-brand-50 p-8 sm:p-12">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-card">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
          Get the weekly Destinyra digest
        </h2>
        <p className="mt-3 text-muted">
          One thoughtful email a week — the best stories on growth,
          spirituality, and self-discovery. No spam, ever.
        </p>

        {done ? (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-success/10 px-6 py-3 font-semibold text-success">
            <Check className="h-5 w-5" />
            You&apos;re in — check your inbox.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 rounded-full border border-line bg-surface px-5 py-3 text-ink outline-none placeholder:text-muted focus:border-brand"
            />
            <Button type="submit" size="lg">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
