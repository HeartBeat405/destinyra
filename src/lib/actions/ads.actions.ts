"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/session";
import { can } from "../auth/rbac";
import { isSupabaseConfigured } from "../supabase";
import { settingsRepo } from "../repositories/settings.repo";
import { auditRepo } from "../repositories/audit.repo";
import { AdSlotsSchema } from "../validation/ads.schema";
import { AD_SLOTS_KEY } from "../../data/ads";
import type { ActionResult } from "../validation/article.schema";

export async function saveAdSlotsAction(raw: unknown): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Not signed in." };
  if (!can(user.role, "update", "settings")) {
    return { ok: false, message: "You don't have permission." };
  }

  const parsed = AdSlotsSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Invalid ad configuration." };
  }

  if (!isSupabaseConfigured) {
    return {
      ok: false,
      devMode: true,
      message: "Dev mode: connect Supabase (.env.local) to persist ad slots.",
    };
  }

  const now = new Date().toISOString();
  const ok = await settingsRepo.set(AD_SLOTS_KEY, parsed.data, now);
  if (!ok) return { ok: false, message: "Save failed." };

  await auditRepo.log({
    actorId: user.id,
    actorName: user.name,
    action: "update",
    resource: "settings",
    resourceId: AD_SLOTS_KEY,
    summary: `Updated ad slots (${parsed.data.length})`,
  });

  revalidatePath("/admin/ads");
  revalidatePath("/");
  return { ok: true, message: "Ad slots saved." };
}
