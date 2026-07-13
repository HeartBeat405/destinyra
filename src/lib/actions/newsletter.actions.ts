"use server";

import { isSupabaseConfigured, createAdminClient } from "../supabase";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Public newsletter signup. Inserts into the `newsletter` table; a repeat
// email (unique constraint) is treated as success ("already subscribed").
export async function subscribeNewsletterAction(
  emailRaw: string
): Promise<{ ok: boolean; message: string }> {
  const email = (emailRaw ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (!isSupabaseConfigured) {
    return { ok: false, message: "Newsletter isn't available right now." };
  }

  const db = createAdminClient();
  if (!db) return { ok: false, message: "Newsletter isn't available right now." };

  const { error } = await db
    .from("newsletter")
    .insert({ email, source: "website" });

  if (error) {
    // 23505 = unique_violation → already on the list.
    if (error.code === "23505" || /duplicate|unique/i.test(error.message)) {
      return { ok: true, message: "You're already subscribed — thank you!" };
    }
    return { ok: false, message: "Couldn't subscribe right now. Please try again." };
  }

  return { ok: true, message: "You're in — welcome to Destinyra." };
}
