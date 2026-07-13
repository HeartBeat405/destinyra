"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2, Archive, ArchiveRestore, Star } from "lucide-react";
import type { Category } from "../../lib/types";
import type { CategoryInput } from "../../lib/validation/category.schema";
import { slugify } from "../../lib/util/article";
import {
  saveCategoryAction,
  archiveCategoryAction,
  deleteCategoryAction,
  bulkCategoryAction,
} from "../../lib/actions/category.actions";
import Icon from "../ui/Icon";
import Drawer from "./Drawer";
import {
  TextField,
  TextAreaField,
  SelectField,
  ToggleField,
  ColorField,
} from "./form/Fields";

type Props = { categories: Category[]; devMode: boolean };

function emptyInput(): CategoryInput {
  return {
    name: "",
    slug: "",
    description: "",
    iconName: "Sparkles",
    color: "#6C63FF",
    gradient: "from-fuchsia-500 to-purple-600",
    parentId: null,
    featured: false,
    visible: true,
    order: 0,
    seoTitle: "",
    seoDescription: "",
  };
}

function toInput(c: Category): CategoryInput {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
    iconName: c.iconName,
    color: c.color ?? "#6C63FF",
    gradient: c.gradient,
    parentId: c.parentId ?? null,
    featured: !!c.featured,
    visible: c.visible !== false,
    order: c.order ?? 0,
    seoTitle: c.seoTitle ?? "",
    seoDescription: c.seoDescription ?? "",
  };
}

export default function CategoriesManager({ categories, devMode }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState<CategoryInput>(emptyInput);
  const [slugLocked, setSlugLocked] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.filter(
      (c) => !q || c.name.toLowerCase().includes(q) || c.slug.includes(q)
    );
  }, [categories, query]);

  function set<K extends keyof CategoryInput>(k: K, v: CategoryInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function notify(m: string) {
    setToast(m);
    setTimeout(() => setToast(null), 3500);
  }

  function run(p: Promise<{ ok: boolean; message?: string }>, after?: () => void) {
    startTransition(async () => {
      const res = await p;
      notify(res.message ?? (res.ok ? "Done." : "Failed."));
      if (res.ok) {
        setSelected(new Set());
        after?.();
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

  function openEdit(c: Category) {
    setForm(toInput(c));
    setSlugLocked(true);
    setErrors({});
    setDrawerOpen(true);
  }

  function save() {
    setErrors({});
    startTransition(async () => {
      const res = await saveCategoryAction(form);
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

  const parentOptions = [
    { value: "", label: "— None —" },
    ...categories
      .filter((c) => c.id !== form.id)
      .map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories…"
            className="w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-gray-600"
          />
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          New Category
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

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-sm text-white">
          <span className="font-medium">{selected.size} selected</span>
          <div className="ml-auto flex gap-2">
            <button disabled={pending} onClick={() => run(bulkCategoryAction([...selected], "archive"))} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10"><Archive className="h-3.5 w-3.5" />Archive</button>
            <button disabled={pending} onClick={() => run(bulkCategoryAction([...selected], "restore"))} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10"><ArchiveRestore className="h-3.5 w-3.5" />Restore</button>
            <button disabled={pending} onClick={() => run(bulkCategoryAction([...selected], "delete"))} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10"><Trash2 className="h-3.5 w-3.5" />Delete</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                <th className="w-10 px-4 py-3" />
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Flags</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} className="accent-purple-500" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${c.gradient} text-white`}>
                        <Icon name={c.iconName} className="h-4 w-4" />
                      </span>
                      <div>
                        <button onClick={() => openEdit(c)} className="font-semibold hover:text-purple-200">{c.name}</button>
                        <p className="text-xs text-gray-500">/{c.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{c.order ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {c.featured && <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] text-amber-300"><Star className="h-3 w-3" />Featured</span>}
                      {c.visible === false && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-gray-400">Hidden</span>}
                      {c.archived && <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[11px] text-rose-300">Archived</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button title={c.archived ? "Restore" : "Archive"} disabled={pending} onClick={() => run(archiveCategoryAction(c.id, !c.archived))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white">
                        {c.archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                      </button>
                      <button title="Delete" disabled={pending} onClick={() => run(deleteCategoryAction(c.id))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No categories match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={form.id ? "Edit category" : "New category"}
        footer={
          <div className="flex gap-2">
            <button onClick={save} disabled={pending} className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              {pending ? "Saving…" : "Save category"}
            </button>
            <button onClick={() => setDrawerOpen(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5">Cancel</button>
          </div>
        }
      >
        <div className="space-y-4">
          <TextField
            id="cat-name"
            label="Name"
            required
            value={form.name}
            error={errors.name}
            onChange={(v) => {
              set("name", v);
              if (!slugLocked) set("slug", slugify(v));
            }}
          />
          <TextField
            id="cat-slug"
            label="Slug"
            required
            value={form.slug}
            error={errors.slug}
            onChange={(v) => {
              setSlugLocked(true);
              set("slug", slugify(v));
            }}
          />
          <TextAreaField id="cat-desc" label="Description" value={form.description ?? ""} onChange={(v) => set("description", v)} error={errors.description} />

          <div className="grid grid-cols-2 gap-3">
            <TextField id="cat-icon" label="Icon (lucide)" value={form.iconName} onChange={(v) => set("iconName", v)} />
            <TextField id="cat-order" label="Order" type="number" value={String(form.order ?? 0)} onChange={(v) => set("order", Number(v) || 0)} />
          </div>

          <TextField id="cat-grad" label="Gradient (tailwind)" value={form.gradient} onChange={(v) => set("gradient", v)} hint="e.g. from-fuchsia-500 to-purple-600" />
          <ColorField id="cat-color" label="Accent color" value={form.color ?? ""} onChange={(v) => set("color", v)} />
          <SelectField id="cat-parent" label="Parent category" value={form.parentId ?? ""} onChange={(v) => set("parentId", v || null)} options={parentOptions} />

          <div className="grid grid-cols-2 gap-3">
            <ToggleField id="cat-featured" label="Featured" checked={!!form.featured} onChange={(v) => set("featured", v)} />
            <ToggleField id="cat-visible" label="Visible" checked={form.visible !== false} onChange={(v) => set("visible", v)} />
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">SEO</p>
            <div className="space-y-4">
              <TextField id="cat-seo-title" label="SEO title" value={form.seoTitle ?? ""} onChange={(v) => set("seoTitle", v)} error={errors.seoTitle} />
              <TextAreaField id="cat-seo-desc" label="Meta description" value={form.seoDescription ?? ""} onChange={(v) => set("seoDescription", v)} error={errors.seoDescription} rows={2} />
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
