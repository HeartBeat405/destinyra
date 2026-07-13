"use client";

import html2canvas from "html2canvas";
import { Sparkles, Zap, Sprout, Briefcase, Heart, Share2 } from "lucide-react";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";

type Props = {
  result: any;
};

// Presentation only — all numerology logic/data come from the service layer.
export default function ResultCard({ result }: Props) {
  async function handleShare() {
    const card = document.getElementById("share-card");
    if (!card) return;

    const canvas = await html2canvas(card, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    });

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "destinyra-result.png";
    link.click();

    const text = `${result.name}'s Destinyra Result

Life Path ${result.number} — ${result.title}
${result.masterNumber ? `Master Number ${result.masterNumber}` : ""}

Discover yours: https://destinyra.vercel.app`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }

  return (
    <>
      {/* ============ OFF-SCREEN SHARE GRAPHIC (light brand poster) ============ */}
      <div
        id="share-card"
        style={{
          position: "fixed",
          left: "-99999px",
          top: 0,
          width: "1080px",
          height: "1600px",
          overflow: "hidden",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: "center",
          padding: "110px 90px",
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: "#1D2433",
        }}
      >
        <div style={{ width: "100%" }}>
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 14,
              textTransform: "uppercase",
              color: "#6C63FF",
            }}
          >
            Destinyra
          </div>
          <div
            style={{
              margin: "24px auto",
              width: 80,
              height: 4,
              borderRadius: 4,
              background: "#6C63FF",
            }}
          />
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 26,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#667085",
            }}
          >
            {result.name || "Your Reading"}
          </div>
        </div>

        <div style={{ width: "100%" }}>
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 320,
              fontWeight: 900,
              lineHeight: 1,
              color: "#6C63FF",
            }}
          >
            {result.number}
          </div>
          <div
            style={{ fontSize: 84, fontWeight: 700, marginTop: 8 }}
          >
            {result.title}
          </div>

          {result.masterNumber && (
            <div
              style={{
                display: "inline-block",
                marginTop: 32,
                padding: "14px 36px",
                borderRadius: 999,
                background: "#FEF3C7",
                color: "#92400E",
                fontFamily: "Inter, sans-serif",
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              Master Number {result.masterNumber}
            </div>
          )}

          <div
            style={{
              marginTop: 60,
              maxWidth: 840,
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: 44,
              lineHeight: 1.7,
              fontStyle: "italic",
              color: "#2A3242",
            }}
          >
            “{result.description?.split(".")[0]}.”
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 20,
              marginTop: 64,
            }}
          >
            {result.strengths
              ?.slice(0, 3)
              .map((item: string, i: number) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    padding: "16px 34px",
                    borderRadius: 999,
                    background: "#F1F0FE",
                    color: "#4a42d4",
                    fontSize: 32,
                    fontWeight: 600,
                  }}
                >
                  {item}
                </div>
              ))}
          </div>
        </div>

        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 26,
            letterSpacing: 6,
            color: "#98A2B3",
          }}
        >
          destinyra.vercel.app
        </div>
      </div>

      {/* ============ VISIBLE RESULT (light editorial) ============ */}
      <div className="rise-in mt-10">
        {/* Hero */}
        <div className="rounded-4xl border border-line bg-surface p-8 text-center shadow-card">
          <p className="text-sm font-medium uppercase tracking-widest text-muted">
            Your Life Path
          </p>
          <div className="mt-3 font-sans text-7xl font-black text-brand sm:text-8xl">
            {result.number}
          </div>
          <h2 className="mt-2 font-serif text-3xl font-bold text-ink">
            {result.title}
          </h2>
          <div className="mt-5">
            {result.masterNumber ? (
              <Badge tone="warning" className="text-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Master Number {result.masterNumber}
              </Badge>
            ) : (
              <p className="text-sm text-muted">
                You don&apos;t carry a Master Number.
              </p>
            )}
          </div>
        </div>

        {/* Master detail */}
        {result.masterData && (
          <Card className="mt-6 border-warning/30 bg-warning/[0.06] p-6">
            <SectionTitle icon={<Sparkles className="h-4 w-4 text-warning" />}>
              {result.masterData.title}
            </SectionTitle>
            <p className="mt-3 leading-8 text-ink/80">
              {result.masterData.description}
            </p>
          </Card>
        )}

        {/* Description */}
        <Card className="mt-6 p-6">
          <p className="font-serif text-lg leading-8 text-ink/85">
            {result.description}
          </p>
        </Card>

        {/* Strengths */}
        <Card className="mt-6 p-6">
          <SectionTitle icon={<Zap className="h-4 w-4 text-brand" />}>
            Strengths
          </SectionTitle>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {result.strengths?.map((item: string, i: number) => (
              <Badge key={i} tone="brand">
                {item}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Growth areas */}
        <Card className="mt-6 p-6">
          <SectionTitle icon={<Sprout className="h-4 w-4 text-success" />}>
            Growth Areas
          </SectionTitle>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {result.weaknesses?.map((item: string, i: number) => (
              <Badge key={i} tone="neutral">
                {item}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Career + Love */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Card className="p-6">
            <SectionTitle icon={<Briefcase className="h-4 w-4 text-brand" />}>
              Career Path
            </SectionTitle>
            <p className="mt-3 leading-7 text-muted">{result.career}</p>
          </Card>
          <Card className="p-6">
            <SectionTitle icon={<Heart className="h-4 w-4 text-danger" />}>
              Love Style
            </SectionTitle>
            <p className="mt-3 leading-7 text-muted">{result.love}</p>
          </Card>
        </div>

        <Button
          onClick={handleShare}
          size="lg"
          className="mt-8 w-full"
        >
          <Share2 className="h-4 w-4" />
          Share my result
        </Button>
      </div>
    </>
  );
}

function SectionTitle({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink">
      {icon}
      {children}
    </h3>
  );
}
