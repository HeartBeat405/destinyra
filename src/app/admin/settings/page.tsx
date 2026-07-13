import { settingsRepo } from "../../../lib/repositories/settings.repo";
import { isDevMode } from "../../../lib/auth/session";
import { SITE_SETTINGS_KEY, DEFAULT_SETTINGS } from "../../../data/settings";
import type { SiteSettings } from "../../../lib/types";
import PageHeader from "../../../components/admin/PageHeader";
import SettingsForm from "../../../components/admin/SettingsForm";

export const metadata = { title: "Settings — Admin" };

export default async function AdminSettingsPage() {
  const stored = await settingsRepo.get<Partial<SiteSettings>>(SITE_SETTINGS_KEY);
  // Merge stored over defaults so new fields always have a value.
  const settings: SiteSettings = {
    general: { ...DEFAULT_SETTINGS.general, ...stored?.general },
    brand: { ...DEFAULT_SETTINGS.brand, ...stored?.brand },
    seo: { ...DEFAULT_SETTINGS.seo, ...stored?.seo },
    social: { ...DEFAULT_SETTINGS.social, ...stored?.social },
    contact: { ...DEFAULT_SETTINGS.contact, ...stored?.contact },
  };

  return (
    <div>
      <PageHeader
        title="Site Settings"
        description="Configure your brand, SEO defaults, social links, and contact details."
      />
      <SettingsForm initial={settings} devMode={isDevMode()} />
    </div>
  );
}
