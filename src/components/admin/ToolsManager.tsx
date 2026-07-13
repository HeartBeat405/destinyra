"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2, Archive, ArchiveRestore, Star } from "lucide-react";
import type { Tool, Category } from "../../lib/types";
import type { ToolInput } from "../../lib/validation/tool.schema";
import { TOOL_STATUSES } from "../../lib/validation/tool.schema";
import { slugify } from "../../lib/util/article";
import {
  saveToolAction,
  archiveToolAction,
  deleteToolAction,
  bulkToolAction,
} from "../../lib/actions/tool.actions";
import Icon from "../ui/Icon";
import StatusBadge from "./StatusBadge";
import Drawer from "./Drawer";
import {
  TextField,
  TextAreaField,
  SelectField,
  ToggleField,
  ColorField,
} from "./form/Fields";

type Props = { tools: Tool[]; categories: Category[]; devMode: boolean };

function emptyInput(): ToolInput {
  return {
    name: "",
    slug: "",
    description: "",
    iconName: "Sparkles",
    gradient: "from-violet-600 to-purple-700",
    color: "#6C63FF",
    buttonText: "Open",
    buttonLink: "",
    status: "future",
    categoryId: null,
    featured: false,
    visible: true,
    order: 0,
    seoTitle: "",
    seoDescription: "",
  };
}

function toInput(t: Tool): ToolInput {
  return {
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description ?? "",
    iconName: t.iconName,
    gradient: t.gradient,
    color: t.color ?? "#6C63FF",
    buttonText: t.buttonText ?? "Open",
    buttonLink: t.buttonLink ?? "",
    status: t.status,
    categoryId: t.categoryId ?? null,
    featured: !!t.featured,
    visible: t.visible !== false,
    order: t.order ?? 0,
    seoTitle: t.seoTitle ?? "",
    seoDescription: t.seoDescription ?? "",
  };
}

