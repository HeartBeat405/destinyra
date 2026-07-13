import type { Category } from "../types";
import { categoriesRepo } from "../repositories/categories.repo";
import { articlesRepo } from "../repositories/articles.repo";
import { auditRepo } from "../repositories/audit.repo";
import type { CategoryInput } from "../validation/category.schema";

type Actor = { id: string; name: string };

export type CategoryWithCount = Category & { count: number };

export const categoryService = {
  getAll(): Promise<Category[]> {
    return categoriesRepo.findAll();
  },

  getAllAdmin(): Promise<Category[]> {
    return categoriesRepo.findAllAdmin();
  },

  getBySlug(slug: string): Promise<Category | null> {
    return categoriesRepo.findBySlug(slug);
  },

  // ---------- Writes (compose repo + audit) ----------
  async save(input: CategoryInput, actor: Actor): Promise<Category | null> {
    const saved = input.id
      ? await categoriesRepo.update(input.id, input)
      : await categoriesRepo.create(input);
    if (saved) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: input.id ? "update" : "create",
        resource: "categories",
        resourceId: saved.id,
        summary: `${input.id ? "Updated" : "Created"} category “${saved.name}”`,
      });
    }
    return saved;
  },

  async setArchived(id: string, archived: boolean, actor: Actor): Promise<boolean> {
    const ok = await categoriesRepo.setArchived(id, archived);
    if (ok) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: archived ? "archive" : "restore",
        resource: "categories",
        resourceId: id,
        summary: archived ? "Archived category" : "Restored category",
      });
    }
    return ok;
  },

  async remove(id: string, actor: Actor): Promise<boolean> {
    const ok = await categoriesRepo.remove(id);
    if (ok) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: "delete",
        resource: "categories",
        resourceId: id,
        summary: "Deleted category",
      });
    }
    return ok;
  },

  async getPopular(limit = 6): Promise<CategoryWithCount[]> {
    const [cats, articles] = await Promise.all([
      categoriesRepo.findAll(),
      articlesRepo.findPublished(),
    ]);
    return cats
      .map((c) => ({
        ...c,
        count: articles.filter((a) => a.categorySlug === c.slug).length,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },
};
