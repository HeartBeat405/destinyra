"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/session";
import { can, type Action } from "../auth/rbac";
import { isSupabaseConfigured } from "../supabase";
import { mediaService } from "../services/media.service";
import { MediaMetaSchema } from "../validation/media.schema";
import type { ActionResult } from "../validation/article.schema";
import type { Media } from "../types";

const DEV_MSG = "Dev mode: connect Supabase Storage (.env.local) to upload/persist.";

async function authorize(action: Action) {
  const user = await getCurrentUser();
  if (!user) return { error: { ok: false, message: "Not signed in." } };
  if (!can(user.role, action, "media")) {
    return { error: { ok: false, message: "You don't have permission." } };
  }
  return { actor: { id: user.id, name: user.name } };
}

export async function uploadMediaAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const auth = await authorize("create");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const file = formData.get("file") as File | null;
  const folder = String(formData.get("folder") ?? "uploads");
  if (!file || typeof (file as { arrayBuffer?: unknown }).arrayBuffer !== "function") {
    return { ok: false, message: "No file provided." };
  }

  const res = await mediaService.upload(file, folder, auth.actor!);
  if (!res.ok) return { ok: false, message: res.error };

  revalidatePath("/admin/media");
  return { ok: true, message: "Uploaded.", data: { id: res.media.id } };
}

export async function updateMediaAction(raw: unknown): Promise<ActionResult> {
  const auth = await authorize("update");
  if (auth.error) return auth.error;

  const parsed = MediaMetaSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, message: "Invalid metadata." };
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const { id, ...patch } = parsed.data;
  const ok = await mediaService.updateMeta(id, patch, auth.actor!);
  if (!ok) return { ok: false, message: "Update failed." };

  revalidatePath("/admin/media");
  return { ok: true, message: "Saved." };
}

export async function deleteMediaAction(id: string): Promise<ActionResult> {
  const auth = await authorize("delete");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  const ok = await mediaService.remove(id, auth.actor!);
  if (!ok) return { ok: false, message: "Delete failed." };
  revalidatePath("/admin/media");
  return { ok: true, message: "Deleted." };
}

export async function bulkDeleteMediaAction(
  ids: string[]
): Promise<ActionResult<{ affected: number }>> {
  const auth = await authorize("delete");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  let affected = 0;
  for (const id of ids) {
    if (await mediaService.remove(id, auth.actor!)) affected++;
  }
  revalidatePath("/admin/media");
  return { ok: true, message: `${affected} file(s) deleted.`, data: { affected } };
}

export async function moveMediaAction(
  ids: string[],
  folder: string
): Promise<ActionResult<{ affected: number }>> {
  const auth = await authorize("update");
  if (auth.error) return auth.error;
  if (!isSupabaseConfigured) return { ok: false, devMode: true, message: DEV_MSG };

  let affected = 0;
  for (const id of ids) {
    if (await mediaService.updateMeta(id, { folder }, auth.actor!)) affected++;
  }
  revalidatePath("/admin/media");
  return { ok: true, message: `${affected} file(s) moved.`, data: { affected } };
}

// Read action for the reusable MediaPicker (client → server).
export async function listMediaAction(): Promise<Media[]> {
  const auth = await authorize("view");
  if (auth.error) return [];
  return mediaService.list();
}
