"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, Share2, MessageCircle, Loader2 } from "lucide-react";

const SITE = "https://destinyra.vercel.app";

export type PosterRow = { label: string; value: string };

export type ResultShareProps = {
  /** File name (no extension) for the downloaded PNG. */
  filename: string;
  /** Text used for the WhatsApp / native share message. */
  shareText: string;
  eyebrow: string;
  title: string;
  /** Big highlighted value (e.g. a score or number). */
  highlight?: string;
  subtitle?: string;
  rows?: PosterRow[];
  /** Small pill under the highlight (e.g. "Master Number 11"). */
  badge?: string;
  /** Italic quote line. */
  quote?: string;
  /** Pill tags (e.g. strengths / keywords). */
  chips?: string[];
  /** Accent hex color for the poster. */
  accent?: string;
};

// Reusable "share your result" actions for the tools. Renders an off-screen
// branded poster, snapshots it to PNG (html2canvas), and offers download +
// native share (image to WhatsApp on mobile) + a WhatsApp text link.
export default function ResultShare({
  filename,
  shareText,
  eyebrow,
  title,
  highlight,
  subtitle,
  rows = [],
  badge,
  quote,
  chips = [],
  accent = "#6C63FF",
}: ResultShareProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  async function toBlob(): Promise<Blob | null> {
    const node = posterRef.current;
    if (!node) return null;
    const canvas = await html2canvas(node, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    });
    return await new Promise<Blob | null>((res) =>
      canvas.toBlob((b) => res(b), "image/png")
    );
  }

  const pageLink = () =>
    typeof window !== "undefined" ? window.location.href : SITE;

  async function handleDownload() {
    setBusy(true);
    try {
      const blob = await toBlob();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  async function handleShare() {
    setBusy(true);
    try {
      const blob = await toBlob();
      const file = blob
        ? new File([blob], `${filename}.png`, { type: "image/png" })
        : null;
      if (
        file &&
        typeof navigator !== "undefined" &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          text: shareText,
          title: "Destinyra",
        });
      } else {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageLink()}`)}`,
          "_blank"
        );
      }
    } catch {
      // user cancelled the share sheet — ignore
    } finally {
      setBusy(false);
    }
  }

  function handleWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageLink()}`)}`,
      "_blank"
    );
  }

  return (
    <div className="mt-8 border-t border-line pt-6">
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">
        Share your result
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={handleDownload}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-600 disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download
        </button>
        <button
          onClick={handleShare}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand disabled:opacity-50"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
        <button
          onClick={handleWhatsApp}
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </button>
      </div>

      {/* ===== Off-screen share poster (inline styles for html2canvas) ===== */}
      <div
        ref={posterRef}
        style={{
          position: "fixed",
          left: "-99999px",
          top: 0,
          width: "1080px",
          height: "1350px",
          overflow: "hidden",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          padding: "0",
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: "#1D2433",
        }}
      >
        <div style={{ height: "16px", width: "100%", background: accent }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            textAlign: "center",
            padding: "100px 90px",
          }}
        >
          <div style={{ width: "100%" }}>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "28px",
                fontWeight: 800,
                letterSpacing: "16px",
                textTransform: "uppercase",
                color: "#1D2433",
              }}
            >
              Destinyra
            </div>
            <div
              style={{
                marginTop: "14px",
                fontFamily: "Inter, sans-serif",
                fontSize: "24px",
                fontWeight: 700,
                letterSpacing: "6px",
                textTransform: "uppercase",
                color: accent,
              }}
            >
              {eyebrow}
            </div>
          </div>

          <div style={{ width: "100%" }}>
            <div
              style={{
                fontSize: "72px",
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>
            {highlight ? (
              <div
                style={{
                  marginTop: "30px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "150px",
                  fontWeight: 800,
                  lineHeight: 1,
                  color: accent,
                }}
              >
                {highlight}
              </div>
            ) : null}
            {badge ? (
              <div
                style={{
                  display: "inline-block",
                  marginTop: "28px",
                  padding: "14px 40px",
                  borderRadius: "999px",
                  background: "#FEF3C7",
                  color: "#92400E",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "32px",
                  fontWeight: 700,
                }}
              >
                {badge}
              </div>
            ) : null}
            {subtitle ? (
              <div
                style={{
                  marginTop: "26px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "36px",
                  fontWeight: 600,
                  color: "#667085",
                }}
              >
                {subtitle}
              </div>
            ) : null}
            {quote ? (
              <div
                style={{
                  marginTop: "44px",
                  maxWidth: "820px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontSize: "42px",
                  lineHeight: 1.6,
                  fontStyle: "italic",
                  color: "#2A3242",
                }}
              >
                “{quote}”
              </div>
            ) : null}

            {rows.length > 0 ? (
              <div
                style={{
                  marginTop: "48px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  width: "100%",
                }}
              >
                {rows.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: "20px",
                      borderTop: "2px solid #E7EAF0",
                      paddingTop: "16px",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <span
                      style={{ fontSize: "30px", fontWeight: 700, color: accent }}
                    >
                      {r.label}
                    </span>
                    <span
                      style={{
                        fontSize: "30px",
                        color: "#1D2433",
                        textAlign: "right",
                      }}
                    >
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            {chips.length > 0 ? (
              <div
                style={{
                  marginTop: "52px",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "20px",
                }}
              >
                {chips.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      padding: "16px 34px",
                      borderRadius: "999px",
                      background: "#F1F0FE",
                      color: "#4a42d4",
                      fontSize: "30px",
                      fontWeight: 600,
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "26px",
              color: "#667085",
            }}
          >
            Discover yours · destinyra.vercel.app
          </div>
        </div>
      </div>
    </div>
  );
}
