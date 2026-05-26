"use client";

import Link from "next/link";

import { useState } from "react";

import ParticleBackground from "../components/animations/ParticleBackground";

import { calculateLifePath } from "../features/numerology/lib/calculateLifePath";

import {
  lifePathData,
  masterNumberData,
} from "../features/numerology/data/lifePathData";

import ResultCard from "../features/numerology/components/ResultCard";

export default function HomePage() {
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

      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative z-10">
        <div className="w-full max-w-2xl">
          {/* LOGO */}
          <div className="text-center mb-10">
            <h1 className="text-6xl font-black glow-text mb-4">
              Destinyra ✨
            </h1>

            <p className="text-gray-400 text-lg">
              Discover your Life Path,
              Master Number, Love Energy,
              and Hidden Destiny.
            </p>
          </div>

          {/* CARD */}
          <div
            className="
              bg-white/5
              border border-white/10
              rounded-3xl
              p-8
              backdrop-blur-xl
              shadow-2xl
            "
          >
            <div className="flex flex-col gap-6">
              {/* NAME */}
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
                  placeholder:text-gray-400
                "
              />

              {/* DATE */}
              <input
                type="date"
                value={birthDate}
                onChange={(e) =>
                  setBirthDate(
                    e.target.value
                  )
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

              {/* BUTTON */}
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
                Reveal My Destiny ✨
              </button>
            </div>

            {/* RESULT */}
            {result && (
              <ResultCard result={result} />
            )}
          </div>

          {/* FOOTER */}
          <footer className="mt-12 text-center">
            <div className="flex items-center justify-center gap-6 mb-4 text-sm text-gray-400">
              <Link
                href="/about"
                className="hover:text-white transition-all"
              >
                About
              </Link>

              <Link
                href="/privacy"
                className="hover:text-white transition-all"
              >
                Privacy Policy
              </Link>
            </div>

            <p className="text-xs text-gray-500">
              © 2026 Destinyra. All rights
              reserved.
            </p>

            <p className="text-xs text-purple-400 mt-2">
              destinyra.vercel.app
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}