import Icon from "../../ui/Icon";

// Reusable relationship visualization components (admin dark theme).
// Presentation only — receive already-resolved plain data.

export type MiniCategory = { name: string; iconName: string; gradient: string };
export type MiniAuthor = { name: string; role?: string };
export type MiniArticle = { title: string; slug: string };

const TOOL_META: Record<
  string,
  { name: string; iconName: string; gradient: string }
> = {
  "life-path": { name: "Life Path Calculator", iconName: "Orbit", gradient: "from-violet-600 to-purple-700" },
  compatibility: { name: "Love Compatibility", iconName: "HeartHandshake", gradient: "from-rose-500 to-pink-600" },
  tarot: { name: "Tarot Reading", iconName: "Layers", gradient: "from-purple-600 to-fuchsia-600" },
  "angel-number": { name: "Angel Number Decoder", iconName: "Feather", gradient: "from-cyan-500 to-sky-600" },
};

export function CategoryChip({ category }: { category: MiniCategory }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 py-1 pl-1 pr-3 text-xs font-medium text-white">
      <span className={`flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br ${category.gradient}`}>
        <Icon name={category.iconName} className="h-3 w-3 text-white" />
      </span>
      {category.name}
    </span>
  );
}

export function TagChip({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full bg-purple-500/15 px-2.5 py-1 text-xs text-purple-200">
      #{label}
    </span>
  );
}

export function AuthorMini({ author }: { author: MiniAuthor }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-sm font-bold text-white">
        {author.name.charAt(0)}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white">{author.name}</p>
        {author.role && <p className="truncate text-xs text-gray-500">{author.role}</p>}
      </div>
    </div>
  );
}

export function ToolMini({ slug }: { slug: string }) {
  const t = TOOL_META[slug];
  if (!t) return null;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${t.gradient}`}>
        <Icon name={t.iconName} className="h-4 w-4 text-white" />
      </span>
      <p className="truncate text-sm font-semibold text-white">{t.name}</p>
    </div>
  );
}

export function ArticleCardMini({ article }: { article: MiniArticle }) {
  return (
    <a
      href={`/articles/${article.slug}`}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 transition-colors hover:bg-white/10"
    >
      <span className="line-clamp-1">{article.title}</span>
    </a>
  );
}

function Section({ title, empty, children }: { title: string; empty?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        {title}
      </p>
      {empty ? <p className="text-xs text-gray-600">Not set</p> : children}
    </div>
  );
}

export default function RelationshipPanel({
  category,
  tags,
  author,
  toolSlug,
  relatedArticles,
}: {
  category?: MiniCategory | null;
  tags: string[];
  author?: MiniAuthor | null;
  toolSlug: string;
  relatedArticles: MiniArticle[];
}) {
  return (
    <div className="space-y-5">
      <Section title="Primary Category" empty={!category}>
        {category && <CategoryChip category={category} />}
      </Section>

      <Section title={`Tags (${tags.length})`} empty={tags.length === 0}>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <TagChip key={t} label={t} />
          ))}
        </div>
      </Section>

      <Section title="Author" empty={!author}>
        {author && <AuthorMini author={author} />}
      </Section>

      <Section title="Related Tool" empty={!toolSlug || toolSlug === "none"}>
        <ToolMini slug={toolSlug} />
      </Section>

      <Section title="Related Articles" empty={relatedArticles.length === 0}>
        <div className="space-y-2">
          {relatedArticles.map((a) => (
            <ArticleCardMini key={a.slug} article={a} />
          ))}
        </div>
      </Section>
    </div>
  );
}
