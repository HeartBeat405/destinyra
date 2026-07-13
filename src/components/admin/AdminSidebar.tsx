"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import Icon from "../ui/Icon";
import { ADMIN_NAV } from "./nav";
import { can, type Role } from "../../lib/auth/rbac";

// Groups preserve declaration order from ADMIN_NAV.
function groupNav(role: Role) {
  const visible = ADMIN_NAV.filter((i) => can(role, "view", i.resource));
  const groups: Record<string, typeof visible> = {};
  for (const item of visible) {
    const key = item.group ?? "";
    (groups[key] ??= []).push(item);
  }
  return groups;
}

export default function AdminSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const groups = groupNav(role);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#070713] lg:block">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
        <Sparkles className="h-5 w-5 text-purple-400" />
        <span className="font-black tracking-tight">Destinyra</span>
        <span className="ml-1 rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          CMS
        </span>
      </div>

      <nav className="flex flex-col gap-6 px-3 py-5">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            {group && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                {group}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-purple-600/30 to-cyan-500/20 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon name={item.iconName} className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
