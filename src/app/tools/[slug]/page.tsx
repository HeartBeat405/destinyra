import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Bell } from "lucide-react";

import { toolService } from "../../../lib/services/tool.service";
import Newsletter from "../../../components/ui/Newsletter";
import Icon from "../../../components/ui/Icon";
import AdSlotRenderer from "../../../components/ads/AdSlotRenderer";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const tools = await toolService.getAll();
  // life-path has its own dedicated route.
  return tools
    .filter((t) => t.slug !== "life-path")
    .map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const tool = await toolService.getBySlug(slug);
  if (!tool) return { title: "Tool not found — Destinyra" };
  return {
    title: `${tool.name} — Destinyra`,
    description: tool.description,
    alternates: { canonical: `/tools/${tool.slug}` },
  };
}

export default async function ToolPage({ params }: Params) {
  const { slug } = await params;
  const tool = await toolService.getBySlug(slug);
  if (!tool) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-line" />
        <Link href="/tools" className="hover:text-ink">
          Tools
        </Link>
        <ChevronRight className="h-4 w-4 text-line" />
        <span className="text-ink">{tool.name}</span>
      </nav>

      <div className="mt-10 overflow-hidden rounded-4xl border border-line bg-surface p-10 text-center shadow-card">
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient} text-white shadow-card`}
        >
          <Icon name={tool.iconName} className="h-10 w-10" />
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-warning/10 px-4 py-1.5 text-sm font-semibold text-[#92400e]">
          <Bell className="h-4 w-4" />
          Coming soon
        </span>
        <h1 className="mt-5 font-serif text-4xl font-bold text-ink">
          {tool.name}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          {tool.description}
        </p>
        <p className="mt-6 text-sm text-muted">
          We&apos;re building this tool right now. Join the newsletter and
          we&apos;ll tell you the moment it goes live.
        </p>
      </div>

      <AdSlotRenderer placement="tool" />

      <div className="mt-10">
        <Newsletter />
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/tools"
          className="text-sm font-semibold text-brand-700 hover:text-brand-600"
        >
          ← Back to all tools
        </Link>
      </div>
    </main>
  );
}
