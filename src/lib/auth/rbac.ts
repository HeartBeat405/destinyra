// ============================================================
// Role-Based Access Control (RBAC)
// ------------------------------------------------------------
// Single source of truth for "who can do what". UI and server
// actions both call can(role, action, resource). Mirrors the
// `user_role` enum in supabase/schema.sql.
// ============================================================

export type Role =
  | "guest"
  | "member"
  | "author"
  | "editor"
  | "moderator"
  | "admin"
  | "super_admin";

export type Resource =
  | "dashboard"
  | "articles"
  | "categories"
  | "tags"
  | "authors"
  | "pages"
  | "media"
  | "tools"
  | "comments"
  | "newsletter"
  | "users"
  | "roles"
  | "analytics"
  | "seo"
  | "settings"
  | "audit_logs";

export type Action =
  | "view"
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "manage";

type Grant = `${Resource}:${Action}` | `${Resource}:*` | "*";

// Permission matrix. "*" = everything; "resource:*" = all actions on it.
const MATRIX: Record<Role, Grant[]> = {
  super_admin: ["*"],
  admin: [
    "dashboard:view",
    "articles:*",
    "categories:*",
    "tags:*",
    "authors:*",
    "pages:*",
    "media:*",
    "tools:*",
    "comments:*",
    "newsletter:*",
    "users:*",
    "analytics:*",
    "seo:*",
    "settings:*",
    "audit_logs:view",
  ],
  editor: [
    "dashboard:view",
    "articles:*",
    "categories:*",
    "tags:*",
    "authors:view",
    "pages:*",
    "media:*",
    "tools:view",
    "comments:view",
    "comments:publish",
    "seo:view",
    "analytics:view",
  ],
  moderator: [
    "dashboard:view",
    "articles:view",
    "comments:*",
    "newsletter:view",
  ],
  author: [
    "dashboard:view",
    "articles:view",
    "articles:create",
    "articles:update",
    "media:view",
    "media:create",
  ],
  member: [],
  guest: [],
};

export function can(role: Role, action: Action, resource: Resource): boolean {
  const grants = MATRIX[role] ?? [];
  return grants.some(
    (g) =>
      g === "*" ||
      g === `${resource}:*` ||
      g === `${resource}:${action}`
  );
}

/** Can this role reach the admin panel at all? */
export function canAccessAdmin(role: Role): boolean {
  return can(role, "view", "dashboard");
}
