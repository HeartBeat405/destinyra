"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/session";
import { can, type Action } from "../auth/rbac";
import { isSupabaseConfigured } from "../supabase";
import { categoryService } from "../services/category.service";
import {
  CategoryInputSchema,
  type CategoryInput,
} from "../validation/category.schema";
import type { ActionResult } from "../validation/article.schema";

const DEV_MSG = "Dev mode: connect Supabase (.env.local) to persist changes.";

async function authorize(action: Action) {
  const user = await getCurrentUser();
  if (!user) return { error: { ok: false, message: "Not signed in." } };
  if (!can(user.role, action, "categories")) {
    return { error: { ok: false, message: "You don't have permission." } };
  }
  return { actor: { id: user.id, name: user.name } };
}

function revalidateCategories() {
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/");
}

export async function saveCategoryAction(
  raw: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = CategoryInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }

  const input: CategoryInput = parsed.data;
  const auth = await authorize(input.id ? "update" : "create");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const saved = await categoryService.save(input, auth.actor!);
  if (!saved) return { ok: false, message: "Save failed (slug may already exist)." };

  revalidateCategories();
  return { ok: true, message: input.id ? "Saved." : "Created.", data: { id: saved.id } };
}

export async function archiveCategoryAction(
  id: string,
  archived: boolean
): Promise<ActionResult> {
  const auth = await authorize("update");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const ok = await categoryService.setArchived(id, archived, auth.actor!);
  if (!ok) return { ok: false, message: "Update failed." };
  revalidateCategories();
  return { ok: true, message: archived ? "Archived." : "Restored." };
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  const auth = await authorize("delete");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const ok = await categoryService.remove(id, auth.actor!);
  if (!ok) return { ok: false, message: "Delete failed." };
  revalidateCategories();
  return { ok: true, message: "Deleted." };
}

export async function bulkCategoryAction(
  ids: string[],
  action: "archive" | "restore" | "delete"
): Promise<ActionResult<{ affected: number }>> {
  const auth = await authorize(action === "delete" ? "delete" : "update");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  let affected = 0;
  for (const id of ids) {
    let ok = false;
    if (action === "delete") ok = await categoryService.remove(id, auth.actor!);
    else ok = await categoryService.setArchived(id, action === "archive", auth.actor!);
    if (ok) affected++;
  }
  revalidateCategories();
  return { ok: true, message: `${affected} categor(ies) updated.`, data: { affected } };
}
