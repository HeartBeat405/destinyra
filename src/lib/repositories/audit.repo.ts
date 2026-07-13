import { isSupabaseConfigured } from "../supabase";
import { createServerSupabase } from "../db/supabase-server";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "archive"
  | "restore"
  | "duplicate";

export type AuditEntry = {
  actorId?: string | null;
  actorName?: string | null;
  action: AuditAction;
  resource: string;
  resourceId?: string | null;
  summary?: string;
  meta?: Record<string, unknown>;
};

export type AuditLog = AuditEntry & {
  id: number;
  createdAt: string;
};

export const auditRepo = {
  // Fire-and-forget: auditing must never block or fail the main action.
  async log(entry: AuditEntry): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      const supabase = await createServerSupabase();
      await supabase.from("audit_logs").insert({
        actor_id: entry.actorId ?? null,
        actor_name: entry.actorName ?? null,
        action: entry.action,
        resource: entry.resource,
        resource_id: entry.resourceId ?? null,
        summary: entry.summary ?? null,
        meta: entry.meta ?? {},
      });
    } catch {
      // Swallow — never let audit failures break the user action.
    }
  },

  async recent(limit = 50): Promise<AuditLog[]> {
    if (!isSupabaseConfigured) return [];
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data ?? []).map((r: any) => ({
      id: r.id,
      actorId: r.actor_id,
      actorName: r.actor_name,
      action: r.action,
      resource: r.resource,
      resourceId: r.resource_id,
      summary: r.summary ?? "",
      meta: r.meta ?? {},
      createdAt: r.created_at,
    }));
  },
};
