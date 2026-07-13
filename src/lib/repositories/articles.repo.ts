import type { Article, Author, Category } from "../types";
import { supabase, isSupabaseConfigured } from "../supabase";
import { createServerSupabase } from "../db/supabase-server";
import type { ArticleInput } from "../validation/article.schema";
import { estimateReadingTime } from "../util/article";

// ------------------------------------------------------------
// Articles repository — the ONLY place article data is fetched.
// Relations (category, author) are denormalized onto the DTO here,
// so UI components never perform their own data access.
// ------------------------------------------------------------

const SELECT = "*, category:categories(*), author:authors(*)";

function mapCategory(c: any): Category | undefined {
  if (!c) return undefined;
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
    iconName: c.icon_name ?? "Sparkles",
    color: c.color ?? "#a855f7",
    gradient: c.gradient ?? "from-fuchsia-500 to-purple-600",
  };
}

function mapAuthor(a: any): Author | undefined {
  if (!a) return undefined;
  return {
    id: a.id,
    name: a.name,
    role: a.role ?? "",
    avatar: a.avatar_url ?? "",
    bio: a.bio ?? "",
  };
}

function mapRow(row: any): Article {
  const category = mapCategory(row.category);
  const author = mapAuthor(row.author);
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    content: row.content ?? "",
    categorySlug: category?.slug ?? row.category_slug ?? "",
    authorId: row.author_id ?? "",
    publishedAt: String(row.published_at ?? row.created_at ?? "").slice(0, 10),
    updatedAt: row.updated_at
      ? String(row.updated_at).slice(0, 10)
      : undefined,
    readingTime: row.reading_time ?? 1,
    tags: Array.isArray(row.tags)
      ? row.tags.map((t: any) => t?.tag?.name ?? t?.name ?? t).filter(Boolean)
      : [],
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    relatedTool: row.related_tool ?? "none",
    status: row.status ?? "published",
    featured: row.featured ?? false,
    editorsPick: row.editors_pick ?? false,
    trending: row.trending ?? false,
    pinned: row.pinned ?? false,
    views: Number(row.views ?? 0),
    iconName: row.icon_name ?? category?.iconName ?? "Sparkles",
    gradient: row.gradient ?? category?.gradient ?? "from-violet-600 to-purple-700",
    category,
    author,
  };
}

function byNewest(
  a: { publishedAt: string },
  b: { publishedAt: string }
) {
  return b.publishedAt.localeCompare(a.publishedAt);
}

// Input DTO -> DB row.
function toRow(input: ArticleInput, nowIso: string) {
  const publishedAt =
    input.status === "published"
      ? nowIso
      : input.status === "scheduled"
        ? (input.scheduledAt ?? null)
        : null;

  return {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt ?? "",
    content: input.content ?? "",
    category_id: input.categoryId || null,
    author_id: input.authorId || null,
    icon_name: input.iconName,
    gradient: input.gradient,
    status: input.status,
    related_tool: input.relatedTool,
    reading_time: estimateReadingTime(input.content ?? ""),
    featured: input.featured,
    editors_pick: input.editorsPick,
    trending: input.trending,
    pinned: input.pinned,
    seo_title: input.seoTitle || null,
    seo_description: input.seoDescription || null,
    canonical_url: input.canonicalUrl || null,
    og_image_url: input.ogImageUrl || null,
    published_at: publishedAt,
  };
}

export const articlesRepo = {
  async findPublished(limit = 60): Promise<Article[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from("articles")
        .select(SELECT)
        .eq("status", "published")
        .is("deleted_at", null)
        .order("published_at", { ascending: false })
        .limit(limit);
      if (data) return data.map(mapRow);
    }
    return [];
  },

  // Admin: every article regardless of status.
  async findAll(limit = 200): Promise<Article[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from("articles")
        .select(SELECT)
        .is("deleted_at", null)
        .order("updated_at", { ascending: false })
        .limit(limit);
      if (data) return data.map(mapRow);
    }
    return [];
  },

  async findBySlug(slug: string): Promise<Article | null> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from("articles")
        .select(SELECT)
        .eq("slug", slug)
        .single();
      if (data) return mapRow(data);
    }
    return null;
  },

  async findByCategory(categorySlug: string): Promise<Article[]> {
    const all = await this.findPublished();
    return all.filter((a) => a.categorySlug === categorySlug).sort(byNewest);
  },

  async search(query: string): Promise<Article[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from("articles")
        .select(SELECT)
        .eq("status", "published")
        .textSearch("search_tsv", q, { type: "websearch" })
        .limit(20);
      if (data) return data.map(mapRow);
    }
    return (await this.findPublished()).filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  },

  // ---------- Writes (Supabase only; RLS via authenticated server client) ----------

  async findById(id: string): Promise<Article | null> {
    if (!isSupabaseConfigured) return null;
    const db = await createServerSupabase();
    const { data } = await db
      .from("articles")
      .select(SELECT)
      .eq("id", id)
      .single();
    return data ? mapRow(data) : null;
  },

  async create(input: ArticleInput, nowIso: string): Promise<Article | null> {
    if (!isSupabaseConfigured) return null;
    const db = await createServerSupabase();
    const { data, error } = await db
      .from("articles")
      .insert(toRow(input, nowIso))
      .select(SELECT)
      .single();
    if (error || !data) return null;
    return mapRow(data);
  },

  async update(
    id: string,
    input: ArticleInput,
    nowIso: string
  ): Promise<Article | null> {
    if (!isSupabaseConfigured) return null;
    const db = await createServerSupabase();
    const { data, error } = await db
      .from("articles")
      .update(toRow(input, nowIso))
      .eq("id", id)
      .select(SELECT)
      .single();
    if (error || !data) return null;
    return mapRow(data);
  },

  async setStatus(
    id: string,
    status: Article["status"],
    nowIso: string
  ): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const db = await createServerSupabase();
    const patch: Record<string, unknown> = { status };
    if (status === "published") patch.published_at = nowIso;
    const { error } = await db.from("articles").update(patch).eq("id", id);
    return !error;
  },

  async softDelete(id: string, nowIso: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const db = await createServerSupabase();
    const { error } = await db
      .from("articles")
      .update({ deleted_at: nowIso, status: "archived" })
      .eq("id", id);
    return !error;
  },

  async restore(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const db = await createServerSupabase();
    const { error } = await db
      .from("articles")
      .update({ deleted_at: null, status: "draft" })
      .eq("id", id);
    return !error;
  },

  async remove(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const db = await createServerSupabase();
    const { error } = await db.from("articles").delete().eq("id", id);
    return !error;
  },

  async duplicate(id: string, nowIso: string): Promise<Article | null> {
    if (!isSupabaseConfigured) return null;
    const original = await this.findById(id);
    if (!original) return null;
    const input: ArticleInput = {
      title: `${original.title} (copy)`,
      slug: `${original.slug}-copy-${nowIso.slice(11, 19).replace(/:/g, "")}`,
      excerpt: original.excerpt,
      content: original.content,
      categoryId: original.category?.id ?? null,
      authorId: original.authorId || null,
      iconName: original.iconName,
      gradient: original.gradient,
      status: "draft",
      relatedTool: original.relatedTool,
      tags: original.tags,
      featured: false,
      editorsPick: false,
      trending: false,
      pinned: false,
      seoTitle: original.seoTitle ?? "",
      seoDescription: original.seoDescription ?? "",
      focusKeyword: "",
      canonicalUrl: "",
      ogImageUrl: "",
      scheduledAt: null,
    };
    return this.create(input, nowIso);
  },
};
