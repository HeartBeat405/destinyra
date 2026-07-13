import type { Author } from "../lib/types";

// Seed authors — will move to the `users` table in Supabase.
export const authors: Author[] = [
  {
    id: "author-luna",
    name: "Luna Vega",
    role: "Spirituality Editor",
    avatar: "🌙",
    bio: "Luna writes about intuition, energy, and the quiet practices that change a life.",
  },
  {
    id: "author-iris",
    name: "Iris Calderon",
    role: "Self Growth Writer",
    avatar: "🌿",
    bio: "Iris explores mindset, habits, and the science of becoming who you want to be.",
  },
  {
    id: "author-noah",
    name: "Noah Bennett",
    role: "Career & Productivity",
    avatar: "🧭",
    bio: "Noah covers work, focus, and building a career that actually fits you.",
  },
  {
    id: "author-mara",
    name: "Mara Ellis",
    role: "Numerology Analyst",
    avatar: "🔢",
    bio: "Mara translates numbers into meaning — from life paths to angel numbers.",
  },
];
