"use client";

import { Sparkles, Zap, Sprout, Briefcase, Heart } from "lucide-react";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import ResultShare from "../../../components/tools/ResultShare";

type Props = {
  result: any;
};

// Presentation only — all numerology logic/data come from the service layer.
export default function ResultCard({ result }: Props) {
  return (
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

      <ResultShare
        filename="destinyra-life-path"
        shareText={`${result.name ? `${result.name}'s ` : ""}Life Path is ${result.number} — ${result.title}. Discover yours on Destinyra ✨`}
        eyebrow="Life Path"
        title={result.title}
        highlight={String(result.number)}
        subtitle={result.name || undefined}
        badge={
          result.masterNumber ? `Master Number ${result.masterNumber}` : undefined
        }
        quote={
          result.description
            ? `${String(result.description).split(".")[0]}.`
            : undefined
        }
        chips={result.strengths?.slice(0, 3)}
        accent="#6C63FF"
      />
    </div>
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
