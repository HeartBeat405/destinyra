"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Trash2,
  Archive,
  ArchiveRestore,
  Star,
  Merge,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Tag } from "../../lib/types";
import type { TagInput } from "../../lib/validation/tag.schema";
import { slugify } from "../../lib/util/article";
import {
  saveTagAction,
  archiveTagAction,
  deleteTagAction,
  bulkTagAction,
  mergeTagsAction,
} from "../../lib/actions/tag.actions";
import Drawer from "./Drawer";
import { TextField, TextAreaField, ToggleField } from "./form/Fields";

type Props = { tags: Tag[]; devMode: boolean };
type SortKey = "name" | "usageCount";
const PAGE_SIZE = 12;

function emptyInput(): TagInput {
  return {
    name: "",
    slug: "",
    description: "",
    featured: false,
    visible: true,
    order: 0,
    seoTitle: "",
    seoDescription: "",
  };
}
function toInput(t: Tag): TagInput {
  return {
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description ?? "",
    featured: !!t.featured,
    visible: t.visible !== false,
    order: t.order ?? 0,
    seoTitle: t.seoTitle ?? "",
    seoDescription: t.seoDescription ?? "",
  };
}

export default function TagsManager({ tags, devMode }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("usageCount");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [mergeTarget, setMergeTarget] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState<TagInput>(emptyInput);
  const [slugLocked, setSlugLocked] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = tags.filter(
      (t) => !q || t.name.toLowerCase().includes(q) || t.slug.includes(q)
    );
    rows.sort((a, b) => {
      const cmp =
        sortKey === "name"
          ? a.name.localeCompare(b.name)
          : a.usageCount - b.usageCount;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [tags, query, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const rows = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  function set<K extends keyof TagInput>(k: K, v: TagInput[K]) {
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
        setMergeTarget("");
        router.refresh();
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
  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("desc");
    }
  }
  function openNew() {
    setForm(emptyInput());
    setSlugLocked(false);
    setErrors({});
    setDrawerOpen(true);
  }
  function openEdit(t: Tag) {
    setForm(toInput(t));
    setSlugLocked(true);
    setErrors({});
    setDrawerOpen(true);
  }
  function save() {
    setErrors({});
    startTransition(async () => {
      const res = await saveTagAction(form);
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

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 hover:text-white">
      {label}
      <ArrowUpDown className="h-3 w-3 opacity-50" />
    </button>
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search tags…"
            className="w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-gray-600"
          />
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" />
          New Tag
        </button>
      </div>

      {devMode && (
        <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-200">
          Dev mode — tags derived from seed articles. Saving/merging needs Supabase.
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
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {/* Merge */}
            <select
              value={mergeTarget}
              onChange={(e) => setMergeTarget(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs"
            >
              <option value="" className="bg-[#0b0b18]">Merge into…</option>
              {tags
                .filter((t) => !selected.has(t.id))
                .map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#0b0b18]">{t.name}</option>
                ))}
            </select>
            <button
              disabled={pending || !mergeTarget}
              onClick={() => run(mergeTagsAction([...selected], mergeTarget))}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10 disabled:opacity-40"
            >
              <Merge className="h-3.5 w-3.5" />Merge
            </button>
            <button disabled={pending} onClick={() => run(bulkTagAction([...selected], "archive"))} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10"><Archive className="h-3.5 w-3.5" />Archive</button>
            <button disabled={pending} onClick={() => run(bulkTagAction([...selected], "restore"))} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10"><ArchiveRestore className="h-3.5 w-3.5" />Restore</button>
            <button disabled={pending} onClick={() => run(bulkTagAction([...selected], "delete"))} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10"><Trash2 className="h-3.5 w-3.5" />Delete</button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                <th className="w-10 px-4 py-3" />
                <th className="px-4 py-3 font-semibold"><SortHeader label="Tag" k="name" /></th>
                <th className="px-4 py-3 font-semibold"><SortHeader label="Usage" k="usageCount" /></th>
                <th className="px-4 py-3 font-semibold">Flags</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(t.id)} onChange={() => toggle(t.id)} className="accent-purple-500" />
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(t)} className="font-semibold hover:text-purple-200">#{t.name}</button>
                    <p className="text-xs text-gray-500">/{t.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{t.usageCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {t.featured && <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] text-amber-300"><Star className="h-3 w-3" />Featured</span>}
                      {t.visible === false && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-gray-400">Hidden</span>}
                      {t.archived && <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[11px] text-rose-300">Archived</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button title={t.archived ? "Restore" : "Archive"} disabled={pending} onClick={() => run(archiveTagAction(t.id, !t.archived))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white">
                        {t.archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                      </button>
                      <button title="Delete" disabled={pending} onClick={() => run(deleteTagAction(t.id))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No tags match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <span>{filtered.length} tag(s)</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={current === 0} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
          <span>{current + 1} / {pageCount}</span>
          <button onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={current >= pageCount - 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={form.id ? "Edit tag" : "New tag"}
        footer={
          <div className="flex gap-2">
            <button onClick={save} disabled={pending} className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              {pending ? "Saving…" : "Save tag"}
            </button>
            <button onClick={() => setDrawerOpen(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5">Cancel</button>
          </div>
        }
      >
        <div className="space-y-4">
          <TextField id="tag-name" label="Name" required value={form.name} error={errors.name} onChange={(v) => { set("name", v); if (!slugLocked) set("slug", slugify(v)); }} />
          <TextField id="tag-slug" label="Slug" required value={form.slug} error={errors.slug} onChange={(v) => { setSlugLocked(true); set("slug", slugify(v)); }} />
          <TextAreaField id="tag-desc" label="Description" value={form.description ?? ""} onChange={(v) => set("description", v)} error={errors.description} rows={2} />
          <div className="grid grid-cols-2 gap-3">
            <ToggleField id="tag-featured" label="Featured" checked={!!form.featured} onChange={(v) => set("featured", v)} />
            <ToggleField id="tag-visible" label="Visible" checked={form.visible !== false} onChange={(v) => set("visible", v)} />
          </div>
          <div className="border-t border-white/10 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">SEO</p>
            <div className="space-y-4">
              <TextField id="tag-seo-title" label="SEO title" value={form.seoTitle ?? ""} onChange={(v) => set("seoTitle", v)} error={errors.seoTitle} />
              <TextAreaField id="tag-seo-desc" label="Meta description" value={form.seoDescription ?? ""} onChange={(v) => set("seoDescription", v)} error={errors.seoDescription} rows={2} />
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
