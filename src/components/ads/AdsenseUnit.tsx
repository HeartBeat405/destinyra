"use client";

import { useEffect } from "react";

// Renders a real AdSense unit on the PUBLIC site (never used in admin).
export default function AdsenseUnit({
  client,
  slotId,
}: {
  client: string;
  slotId: string;
}) {
  useEffect(() => {
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // ad script not ready — ignore
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
