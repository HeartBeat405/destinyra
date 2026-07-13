import type { Role } from "./rbac";
import { isSupabaseConfigured } from "../supabase";
import { createServerSupabase } from "../db/supabase-server";
import { profilesRepo } from "../repositories/profiles.repo";

// ============================================================
// Session — server-only current-user resolution.
// ------------------------------------------------------------
// When Supabase is configured: resolves the cookie-bound session and
// joins the role from `profiles`. When NOT configured: dev-mode returns
// a super_admin so the panel is usable locally without credentials.
// ============================================================

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

// No development bypass: admin access is granted ONLY via a real Supabase
// session with an authorized role. When Supabase isn't configured there is
// no way to authenticate, so no user is returned.
export async function getCurrentUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const name =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "User";

  let role = await profilesRepo.getRole(user.id);
  if (!role) {
    // First login without a profile row — create one (role 'member').
    await profilesRepo.ensureProfile(user.id, name);
    role = (await profilesRepo.getRole(user.id)) ?? "member";
  }

  return {
    id: user.id,
    email: user.email ?? "",
    name,
    role,
  };
}

export function isDevMode(): boolean {
  return !isSupabaseConfigured;
}
