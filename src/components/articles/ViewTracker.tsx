"use client";

import { useEffect, useRef } from "react";
import { trackArticleView } from "../../lib/actions/view.actions";

// Fires exactly once per article per browser session, on real mount.
// SSG/prefetch never runs this, so the count tracks actual readers.
export default function ViewTracker({ articleId }: { articleId: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current || !articleId) return;
    fired.current = true;

    const key = `viewed:${articleId}`;
    try {
      if (sessionStorage.getItem(key)) return; // already counted this session
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage unavailable (private mode) — still count once per mount
    }

    void trackArticleView(articleId);
  }, [articleId]);

  return null;
}
