"use client";

import { useEffect, useState } from "react";
import { Search, X, ImageIcon, Loader2 } from "lucide-react";
import type { Media } from "../../lib/types";
import { listMediaAction } from "../../lib/actions/media.actions";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
};

// Reusable media chooser. Used by the Article editor, Homepage Builder, etc.
// Reads through the listMediaAction server action — never touches Storage directly.
export default function MediaPicker({ open, onClose, onSelect }: Props) {
  const [items, setItems] = useState<Media[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setItems(null);
    listMediaAction().then((res) => {
      if (!cancelled) setItems(res);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!open) return null;

  const filtered = (items ?? []).filter(
    (m) =>
      m.type === "image" &&
      (!query ||
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.folder.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b18]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 p-4">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search media…"
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-gray-600"
            />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4">
          {items === null ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-sm text-gray-500">
              <ImageIcon className="mb-3 h-8 w-8 text-gray-600" />
              No images found. Upload some in the Media Library.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {filtered.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onSelect(m);
                    onClose();
                  }}
                  className="group overflow-hidden rounded-xl border border-white/10 hover:border-purple-400"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.url}
                    alt={m.alt || m.name}
                    loading="lazy"
                    className="h-24 w-full object-cover"
                  />
                  <p className="line-clamp-1 px-2 py-1 text-[10px] text-gray-400">{m.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
