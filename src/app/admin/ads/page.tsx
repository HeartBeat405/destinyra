import { settingsRepo } from "../../../lib/repositories/settings.repo";
import { isDevMode } from "../../../lib/auth/session";
import { AD_SLOTS_KEY, DEFAULT_AD_SLOTS } from "../../../data/ads";
import type { AdSlot } from "../../../lib/types";
import PageHeader from "../../../components/admin/PageHeader";
import AdsManager from "../../../components/admin/AdsManager";

export const metadata = { title: "Ads — Admin" };

export default async function AdminAdsPage() {
  const stored = await settingsRepo.get<AdSlot[]>(AD_SLOTS_KEY);
  const slots = stored ?? DEFAULT_AD_SLOTS;

  return (
    <div>
      <PageHeader
        title="Advertisement Manager"
        description="Create and manage ad slots, placements, and types — previewed safely, never injected here."
      />
      <AdsManager initialSlots={slots} devMode={isDevMode()} />
    </div>
  );
}
