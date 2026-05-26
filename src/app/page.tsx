"use client";

import { useState } from "react";

import ParticleBackground from "../components/animations/ParticleBackground";

import { calculateLifePath } from "../features/numerology/lib/calculateLifePath";

import {
  lifePathData,
  masterNumberData,
} from "../features/numerology/data/lifePathData";

import ResultCard from "../features/numerology/components/ResultCard";

export default function AnalyzePage() {
  const [name, setName] = useState("");

  const [birthDate, setBirthDate] = useState("");

  const [result, setResult] = useState<any>(null);

  function handleAnalyze() {
    if (!birthDate) return;

    const resultData =
      calculateLifePath(birthDate);

    const data =
      lifePathData[resultData.lifePath];

    const masterData =
      masterNumberData[
        resultData.masterNumber
      ];

    setResult({
      name,

      number: resultData.lifePath,

      masterNumber:
        resultData.masterNumber,

      ...data,

      masterData,
    });
  }

  return (
    <>
      <ParticleBackground />

      <main className="min-h-screen flex items-center justify-center px-6 py-20 relative z-10">
        <div className="w-full max-w-2xl">
          <h1 className="text-5xl font-bold glow-text text-center mb-10">
            Analyze Your Destiny ✨
          </h1>

          <div
            className="
              bg-white/5
              border border-white/10
              rounded-3xl
              p-8
              backdrop-blur-xl
            "
          >
            <div className="flex flex-col gap-6">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="
                  p-4
                  rounded-2xl
                  bg-white/10
                  border border-white/10
                  outline-none
                  text-white
                "
              />

              <input
                type="date"
                value={birthDate}
                onChange={(e) =>
                  setBirthDate(e.target.value)
                }
                className="
                  p-4
                  rounded-2xl
                  bg-white/10
                  border border-white/10
                  outline-none
                  text-white
                "
              />

              <button
                onClick={handleAnalyze}
                className="
                  p-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-purple-600
                  to-cyan-500
                  hover:scale-[1.02]
                  transition-all
                  duration-300
                  font-semibold
                  shadow-purple-500/30
                  shadow-2xl
                "
              >
                Reveal My Destiny
              </button>
            </div>

            {result && (
              <ResultCard result={result} />
            )}
          </div>
        </div>
      </main>
    </>
  );
}