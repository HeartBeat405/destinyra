import type { Metadata } from "next";

import { toolService } from "../../lib/services/tool.service";
import ToolCard from "../../components/tools/ToolCard";

export const metadata: Metadata = {
  title: "Tools — Destinyra",
  description:
    "Interactive self-discovery tools: Life Path Calculator, Love Compatibility, Tarot Reading, Angel Number Decoder, and more.",
  alternates: { canonical: "/tools" },
};

export default async function ToolsPage() {
  const tools = await toolService.getAll();

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">
          Tools for Self-Discovery
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Insight is better when you can act on it. Use these interactive tools
          to explore your numbers, your cards, and your path.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </div>
    </main>
  );
}
