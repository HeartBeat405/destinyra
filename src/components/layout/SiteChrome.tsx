"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CommandPalette from "../search/CommandPalette";
import type { SiteSettings, Category } from "../../lib/types";

// Hides the public Navbar/Footer on admin & auth routes so those areas
// can render their own chrome — without moving any public pages.
export default function SiteChrome({
  children,
  settings,
  categories,
}: {
  children: React.ReactNode;
  settings: SiteSettings;
  categories: Category[];
}) {
  const pathname = usePathname();
  const bare =
    pathname?.startsWith("/admin") || pathname?.startsWith("/login");

  if (bare) return <>{children}</>;

  return (
    <>
      <Navbar
        siteName={settings.general.siteName}
        logoUrl={settings.general.logoUrl}
      />
      {children}
      <Footer settings={settings} categories={categories} />
      <CommandPalette />
    </>
  );
}
