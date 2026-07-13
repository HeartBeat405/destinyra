"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Compass } from "lucide-react";
import { ButtonLink } from "../ui/Button";
import SearchButton from "../search/SearchButton";

const links = [
  { label: "Home", href: "/" },
  { label: "Articles", href: "/articles" },
  { label: "Categories", href: "/categories" },
  { label: "Tools", href: "/tools" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar({
  siteName = "Destinyra",
  logoUrl = "",
}: {
  siteName?: string;
  logoUrl?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteName} className="h-8 w-auto" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-white">
              <Compass className="h-5 w-5" strokeWidth={2} />
            </span>
          )}
          <span className="text-lg font-black tracking-tight text-ink">
            {siteName}
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-muted hover:bg-black/[0.04] hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <SearchButton />
          <ButtonLink href="/tools/life-path" size="sm">
            Try a Tool
          </ButtonLink>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <SearchButton variant="icon" />
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-ink"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-brand-50 text-brand-700"
                    : "text-muted hover:bg-black/[0.04] hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <ButtonLink
              href="/tools/life-path"
              size="md"
              className="mt-2 w-full"
            >
              Try a Tool
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
