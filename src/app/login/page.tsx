"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Compass, Lock, Mail } from "lucide-react";
import { signInAction, type AuthState } from "../../lib/auth/actions";
import { isSupabaseConfigured } from "../../lib/supabase";
import { Button } from "../../components/ui/Button";

const initialState: AuthState = { error: null };

export default function LoginPage() {
  const [state, action, pending] = useActionState(signInAction, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
              <Compass className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="text-2xl font-black tracking-tight text-ink">
              Destinyra
            </span>
          </Link>
          <p className="mt-2 text-sm text-muted">Admin sign in</p>
        </div>

        <form
          action={action}
          className="rounded-4xl border border-line bg-surface p-8 shadow-card"
        >
          {!isSupabaseConfigured && (
            <div className="mb-6 rounded-2xl border border-warning/20 bg-warning/10 p-4 text-sm text-[#92400e]">
              Dev mode: no Supabase configured. Sign in is bypassed — click
              continue to open the panel as a super admin.
            </div>
          )}

          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm font-medium text-ink">
              Email
            </span>
            <span className="flex items-center gap-3 rounded-2xl border border-line bg-canvas px-4 focus-within:border-brand">
              <Mail className="h-4 w-4 text-muted" />
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@destinyra.app"
                className="w-full bg-transparent py-3.5 text-ink outline-none placeholder:text-muted"
              />
            </span>
          </label>

          <label className="mb-6 block">
            <span className="mb-1.5 block text-sm font-medium text-ink">
              Password
            </span>
            <span className="flex items-center gap-3 rounded-2xl border border-line bg-canvas px-4 focus-within:border-brand">
              <Lock className="h-4 w-4 text-muted" />
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-transparent py-3.5 text-ink outline-none placeholder:text-muted"
              />
            </span>
          </label>

          {state?.error && (
            <p className="mb-4 rounded-xl bg-danger/10 px-4 py-2 text-sm text-danger">
              {state.error}
            </p>
          )}

          <Button type="submit" size="lg" disabled={pending} className="w-full">
            {pending
              ? "Signing in..."
              : isSupabaseConfigured
                ? "Sign in"
                : "Continue to panel"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="hover:text-ink">
            ← Back to site
          </Link>
        </p>
      </div>
    </main>
  );
}
