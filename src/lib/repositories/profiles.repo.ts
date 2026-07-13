import type { Role } from "../auth/rbac";
import { isSupabaseConfigured } from "../supabase";
import { createServerSupabase } from "../db/supabase-server";

// Data access for user profiles (role lookup, etc.). Server-only:
// uses the cookie-bound client so RLS sees the authenticated user.
export const profilesRepo = {
  async getRole(userId: string): Promise<Role | null> {
    if (!isSupabaseConfigured) return null;
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    return (data?.role as Role) ?? null;
  },

  // Defense-in-depth: guarantee a profile row exists after first login,
  // even if the `handle_new_user` trigger didn't run. Role defaults to
  // 'member' — elevation to super_admin is done out-of-band (SQL/admin).
  async ensureProfile(userId: string, fullName?: string | null): Promise<void> {
    if (!isSupabaseConfigured) return;
    const supabase = await createServerSupabase();
    await supabase
      .from("profiles")
      .upsert(
        { id: userId, full_name: fullName ?? null },
        { onConflict: "id", ignoreDuplicates: true }
      );
  },
};
