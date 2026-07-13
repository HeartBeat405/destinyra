"use client";

import { Twitter, Facebook, Link2, Check } from "lucide-react";
import { useState } from "react";

type Props = {
  url: string;
  title: string;
};

export default function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — ignore
    }
  }

  const base =
    "flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-muted transition-all hover:border-brand hover:text-brand";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={base}
      >
        <Twitter className="h-4 w-4" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className={base}
      >
        <Facebook className="h-4 w-4" />
      </a>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className={base}
      >
        <span className="text-sm font-bold">W</span>
      </a>
      <button onClick={copy} aria-label="Copy link" className={base}>
        {copied ? (
          <Check className="h-4 w-4 text-success" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