export default function ToolsManager({ tools, categories, devMode }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState<ToolInput>(emptyInput);
  const [slugLocked, setSlugLocked] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter(
      (t) => !q || t.name.toLowerCase().includes(q) || t.slug.includes(q)
    );
  }, [tools, query]);

  function set<K extends keyof ToolInput>(k: K, v: ToolInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function notify(m: string) {
    setToast(m);
    setTimeout(() => setToast(null), 3500);
  }
  function run(p: Promise<{ ok: boolean; message?: string }>) {
    startTransition(async () => {
      const res = await p;
      notify(res.message ?? (res.ok ? "Done." : "Failed."));
      if (res.ok) {
        setSelected(new Set());
        router.refresh();
      }
    });
  }
  function openNew() {
    setForm(emptyInput());
    setSlugLocked(false);
    setErrors({});
    setDrawerOpen(true);
  }
  function openEdit(t: Tool) {
    setForm(toInput(t));
    setSlugLocked(true);
    setErrors({});
    setDrawerOpen(true);
  }
  function save() {
    setErrors({});
    startTransition(async () => {
      const res = await saveToolAction(form);
      if (res.ok) {
        notify(res.message ?? "Saved.");
        setDrawerOpen(false);
        router.refresh();
      } else {
        if (res.fieldErrors) setErrors(res.fieldErrors);
        notify(res.message ?? "Failed.");
      }
    });
  }
  function toggle(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  const categoryOptions = [
    { value: "", label: "— None —" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];
  const statusOptions = TOOL_STATUSES.map((s) => ({ value: s, label: s }));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            className="w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-gray-600"
          />
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          New Tool
        </button>
      </div>

      {devMode && (
        <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-200">
          Dev mode — editing is interactive, but saving needs Supabase.
        </div>
      )}
      {toast && (
        <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200">
          {toast}
        </div>
      )}

      {selected.size > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-sm text-white">
          <span className="font-medium">{selected.size} selected</span>
          <div className="ml-auto flex gap-2">
            <button disabled={pending} onClick={() => run(bulkToolAction([...selected], "archive"))} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10"><Archive className="h-3.5 w-3.5" />Archive</button>
            <button disabled={pending} onClick={() => run(bulkToolAction([...selected], "restore"))} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10"><ArchiveRestore className="h-3.5 w-3.5" />Restore</button>
            <button disabled={pending} onClick={() => run(bulkToolAction([...selected], "delete"))} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10"><Trash2 className="h-3.5 w-3.5" />Delete</button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                <th className="w-10 px-4 py-3" />
                <th className="px-4 py-3 font-semibold">Tool</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Flags</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(t.id)} onChange={() => toggle(t.id)} className="accent-purple-500" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${t.gradient} text-white`}>
                        <Icon name={t.iconName} className="h-4 w-4" />
                      </span>
                      <div>
                        <button onClick={() => openEdit(t)} className="font-semibold hover:text-purple-200">{t.name}</button>
                        <p className="text-xs text-gray-500">/{t.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {t.featured && <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] text-amber-300"><Star className="h-3 w-3" />Featured</span>}
                      {t.visible === false && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-gray-400">Hidden</span>}
                      {t.archived && <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[11px] text-rose-300">Archived</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button title={t.archived ? "Restore" : "Archive"} disabled={pending} onClick={() => run(archiveToolAction(t.id, !t.archived))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white">
                        {t.archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                      </button>
                      <button title="Delete" disabled={pending} onClick={() => run(deleteToolAction(t.id))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No tools match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={form.id ? "Edit tool" : "New tool"}
        footer={
          <div className="flex gap-2">
            <button onClick={save} disabled={pending} className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              {pending ? "Saving…" : "Save tool"}
            </button>
            <button onClick={() => setDrawerOpen(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5">Cancel</button>
          </div>
        }
      >
        <div className="space-y-4">
          <TextField id="tool-name" label="Name" required value={form.name} error={errors.name} onChange={(v) => { set("name", v); if (!slugLocked) set("slug", slugify(v)); }} />
          <TextField id="tool-slug" label="Slug" required value={form.slug} error={errors.slug} onChange={(v) => { setSlugLocked(true); set("slug", slugify(v)); }} />
          <TextAreaField id="tool-desc" label="Description" value={form.description ?? ""} onChange={(v) => set("description", v)} error={errors.description} />

          <div className="grid grid-cols-2 gap-3">
            <TextField id="tool-icon" label="Icon (lucide)" value={form.iconName} onChange={(v) => set("iconName", v)} />
            <TextField id="tool-order" label="Order" type="number" value={String(form.order ?? 0)} onChange={(v) => set("order", Number(v) || 0)} />
          </div>

          <TextField id="tool-grad" label="Gradient (tailwind)" value={form.gradient} onChange={(v) => set("gradient", v)} hint="e.g. from-violet-600 to-purple-700" />
          <ColorField id="tool-color" label="Accent color" value={form.color ?? ""} onChange={(v) => set("color", v)} />

          <div className="grid grid-cols-2 gap-3">
            <SelectField id="tool-status" label="Status" value={form.status} onChange={(v) => set("status", v as ToolInput["status"])} options={statusOptions} />
            <SelectField id="tool-cat" label="Category" value={form.categoryId ?? ""} onChange={(v) => set("categoryId", v || null)} options={categoryOptions} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextField id="tool-btn-text" label="Button text" value={form.buttonText ?? ""} onChange={(v) => set("buttonText", v)} />
            <TextField id="tool-btn-link" label="Button link" value={form.buttonLink ?? ""} onChange={(v) => set("buttonLink", v)} hint="/tools/…" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ToggleField id="tool-featured" label="Featured" checked={!!form.featured} onChange={(v) => set("featured", v)} />
            <ToggleField id="tool-visible" label="Visible" checked={form.visible !== false} onChange={(v) => set("visible", v)} />
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">SEO</p>
            <div className="space-y-4">
              <TextField id="tool-seo-title" label="SEO title" value={form.seoTitle ?? ""} onChange={(v) => set("seoTitle", v)} error={errors.seoTitle} />
              <TextAreaField id="tool-seo-desc" label="Meta description" value={form.seoDescription ?? ""} onChange={(v) => set("seoDescription", v)} error={errors.seoDescription} rows={2} />
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
