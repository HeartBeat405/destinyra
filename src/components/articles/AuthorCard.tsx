import type { Author } from "../../lib/types";
import { ButtonLink } from "../ui/Button";

// Reusable author card. Presentation only — reads the Author DTO as-is.
export default function AuthorCard({ author }: { author: Author }) {
  return (
    <div className="mt-12 rounded-4xl border border-line bg-surface p-6 shadow-card sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand text-2xl font-bold text-white">
          {author.name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wide text-muted">
            Written by
          </p>
          <p className="text-lg font-bold text-ink">{author.name}</p>
          {author.role && (
            <p className="text-sm text-brand-700">{author.role}</p>
          )}
          {author.bio && (
            <p className="mt-2 text-sm leading-6 text-muted">{author.bio}</p>
          )}
        </div>
        <ButtonLink
          href="/articles"
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          More articles
        </ButtonLink>
      </div>
    </div>
  );
}
