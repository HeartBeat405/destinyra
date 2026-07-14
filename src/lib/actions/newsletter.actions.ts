"use server";

import { isSupabaseConfigured } from "../supabase";
import { newsletterRepo } from "../repositories/newsletter.repo";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Public newsletter signup. A repeat email (unique constraint) is treated as
// success ("already subscribed").
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

  const res = await newsletterRepo.subscribe(email);
  if (res === "duplicate") {
    return { ok: true, message: "You're already subscribed — thank you!" };
  }
  if (res === "error") {
    return { ok: false, message: "Couldn't subscribe right now. Please try again." };
  }
  return { ok: true, message: "You're in — welcome to Destinyra." };
}
