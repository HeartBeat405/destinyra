"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Feather, Sparkles } from "lucide-react";

import {
  decodeAngelNumber,
  type AngelReading,
} from "../../../features/angel-number/data/angelNumbers";

export default function AngelNumberToolPage() {
  const [value, setValue] = useState("");
  const [reading, setReading] = useState<AngelReading | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function decode() {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setError("Enter a number you keep seeing, like 111 or 1212.");
      return;
    }
    setError("");
    setReading(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    setReading(decodeAngelNumber(clean));
    setLoading(false);
  }

  const quick = ["111", "222", "333", "444", "555", "1111", "1212"];

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <nav className="flex items-center gap-1 text-sm text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-line" />
        <Link href="/tools" className="hover:text-ink">
          Tools
        </Link>
        <ChevronRight className="h-4 w-4 text-line" />
        <span className="text-ink">Angel Number Decoder</span>
      </nav>

      <header className="mt-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white shadow-card">
          <Feather className="h-8 w-8" strokeWidth={1.75} />
        </div>
        <h1 className="font-serif text-4xl font-bold text-ink">
          Angel Number Decoder
        </h1>
        <p className="mt-3 text-muted">
          Keep seeing a repeating number? Enter it below and decode the message
          behind it.
        </p>
      </header>

      <div className="mt-10 rounded-4xl border border-line bg-surface p-8 shadow-card">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            inputMode="numeric"
            placeholder="e.g. 1111"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && decode()}
            className="rounded-2xl border border-line bg-canvas p-4 text-center text-2xl font-bold tracking-widest text-ink outline-none placeholder:text-muted focus:border-brand"
          />

          <div className="flex flex-wrap justify-center gap-2">
            {quick.map((q) => (
              <button
                key={q}
                onClick={() => setValue(q)}
                className="rounded-full border border-line bg-canvas px-3 py-1 text-sm font-semibold text-muted transition-colors hover:border-brand hover:text-brand"
              >
                {q}
              </button>
            ))}
          </div>

          <button
            onClick={decode}
            disabled={loading}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-cyan-500 to-sky-600 p-4 font-semibold text-white shadow-card transition-all hover:opacity-90 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "Decoding..." : "Decode Your Number"}
          </button>

          {error && (
            <p className="text-center text-sm text-danger">{error}</p>
          )}
        </div>

        {loading && (
          <div className="mt-8 rounded-2xl border border-line bg-brand-50 p-6 text-center">
            <div className="spinner mx-auto mb-4" />
            <p className="text-muted">Tuning into the message...</p>
          </div>
        )}

        {!loading && reading && (
          <div className="mt-8">
            <div className="flex flex-col items-center text-center">
              <span className="font-serif text-5xl font-black text-ink">
                {reading.number}
              </span>
              <p className="mt-2 text-lg font-bold text-brand-700">
                {reading.title}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-line bg-canvas p-6">
              <p className="leading-7 text-muted">{reading.meaning}</p>
              <div className="mt-4 border-t border-line pt-4">
                <p className="flex items-center gap-2 text-sm font-bold text-ink">
                  <Sparkles className="h-4 w-4 text-brand" />
                  Your guidance
                </p>
                <p className="mt-2 leading-7 text-muted">{reading.guidance}</p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-muted">
              Angel numbers are a tool for reflection — notice what the message
              stirs in you.
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/tools"
          className="text-sm font-semibold text-brand-700 hover:text-brand-600"
        >
          ← Back to all tools
        </Link>
      </div>
    </main>
  );
}
