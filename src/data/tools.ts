import type { Tool } from "../lib/types";

// Seed tools — mirror the `tools` table in Supabase so the admin can
// add/edit tools without touching code. `iconName` is a lucide icon.
export const tools: Tool[] = [
  {
    id: "tool-life-path",
    name: "Life Path Calculator",
    slug: "life-path",
    description:
      "Reveal your core Life Path number and the personality blueprint behind your birth date.",
    iconName: "Orbit",
    gradient: "from-violet-600 to-purple-700",
    buttonText: "Discover Your Life Path",
    buttonLink: "/tools/life-path",
    status: "published",
  },
  {
    id: "tool-compatibility",
    name: "Love Compatibility",
    slug: "compatibility",
    description:
      "Compare two birth dates to see how your numbers harmonize in love and friendship.",
    iconName: "HeartHandshake",
    gradient: "from-rose-500 to-pink-600",
    buttonText: "Check Compatibility",
    buttonLink: "/tools/compatibility",
    status: "future",
  },
  {
    id: "tool-tarot",
    name: "Tarot Reading",
    slug: "tarot",
    description:
      "Pull a card and receive focused guidance for the question on your mind right now.",
    iconName: "Layers",
    gradient: "from-purple-600 to-fuchsia-600",
    buttonText: "Draw Your Card",
    buttonLink: "/tools/tarot",
    status: "future",
  },
  {
    id: "tool-angel-number",
    name: "Angel Number Decoder",
    slug: "angel-number",
    description:
      "Enter a repeating number you keep seeing and decode the message behind it.",
    iconName: "Feather",
    gradient: "from-cyan-500 to-sky-600",
    buttonText: "Decode Your Number",
    buttonLink: "/tools/angel-number",
    status: "future",
  },
  {
    id: "tool-ai-reading",
    name: "AI Reading",
    slug: "ai-reading",
    description:
      "A personalized, AI-powered reading that blends your numbers into one clear story.",
    iconName: "Bot",
    gradient: "from-indigo-500 to-violet-600",
    buttonText: "Coming Soon",
    buttonLink: "/tools/ai-reading",
    status: "future",
  },
  {
    id: "tool-horoscope",
    name: "Daily Horoscope",
    slug: "daily-horoscope",
    description:
      "A fresh daily insight tuned to your sign and the energy of the day.",
    iconName: "Sun",
    gradient: "from-amber-500 to-orange-600",
    buttonText: "Coming Soon",
    buttonLink: "/tools/daily-horoscope",
    status: "future",
  },
];
