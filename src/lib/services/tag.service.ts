import type { Tag } from "../types";
import { tagsRepo } from "../repositories/tags.repo";
import { auditRepo } from "../repositories/audit.repo";
import type { TagInput } from "../validation/tag.schema";

type Actor = { id: string; name: string };

export const tagService = {
  getAll(): Promise<Tag[]> {
    return tagsRepo.findAll();
  },

  getAllAdmin(): Promise<Tag[]> {
    return tagsRepo.findAllAdmin();
  },

  async save(input: TagInput, actor: Actor): Promise<Tag | null> {
    const saved = input.id
      ? await tagsRepo.update(input.id, input)
      : await tagsRepo.create(input);
    if (saved) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: input.id ? "update" : "create",
        resource: "tags",
        resourceId: saved.id,
        summary: `${input.id ? "Updated" : "Created"} tag “${saved.name}”`,
      });
    }
    return saved;
  },

  async setArchived(id: string, archived: boolean, actor: Actor): Promise<boolean> {
    const ok = await tagsRepo.setArchived(id, archived);
    if (ok) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: archived ? "archive" : "restore",
        resource: "tags",
        resourceId: id,
        summary: archived ? "Archived tag" : "Restored tag",
      });
    }
    return ok;
  },

  async remove(id: string, actor: Actor): Promise<boolean> {
    const ok = await tagsRepo.remove(id);
    if (ok) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: "delete",
        resource: "tags",
        resourceId: id,
        summary: "Deleted tag",
      });
    }
    return ok;
  },

  async merge(sourceIds: string[], targetId: string, actor: Actor): Promise<boolean> {
    const ok = await tagsRepo.merge(sourceIds, targetId);
    if (ok) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: "update",
        resource: "tags",
        resourceId: targetId,
        summary: `Merged ${sourceIds.length} tag(s) into target`,
      });
    }
    return ok;
  },
};
