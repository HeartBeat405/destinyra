"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Layers, Sparkles, RotateCcw } from "lucide-react";

import { tarotCards, type TarotCard } from "../../../features/tarot/data/tarotCards";

export default function TarotToolPage() {
  const [question, setQuestion] = useState("");
  const [card, setCard] = useState<TarotCard | null>(null);
  const [drawing, setDrawing] = useState(false);

  async function drawCard() {
    setCard(null);
    setDrawing(true);
    await new Promise((r) => setTimeout(r, 1200));
    const pick = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    setCard(pick);
    setDrawing(false);
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
        <span className="text-ink">Tarot Reading</span>
      </nav>

      <header className="mt-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-card">
          <Layers className="h-8 w-8" strokeWidth={1.75} />
        </div>
        <h1 className="font-serif text-4xl font-bold text-ink">Tarot Reading</h1>
        <p className="mt-3 text-muted">
          Hold a question in mind, then draw a card for focused guidance on
          what&apos;s in front of you right now.
        </p>
      </header>

      <div className="mt-10 rounded-4xl border border-line bg-surface p-8 shadow-card">
        <div className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="What's on your mind? (optional)"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="rounded-2xl border border-line bg-canvas p-4 text-ink outline-none placeholder:text-muted focus:border-brand"
          />
          <button
            onClick={drawCard}
            disabled={drawing}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 p-4 font-semibold text-white shadow-card transition-all hover:opacity-90 disabled:opacity-50"
          >
            {card ? (
              <>
                <RotateCcw className="h-4 w-4" />
                Draw Another Card
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {drawing ? "Shuffling the deck..." : "Draw Your Card"}
              </>
            )}
          </button>
        </div>

        {drawing && (
          <div className="mt-8 flex flex-col items-center">
            <div className="h-56 w-36 animate-pulse rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600" />
            <p className="mt-4 text-muted">Drawing your card...</p>
          </div>
        )}

        {!drawing && card && (
          <div className="mt-8">
            {question.trim() && (
              <p className="mb-5 rounded-2xl border border-line bg-canvas px-4 py-3 text-center text-sm italic text-muted">
                “{question.trim()}”
              </p>
            )}

            <div className="flex flex-col items-center">
              <div className="relative flex h-56 w-36 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 p-4 text-center text-white shadow-lift">
                <span className="absolute left-3 top-2 text-xs font-bold opacity-80">
                  {card.number}
                </span>
                <span className="absolute bottom-2 right-3 rotate-180 text-xs font-bold opacity-80">
                  {card.number}
                </span>
                <Layers className="mb-3 h-10 w-10" strokeWidth={1.5} />
                <span className="font-serif text-lg font-bold leading-tight">
                  {card.name}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {card.keywords.map((k) => (
                  <span
                    key={k}
                    className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-line bg-canvas p-6">
              <h2 className="font-serif text-xl font-bold text-ink">
                {card.name}
              </h2>
              <p className="mt-3 leading-7 text-muted">{card.upright}</p>
              <div className="mt-4 border-t border-line pt-4">
                <p className="flex items-center gap-2 text-sm font-bold text-ink">
                  <Sparkles className="h-4 w-4 text-brand" />
                  Your guidance
                </p>
                <p className="mt-2 leading-7 text-muted">{card.guidance}</p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-muted">
              A single card is a mirror for reflection, not a prediction. Take
              what resonates and leave the rest.
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
