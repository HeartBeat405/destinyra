"use client";

import { useState } from "react";

import { calculateLifePath } from "../../features/numerology/lib/calculateLifePath";

import { lifePathData } from "../../features/numerology/data/lifePathData";

import ResultCard from "../../features/numerology/components/ResultCard";

export default function AnalyzePage() {
  const [name, setName] = useState("");

  const [birthDate, setBirthDate] = useState("");

  const [result, setResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!birthDate) return;

    setResult(null);

    setLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 3000)
    );

    const resultData =
      calculateLifePath(birthDate);

    const data =
      lifePathData[resultData.lifePath];

    setResult({
      name,
      number: resultData.lifePath,
      masterNumber:
        resultData.masterNumber,
      ...data,
    });

    setLoading(false);
  }

  return (
    <main
      className="
        w-full
        min-h-screen
        flex
        items-center
        justify-center
        px-6
        py-20
      "
    >
      <div className="w-full max-w-3xl">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1
            className="
              text-4xl
              md:text-7xl
              font-bold
              glow-text
              mb-4
            "
          >
            Analyze Your Destiny ✨
          </h1>

          <p className="text-gray-400 text-lg">
            Unlock your hidden life path and destiny.
          </p>
        </div>

        {/* MAIN CARD */}
        <div
          className="
            bg-white/5
            border
            border-white/10
            backdrop-blur-2xl
            rounded-3xl
            p-8
            shadow-2xl
          "
        >
          <div className="flex flex-col gap-6">
            {/* NAME INPUT */}
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="
                w-full
                p-4
                rounded-2xl
                bg-white/10
                border
                border-white/10
                outline-none
                text-white
                placeholder:text-gray-400
              "
            />

            {/* DATE INPUT */}
            <input
              type="date"
              value={birthDate}
              onChange={(e) =>
                setBirthDate(e.target.value)
              }
              className="
                w-full
                p-4
                rounded-2xl
                bg-white/10
                border
                border-white/10
                outline-none
                text-white
              "
            />

            {/* BUTTON */}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="
                w-full
                p-4
                rounded-2xl
                bg-gradient-to-r
                from-purple-600
                to-cyan-500
                font-semibold
                hover:scale-[1.02]
                transition-all
                duration-300
                shadow-lg
                disabled:opacity-50
              "
            >
              {loading
                ? "Reading Your Destiny..."
                : "Reveal My Destiny"}
            </button>
          </div>

          {/* LOADING */}
          {loading && (
            <div
              className="
                mt-8
                p-6
                rounded-2xl
                bg-purple-500/10
                border
                border-purple-500/20
                text-center
              "
            >
              <div className="spinner mx-auto mb-4" />

              <h2 className="text-2xl glow-text mb-2">
                Reading Your Destiny ✨
              </h2>

              <p className="text-gray-400">
                Analyzing cosmic energy...
              </p>
            </div>
          )}

          {/* RESULT */}
          {!loading && result && (
            <ResultCard result={result} />
          )}
        </div>
      </div>
    </main>
  );
}