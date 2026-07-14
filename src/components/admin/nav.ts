import type { Resource } from "../../lib/auth/rbac";

// Sidebar definition — single source so Sidebar + RBAC stay in sync.
export type AdminNavItem = {
  label: string;
  href: string;
  iconName: string; // lucide name resolved by <Icon />
  resource: Resource;
  group?: string;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", iconName: "LayoutDashboard", resource: "dashboard" },
  { label: "Launch", href: "/admin/launch", iconName: "Rocket", resource: "dashboard" },

  { label: "Homepage", href: "/admin/homepage", iconName: "LayoutTemplate", resource: "settings", group: "Appearance" },

  { label: "Articles", href: "/admin/articles", iconName: "FileText", resource: "articles", group: "Content" },
  { label: "Categories", href: "/admin/categories", iconName: "FolderTree", resource: "categories", group: "Content" },
  { label: "Tags", href: "/admin/tags", iconName: "Tag", resource: "tags", group: "Content" },
  { label: "Authors", href: "/admin/authors", iconName: "Users", resource: "authors", group: "Content" },
  { label: "Pages", href: "/admin/pages", iconName: "File", resource: "pages", group: "Content" },
  { label: "Media", href: "/admin/media", iconName: "Image", resource: "media", group: "Content" },
  { label: "Tools", href: "/admin/tools", iconName: "Wrench", resource: "tools", group: "Content" },

  { label: "Comments", href: "/admin/comments", iconName: "MessageSquare", resource: "comments", group: "Community" },
  { label: "Reviews", href: "/admin/reviews", iconName: "Star", resource: "comments", group: "Community" },
  { label: "Newsletter", href: "/admin/newsletter", iconName: "Mail", resource: "newsletter", group: "Community" },

  { label: "Users", href: "/admin/users", iconName: "UserCog", resource: "users", group: "System" },
  { label: "Roles", href: "/admin/roles", iconName: "ShieldCheck", resource: "roles", group: "System" },
  { label: "Analytics", href: "/admin/analytics", iconName: "BarChart3", resource: "analytics", group: "System" },
  { label: "SEO", href: "/admin/seo", iconName: "Search", resource: "seo", group: "System" },
  { label: "Ads", href: "/admin/ads", iconName: "Megaphone", resource: "settings", group: "System" },
  { label: "Settings", href: "/admin/settings", iconName: "Settings", resource: "settings", group: "System" },
  { label: "Audit Logs", href: "/admin/audit-logs", iconName: "ScrollText", resource: "audit_logs", group: "System" },
];
