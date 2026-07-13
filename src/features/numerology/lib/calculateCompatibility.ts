import { calculateLifePath } from "./calculateLifePath";
import { lifePathData } from "../data/lifePathData";

// Master numbers collapse to their root for relationship matching
// (11 -> 2, 22 -> 4, 33 -> 6).
function toRoot(n: number): number {
  if (n === 11) return 2;
  if (n === 22) return 4;
  if (n === 33) return 6;
  return n;
}

// Hand-tuned numerology affinities per Life Path root (1–9).
const AFFINITY: Record<number, { best: number[]; good: number[]; tough: number[] }> = {
  1: { best: [3, 5, 9], good: [1, 2, 7], tough: [4, 6, 8] },
  2: { best: [6, 8, 9], good: [1, 2, 4], tough: [5, 7] },
  3: { best: [1, 5, 6, 9], good: [3, 7], tough: [4, 8] },
  4: { best: [2, 7, 8], good: [4, 6], tough: [1, 3, 5, 9] },
  5: { best: [1, 3, 7], good: [5, 9], tough: [2, 4, 6, 8] },
  6: { best: [2, 3, 9], good: [4, 6, 8], tough: [1, 5, 7] },
  7: { best: [4, 5, 7], good: [1, 3, 9], tough: [2, 6, 8] },
  8: { best: [2, 4, 6], good: [8], tough: [1, 3, 5, 7, 9] },
  9: { best: [1, 3, 6, 9], good: [2, 5, 7], tough: [4, 8] },
};

function bandScore(from: number, to: number): number {
  const a = AFFINITY[from];
  if (a.best.includes(to)) return 92;
  if (a.good.includes(to)) return 80;
  if (a.tough.includes(to)) return 62;
  return 72;
}

export type CompatibilityResult = {
  aRoot: number;
  bRoot: number;
  aTitle: string;
  bTitle: string;
  aLove: string;
  bLove: string;
  score: number;
  label: string;
  summary: string;
  strengths: string[];
  watchouts: string[];
};

function labelFor(score: number): string {
  if (score >= 90) return "Soulmate Connection";
  if (score >= 80) return "Highly Compatible";
  if (score >= 70) return "Balanced Match";
  if (score >= 60) return "Growth Pairing";
  return "Opposites Attract";
}

export function calculateCompatibility(
  dateA: string,
  dateB: string,
  nameA = "Partner 1",
  nameB = "Partner 2"
): CompatibilityResult {
  const aRoot = toRoot(calculateLifePath(dateA).lifePath);
  const bRoot = toRoot(calculateLifePath(dateB).lifePath);

  // Symmetric score: average both viewpoints + a stable, non-random tweak.
  const base = (bandScore(aRoot, bRoot) + bandScore(bRoot, aRoot)) / 2;
  const tweak = ((aRoot * bRoot) % 7) - 3; // -3..+3, deterministic
  const score = Math.max(42, Math.min(99, Math.round(base + tweak)));

  const a = lifePathData[aRoot];
  const b = lifePathData[bRoot];

  const same = aRoot === bRoot;
  const summary = same
    ? `Two ${a.title}s (Life Path ${aRoot}) share the same core wiring — you understand each other instantly and rarely need to explain yourselves. The risk is that you also mirror each other's blind spots, so growth comes from consciously balancing what you both naturally avoid.`
    : `${nameA} walks the path of ${a.title} (${aRoot}) while ${nameB} carries the energy of ${b.title} (${bRoot}). ${
        score >= 80
          ? "Your numbers naturally complement each other — where one leans, the other supports."
          : score >= 70
            ? "You meet in the middle: different rhythms that, with a little patience, create a steady balance."
            : "Your energies pull in different directions, which can feel like friction — but it's exactly that contrast that helps you both grow."
      }`;

  const strengths: string[] = [
    `${a.title}: ${a.strengths.slice(0, 2).join(", ")}`,
    `${b.title}: ${b.strengths.slice(0, 2).join(", ")}`,
    score >= 80
      ? "Natural emotional rhythm and easy trust"
      : "Complementary strengths that cover each other's gaps",
  ];

  const watchouts: string[] = [
    `${a.title} can be ${a.weaknesses[0].toLowerCase()}`,
    `${b.title} can be ${b.weaknesses[0].toLowerCase()}`,
    score < 70
      ? "Different core needs — communicate expectations early and often"
      : "Don't take the easy harmony for granted; keep choosing each other",
  ];

  return {
    aRoot,
    bRoot,
    aTitle: a.title,
    bTitle: b.title,
    aLove: a.love,
    bLove: b.love,
    score,
    label: labelFor(score),
    summary,
    strengths,
    watchouts,
  };
}
