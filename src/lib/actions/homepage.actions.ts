"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/session";
import { can } from "../auth/rbac";
import { isSupabaseConfigured } from "../supabase";
import { settingsRepo } from "../repositories/settings.repo";
import { auditRepo } from "../repositories/audit.repo";
import { HomepageWidgetsSchema } from "../validation/homepage.schema";
import { HOMEPAGE_SETTINGS_KEY } from "../services/homepage-builder.service";
import type { ActionResult } from "../validation/article.schema";

export async function saveHomepageWidgetsAction(
  raw: unknown
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Not signed in." };
  if (!can(user.role, "update", "settings")) {
    return { ok: false, message: "You don't have permission." };
  }

  const parsed = HomepageWidgetsSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Invalid widget configuration." };
  }

  if (!isSupabaseConfigured) {
    return {
      ok: false,
      devMode: true,
      message: "Dev mode: connect Supabase (.env.local) to persist the layout.",
    };
  }

  const now = new Date().toISOString();
  const ok = await settingsRepo.set(HOMEPAGE_SETTINGS_KEY, parsed.data, now);
  if (!ok) return { ok: false, message: "Save failed." };

  await auditRepo.log({
    actorId: user.id,
    actorName: user.name,
    action: "update",
    resource: "settings",
    resourceId: HOMEPAGE_SETTINGS_KEY,
    summary: `Updated homepage layout (${parsed.data.length} widgets)`,
  });

  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { ok: true, message: "Homepage layout saved." };
}
