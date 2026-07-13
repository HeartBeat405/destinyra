import { z } from "zod";

const str = (max = 200) => z.string().max(max).optional().default("");

export const SiteSettingsSchema = z.object({
  general: z.object({
    siteName: z.string().min(1, "Site name is required.").max(80),
    tagline: str(160),
    logoUrl: str(500),
    faviconUrl: str(500),
    language: str(10),
    timezone: str(60),
    copyright: str(160),
    footerText: str(300),
  }),
  brand: z.object({
    primaryColor: str(20),
    secondaryColor: str(20),
    accentColor: str(20),
    buttonRadius: str(20),
    containerWidth: str(20),
    theme: z.enum(["light"]).default("light"),
  }),
  seo: z.object({
    metaTitle: str(70),
    metaDescription: str(200),
    ogImage: str(500),
    twitterCard: z.enum(["summary", "summary_large_image"]).default("summary_large_image"),
    canonicalDomain: str(200),
    organizationName: str(120),
  }),
  social: z.object({
    facebook: str(200),
    instagram: str(200),
    linkedin: str(200),
    x: str(200),
    youtube: str(200),
    tiktok: str(200),
    github: str(200),
  }),
  contact: z.object({
    email: str(160),
    phone: str(60),
    address: str(300),
    supportUrl: str(200),
  }),
});

export type SiteSettingsInput = z.infer<typeof SiteSettingsSchema>;
