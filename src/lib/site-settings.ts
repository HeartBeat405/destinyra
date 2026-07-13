import { cache } from "react";
import type { SiteSettings, AdSlot } from "./types";
import { settingsRepo } from "./repositories/settings.repo";
import { SITE_SETTINGS_KEY, DEFAULT_SETTINGS } from "../data/settings";
import { AD_SLOTS_KEY } from "../data/ads";

// Request-cached readers (Phase 7): one query per request, shared across
// layout/metadata/footer/pages. Integration helpers — no repo/service changes.

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const stored = await settingsRepo.get<Partial<SiteSettings>>(SITE_SETTINGS_KEY);
  return {
    general: { ...DEFAULT_SETTINGS.general, ...stored?.general },
    brand: { ...DEFAULT_SETTINGS.brand, ...stored?.brand },
    seo: { ...DEFAULT_SETTINGS.seo, ...stored?.seo },
    social: { ...DEFAULT_SETTINGS.social, ...stored?.social },
    contact: { ...DEFAULT_SETTINGS.contact, ...stored?.contact },
  };
});

export const getAdSlots = cache(async (): Promise<AdSlot[]> => {
  return (await settingsRepo.get<AdSlot[]>(AD_SLOTS_KEY)) ?? [];
});
