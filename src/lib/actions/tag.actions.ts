"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/session";
import { can, type Action } from "../auth/rbac";
import { isSupabaseConfigured } from "../supabase";
import { tagService } from "../services/tag.service";
import { TagInputSchema, type TagInput } from "../validation/tag.schema";
import type { ActionResult } from "../validation/article.schema";

const DEV_MSG = "Dev mode: connect Supabase (.env.local) to persist changes.";

async function authorize(action: Action) {
  const user = await getCurrentUser();
  if (!user) return { error: { ok: false, message: "Not signed in." } };
  if (!can(user.role, action, "tags")) {
    return { error: { ok: false, message: "You don't have permission." } };
  }
  return { actor: { id: user.id, name: user.name } };
}

function revalidateTags() {
  revalidatePath("/admin/tags");
  revalidatePath("/articles");
}

export async function saveTagAction(
  raw: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = TagInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }

  const input: TagInput = parsed.data;
  const auth = await authorize(input.id ? "update" : "create");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const saved = await tagService.save(input, auth.actor!);
  if (!saved) return { ok: false, message: "Save failed (slug may already exist)." };

  revalidateTags();
  return { ok: true, message: input.id ? "Saved." : "Created.", data: { id: saved.id } };
}

export async function archiveTagAction(
  id: string,
  archived: boolean
): Promise<ActionResult> {
  const auth = await authorize("update");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const ok = await tagService.setArchived(id, archived, auth.actor!);
  if (!ok) return { ok: false, message: "Update failed." };
  revalidateTags();
  return { ok: true, message: archived ? "Archived." : "Restored." };
}

export async function deleteTagAction(id: string): Promise<ActionResult> {
  const auth = await authorize("delete");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const ok = await tagService.remove(id, auth.actor!);
  if (!ok) return { ok: false, message: "Delete failed." };
  revalidateTags();
  return { ok: true, message: "Deleted." };
}

export async function bulkTagAction(
  ids: string[],
  action: "archive" | "restore" | "delete"
): Promise<ActionResult<{ affected: number }>> {
  const auth = await authorize(action === "delete" ? "delete" : "update");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  let affected = 0;
  for (const id of ids) {
    let ok = false;
    if (action === "delete") ok = await tagService.remove(id, auth.actor!);
    else ok = await tagService.setArchived(id, action === "archive", auth.actor!);
    if (ok) affected++;
  }
  revalidateTags();
  return { ok: true, message: `${affected} tag(s) updated.`, data: { affected } };
}

export async function mergeTagsAction(
  sourceIds: string[],
  targetId: string
): Promise<ActionResult> {
  const auth = await authorize("update");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };
  if (!targetId || sourceIds.filter((id) => id !== targetId).length === 0) {
    return { ok: false, message: "Pick a different target tag to merge into." };
  }

  const ok = await tagService.merge(sourceIds, targetId, auth.actor!);
  if (!ok) return { ok: false, message: "Merge failed." };
  revalidateTags();
  return { ok: true, message: "Tags merged." };
}
