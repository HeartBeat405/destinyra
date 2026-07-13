import type { Category } from "../lib/types";

// Seed categories — mirror the `categories` table in Supabase.
// `iconName` is a lucide icon resolved by the <Icon /> component.
export const categories: Category[] = [
  {
    id: "cat-self-growth",
    name: "Self Growth",
    slug: "self-growth",
    description:
      "Become a stronger, calmer, more intentional version of yourself.",
    iconName: "Sprout",
    color: "#22c55e",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "cat-lifestyle",
    name: "Lifestyle",
    slug: "lifestyle",
    description:
      "Design a daily life that feels good and looks good.",
    iconName: "Gem",
    color: "#a855f7",
    gradient: "from-fuchsia-500 to-purple-600",
  },
  {
    id: "cat-relationships",
    name: "Relationships",
    slug: "relationships",
    description:
      "Love, connection, and the art of understanding people.",
    iconName: "Heart",
    color: "#f43f5e",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    id: "cat-career",
    name: "Career",
    slug: "career",
    description:
      "Work with purpose and build a path that fits who you are.",
    iconName: "Briefcase",
    color: "#3b82f6",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "cat-numerology",
    name: "Numerology",
    slug: "numerology",
    description:
      "Decode the meaning hidden inside your numbers.",
    iconName: "Hash",
    color: "#8b5cf6",
    gradient: "from-violet-600 to-purple-700",
  },
  {
    id: "cat-tarot",
    name: "Tarot",
    slug: "tarot",
    description:
      "Ancient cards, modern guidance for the questions you carry.",
    iconName: "Layers",
    color: "#d946ef",
    gradient: "from-purple-600 to-fuchsia-600",
  },
  {
    id: "cat-angel-numbers",
    name: "Angel Numbers",
    slug: "angel-numbers",
    description:
      "Repeating numbers and the messages they may be sending you.",
    iconName: "Feather",
    color: "#06b6d4",
    gradient: "from-cyan-500 to-sky-600",
  },
  {
    id: "cat-spirituality",
    name: "Spirituality",
    slug: "spirituality",
    description:
      "Energy, intuition, and the search for deeper meaning.",
    iconName: "Moon",
    color: "#6366f1",
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    id: "cat-mindset",
    name: "Mindset",
    slug: "mindset",
    description:
      "Train your thinking and master your inner game.",
    iconName: "Brain",
    color: "#f59e0b",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "cat-productivity",
    name: "Productivity",
    slug: "productivity",
    description:
      "Do more of what matters without burning out.",
    iconName: "Zap",
    color: "#eab308",
    gradient: "from-yellow-500 to-amber-600",
  },
];
