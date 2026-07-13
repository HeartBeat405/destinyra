import Link from "next/link";
import { Eye, LogOut } from "lucide-react";
import type { SessionUser } from "../../lib/auth/session";
import { signOutAction } from "../../lib/auth/actions";

export default function AdminTopbar({ user }: { user: SessionUser }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#070713]/80 px-6 backdrop-blur">
      <div className="text-sm text-gray-400">
        Welcome back,{" "}
        <span className="font-semibold text-white">{user.name}</span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 sm:flex"
        >
          <Eye className="h-4 w-4" />
          View site
        </Link>

        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-sm font-bold">
            {user.name.charAt(0)}
          </span>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold leading-tight">{user.name}</p>
            <p className="text-[11px] capitalize leading-tight text-gray-500">
              {user.role.replace("_", " ")}
            </p>
          </div>
        </div>

        <form action={signOutAction}>
          <button
            type="submit"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </header>
  );
}
