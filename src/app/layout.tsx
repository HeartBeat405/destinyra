import type { Metadata } from "next";
import "./globals.css";

import Script from "next/script";

import { GoogleAnalytics } from "@next/third-parties/google";

import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title:
    "Destinyra ✨ Discover Your Life Path & Master Number",

  description:
    "Discover your destiny, life path number, master number, love energy, and hidden personality with Destinyra.",

  keywords: [
    "numerology",
    "life path",
    "master number",
    "destiny calculator",
    "spiritual app",
    "life path number",
    "love energy",
    "personality test",
    "destinyra",
  ],

  authors: [
    {
      name: "Destinyra",
    },
  ],

  creator: "Destinyra",

  metadataBase: new URL(
    "https://destinyra.vercel.app"
  ),

  openGraph: {
    title:
      "Destinyra ✨",

    description:
      "Discover your life path and master number.",

    url:
      "https://destinyra.vercel.app",

    siteName: "Destinyra",

    images: [
      {
        url: "/image/og-banner.png",
        width: 1200,
        height: 630,
      },
    ],

    locale: "en_US",

    type: "website",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Destinyra ✨",

    description:
      "Discover your life path and master number.",

    images: [
      "/image/og-banner.png",
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* ADSENSE */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />

        {children}

        {/* GOOGLE ANALYTICS */}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />

        {/* VERCEL ANALYTICS */}
        <Analytics />
      </body>
    </html>
  );
}