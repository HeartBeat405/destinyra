import type { Metadata } from "next";
import "./globals.css";

import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";

import SiteChrome from "../components/layout/SiteChrome";
import InstallationRequired from "../components/InstallationRequired";
import { getSiteSettings } from "../lib/site-settings";
import { isSupabaseConfigured } from "../lib/supabase";
import { categoryService } from "../lib/services/category.service";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const base = s.seo.canonicalDomain || "https://destinyra.vercel.app";

  return {
    title: { default: s.seo.metaTitle || s.general.siteName, template: "%s" },
    description: s.seo.metaDescription,
    applicationName: s.general.siteName,
    creator: s.seo.organizationName || s.general.siteName,
    metadataBase: new URL(base),
    keywords: [
      "self growth",
      "lifestyle",
      "relationships",
      "numerology",
      "tarot",
      "spirituality",
      "mindset",
      s.general.siteName.toLowerCase(),
    ],
    openGraph: {
      title: s.general.siteName,
      description: s.seo.metaDescription,
      url: base,
      siteName: s.general.siteName,
      images: [{ url: s.seo.ogImage || "/image/og-banner.png", width: 1200, height: 630 }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: s.seo.twitterCard,
      title: s.general.siteName,
      description: s.seo.metaDescription,
      images: [s.seo.ogImage || "/image/og-banner.png"],
    },
    icons: s.general.faviconUrl ? { icon: s.general.faviconUrl } : undefined,
    robots: { index: true, follow: true },
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const { brand } = settings;

  // Brand tokens as CSS variables (applied globally; overrides globals.css).
  const brandVars = `:root{--brand:${brand.primaryColor};--brand-secondary:${brand.secondaryColor};--accent:${brand.accentColor};--btn-radius:${brand.buttonRadius};--container-width:${brand.containerWidth};}`;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.seo.organizationName || settings.general.siteName,
    url: settings.seo.canonicalDomain || "https://destinyra.vercel.app",
    logo:
      settings.general.logoUrl ||
      `${settings.seo.canonicalDomain || "https://destinyra.vercel.app"}${settings.seo.ogImage || "/image/og-banner.png"}`,
    sameAs: Object.values(settings.social).filter((v) => v.trim()),
  };

  // Live-only: without Supabase there is no data — show installation instead.
  if (!isSupabaseConfigured) {
    return (
      <html lang="en">
        <body>
          <style dangerouslySetInnerHTML={{ __html: brandVars }} />
          <InstallationRequired />
        </body>
      </html>
    );
  }

  const categories = await categoryService.getAll();

  return (
    <html lang={settings.general.language || "en"}>
      <body>
        <style dangerouslySetInnerHTML={{ __html: brandVars }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />

        {/* ADSENSE */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1856961818755959"
          crossOrigin="anonymous"
        />

        <SiteChrome settings={settings} categories={categories}>
          {children}
        </SiteChrome>

        <GoogleAnalytics gaId="G-E19FHS6T8J" />
        <Analytics />
      </body>
    </html>
  );
}
