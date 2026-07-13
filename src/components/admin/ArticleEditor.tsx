"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  Eye,
  Pencil,
  Bold,
  Heading2,
  List,
  Quote,
  Code,
  Link2,
  Check,
  Loader2,
  AlertTriangle,
  ExternalLink,
  ImageIcon,
  CheckCircle2,
  Circle,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";
import type { Article, Media } from "../../lib/types";
import MediaPicker from "./MediaPicker";
import { SearchSelect, MultiSelect } from "./form/Selects";
import {
  ARTICLE_STATUSES,
  RELATED_TOOLS,
  type ArticleInput,
} from "../../lib/validation/article.schema";
import { slugify, estimateReadingTime } from "../../lib/util/article";
import { saveArticleAction } from "../../lib/actions/article.actions";
import ArticleContent from "../articles/ArticleContent";
import RelationshipPanel, {
  type MiniArticle,
} from "./relationships/RelationshipPanel";

type Option = {
  value: string;
  label: string;
  hint?: string;
  iconName?: string;
  gradient?: string;
};

type Props = {
  article?: Article;
  categories: Option[];
  authors: Option[];
  availableTags: string[];
  relatedArticles?: MiniArticle[];
  devMode: boolean;
};

type SaveState = "idle" | "saving" | "saved" | "error" | "dev";

// Preset accent gradients. Values are safelisted in tailwind.config.js so
// they always render even though they're stored in the database.
const GRADIENT_PRESETS: { label: string; value: string }[] = [
  { label: "Purple", value: "from-violet-600 to-purple-700" },
  { label: "Pink", value: "from-rose-500 to-pink-600" },
  { label: "Blue", value: "from-blue-500 to-indigo-600" },
  { label: "Green", value: "from-emerald-500 to-teal-500" },
  { label: "Amber", value: "from-amber-500 to-orange-600" },
  { label: "Cyan", value: "from-cyan-500 to-sky-600" },
  { label: "Fuchsia", value: "from-fuchsia-500 to-purple-600" },
  { label: "Slate", value: "from-slate-500 to-gray-600" },
];

function toInput(a?: Article): ArticleInput {
  return {
    id: a?.id,
    title: a?.title ?? "",
    slug: a?.slug ?? "",
    excerpt: a?.excerpt ?? "",
    content: a?.content ?? "",
    categoryId: a?.category?.id ?? null,
    authorId: a?.authorId || null,
    iconName: a?.iconName ?? "Sparkles",
    gradient: a?.gradient ?? "from-violet-600 to-purple-700",
    status: a?.status ?? "draft",
    relatedTool: a?.relatedTool ?? "none",
    tags: a?.tags ?? [],
    featured: !!a?.featured,
    editorsPick: !!a?.editorsPick,
    trending: !!a?.trending,
    pinned: !!a?.pinned,
    heroTextColor: a?.heroTextColor ?? "auto",
    seoTitle: a?.seoTitle ?? "",
    seoDescription: a?.seoDescription ?? "",
    focusKeyword: "",
    canonicalUrl: "",
    // Loaded from the article's stored banner so editing/autosave never
    // wipes it (Article.image maps from og_image_url).
    ogImageUrl: a?.image ?? "",
    scheduledAt: null,
  };
}

