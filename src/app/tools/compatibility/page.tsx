"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, HeartHandshake, Heart, Sparkles } from "lucide-react";

import {
  calculateCompatibility,
  type CompatibilityResult,
} from "../../../features/numerology/lib/calculateCompatibility";
import ResultShare from "../../../components/tools/ResultShare";

export default function CompatibilityToolPage() {
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");
  const [dateA, setDateA] = useState("");
  const [dateB, setDateB] = useState("");
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCheck() {
    if (!dateA || !dateB) return;
    setResult(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setResult(
      calculateCompatibility(
        dateA,
        dateB,
        nameA || "Partner 1",
        nameB || "Partner 2"
      )
    );
    setLoading(false);
  }

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
        <span className="text-ink">Love Compatibility</span>
      </nav>

      <header className="mt-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-card">
          <HeartHandshake className="h-8 w-8" strokeWidth={1.75} />
        </div>
        <h1 className="font-serif text-4xl font-bold text-ink">
          Love Compatibility
        </h1>
        <p className="mt-3 text-muted">
          Compare two birth dates to see how your numbers harmonize in love and
          friendship.
        </p>
      </header>

      <div className="mt-10 rounded-4xl border border-line bg-surface p-8 shadow-card">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-ink">Partner 1</label>
            <input
              type="text"
              placeholder="Name (optional)"
              value={nameA}
              onChange={(e) => setNameA(e.target.value)}
              className="rounded-2xl border border-line bg-canvas p-4 text-ink outline-none placeholder:text-muted focus:border-brand"
            />
            <input
              type="date"
              value={dateA}
              onChange={(e) => setDateA(e.target.value)}
              className="rounded-2xl border border-line bg-canvas p-4 text-ink outline-none focus:border-brand"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-ink">Partner 2</label>
            <input
              type="text"
              placeholder="Name (optional)"
              value={nameB}
              onChange={(e) => setNameB(e.target.value)}
              className="rounded-2xl border border-line bg-canvas p-4 text-ink outline-none placeholder:text-muted focus:border-brand"
            />
            <input
              type="date"
              value={dateB}
              onChange={(e) => setDateB(e.target.value)}
              className="rounded-2xl border border-line bg-canvas p-4 text-ink outline-none focus:border-brand"
            />
          </div>
        </div>

        <button
          onClick={handleCheck}
          disabled={loading || !dateA || !dateB}
          className="mt-6 w-full rounded-full bg-gradient-to-br from-rose-500 to-pink-600 p-4 font-semibold text-white shadow-card transition-all hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Reading your numbers..." : "Check Compatibility"}
        </button>

        {loading && (
          <div className="mt-8 rounded-2xl border border-line bg-brand-50 p-6 text-center">
            <div className="spinner mx-auto mb-4" />
            <p className="text-muted">Aligning your energies...</p>
          </div>
        )}

        {!loading && result && (
          <div className="mt-8">
            {/* Score ring */}
            <div className="flex flex-col items-center">
              <div className="relative flex h-40 w-40 items-center justify-center">
                <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-line"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="url(#grad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={
                      2 * Math.PI * 52 * (1 - result.score / 100)
                    }
                  />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#db2777" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-ink">
                    {result.score}%
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                    match
                  </span>
                </div>
              </div>
              <p className="mt-3 text-lg font-bold text-ink">{result.label}</p>
              <p className="mt-1 text-sm text-muted">
                Life Path {result.aRoot} ({result.aTitle}) &nbsp;×&nbsp; Life
                Path {result.bRoot} ({result.bTitle})
              </p>
            </div>

            <p className="mt-6 leading-7 text-muted">{result.summary}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-canvas p-5">
                <p className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                  What works
                </p>
                <ul className="space-y-2 text-sm text-muted">
                  {result.strengths.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-canvas p-5">
                <p className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
                  <Heart className="h-4 w-4 text-rose-500" />
                  Watch out for
                </p>
                <ul className="space-y-2 text-sm text-muted">
                  {result.watchouts.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <ResultShare
              filename="destinyra-compatibility"
              shareText={`${nameA || "Partner 1"} × ${nameB || "Partner 2"}: ${result.score}% match (${result.label}) on Destinyra 💞`}
              eyebrow="Love Compatibility"
              title={`${nameA || "Partner 1"} × ${nameB || "Partner 2"}`}
              highlight={`${result.score}%`}
              subtitle={result.label}
              rows={[
                { label: `Life Path ${result.aRoot}`, value: result.aTitle },
                { label: `Life Path ${result.bRoot}`, value: result.bTitle },
              ]}
              accent="#f43f5e"
            />

            <p className="mt-6 text-center text-xs text-muted">
              For entertainment and self-reflection — your connection is always
              bigger than a number.
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
