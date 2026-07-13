"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Layers, Sparkles, RotateCcw } from "lucide-react";

import { tarotCards, type TarotCard } from "../../../features/tarot/data/tarotCards";

type Position = { label: string; hint: string };

// Card-count spreads. Each position frames its card's meaning so the
// reading stays coherent no matter how many cards are drawn.
const SPREADS: Record<number, { title: string; positions: Position[] }> = {
  1: {
    title: "Single Card",
    positions: [
      { label: "Your Card", hint: "Focused guidance for what's on your mind right now." },
    ],
  },
  3: {
    title: "Past · Present · Future",
    positions: [
      { label: "Past", hint: "What shaped where you are now." },
      { label: "Present", hint: "The energy around you today." },
      { label: "Future", hint: "Where this path is heading." },
    ],
  },
  5: {
    title: "Five-Card Path",
    positions: [
      { label: "The Situation", hint: "The heart of the matter." },
      { label: "The Challenge", hint: "What's testing or blocking you." },
      { label: "The Root", hint: "The deeper cause beneath it all." },
      { label: "The Advice", hint: "How best to move forward." },
      { label: "The Outcome", hint: "Where this leads if you follow through." },
    ],
  },
};

const COUNTS = [1, 3, 5] as const;

// Draw N distinct cards (Fisher–Yates shuffle, no duplicates).
function drawCards(n: number): TarotCard[] {
  const deck = [...tarotCards];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, n);
}

export default function TarotToolPage() {
  const [question, setQuestion] = useState("");
  const [count, setCount] = useState<number>(1);
  const [cards, setCards] = useState<TarotCard[] | null>(null);
  const [drawing, setDrawing] = useState(false);

  async function draw() {
    setCards(null);
    setDrawing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setCards(drawCards(count));
    setDrawing(false);
  }

  const positions = SPREADS[count].positions;

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
          Hold a question in mind, choose your spread, then draw for focused
          guidance. Readings use the 22 Major Arcana.
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

          {/* Spread selector */}
          <div>
            <p className="mb-2 text-sm font-semibold text-ink">
              How many cards?
            </p>
            <div className="grid grid-cols-3 gap-2">
              {COUNTS.map((c) => {
                const active = count === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCount(c);
                      setCards(null);
                    }}
                    className={`rounded-2xl border p-3 text-center transition ${
                      active
                        ? "border-brand bg-brand-50 text-brand-700"
                        : "border-line bg-canvas text-muted hover:border-brand/50"
                    }`}
                  >
                    <span className="block text-lg font-black">{c}</span>
                    <span className="block text-[11px] font-medium">
                      {SPREADS[c].title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={draw}
            disabled={drawing}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 p-4 font-semibold text-white shadow-card transition-all hover:opacity-90 disabled:opacity-50"
          >
            {cards ? (
              <>
                <RotateCcw className="h-4 w-4" />
                Draw Again
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {drawing
                  ? "Shuffling the deck..."
                  : `Draw ${count} Card${count > 1 ? "s" : ""}`}
              </>
            )}
          </button>
        </div>

        {drawing && (
          <div className="mt-8 flex flex-col items-center">
            <div className="flex gap-2">
              {Array.from({ length: count }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-40 w-24 animate-pulse rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600"
                  style={{ animationDelay: `${idx * 120}ms` }}
                />
              ))}
            </div>
            <p className="mt-4 text-muted">Drawing your cards...</p>
          </div>
        )}

        {!drawing && cards && (
          <div className="mt-8">
            {question.trim() && (
              <p className="mb-5 rounded-2xl border border-line bg-canvas px-4 py-3 text-center text-sm italic text-muted">
                “{question.trim()}”
              </p>
            )}

            <p className="mb-4 text-center text-sm font-semibold text-brand-700">
              {SPREADS[count].title}
            </p>

            <div className="flex flex-col gap-4">
              {cards.map((card, idx) => {
                const pos = positions[idx];
                return (
                  <div
                    key={card.name}
                    className="flex flex-col gap-4 rounded-2xl border border-line bg-canvas p-4 sm:flex-row"
                  >
                    {/* Card visual */}
                    <div className="relative mx-auto flex h-44 w-28 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 p-3 text-center text-white shadow-card sm:mx-0">
                      <span className="absolute left-2 top-1.5 text-[10px] font-bold opacity-80">
                        {card.number}
                      </span>
                      <span className="absolute bottom-1.5 right-2 rotate-180 text-[10px] font-bold opacity-80">
                        {card.number}
                      </span>
                      <Layers className="mb-2 h-8 w-8" strokeWidth={1.5} />
                      <span className="font-serif text-sm font-bold leading-tight">
                        {card.name}
                      </span>
                    </div>

                    {/* Meaning framed by position */}
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-700">
                        {pos.label}
                      </span>
                      <p className="mt-1 text-xs italic text-muted">{pos.hint}</p>
                      <h3 className="mt-2 font-serif text-lg font-bold text-ink">
                        {card.name}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {card.keywords.map((k) => (
                          <span
                            key={k}
                            className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-brand-700"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted">
                        {card.upright}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-ink">
                        <span className="font-semibold">Guidance: </span>
                        {card.guidance}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-6 text-center text-xs text-muted">
              The cards are a mirror for reflection, not a prediction. Take what
              resonates and leave the rest.
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
