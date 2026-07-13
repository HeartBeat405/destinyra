import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth/session";
import { canAccessAdmin } from "../../lib/auth/rbac";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

export const metadata: Metadata = {
  title: "Admin — Destinyra",
  robots: { index: false, follow: false },
};

// Admin is auth-gated and always reflects live data — never prerender it.
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // RBAC gate: must be signed in and allowed to reach the panel.
  if (!user) redirect("/login");
  if (!canAccessAdmin(user.role)) redirect("/");

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
