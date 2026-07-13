import type { Article } from "../types";
import { articlesRepo } from "../repositories/articles.repo";
import { auditRepo } from "../repositories/audit.repo";
import type { ArticleInput } from "../validation/article.schema";

type Actor = { id: string; name: string };

// Business logic for articles. Composes the repository; holds the rules
// for what "featured", "trending", "popular", and "related" mean.
export const articleService = {
  getAll(limit = 60): Promise<Article[]> {
    return articlesRepo.findPublished(limit);
  },

  getBySlug(slug: string): Promise<Article | null> {
    return articlesRepo.findBySlug(slug);
  },

  getById(id: string): Promise<Article | null> {
    return articlesRepo.findById(id);
  },

  // ---------- Writes (compose repo + audit) ----------

  async create(input: ArticleInput, actor: Actor): Promise<Article | null> {
    const now = new Date().toISOString();
    const created = await articlesRepo.create(input, now);
    if (created) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: "create",
        resource: "articles",
        resourceId: created.id,
        summary: `Created “${created.title}”`,
      });
    }
    return created;
  },

  async update(
    id: string,
    input: ArticleInput,
    actor: Actor
  ): Promise<Article | null> {
    const now = new Date().toISOString();
    const updated = await articlesRepo.update(id, input, now);
    if (updated) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: "update",
        resource: "articles",
        resourceId: id,
        summary: `Updated “${updated.title}”`,
      });
    }
    return updated;
  },

  async setStatus(
    id: string,
    status: Article["status"],
    actor: Actor
  ): Promise<boolean> {
    const now = new Date().toISOString();
    const ok = await articlesRepo.setStatus(id, status, now);
    if (ok) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: status === "published" ? "publish" : "update",
        resource: "articles",
        resourceId: id,
        summary: `Set status to ${status}`,
      });
    }
    return ok;
  },

  async softDelete(id: string, actor: Actor): Promise<boolean> {
    const now = new Date().toISOString();
    const ok = await articlesRepo.softDelete(id, now);
    if (ok) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: "delete",
        resource: "articles",
        resourceId: id,
        summary: "Moved to trash (soft delete)",
      });
    }
    return ok;
  },

  async restore(id: string, actor: Actor): Promise<boolean> {
    const ok = await articlesRepo.restore(id);
    if (ok) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: "restore",
        resource: "articles",
        resourceId: id,
        summary: "Restored from trash",
      });
    }
    return ok;
  },

  async remove(id: string, actor: Actor): Promise<boolean> {
    const ok = await articlesRepo.remove(id);
    if (ok) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: "delete",
        resource: "articles",
        resourceId: id,
        summary: "Permanently deleted",
      });
    }
    return ok;
  },

  async duplicate(id: string, actor: Actor): Promise<Article | null> {
    const now = new Date().toISOString();
    const copy = await articlesRepo.duplicate(id, now);
    if (copy) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: "duplicate",
        resource: "articles",
        resourceId: copy.id,
        summary: `Duplicated into “${copy.title}”`,
      });
    }
    return copy;
  },

  getByCategory(categorySlug: string): Promise<Article[]> {
    return articlesRepo.findByCategory(categorySlug);
  },

  search(query: string): Promise<Article[]> {
    return articlesRepo.search(query);
  },

  async getFeatured(limit = 3): Promise<Article[]> {
    const all = await articlesRepo.findPublished();
    return all.filter((a) => a.featured).slice(0, limit);
  },

  async getEditorsPick(): Promise<Article | null> {
    const all = await articlesRepo.findPublished();
    return all.find((a) => a.editorsPick) ?? null;
  },

  async getTrending(limit = 4): Promise<Article[]> {
    const all = await articlesRepo.findPublished();
    return all
      .filter((a) => a.trending)
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  },

  async getLatest(limit = 6): Promise<Article[]> {
    const all = await articlesRepo.findPublished();
    return all.slice(0, limit);
  },

  async getPopular(limit = 5): Promise<Article[]> {
    const all = await articlesRepo.findPublished();
    return [...all].sort((a, b) => b.views - a.views).slice(0, limit);
  },

  async getRelated(article: Article, limit = 3): Promise<Article[]> {
    const all = await articlesRepo.findPublished();
    const same = all.filter(
      (a) => a.id !== article.id && a.categorySlug === article.categorySlug
    );
    const others = all.filter(
      (a) => a.id !== article.id && a.categorySlug !== article.categorySlug
    );
    return [...same, ...others].slice(0, limit);
  },
};
