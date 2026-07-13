import type { Author } from "../types";
import { authorsRepo } from "../repositories/authors.repo";
import { auditRepo } from "../repositories/audit.repo";
import type { AuthorInput } from "../validation/author.schema";

type Actor = { id: string; name: string };

export const authorService = {
  getAll(): Promise<Author[]> {
    return authorsRepo.findAll();
  },

  getAllAdmin(): Promise<Author[]> {
    return authorsRepo.findAllAdmin();
  },

  getById(id: string): Promise<Author | null> {
    return authorsRepo.findById(id);
  },

  async save(input: AuthorInput, actor: Actor): Promise<Author | null> {
    const saved = input.id
      ? await authorsRepo.update(input.id, input)
      : await authorsRepo.create(input);
    if (saved) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: input.id ? "update" : "create",
        resource: "authors",
        resourceId: saved.id,
        summary: `${input.id ? "Updated" : "Created"} author “${saved.name}”`,
      });
    }
    return saved;
  },

  async setArchived(id: string, archived: boolean, actor: Actor): Promise<boolean> {
    const ok = await authorsRepo.setArchived(id, archived);
    if (ok) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: archived ? "archive" : "restore",
        resource: "authors",
        resourceId: id,
        summary: archived ? "Archived author" : "Restored author",
      });
    }
    return ok;
  },

  async remove(id: string, actor: Actor): Promise<boolean> {
    const ok = await authorsRepo.remove(id);
    if (ok) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: "delete",
        resource: "authors",
        resourceId: id,
        summary: "Deleted author",
      });
    }
    return ok;
  },
};
