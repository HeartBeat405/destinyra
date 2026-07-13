"use client";

import { useEffect, useState } from "react";
import { List, ChevronDown } from "lucide-react";
import type { TocHeading } from "../../lib/util/toc";

// Active-section highlighting via IntersectionObserver. No external libraries.
// `mode` lets the page place the desktop sidebar and mobile collapsible
// independently in the layout.
export default function TableOfContents({
  items,
  mode = "desktop",
}: {
  items: TocHeading[];
  mode?: "desktop" | "mobile";
}) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;
    const elements = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  const nav = (
    <nav aria-label="Table of contents">
      <ul className="space-y-1.5 border-l border-line">
        {items.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
            <a
              href={`#${h.id}`}
              onClick={() => setOpen(false)}
              className={`-ml-px block border-l-2 py-1 pl-3 text-sm transition-colors ${
                active === h.id
                  ? "border-brand font-medium text-brand-700"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  if (mode === "mobile") {
    return (
      <div className="mb-8 rounded-2xl border border-line bg-surface">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-ink"
        >
          <span className="flex items-center gap-2">
            <List className="h-4 w-4" />
            On this page
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && <div className="px-4 pb-4">{nav}</div>}
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
        <List className="h-3.5 w-3.5" />
        On this page
      </p>
      {nav}
    </div>
  );
}
