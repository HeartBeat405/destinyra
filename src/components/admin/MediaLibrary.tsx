"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  X,
  FileText,
  Film,
  ImageIcon,
} from "lucide-react";
import type { Media } from "../../lib/types";
import {
  uploadMediaAction,
  updateMediaAction,
  deleteMediaAction,
  bulkDeleteMediaAction,
  moveMediaAction,
} from "../../lib/actions/media.actions";

type Props = {
  initialMedia: Media[];
  folders: string[];
  unusedIds: string[];
  devMode: boolean;
};

const PAGE_SIZE = 12;

function MediaThumb({ m, className = "" }: { m: Media; className?: string }) {
  if (m.type === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={m.url}
        alt={m.alt || m.name}
        loading="lazy"
        decoding="async"
        className={`object-cover ${className}`}
      />
    );
  }
  const Icon = m.type === "video" ? Film : FileText;
  return (
    <div className={`flex items-center justify-center bg-white/5 ${className}`}>
      <Icon className="h-8 w-8 text-gray-500" />
    </div>
  );
}

export default function MediaLibrary({
  initialMedia,
  folders,
  unusedIds,
  devMode,
}: Props) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [folder, setFolder] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [onlyUnused, setOnlyUnused] = useState(false);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<Media | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const unused = useMemo(() => new Set(unusedIds), [unusedIds]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const m of initialMedia) c[m.folder] = (c[m.folder] ?? 0) + 1;
    return c;
  }, [initialMedia]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialMedia.filter((m) => {
      const inFolder = folder === "all" || m.folder === folder;
      const inQuery =
        !q || m.name.toLowerCase().includes(q) || m.alt.toLowerCase().includes(q);
      const inUnused = !onlyUnused || unused.has(m.id);
      return inFolder && inQuery && inUnused;
    });
  }, [initialMedia, folder, query, onlyUnused, unused]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const rows = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function refreshAfter(p: Promise<{ ok: boolean; message?: string }>) {
    startTransition(async () => {
      const res = await p;
      notify(res.message ?? (res.ok ? "Done." : "Failed."));
      if (res.ok) {
        setSelected(new Set());
        router.refresh();
      }
    });
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    startTransition(async () => {
      let ok = 0;
      for (const file of Array.from(files)) {
        try {
          const fd = new FormData();
          fd.append("file", file);
          fd.append("folder", folder === "all" ? "uploads" : folder);
          const res = await uploadMediaAction(fd);
          if (res.ok) ok++;
          else notify(res.message ?? "Upload failed.");
        } catch {
          notify(
            `"${file.name}" couldn't upload — it may be too large (max 10 MB) or the connection dropped.`
          );
        }
      }
      if (ok > 0) {
        notify(`${ok} file(s) uploaded.`);
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

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(
        url.startsWith("http") ? url : `${window.location.origin}${url}`
      );
      notify("URL copied.");
    } catch {
      notify("Copy failed.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
      {/* Folder sidebar */}
      <aside>
        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-600">
          Folders
        </p>
        <div className="flex flex-col gap-0.5">
          <FolderBtn label="All media" count={initialMedia.length} active={folder === "all"} onClick={() => setFolder("all")} />
          {folders.map((f) => (
            <FolderBtn
              key={f}
              label={f}
              count={counts[f] ?? 0}
              active={folder === f}
              onClick={() => setFolder(f)}
            />
          ))}
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2 px-2 text-xs text-gray-400">
          <input
            type="checkbox"
            checked={onlyUnused}
            onChange={(e) => setOnlyUnused(e.target.checked)}
            className="accent-purple-500"
          />
          Unused only
        </label>
      </aside>

      {/* Main */}
      <div>
        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder="Search media…"
              className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-gray-600"
            />
          </div>
          <button
            onClick={() => fileInput.current?.click()}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>
          <input
            ref={fileInput}
            type="file"
            multiple
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {devMode && (
          <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-200">
            Dev mode — uploads need Supabase Storage. Showing seed media only.
          </div>
        )}
        {toast && (
          <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200">
            {toast}
          </div>
        )}

        {/* Bulk bar */}
        {selected.size > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-sm">
            <span className="font-medium">{selected.size} selected</span>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <select
                onChange={(e) => {
                  if (e.target.value) refreshAfter(moveMediaAction([...selected], e.target.value));
                  e.target.value = "";
                }}
                defaultValue=""
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs"
              >
                <option value="" className="bg-[#0b0b18]">Move to…</option>
                {folders.map((f) => (
                  <option key={f} value={f} className="bg-[#0b0b18]">{f}</option>
                ))}
              </select>
              <button
                disabled={pending}
                onClick={() => refreshAfter(bulkDeleteMediaAction([...selected]))}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        )}

        {/* Drop zone + grid */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`rounded-2xl border-2 border-dashed p-4 transition-colors ${
            dragOver ? "border-purple-400 bg-purple-500/5" : "border-white/10"
          }`}
        >
          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-sm text-gray-500">
              <ImageIcon className="mb-3 h-8 w-8 text-gray-600" />
              No media here. Drag &amp; drop files or click Upload.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {rows.map((m) => (
                <div
                  key={m.id}
                  className={`group relative overflow-hidden rounded-xl border bg-white/[0.03] ${
                    selected.has(m.id) ? "border-purple-400" : "border-white/10"
                  }`}
                >
                  <button onClick={() => setActive(m)} className="block w-full">
                    <MediaThumb m={m} className="h-32 w-full" />
                  </button>
                  <input
                    type="checkbox"
                    checked={selected.has(m.id)}
                    onChange={() => toggle(m.id)}
                    className="absolute left-2 top-2 accent-purple-500"
                  />
                  {unused.has(m.id) && (
                    <span className="absolute right-2 top-2 rounded bg-amber-500/80 px-1.5 py-0.5 text-[10px] font-semibold text-black">
                      unused
                    </span>
                  )}
                  <div className="px-2 py-1.5">
                    <p className="line-clamp-1 text-xs font-medium">{m.name}</p>
                    <p className="text-[10px] text-gray-500">{m.folder}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <span>{filtered.length} item(s)</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={current === 0} className="rounded-lg border border-white/10 px-3 py-1 disabled:opacity-30">Prev</button>
            <span>{current + 1} / {pageCount}</span>
            <button onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={current >= pageCount - 1} className="rounded-lg border border-white/10 px-3 py-1 disabled:opacity-30">Next</button>
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      {active && (
        <DetailDrawer
          media={active}
          folders={folders}
          pending={pending}
          onClose={() => setActive(null)}
          onCopy={() => copyUrl(active.url)}
          onSave={(patch) =>
            refreshAfter(updateMediaAction({ id: active.id, ...patch }))
          }
          onDelete={() => {
            refreshAfter(deleteMediaAction(active.id));
            setActive(null);
          }}
        />
      )}
    </div>
  );
}

function FolderBtn({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm capitalize transition-colors ${
        active ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {label}
      <span className="text-xs text-gray-600">{count}</span>
    </button>
  );
}

function DetailDrawer({
  media,
  folders,
  pending,
  onClose,
  onCopy,
  onSave,
  onDelete,
}: {
  media: Media;
  folders: string[];
  pending: boolean;
  onClose: () => void;
  onCopy: () => void;
  onSave: (patch: { name: string; alt: string; caption: string; folder: string }) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(media.name);
  const [alt, setAlt] = useState(media.alt);
  const [caption, setCaption] = useState(media.caption);
  const [folder, setFolder] = useState(media.folder);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-[#0b0b18] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold">Media details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <MediaThumb m={media} className="mb-4 h-48 w-full rounded-xl" />

        <div className="mb-4 flex items-center gap-2">
          <button onClick={onCopy} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5">
            <Copy className="h-3.5 w-3.5" /> Copy URL
          </button>
          <button onClick={onDelete} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-rose-300 hover:bg-white/5">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <Labeled label="Name">
            <input value={name} onChange={(e) => setName(e.target.value)} className="editor-input" />
          </Labeled>
          <Labeled label="Alt text">
            <input value={alt} onChange={(e) => setAlt(e.target.value)} className="editor-input" />
          </Labeled>
          <Labeled label="Caption">
            <input value={caption} onChange={(e) => setCaption(e.target.value)} className="editor-input" />
          </Labeled>
          <Labeled label="Folder">
            <select value={folder} onChange={(e) => setFolder(e.target.value)} className="editor-input">
              {folders.map((f) => (
                <option key={f} value={f} className="bg-[#0b0b18]">{f}</option>
              ))}
            </select>
          </Labeled>

          <dl className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-gray-400">
            <div className="flex justify-between"><dt>Type</dt><dd>{media.type}</dd></div>
            {media.sizeBytes ? <div className="flex justify-between"><dt>Size</dt><dd>{(media.sizeBytes / 1024).toFixed(0)} KB</dd></div> : null}
            {media.width ? <div className="flex justify-between"><dt>Dimensions</dt><dd>{media.width}×{media.height}</dd></div> : null}
            <div className="flex justify-between"><dt>Uploaded</dt><dd>{media.createdAt}</dd></div>
          </dl>

          <button
            onClick={() => onSave({ name, alt, caption, folder })}
            disabled={pending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-400">{label}</span>
      {children}
    </label>
  );
}
