import type { SiteSettings } from "../lib/types";

export const SITE_SETTINGS_KEY = "site_settings";

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "id", label: "Indonesian" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

export const TWITTER_CARD_OPTIONS = [
  { value: "summary_large_image", label: "Summary large image" },
  { value: "summary", label: "Summary" },
];

export const THEME_OPTIONS = [{ value: "light", label: "Light" }];

export const DEFAULT_SETTINGS: SiteSettings = {
  general: {
    siteName: "Destinyra",
    tagline: "Discover Yourself. Understand Life. Grow Every Day.",
    logoUrl: "",
    faviconUrl: "",
    language: "en",
    timezone: "UTC",
    copyright: "© 2026 Destinyra. All rights reserved.",
    footerText: "Lifestyle, knowledge, and self-discovery.",
  },
  brand: {
    primaryColor: "#6C63FF",
    secondaryColor: "#4F8CFF",
    accentColor: "#F59E0B",
    buttonRadius: "9999px",
    containerWidth: "80rem",
    theme: "light",
  },
  seo: {
    metaTitle: "Destinyra — Discover Yourself. Understand Life. Grow Every Day.",
    metaDescription:
      "A modern self-discovery platform — articles and tools for growth, relationships, and spirituality.",
    ogImage: "/image/og-banner.png",
    twitterCard: "summary_large_image",
    canonicalDomain: "https://destinyra.vercel.app",
    organizationName: "Destinyra",
  },
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    x: "",
    youtube: "",
    tiktok: "",
    github: "",
  },
  contact: {
    email: "hello@destinyra.app",
    phone: "",
    address: "",
    supportUrl: "",
  },
};
