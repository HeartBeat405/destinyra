import { ArrowRight } from "lucide-react";
import type { RelatedTool } from "../../lib/types";
import Icon from "../ui/Icon";
import { ButtonLink } from "../ui/Button";

const CTA: Record<
  Exclude<RelatedTool, "none">,
  {
    iconName: string;
    title: string;
    description: string;
    button: string;
    href: string;
    live: boolean;
  }
> = {
  "life-path": {
    iconName: "Orbit",
    title: "Discover Your Life Path",
    description:
      "Enter your birth date and reveal the number that maps your strengths and destiny.",
    button: "Calculate My Life Path",
    href: "/tools/life-path",
    live: true,
  },
  compatibility: {
    iconName: "HeartHandshake",
    title: "Check Love Compatibility",
    description:
      "Compare two birth dates and see how your numbers harmonize in love.",
    button: "Check Compatibility",
    href: "/tools/compatibility",
    live: false,
  },
  tarot: {
    iconName: "Layers",
    title: "Draw Your Tarot Card",
    description:
      "Pull a card for focused guidance on the question on your mind.",
    button: "Draw Your Card",
    href: "/tools/tarot",
    live: false,
  },
  "angel-number": {
    iconName: "Feather",
    title: "Decode Your Angel Number",
    description:
      "Enter a repeating number you keep seeing and uncover its message.",
    button: "Decode My Number",
    href: "/tools/angel-number",
    live: false,
  },
};

export default function ToolCTA({ tool }: { tool: RelatedTool }) {
  if (tool === "none" || !CTA[tool as Exclude<RelatedTool, "none">]) return null;
  const cta = CTA[tool as Exclude<RelatedTool, "none">];

  return (
    <div className="my-12 rounded-4xl border border-line bg-brand-50 p-8">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-card">
            <Icon name={cta.iconName} className="h-7 w-7" />
          </span>
          <div>
            <h3 className="text-xl font-black tracking-tight text-ink">
              {cta.title}
            </h3>
            <p className="mt-1 max-w-md text-sm text-muted">{cta.description}</p>
          </div>
        </div>
        <ButtonLink href={cta.href} size="md" className="shrink-0">
          {cta.live ? cta.button : "See the Tool"}
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>
    </div>
  );
}
