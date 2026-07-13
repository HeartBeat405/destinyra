"use client";

import { useState, useTransition } from "react";
import { Mail, Check, AlertCircle } from "lucide-react";
import { Button } from "./Button";
import { subscribeNewsletterAction } from "../../lib/actions/newsletter.actions";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || pending) return;
    setError(null);
    startTransition(async () => {
      const res = await subscribeNewsletterAction(email);
      if (res.ok) {
        setMessage(res.message);
        setDone(true);
      } else {
        setError(res.message);
      }
    });
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
            {message ?? "You're in — check your inbox."}
          </div>
        ) : (
          <>
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
              <Button type="submit" size="lg" disabled={pending}>
                {pending ? "Subscribing…" : "Subscribe"}
              </Button>
            </form>
            {error && (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-danger">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
