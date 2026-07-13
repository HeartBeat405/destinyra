import { Database, KeyRound, ShieldCheck } from "lucide-react";

// Shown when Supabase is not configured. The CMS is live-only — there is no
// demo/seed fallback — so the app asks to be installed instead.
export default function InstallationRequired() {
  const steps = [
    {
      icon: Database,
      title: "Create a Supabase project",
      body: "Then run supabase/schema.sql in the SQL editor to create the tables, storage bucket, and policies.",
    },
    {
      icon: KeyRound,
      title: "Add environment variables",
      body: "Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in .env.local, then restart.",
    },
    {
      icon: ShieldCheck,
      title: "Create your admin account",
      body: "Add a user in Supabase Auth, then set profiles.role = 'super_admin' for that account. Sign in at /admin/login.",
    },
  ];

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
          <Database className="h-7 w-7" />
        </span>
        <h1 className="font-serif text-4xl font-bold text-ink">
          Installation required
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Destinyra runs on live data only — there&apos;s no demo content.
          Connect Supabase to bring the site and CMS online.
        </p>
      </div>

      <ol className="space-y-4">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="flex gap-4 rounded-3xl border border-line bg-surface p-5 shadow-card"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-ink">
                {i + 1}. {s.title}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-center text-xs text-muted">
        See <code>.env.example</code> and <code>supabase/schema.sql</code> in the
        repository for details.
      </p>
    </main>
  );
}