export default function ArticleEditor({
  article,
  categories,
  authors,
  availableTags,
  relatedArticles = [],
  devMode,
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleInput>(() => toInput(article));
  const [slugLocked, setSlugLocked] = useState(Boolean(article?.slug));
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const savedSnapshot = useRef<string>(JSON.stringify(toInput(article)));

  function set<K extends keyof ArticleInput>(key: K, value: ArticleInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Auto-slug from title until the slug is manually edited.
  useEffect(() => {
    if (!slugLocked) set("slug", slugify(form.title));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title, slugLocked]);

  const readingTime = useMemo(
    () => estimateReadingTime(form.content ?? ""),
    [form.content]
  );

  async function persist(): Promise<boolean> {
    setSaveState("saving");
    setMessage(null);
    return new Promise((resolve) => {
      startTransition(async () => {
        const res = await saveArticleAction(form);
        if (res.ok) {
          setSaveState("saved");
          setErrors({});
          savedSnapshot.current = JSON.stringify(form);
          setLastSavedAt(
            new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
          // First save of a new article → switch to its edit route.
          if (!form.id && res.data) {
            router.replace(`/admin/articles/${res.data.slug}`);
            router.refresh();
          }
          resolve(true);
        } else if (res.devMode) {
          setSaveState("dev");
          setMessage(res.message ?? null);
          resolve(false);
        } else {
          setSaveState("error");
          setMessage(res.message ?? "Save failed.");
          if (res.fieldErrors) setErrors(res.fieldErrors);
          resolve(false);
        }
      });
    });
  }

  const dirty = JSON.stringify(form) !== savedSnapshot.current;

  // Autosave (edit mode only): debounce 2s after changes settle.
  useEffect(() => {
    if (!form.id) return;
    const snapshot = JSON.stringify(form);
    if (snapshot === savedSnapshot.current) return;
    const t = setTimeout(() => {
      void persist();
    }, 2000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // Warn on navigation away with unsaved changes.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (JSON.stringify(form) !== savedSnapshot.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [form]);

  // Publishing checklist / content completeness.
  const checklist = [
    { label: "Title", done: form.title.trim().length >= 3 },
    { label: "Slug", done: form.slug.trim().length > 0 },
    { label: "Excerpt", done: (form.excerpt ?? "").trim().length > 0 },
    { label: "Content (300+ chars)", done: (form.content ?? "").trim().length >= 300 },
    { label: "Category", done: Boolean(form.categoryId) },
    { label: "Author", done: Boolean(form.authorId) },
    { label: "At least one tag", done: (form.tags ?? []).length > 0 },
    { label: "SEO meta description", done: (form.seoDescription ?? "").trim().length > 0 },
  ];
  const completeness = Math.round(
    (checklist.filter((c) => c.done).length / checklist.length) * 100
  );

  // Publishing stats (Phase 2)
  const wordCount = (form.content ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const charCount = (form.content ?? "").length;

  // Resolved relationships for visualization (Phase 1)
  const selCat = categories.find((c) => c.value === form.categoryId);
  const relCategory = selCat
    ? {
        name: selCat.label,
        iconName: selCat.iconName ?? "Sparkles",
        gradient: selCat.gradient ?? "from-fuchsia-500 to-purple-600",
      }
    : null;
  const selAuthor = authors.find((a) => a.value === form.authorId);
  const relAuthor = selAuthor
    ? { name: selAuthor.label, role: selAuthor.hint }
    : null;

  // Content health warnings (Phase 3)
  const warnings: string[] = [];
  if (!form.title.trim()) warnings.push("Missing title");
  if (!(form.excerpt ?? "").trim()) warnings.push("Missing excerpt");
  if (!(form.ogImageUrl ?? "").trim()) warnings.push("No cover image");
  if (!form.categoryId) warnings.push("No category");
  if ((form.tags ?? []).length === 0) warnings.push("No tags");
  if (!form.authorId) warnings.push("No author");
  if (form.relatedTool === "none") warnings.push("No related tool");
  if (wordCount < 300) warnings.push("Low word count (< 300)");
  if (!(form.seoTitle ?? "").trim()) warnings.push("SEO title missing");
  if (!(form.seoDescription ?? "").trim())
    warnings.push("Meta description missing");

  // Ctrl/Cmd + S to save (Phase 6)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void persist();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  function wrapSelection(before: string, after = before) {
    const el = contentRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e) || "text";
    const next = value.slice(0, s) + before + selected + after + value.slice(e);
    set("content", next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = s + before.length;
      el.selectionEnd = s + before.length + selected.length;
    });
  }

  function prefixLine(prefix: string) {
    const el = contentRef.current;
    if (!el) return;
    const { selectionStart: s, value } = el;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    set("content", value.slice(0, lineStart) + prefix + value.slice(lineStart));
  }

  const toolbar = [
    { icon: Bold, label: "Bold", run: () => wrapSelection("**") },
    { icon: Heading2, label: "Heading", run: () => prefixLine("## ") },
    { icon: List, label: "List", run: () => prefixLine("- ") },
    { icon: Quote, label: "Quote", run: () => prefixLine("> ") },
    { icon: Code, label: "Code", run: () => wrapSelection("`") },
    { icon: Link2, label: "Link", run: () => wrapSelection("[", "](https://)") },
  ];

  const seoTitle = form.seoTitle || form.title || "Untitled";
  const seoDesc =
    form.seoDescription || form.excerpt || "No description set yet.";

  const statusPill = {
    idle: { text: form.id ? "All changes saved" : "Not saved yet", cls: "text-gray-500", Icon: Check },
    saving: { text: "Saving…", cls: "text-amber-300", Icon: Loader2 },
    saved: { text: "Saved", cls: "text-emerald-300", Icon: Check },
    dev: { text: "Dev mode — not persisted", cls: "text-amber-300", Icon: AlertTriangle },
    error: { text: "Save error", cls: "text-rose-300", Icon: AlertTriangle },
  }[saveState];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Articles
          </Link>
          <span
            className={`flex items-center gap-1.5 text-xs font-medium ${statusPill.cls}`}
          >
            <statusPill.Icon
              className={`h-3.5 w-3.5 ${saveState === "saving" ? "animate-spin" : ""}`}
            />
            {statusPill.text}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {form.id && (
            <Link
              href={`/articles/${form.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-sm text-gray-300 hover:bg-white/5"
            >
              <ExternalLink className="h-4 w-4" />
              Preview
            </Link>
          )}
          <button
            onClick={() => void persist()}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {form.id ? "Save" : "Create"}
          </button>
        </div>
      </div>

      {devMode && (
        <div className="mb-5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-200">
          Dev mode — editing is fully interactive, but saving needs Supabase
          (set keys in .env.local to persist).
        </div>
      )}
      {message && saveState === "error" && (
        <div className="mb-5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-200">
          {message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Article title"
              className="w-full bg-transparent text-2xl font-black tracking-tight outline-none placeholder:text-gray-600"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-300">{errors.title}</p>
            )}

            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <span>/articles/</span>
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugLocked(true);
                  set("slug", slugify(e.target.value));
                }}
                placeholder="slug"
                className="flex-1 bg-transparent text-purple-300 outline-none"
              />
              <span className="text-xs text-gray-600">{readingTime} min read</span>
            </div>
            {errors.slug && (
              <p className="mt-1 text-xs text-rose-300">{errors.slug}</p>
            )}
          </div>

          {/* Excerpt */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Excerpt
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={2}
              placeholder="One or two sentences that summarize the article."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm outline-none placeholder:text-gray-600 focus:border-purple-400"
            />
          </div>

          {/* Content editor */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04]">
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
              <div className="flex items-center gap-1">
                {toolbar.map((t) => (
                  <button
                    key={t.label}
                    onClick={t.run}
                    title={t.label}
                    disabled={tab === "preview"}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                  >
                    <t.icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
              <div className="flex rounded-lg bg-white/5 p-0.5 text-sm">
                <button
                  onClick={() => setTab("write")}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1 ${tab === "write" ? "bg-white/10 text-white" : "text-gray-400"}`}
                >
                  <Pencil className="h-3.5 w-3.5" /> Write
                </button>
                <button
                  onClick={() => setTab("preview")}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1 ${tab === "preview" ? "bg-white/10 text-white" : "text-gray-400"}`}
                >
                  <Eye className="h-3.5 w-3.5" /> Preview
                </button>
              </div>
            </div>

            {tab === "write" ? (
              <textarea
                ref={contentRef}
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                rows={20}
                placeholder={"Write in markdown…\n\n## A heading\n\nA paragraph with **bold** text.\n\n- a list item\n> a quote"}
                className="w-full resize-y bg-transparent p-5 font-mono text-sm leading-7 outline-none placeholder:text-gray-600"
              />
            ) : (
              <div className="bg-[#0b0b18] p-4">
                {/* Device toolbar */}
                <div className="mb-4 flex items-center justify-center gap-2">
                  {([
                    ["desktop", Monitor],
                    ["tablet", Tablet],
                    ["mobile", Smartphone],
                  ] as const).map(([d, IconCmp]) => (
                    <button
                      key={d}
                      onClick={() => setPreviewDevice(d)}
                      aria-pressed={previewDevice === d}
                      aria-label={`${d} preview`}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 ${
                        previewDevice === d
                          ? "bg-white/10 text-white"
                          : "text-gray-500 hover:text-white"
                      }`}
                    >
                      <IconCmp className="h-4 w-4" />
                    </button>
                  ))}
                  <a
                    href={form.id ? `/articles/${form.slug}` : undefined}
                    target="_blank"
                    rel="noreferrer"
                    aria-disabled={!form.id}
                    className={`ml-2 inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs ${
                      form.id
                        ? "text-gray-300 hover:bg-white/10"
                        : "cursor-not-allowed text-gray-600"
                    }`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open in new window
                  </a>
                </div>

                {/* Device frame (white light-theme page) */}
                <div
                  className="mx-auto overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
                  style={{
                    maxWidth:
                      previewDevice === "mobile"
                        ? "390px"
                        : previewDevice === "tablet"
                          ? "768px"
                          : "100%",
                  }}
                >
                  <div className="px-6 py-8 text-ink">
                    {form.title && (
                      <h1 className="mb-4 font-serif text-3xl font-bold text-ink">
                        {form.title}
                      </h1>
                    )}
                    {form.content?.trim() ? (
                      <ArticleContent content={form.content} />
                    ) : (
                      <p className="text-sm text-muted">Nothing to preview yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEO panel */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              SEO
            </h3>

            {/* Google preview */}
            <div className="mb-5 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="truncate text-xs text-emerald-300/80">
                destinyra.vercel.app › articles › {form.slug || "slug"}
              </p>
              <p className="truncate text-lg text-[#8ab4f8]">{seoTitle}</p>
              <p className="line-clamp-2 text-sm text-gray-400">{seoDesc}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`SEO Title (${(form.seoTitle ?? "").length}/70)`}>
                <input
                  value={form.seoTitle}
                  onChange={(e) => set("seoTitle", e.target.value)}
                  className="editor-input"
                  placeholder={form.title}
                />
              </Field>
              <Field label="Focus Keyword">
                <input
                  value={form.focusKeyword}
                  onChange={(e) => set("focusKeyword", e.target.value)}
                  className="editor-input"
                  placeholder="e.g. life path number"
                />
              </Field>
              <Field label={`Meta Description (${(form.seoDescription ?? "").length}/200)`}>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => set("seoDescription", e.target.value)}
                  rows={2}
                  className="editor-input resize-none"
                  placeholder={form.excerpt}
                />
              </Field>
              <Field label="Canonical URL">
                <input
                  value={form.canonicalUrl}
                  onChange={(e) => set("canonicalUrl", e.target.value)}
                  className="editor-input"
                  placeholder="https://…"
                />
              </Field>
              <Field label="Banner / Cover Image">
                <div className="flex items-center gap-2">
                  <input
                    value={form.ogImageUrl}
                    onChange={(e) => set("ogImageUrl", e.target.value)}
                    className="editor-input"
                    placeholder="Pick from media or paste an image URL"
                  />
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/10"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    Browse
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-white/40">
                  Recommended <strong>1600×900 px</strong> (16:9, landscape).
                  One image feeds the homepage hero slideshow, the article
                  banner, cards, and social sharing — so keep the main subject
                  centered and it won&apos;t look cut off when cropped to fit
                  each spot. Leave empty to use the placeholder tile.
                </p>
                {form.ogImageUrl?.trim() ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.ogImageUrl}
                    alt="Banner preview"
                    className="mt-2 h-32 w-full rounded-lg border border-white/10 object-cover"
                  />
                ) : null}
              </Field>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          {/* Publishing stats */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Publishing
            </h3>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Stat label="Words" value={wordCount.toLocaleString()} />
              <Stat label="Characters" value={charCount.toLocaleString()} />
              <Stat label="Reading time" value={`${readingTime} min`} />
              <Stat label="Tags" value={String((form.tags ?? []).length)} />
              <Stat label="Status" value={form.status} />
              <Stat label="Last saved" value={lastSavedAt ?? "—"} />
            </dl>
          </div>

          {/* Publish box */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Publish
            </h3>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as ArticleInput["status"])}
                className="editor-input capitalize"
              >
                {ARTICLE_STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-[#0b0b18]">
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            {form.status === "scheduled" && (
              <Field label="Scheduled at">
                <input
                  type="datetime-local"
                  value={form.scheduledAt ?? ""}
                  onChange={(e) => set("scheduledAt", e.target.value)}
                  className="editor-input"
                />
              </Field>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2">
              {([
                ["featured", "Featured"],
                ["editorsPick", "Editor's Pick"],
                ["trending", "Trending"],
                ["pinned", "Pinned"],
              ] as const).map(([key, label]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-2.5 py-2 text-xs"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(form[key])}
                    onChange={(e) => set(key, e.target.checked)}
                    className="accent-purple-500"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Publishing checklist / completeness */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Checklist
              </h3>
              <span className="text-xs font-semibold text-gray-300">
                {completeness}%
              </span>
            </div>
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all"
                style={{ width: `${completeness}%` }}
                role="progressbar"
                aria-valuenow={completeness}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Content completeness"
              />
            </div>
            <ul className="space-y-2">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-2 text-sm">
                  {c.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-600" />
                  )}
                  <span className={c.done ? "text-gray-300" : "text-gray-500"}>
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>
            {dirty && (
              <p className="mt-4 flex items-center gap-1.5 text-xs text-amber-300">
                <AlertTriangle className="h-3.5 w-3.5" />
                Unsaved changes
              </p>
            )}
          </div>

          {/* Content health */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Content Health
            </h3>
            {warnings.length === 0 ? (
              <p className="flex items-center gap-1.5 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Looks good — ready to publish.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {warnings.map((w) => (
                  <li key={w} className="flex items-center gap-2 text-sm text-amber-300">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Relationships visualization */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Relationships
            </h3>
            <RelationshipPanel
              category={relCategory}
              tags={form.tags ?? []}
              author={relAuthor}
              toolSlug={form.relatedTool}
              relatedArticles={relatedArticles}
            />
          </div>

          {/* Organize (smart selectors) */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Organize
            </h3>
            <SearchSelect
              label="Primary Category"
              value={form.categoryId ?? ""}
              onChange={(v) => set("categoryId", v || null)}
              options={categories}
              placeholder="Choose a category"
            />
            <SearchSelect
              label="Author"
              value={form.authorId ?? ""}
              onChange={(v) => set("authorId", v || null)}
              options={authors}
              placeholder="Choose an author"
            />
            <MultiSelect
              label="Tags"
              values={form.tags ?? []}
              onChange={(v) => set("tags", v)}
              options={availableTags.map((t) => ({ value: t, label: t }))}
              allowCreate
              placeholder="Search or create a tag…"
            />
            <SearchSelect
              label="Related Tool (auto CTA)"
              value={form.relatedTool}
              onChange={(v) =>
                set("relatedTool", (v || "none") as ArticleInput["relatedTool"])
              }
              options={RELATED_TOOLS.map((t) => ({ value: t, label: t }))}
              clearable={false}
              placeholder="No related tool"
            />
          </div>

          {/* Appearance */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Appearance
            </h3>
            <Field label="Icon name (lucide)">
              <input
                value={form.iconName}
                onChange={(e) => set("iconName", e.target.value)}
                className="editor-input"
                placeholder="Sparkles"
              />
            </Field>
            <Field label="Gradient / accent color">
              <div className="flex flex-wrap gap-2">
                {GRADIENT_PRESETS.map((g) => {
                  const active = form.gradient === g.value;
                  return (
                    <button
                      key={g.value}
                      type="button"
                      title={g.label}
                      onClick={() => set("gradient", g.value)}
                      className={`h-8 w-8 rounded-lg bg-gradient-to-br ${g.value} ring-2 ring-offset-2 ring-offset-[#0b0b18] transition ${
                        active ? "ring-white" : "ring-transparent hover:ring-white/40"
                      }`}
                    />
                  );
                })}
              </div>
            </Field>
            <p className="mt-2 text-[11px] text-gray-500">
              Used as the fallback tile color when this article has no banner
              image.
            </p>
            <div className={`mt-2 h-16 rounded-xl bg-gradient-to-br ${form.gradient}`} />

            <Field label="Banner text color">
              <div className="flex gap-1.5">
                {(["auto", "light", "dark"] as const).map((c) => {
                  const active = (form.heroTextColor ?? "auto") === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set("heroTextColor", c)}
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold capitalize transition ${
                        active
                          ? "bg-white/15 text-white ring-1 ring-white/30"
                          : "bg-white/[0.03] text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {c === "auto" ? "Auto" : c === "light" ? "Light" : "Dark"}
                    </button>
                  );
                })}
              </div>
            </Field>
            <p className="mt-1 text-[11px] text-gray-500">
              Color of the title over the homepage banner. <strong>Auto</strong>{" "}
              = white on a photo. Pick <strong>Dark</strong> if your banner is
              light and white text is hard to read.
            </p>
          </div>
        </div>
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(m: Media) => set("ogImageUrl", m.url)}
      />
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-3 block">
      <span className="mb-1.5 block text-xs font-medium text-gray-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <dt className="text-[11px] text-gray-500">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-semibold capitalize text-white">
        {value}
      </dd>
    </div>
  );
}
