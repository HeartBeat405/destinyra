import { ArrowRight, Lock } from "lucide-react";
import type { Tool } from "../../lib/types";
import Icon from "../ui/Icon";
import Badge from "../ui/Badge";
import { ButtonLink } from "../ui/Button";

export default function ToolCard({ tool }: { tool: Tool }) {
  const isPublished = tool.status === "published";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <span className="absolute right-5 top-5">
        <Badge tone={isPublished ? "success" : "warning"}>
          {isPublished ? "Live" : "Coming soon"}
        </Badge>
      </span>

      <div
        className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient} text-white shadow-card`}
      >
        <Icon name={tool.iconName} className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-bold tracking-tight text-ink">{tool.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">
        {tool.description}
      </p>

      {isPublished ? (
        <ButtonLink href={tool.buttonLink} size="md" className="mt-6 w-full">
          {tool.buttonText}
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      ) : (
        <span className="mt-6 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-line bg-canvas px-5 py-3 text-sm font-semibold text-muted">
          <Lock className="h-4 w-4" />
          {tool.buttonText}
        </span>
      )}
    </div>
  );
}
