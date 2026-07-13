"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2, Archive, ArchiveRestore, Star } from "lucide-react";
import type { Author } from "../../lib/types";
import type { AuthorInput } from "../../lib/validation/author.schema";
import {
  saveAuthorAction,
  archiveAuthorAction,
  deleteAuthorAction,
  bulkAuthorAction,
} from "../../lib/actions/author.actions";
import Drawer from "./Drawer";
import { TextField, TextAreaField, ToggleField } from "./form/Fields";

type Props = { authors: Author[]; devMode: boolean };

function emptyInput(): AuthorInput {
  return {
    name: "",
    role: "",
    bio: "",
    avatarUrl: "",
    website: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    featured: false,
    visible: true,
    order: 0,
    seoTitle: "",
    seoDescription: "",
  };
}
function toInput(a: Author): AuthorInput {
  return {
    id: a.id,
    name: a.name,
    role: a.role ?? "",
    bio: a.bio ?? "",
    avatarUrl: a.avatarUrl ?? "",
    website: a.website ?? "",
    twitter: a.twitter ?? "",
    instagram: a.instagram ?? "",
    linkedin: a.linkedin ?? "",
    featured: !!a.featured,
    visible: a.visible !== false,
    order: a.order ?? 0,
    seoTitle: a.seoTitle ?? "",
    seoDescription: a.seoDescription ?? "",
  };
}

export default function AuthorsManager({ authors, devMode }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState<AuthorInput>(emptyInput);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return authors.filter(
      (a) => !q || a.name.toLowerCase().includes(q) || (a.role ?? "").toLowerCase().includes(q)
    );
  }, [authors, query]);

  function set<K extends keyof AuthorInput>(k: K, v: AuthorInput[K]) {
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
  function toggle(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }
  function openNew() {
    setForm(emptyInput());
    setErrors({});
    setDrawerOpen(true);
  }
  function openEdit(a: Author) {
    setForm(toInput(a));
    setErrors({});
    setDrawerOpen(true);
  }
  function save() {
    setErrors({});
    startTransition(async () => {
      const res = await saveAuthorAction(form);
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

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search authors…"
            className="w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-gray-600"
          />
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" />
          New Author
        </button>
      </div>

      {devMode && (
        <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-200">
          Dev mode — editing is interactive, but saving needs Supabase.
        </div>
      )}
      {toast && (
        <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200">{toast}</div>
      )}

      {selected.size > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-sm text-white">
          <span className="font-medium">{selected.size} selected</span>
          <div className="ml-auto flex gap-2">
            <button disabled={pending} onClick={() => run(bulkAuthorAction([...selected], "archive"))} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10"><Archive className="h-3.5 w-3.5" />Archive</button>
            <button disabled={pending} onClick={() => run(bulkAuthorAction([...selected], "restore"))} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10"><ArchiveRestore className="h-3.5 w-3.5" />Restore</button>
            <button disabled={pending} onClick={() => run(bulkAuthorAction([...selected], "delete"))} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10"><Trash2 className="h-3.5 w-3.5" />Delete</button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                <th className="w-10 px-4 py-3" />
                <th className="px-4 py-3 font-semibold">Author</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Flags</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(a.id)} onChange={() => toggle(a.id)} className="accent-purple-500" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-sm font-bold">
                        {a.name.charAt(0)}
                      </span>
                      <button onClick={() => openEdit(a)} className="font-semibold hover:text-purple-200">{a.name}</button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{a.role || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {a.featured && <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] text-amber-300"><Star className="h-3 w-3" />Featured</span>}
                      {a.visible === false && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-gray-400">Hidden</span>}
                      {a.archived && <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[11px] text-rose-300">Archived</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button title={a.archived ? "Restore" : "Archive"} disabled={pending} onClick={() => run(archiveAuthorAction(a.id, !a.archived))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white">
                        {a.archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                      </button>
                      <button title="Delete" disabled={pending} onClick={() => run(deleteAuthorAction(a.id))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No authors match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={form.id ? "Edit author" : "New author"}
        footer={
          <div className="flex gap-2">
            <button onClick={save} disabled={pending} className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              {pending ? "Saving…" : "Save author"}
            </button>
            <button onClick={() => setDrawerOpen(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5">Cancel</button>
          </div>
        }
      >
        <div className="space-y-4">
          <TextField id="au-name" label="Name" required value={form.name} error={errors.name} onChange={(v) => set("name", v)} />
          <TextField id="au-role" label="Role" value={form.role ?? ""} onChange={(v) => set("role", v)} />
          <TextAreaField id="au-bio" label="Biography" value={form.bio ?? ""} onChange={(v) => set("bio", v)} error={errors.bio} rows={3} />
          <TextField id="au-avatar" label="Avatar URL" value={form.avatarUrl ?? ""} onChange={(v) => set("avatarUrl", v)} error={errors.avatarUrl} />

          <div className="border-t border-white/10 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Social links</p>
            <div className="space-y-4">
              <TextField id="au-website" label="Website" value={form.website ?? ""} onChange={(v) => set("website", v)} error={errors.website} />
              <div className="grid grid-cols-2 gap-3">
                <TextField id="au-twitter" label="Twitter / X" value={form.twitter ?? ""} onChange={(v) => set("twitter", v)} />
                <TextField id="au-instagram" label="Instagram" value={form.instagram ?? ""} onChange={(v) => set("instagram", v)} />
              </div>
              <TextField id="au-linkedin" label="LinkedIn" value={form.linkedin ?? ""} onChange={(v) => set("linkedin", v)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ToggleField id="au-featured" label="Featured author" checked={!!form.featured} onChange={(v) => set("featured", v)} />
            <ToggleField id="au-visible" label="Visible" checked={form.visible !== false} onChange={(v) => set("visible", v)} />
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">SEO</p>
            <div className="space-y-4">
              <TextField id="au-seo-title" label="SEO title" value={form.seoTitle ?? ""} onChange={(v) => set("seoTitle", v)} error={errors.seoTitle} />
              <TextAreaField id="au-seo-desc" label="Meta description" value={form.seoDescription ?? ""} onChange={(v) => set("seoDescription", v)} error={errors.seoDescription} rows={2} />
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
