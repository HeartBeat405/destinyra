import type { HomepageWidget } from "../types";
import { settingsRepo } from "../repositories/settings.repo";
import { DEFAULT_HOMEPAGE_WIDGETS } from "../../data/homepage";
import { homepageService, type HomepageSections } from "./homepage.service";

export const HOMEPAGE_SETTINGS_KEY = "homepage_widgets";

// Resolves the homepage layout. Reads widget config from `settings`
// (falls back to defaults), and composes the article/category/tool data
// from the existing homepage.service — no duplicated data access.
export const homepageBuilderService = {
  async getWidgets(): Promise<HomepageWidget[]> {
    const stored = await settingsRepo.get<HomepageWidget[]>(
      HOMEPAGE_SETTINGS_KEY
    );
    const widgets =
      stored && stored.length ? stored : DEFAULT_HOMEPAGE_WIDGETS;
    return [...widgets].sort((a, b) => a.order - b.order);
  },

  async getPublicHomepage(): Promise<{
    widgets: HomepageWidget[];
    sections: HomepageSections;
  }> {
    const [all, sections] = await Promise.all([
      this.getWidgets(),
      homepageService.getSections(),
    ]);
    return {
      widgets: all.filter((w) => w.enabled),
      sections,
    };
  },
};
