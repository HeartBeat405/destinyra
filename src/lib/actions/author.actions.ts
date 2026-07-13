"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/session";
import { can, type Action } from "../auth/rbac";
import { isSupabaseConfigured } from "../supabase";
import { authorService } from "../services/author.service";
import { AuthorInputSchema, type AuthorInput } from "../validation/author.schema";
import type { ActionResult } from "../validation/article.schema";

const DEV_MSG = "Dev mode: connect Supabase (.env.local) to persist changes.";

async function authorize(action: Action) {
  const user = await getCurrentUser();
  if (!user) return { error: { ok: false, message: "Not signed in." } };
  if (!can(user.role, action, "authors")) {
    return { error: { ok: false, message: "You don't have permission." } };
  }
  return { actor: { id: user.id, name: user.name } };
}

function revalidateAuthors() {
  revalidatePath("/admin/authors");
  revalidatePath("/articles");
  revalidatePath("/articles/[slug]", "page"); // bylines on SSG detail pages
}

export async function saveAuthorAction(
  raw: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = AuthorInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }

  const input: AuthorInput = parsed.data;
  const auth = await authorize(input.id ? "update" : "create");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const saved = await authorService.save(input, auth.actor!);
  if (!saved) return { ok: false, message: "Save failed." };

  revalidateAuthors();
  return { ok: true, message: input.id ? "Saved." : "Created.", data: { id: saved.id } };
}

export async function archiveAuthorAction(
  id: string,
  archived: boolean
): Promise<ActionResult> {
  const auth = await authorize("update");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const ok = await authorService.setArchived(id, archived, auth.actor!);
  if (!ok) return { ok: false, message: "Update failed." };
  revalidateAuthors();
  return { ok: true, message: archived ? "Archived." : "Restored." };
}

export async function deleteAuthorAction(id: string): Promise<ActionResult> {
  const auth = await authorize("delete");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const ok = await authorService.remove(id, auth.actor!);
  if (!ok) return { ok: false, message: "Delete failed." };
  revalidateAuthors();
  return { ok: true, message: "Deleted." };
}

export async function bulkAuthorAction(
  ids: string[],
  action: "archive" | "restore" | "delete"
): Promise<ActionResult<{ affected: number }>> {
  const auth = await authorize(action === "delete" ? "delete" : "update");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  let affected = 0;
  for (const id of ids) {
    let ok = false;
    if (action === "delete") ok = await authorService.remove(id, auth.actor!);
    else ok = await authorService.setArchived(id, action === "archive", auth.actor!);
    if (ok) affected++;
  }
  revalidateAuthors();
  return { ok: true, message: `${affected} author(s) updated.`, data: { affected } };
}
