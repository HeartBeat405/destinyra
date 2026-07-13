import { Sparkles } from "lucide-react";
import { ButtonLink } from "../ui/Button";

// Editorial light hero — calm, magazine-style. No glow/particles.
export default function Hero() {
  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center sm:pt-24">
        <span className="rise-in inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-4 py-1.5 text-sm font-medium text-muted">
          <Sparkles className="h-4 w-4 text-brand" strokeWidth={2} />
          Lifestyle · Knowledge · Self-discovery
        </span>

        <h1 className="rise-in mx-auto mt-7 max-w-3xl font-serif text-4xl font-bold leading-[1.1] text-ink sm:text-6xl">
          Stories that help you understand yourself
        </h1>

        <p className="rise-in mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
          Thoughtful writing on growth, relationships, and spirituality —
          paired with interactive tools that turn insight into action.
        </p>

        <div className="rise-in mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/articles" size="lg">
            Start Reading
          </ButtonLink>
          <ButtonLink href="/tools" size="lg" variant="outline">
            Explore Tools
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
