import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentUser } from "../../lib/auth/session";
import { signOutAction } from "../../lib/auth/actions";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

export const metadata: Metadata = {
  title: "Admin — Destinyra",
  robots: { index: false, follow: false },
};

// Admin is auth-gated and always reflects live data — never prerender it.
export const dynamic = "force-dynamic";

// Only these roles may access the admin panel.
const ADMIN_ROLES = ["super_admin", "admin"] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") ?? "";

  // The login page renders bare (no shell, no guard) to avoid a redirect loop.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  // Authenticated but not authorized → 403.
  if (!ADMIN_ROLES.includes(user.role as (typeof ADMIN_ROLES)[number])) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#04040c] px-6 text-center text-white">
        <p className="text-6xl font-black text-rose-400">403</p>
        <h1 className="mt-3 text-xl font-bold">Access denied</h1>
        <p className="mt-2 max-w-sm text-sm text-gray-400">
          Your account ({user.email}) doesn&apos;t have administrator access.
        </p>
        <div className="mt-6 flex gap-3">
          <form action={signOutAction}>
            <button className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/5">
              Sign out
            </button>
          </form>
          <a href="/" className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
            Back to site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#04040c] text-white">
      <AdminSidebar role={user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar user={user} />
        <main className="flex-1 overflow-x-hidden px-5 py-7 sm:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
