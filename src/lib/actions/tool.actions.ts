"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/session";
import { can, type Action } from "../auth/rbac";
import { isSupabaseConfigured } from "../supabase";
import { toolService } from "../services/tool.service";
import { ToolInputSchema, type ToolInput } from "../validation/tool.schema";
import type { ActionResult } from "../validation/article.schema";

const DEV_MSG = "Dev mode: connect Supabase (.env.local) to persist changes.";

async function authorize(action: Action) {
  const user = await getCurrentUser();
  if (!user) return { error: { ok: false, message: "Not signed in." } };
  if (!can(user.role, action, "tools")) {
    return { error: { ok: false, message: "You don't have permission." } };
  }
  return { actor: { id: user.id, name: user.name } };
}

function revalidateTools() {
  revalidatePath("/admin/tools");
  revalidatePath("/tools");
  revalidatePath("/tools/[slug]", "page"); // SSG detail pages
  revalidatePath("/");
}

export async function saveToolAction(
  raw: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = ToolInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }

  const input: ToolInput = parsed.data;
  const auth = await authorize(input.id ? "update" : "create");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const saved = await toolService.save(input, auth.actor!);
  if (!saved) return { ok: false, message: "Save failed (slug may already exist)." };

  revalidateTools();
  return { ok: true, message: input.id ? "Saved." : "Created.", data: { id: saved.id } };
}

export async function archiveToolAction(
  id: string,
  archived: boolean
): Promise<ActionResult> {
  const auth = await authorize("update");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const ok = await toolService.setArchived(id, archived, auth.actor!);
  if (!ok) return { ok: false, message: "Update failed." };
  revalidateTools();
  return { ok: true, message: archived ? "Archived." : "Restored." };
}

export async function deleteToolAction(id: string): Promise<ActionResult> {
  const auth = await authorize("delete");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const ok = await toolService.remove(id, auth.actor!);
  if (!ok) return { ok: false, message: "Delete failed." };
  revalidateTools();
  return { ok: true, message: "Deleted." };
}

export async function bulkToolAction(
  ids: string[],
  action: "archive" | "restore" | "delete"
): Promise<ActionResult<{ affected: number }>> {
  const auth = await authorize(action === "delete" ? "delete" : "update");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  let affected = 0;
  for (const id of ids) {
    let ok = false;
    if (action === "delete") ok = await toolService.remove(id, auth.actor!);
    else ok = await toolService.setArchived(id, action === "archive", auth.actor!);
    if (ok) affected++;
  }
  revalidateTools();
  return { ok: true, message: `${affected} tool(s) updated.`, data: { affected } };
}
