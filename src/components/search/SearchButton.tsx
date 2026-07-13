"use client";

import { Search } from "lucide-react";

// Opens the global command palette via a window event (no shared context).
export default function SearchButton({
  variant = "full",
}: {
  variant?: "full" | "icon";
}) {
  function open() {
    window.dispatchEvent(new Event("open-command-palette"));
  }

  if (variant === "icon") {
    return (
      <button
        onClick={open}
        aria-label="Search"
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-black/[0.04] hover:text-ink"
      >
        <Search className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={open}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
      aria-label="Search"
    >
      <Search className="h-4 w-4" />
      <span className="hidden lg:inline">Search</span>
      <kbd className="hidden rounded border border-line bg-surface px-1.5 py-0.5 text-[11px] lg:inline">
        ⌘K
      </kbd>
    </button>
  );
}
