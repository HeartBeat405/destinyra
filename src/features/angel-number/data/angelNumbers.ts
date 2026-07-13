export type AngelReading = {
  number: string;
  title: string;
  meaning: string;
  guidance: string;
};

// Well-known repeating sequences with established meanings.
const KNOWN: Record<string, Omit<AngelReading, "number">> = {
  "000": {
    title: "Infinite Potential",
    meaning:
      "000 signals a clean slate — you're standing at the start of a spiritual cycle with unlimited possibility ahead.",
    guidance: "Release the old story. This is a blank page; write it on purpose.",
  },
  "111": {
    title: "Manifestation Gateway",
    meaning:
      "111 is a wake-up call. Your thoughts are aligning with reality faster than usual, so what you focus on grows.",
    guidance: "Guard your thoughts. Focus only on what you want to create.",
  },
  "222": {
    title: "Balance & Trust",
    meaning:
      "222 is reassurance that you're on the right path. Keep the faith — things are aligning even if you can't see it yet.",
    guidance: "Stay patient and keep nurturing what you've started.",
  },
  "333": {
    title: "Support & Expression",
    meaning:
      "333 means guidance and support surround you. It's an encouragement to express your truth and use your gifts.",
    guidance: "Speak up, create, and trust that you're supported.",
  },
  "444": {
    title: "Protection & Foundation",
    meaning:
      "444 is a sign of stability and protection. Your foundation is solid and you are not walking this alone.",
    guidance: "Keep building steadily — you're safe to continue.",
  },
  "555": {
    title: "Major Change",
    meaning:
      "555 announces transformation. A significant shift is coming — welcome it rather than bracing against it.",
    guidance: "Loosen your grip and let the change move you forward.",
  },
  "666": {
    title: "Realign & Rebalance",
    meaning:
      "666 is a gentle nudge to rebalance. You may be over-focused on worry, work, or material things — return to center.",
    guidance: "Refocus on what truly matters and let go of the fear.",
  },
  "777": {
    title: "Spiritual Alignment",
    meaning:
      "777 is a lucky, deeply spiritual sign. You're in flow and your inner work is paying off.",
    guidance: "Trust your path — you're exactly where you need to be.",
  },
  "888": {
    title: "Abundance & Reward",
    meaning:
      "888 signals abundance and karmic reward. Effort you've invested is circling back to you.",
    guidance: "Stay open to receive. What you've given is returning.",
  },
  "999": {
    title: "Completion",
    meaning:
      "999 marks the end of a chapter. Something is wrapping up to make room for a new beginning.",
    guidance: "Finish what's ending gracefully. A new cycle is near.",
  },
  "1010": {
    title: "Spiritual Awakening",
    meaning:
      "1010 blends new beginnings with spiritual growth. You're being encouraged to step forward with awareness.",
    guidance: "Take the leap — growth is calling you upward.",
  },
  "1111": {
    title: "Awakening Portal",
    meaning:
      "1111 is the most famous angel number — a powerful portal of alignment, awakening, and manifestation.",
    guidance: "Make a wish and align your actions with it. The door is open.",
  },
  "1212": {
    title: "Trust the Path",
    meaning:
      "1212 encourages you to keep believing in your journey. Stay positive and keep moving toward your purpose.",
    guidance: "Keep going — you're growing exactly as intended.",
  },
  "1234": {
    title: "Step by Step",
    meaning:
      "1234 is a sign of forward progress. Simplify, take things in order, and trust the sequence unfolding.",
    guidance: "One step at a time. You're moving in the right direction.",
  },
};

// Root-digit themes for numbers not in the known list.
const DIGIT_THEME: Record<number, { title: string; meaning: string; guidance: string }> = {
  1: { title: "New Beginnings", meaning: "leadership, fresh starts, and independence.", guidance: "Take initiative and start." },
  2: { title: "Harmony", meaning: "balance, partnership, and patience.", guidance: "Trust the timing and cooperate." },
  3: { title: "Expression", meaning: "creativity, communication, and joy.", guidance: "Express yourself openly." },
  4: { title: "Foundation", meaning: "stability, hard work, and structure.", guidance: "Build steadily and stay grounded." },
  5: { title: "Change", meaning: "freedom, adventure, and transformation.", guidance: "Embrace the change ahead." },
  6: { title: "Love & Care", meaning: "home, responsibility, and nurturing.", guidance: "Tend to those you love, including yourself." },
  7: { title: "Spiritual Insight", meaning: "wisdom, intuition, and inner growth.", guidance: "Go within for the answer." },
  8: { title: "Abundance", meaning: "power, success, and material flow.", guidance: "Own your ambition." },
  9: { title: "Completion", meaning: "compassion, endings, and higher purpose.", guidance: "Release and serve something bigger." },
};

function reduceToDigit(digits: number[]): number {
  let total = digits.reduce((a, b) => a + b, 0);
  while (total > 9) {
    total = String(total)
      .split("")
      .reduce((a, b) => a + Number(b), 0);
  }
  return total || 1;
}

export function decodeAngelNumber(raw: string): AngelReading | null {
  const num = raw.replace(/\D/g, "");
  if (!num) return null;

  if (KNOWN[num]) {
    return { number: num, ...KNOWN[num] };
  }

  const root = reduceToDigit(num.split("").map(Number));
  const theme = DIGIT_THEME[root];
  return {
    number: num,
    title: `${theme.title} (Root ${root})`,
    meaning: `${num} reduces to ${root}, carrying the energy of ${theme.meaning} The repeating digits amplify that message in your life right now.`,
    guidance: theme.guidance,
  };
}
