import type { Tool } from "../types";
import { toolsRepo } from "../repositories/tools.repo";
import { auditRepo } from "../repositories/audit.repo";
import type { ToolInput } from "../validation/tool.schema";

type Actor = { id: string; name: string };

export const toolService = {
  getAll(): Promise<Tool[]> {
    return toolsRepo.findAll();
  },

  getAllAdmin(): Promise<Tool[]> {
    return toolsRepo.findAllAdmin();
  },

  getBySlug(slug: string): Promise<Tool | null> {
    return toolsRepo.findBySlug(slug);
  },

  // ---------- Writes (compose repo + audit) ----------
  async save(input: ToolInput, actor: Actor): Promise<Tool | null> {
    const saved = input.id
      ? await toolsRepo.update(input.id, input)
      : await toolsRepo.create(input);
    if (saved) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: input.id ? "update" : "create",
        resource: "tools",
        resourceId: saved.id,
        summary: `${input.id ? "Updated" : "Created"} tool “${saved.name}”`,
      });
    }
    return saved;
  },

  async setArchived(id: string, archived: boolean, actor: Actor): Promise<boolean> {
    const ok = await toolsRepo.setArchived(id, archived);
    if (ok) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: archived ? "archive" : "restore",
        resource: "tools",
        resourceId: id,
        summary: archived ? "Archived tool" : "Restored tool",
      });
    }
    return ok;
  },

  async remove(id: string, actor: Actor): Promise<boolean> {
    const ok = await toolsRepo.remove(id);
    if (ok) {
      await auditRepo.log({
        actorId: actor.id,
        actorName: actor.name,
        action: "delete",
        resource: "tools",
        resourceId: id,
        summary: "Deleted tool",
      });
    }
    return ok;
  },
};
