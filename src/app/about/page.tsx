import type { Metadata } from "next";
import { ButtonLink } from "../../components/ui/Button";

export const metadata: Metadata = {
  title: "About — Destinyra",
  description:
    "Destinyra is a modern self-discovery platform blending thoughtful articles with interactive tools for growth, relationships, and spirituality.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">
        About Destinyra
      </h1>

      <div className="mt-8 space-y-6 rounded-4xl border border-line bg-surface p-8 shadow-card">
        <p className="text-lg leading-8 text-ink/80">
          Destinyra is a modern lifestyle and self-discovery platform. We
          publish thoughtful writing on self-growth, relationships, career,
          mindset, and spirituality — paired with interactive tools like
          numerology, tarot, and angel numbers.
        </p>
        <p className="leading-8 text-muted">
          Our belief is simple: insight should lead to action. So every story
          can connect to a tool, and every tool is grounded in ideas you can
          actually use. Discover an article, then explore your numbers — all in
          one place.
        </p>
        <p className="leading-8 text-muted">
          Built with Next.js, TypeScript, and Tailwind CSS, Destinyra is
          designed to feel calm, premium, and genuinely helpful — created for
          inspiration, reflection, and personal exploration.
        </p>

        <div className="flex flex-wrap gap-3 border-t border-line pt-6">
          <ButtonLink href="/articles">Read articles</ButtonLink>
          <ButtonLink href="/tools" variant="outline">
            Explore tools
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
