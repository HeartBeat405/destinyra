import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ============================================================
// Server-side Supabase client (cookie-bound session).
// Use in Server Components, Server Actions, and Route Handlers.
// Callers must guard with isSupabaseConfigured before calling —
// this throws if env vars are missing.
// ============================================================

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(url as string, anonKey as string, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component (read-only cookies) — safe to
          // ignore; the middleware refreshes the session on navigation.
        }
      },
    },
  });
}
