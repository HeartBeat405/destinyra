"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "../supabase";
import { createServerSupabase } from "../db/supabase-server";

export type AuthState = { error: string | null };

const SignInSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export async function signInAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  // Dev mode: no auth backend — the dev session is already a super admin.
  if (!isSupabaseConfigured) {
    redirect("/admin");
  }

  const parsed = SignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message };
  }

  redirect("/admin");
}

export async function signOutAction(): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
