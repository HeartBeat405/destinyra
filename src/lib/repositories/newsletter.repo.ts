import { supabase, isSupabaseConfigured } from "../supabase";

export const newsletterRepo = {
  async subscribe(email: string): Promise<{ ok: boolean; error?: string }> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("newsletter").insert({ email });
      if (error && !error.message.includes("duplicate")) {
        return { ok: false, error: error.message };
      }
    }
    // Seed mode: accept optimistically (no persistence yet).
    return { ok: true };
  },
};
