import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ============================================================
// Supabase client
// ------------------------------------------------------------
// The client is only created when env vars are present. Until
// then `supabase` is null and the data layer falls back to seed
// data — so the app runs locally with zero configuration.
// ============================================================

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

/**
 * Server-side admin client using the service role key. Use ONLY in
 * server code (route handlers, server actions) — never import into a
 * client component. Returns null if the service key isn't set.
 */
export function createAdminClient(): SupabaseClient | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
