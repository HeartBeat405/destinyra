import { supabase, isSupabaseConfigured } from "../supabase";
import { createServerSupabase } from "../db/supabase-server";

// Key/value site config (jsonb) — homepage layout, theme, ads, etc.
export const settingsRepo = {
  // Public read via the anon client (no cookies) so pages stay static/ISR.
  async get<T = unknown>(key: string): Promise<T | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", key)
      .single();
    return (data?.value as T) ?? null;
  },

  async set(key: string, value: unknown, nowIso: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const db = await createServerSupabase();
    const { error } = await db
      .from("settings")
      .upsert({ key, value, updated_at: nowIso });
    return !error;
  },
};
