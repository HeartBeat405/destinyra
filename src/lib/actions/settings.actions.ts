"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/session";
import { can } from "../auth/rbac";
import { isSupabaseConfigured } from "../supabase";
import { settingsRepo } from "../repositories/settings.repo";
import { auditRepo } from "../repositories/audit.repo";
import { SiteSettingsSchema } from "../validation/settings.schema";
import { SITE_SETTINGS_KEY } from "../../data/settings";
import type { ActionResult } from "../validation/article.schema";

export async function saveSettingsAction(raw: unknown): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Not signed in." };
  if (!can(user.role, "update", "settings")) {
    return { ok: false, message: "You don't have permission." };
  }

  const parsed = SiteSettingsSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      message: first ? `${first.path.join(".")}: ${first.message}` : "Invalid settings.",
    };
  }

  if (!isSupabaseConfigured) {
    return {
      ok: false,
      devMode: true,
      message: "Dev mode: connect Supabase (.env.local) to persist settings.",
    };
  }

  const now = new Date().toISOString();
  const ok = await settingsRepo.set(SITE_SETTINGS_KEY, parsed.data, now);
  if (!ok) return { ok: false, message: "Save failed." };

  await auditRepo.log({
    actorId: user.id,
    actorName: user.name,
    action: "update",
    resource: "settings",
    resourceId: SITE_SETTINGS_KEY,
    summary: "Updated site settings",
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { ok: true, message: "Settings saved." };
}
