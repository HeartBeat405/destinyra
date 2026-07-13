"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/session";
import { can, type Action } from "../auth/rbac";
import { isSupabaseConfigured } from "../supabase";
import { articleService } from "../services/article.service";
import {
  ArticleInputSchema,
  type ActionResult,
  type BulkAction,
} from "../validation/article.schema";
import type { ArticleStatus } from "../types";

const DEV_MSG =
  "Dev mode: connect Supabase (.env.local) to persist changes.";

// Shared guard: resolve user + check RBAC. Returns the actor or an error.
async function authorize(action: Action) {
  const user = await getCurrentUser();
  if (!user) return { error: { ok: false, message: "Not signed in." } };
  if (!can(user.role, action, "articles")) {
    return { error: { ok: false, message: "You don't have permission." } };
  }
  return { actor: { id: user.id, name: user.name } };
}

function revalidateArticle(slug?: string) {
  revalidatePath("/admin/articles");
  revalidatePath("/admin");
  revalidatePath("/"); // homepage hero + featured/trending/latest cards
  revalidatePath("/articles");
  // All article detail pages are SSG — revalidate the whole segment so
  // status changes / deletes / bulk edits don't leave stale (or deleted)
  // pages publicly cached, even when we don't have the slug.
  revalidatePath("/articles/[slug]", "page");
  if (slug) revalidatePath(`/articles/${slug}`);
}

export async function saveArticleAction(
  raw: unknown
): Promise<ActionResult<{ id: string; slug: string }>> {
  const parsed = ArticleInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  }

  const input = parsed.data;
  const isUpdate = Boolean(input.id);

  const auth = await authorize(isUpdate ? "update" : "create");
  if (auth.error) return auth.error;

  if (!isSupabaseConfigured) {
    return { ok: false, devMode: true, message: DEV_MSG };
  }

  const result = input.id
    ? await articleService.update(input.id, input, auth.actor!)
    : await articleService.create(input, auth.actor!);

  if (!result) {
    return { ok: false, message: "Save failed. Check slug uniqueness and try again." };
  }

  revalidateArticle(result.slug);
  return {
    ok: true,
    message: isUpdate ? "Saved" : "Created",
    data: { id: result.id, slug: result.slug },
  };
}

export async function setArticleStatusAction(
  id: string,
  status: ArticleStatus
): Promise<ActionResult> {
  const auth = await authorize(status === "published" ? "publish" : "update");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const ok = await articleService.setStatus(id, status, auth.actor!);
  if (!ok) return { ok: false, message: "Update failed." };
  revalidateArticle();
  return { ok: true, message: `Status set to ${status}.` };
}

export async function deleteArticleAction(
  id: string,
  permanent = false
): Promise<ActionResult> {
  const auth = await authorize("delete");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const ok = permanent
    ? await articleService.remove(id, auth.actor!)
    : await articleService.softDelete(id, auth.actor!);
  if (!ok) return { ok: false, message: "Delete failed." };
  revalidateArticle();
  return { ok: true, message: permanent ? "Deleted permanently." : "Moved to trash." };
}

export async function restoreArticleAction(id: string): Promise<ActionResult> {
  const auth = await authorize("update");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const ok = await articleService.restore(id, auth.actor!);
  if (!ok) return { ok: false, message: "Restore failed." };
  revalidateArticle();
  return { ok: true, message: "Restored." };
}

export async function duplicateArticleAction(
  id: string
): Promise<ActionResult<{ slug: string }>> {
  const auth = await authorize("create");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const copy = await articleService.duplicate(id, auth.actor!);
  if (!copy) return { ok: false, message: "Duplicate failed." };
  revalidateArticle(copy.slug);
  return { ok: true, message: "Duplicated.", data: { slug: copy.slug } };
}

export async function bulkArticleAction(
  ids: string[],
  action: BulkAction
): Promise<ActionResult<{ affected: number }>> {
  const needed: Action = action === "delete" ? "delete" : action === "publish" ? "publish" : "update";
  const auth = await authorize(needed);
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  let affected = 0;
  for (const id of ids) {
    let ok = false;
    if (action === "delete") ok = await articleService.softDelete(id, auth.actor!);
    else if (action === "publish") ok = await articleService.setStatus(id, "published", auth.actor!);
    else if (action === "draft") ok = await articleService.setStatus(id, "draft", auth.actor!);
    else if (action === "archive") ok = await articleService.setStatus(id, "archived", auth.actor!);
    if (ok) affected++;
  }

  revalidateArticle();
  return { ok: true, message: `${affected} article(s) updated.`, data: { affected } };
}
