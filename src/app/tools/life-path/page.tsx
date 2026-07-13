"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Orbit } from "lucide-react";

import { calculateLifePath } from "../../../features/numerology/lib/calculateLifePath";
import {
  lifePathData,
  masterNumberData,
} from "../../../features/numerology/data/lifePathData";
import ResultCard from "../../../features/numerology/components/ResultCard";

export default function LifePathToolPage() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!birthDate) return;
    setResult(null);
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const resultData = calculateLifePath(birthDate);
    const data = lifePathData[resultData.lifePath];
    const masterData = resultData.masterNumber
      ? masterNumberData[resultData.masterNumber]
      : undefined;

    setResult({
      name,
      number: resultData.lifePath,
      masterNumber: resultData.masterNumber,
      ...data,
      masterData,
    });
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-line" />
        <Link href="/tools" className="hover:text-ink">
          Tools
        </Link>
        <ChevronRight className="h-4 w-4 text-line" />
        <span className="text-ink">Life Path Calculator</span>
      </nav>

      {/* Header */}
      <header className="mt-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white shadow-card">
          <Orbit className="h-8 w-8" strokeWidth={1.75} />
        </div>
        <h1 className="font-serif text-4xl font-bold text-ink">
          Life Path Calculator
        </h1>
        <p className="mt-3 text-muted">
          Enter your birth date to reveal your core Life Path number and
          the personality blueprint behind it.
        </p>
      </header>

      {/* Card */}
      <div className="mt-10 rounded-4xl border border-line bg-surface p-8 shadow-card">
        <div className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Your Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-2xl border border-line bg-canvas p-4 text-ink outline-none placeholder:text-muted focus:border-brand"
          />
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="rounded-2xl border border-line bg-canvas p-4 text-ink outline-none focus:border-brand"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="rounded-full bg-brand p-4 font-semibold text-white shadow-card transition-all hover:bg-brand-600 disabled:opacity-50"
          >
            {loading ? "Reading your numbers..." : "Reveal My Life Path"}
          </button>
        </div>

        {loading && (
          <div className="mt-8 rounded-2xl border border-line bg-brand-50 p-6 text-center">
            <div className="spinner mx-auto mb-4" />
            <h2 className="mb-2 text-2xl font-bold text-ink">
              Reading your numbers
            </h2>
            <p className="text-muted">Mapping your cosmic energy...</p>
          </div>
        )}

        {!loading && result && <ResultCard result={result} />}
      </div>

      {/* Back to articles */}
      <div className="mt-10 text-center">
        <Link
          href="/categories/numerology"
          className="text-sm font-semibold text-brand-700 hover:text-brand-600"
        >
          ← Read more about numerology
        </Link>
      </div>
    </main>
  );
}
