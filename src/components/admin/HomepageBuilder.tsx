"use client";

import { useState, useTransition } from "react";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Save,
  Eye,
  GripVertical,
  Check,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import type { HomepageWidget, WidgetType } from "../../lib/types";
import { WIDGET_META, ADDABLE_WIDGET_TYPES } from "../../data/homepage";
import { saveHomepageWidgetsAction } from "../../lib/actions/homepage.actions";

const NON_CONFIGURABLE: WidgetType[] = ["hero", "newsletter"];

export default function HomepageBuilder({
  initialWidgets,
  devMode,
}: {
  initialWidgets: HomepageWidget[];
  devMode: boolean;
}) {
  const [widgets, setWidgets] = useState<HomepageWidget[]>(
    [...initialWidgets].sort((a, b) => a.order - b.order)
  );
  const [adding, setAdding] = useState(false);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function update(id: string, patch: Partial<HomepageWidget>) {
    setWidgets((ws) => ws.map((w) => (w.id === id ? { ...w, ...patch } : w)));
    setSaved(false);
  }

  function move(index: number, dir: -1 | 1) {
    setWidgets((ws) => {
      const next = [...ws];
      const target = index + dir;
      if (target < 0 || target >= next.length) return ws;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((w, i) => ({ ...w, order: i }));
    });
    setSaved(false);
  }

  function remove(id: string) {
    setWidgets((ws) =>
      ws.filter((w) => w.id !== id).map((w, i) => ({ ...w, order: i }))
    );
    setSaved(false);
  }

  function add(type: WidgetType) {
    setWidgets((ws) => [
      ...ws,
      {
        id: `w-${type}-${ws.length}-${Math.round(performance.now())}`,
        type,
        enabled: true,
        order: ws.length,
      },
    ]);
    setAdding(false);
    setSaved(false);
  }

  function save() {
    setMessage(null);
    startTransition(async () => {
      const payload = widgets.map((w, i) => ({ ...w, order: i }));
      const res = await saveHomepageWidgetsAction(payload);
      if (res.ok) {
        setSaved(true);
      } else {
        setMessage(res.message ?? "Save failed.");
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Builder */}
      <div className="lg:col-span-2">
        <div className="space-y-3">
          {widgets.map((w, i) => {
            const meta = WIDGET_META[w.type];
            const configurable = !NON_CONFIGURABLE.includes(w.type);
            return (
              <div
                key={w.id}
                className={`rounded-2xl border bg-white/[0.04] p-4 transition-colors ${
                  w.enabled ? "border-white/10" : "border-white/5 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-gray-600" />
                  <div className="flex flex-col">
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="text-gray-500 hover:text-white disabled:opacity-20"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === widgets.length - 1}
                      className="text-gray-500 hover:text-white disabled:opacity-20"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      {meta?.label ?? w.type}
                      <span className="ml-2 text-xs font-normal text-gray-500">
                        {w.type}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">{meta?.description}</p>
                  </div>

                  {/* enable toggle */}
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-400">
                    <input
                      type="checkbox"
                      checked={w.enabled}
                      onChange={(e) => update(w.id, { enabled: e.target.checked })}
                      className="accent-purple-500"
                    />
                    {w.enabled ? "On" : "Off"}
                  </label>

                  <button
                    onClick={() => remove(w.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-500 hover:bg-white/5 hover:text-rose-300"
                    aria-label="Remove widget"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* config */}
                {configurable && (
                  <div className="mt-3 grid gap-3 border-t border-white/5 pt-3 sm:grid-cols-2">
                    <input
                      value={w.title ?? ""}
                      onChange={(e) => update(w.id, { title: e.target.value })}
                      placeholder="Title"
                      className="editor-input"
                    />
                    <input
                      value={w.subtitle ?? ""}
                      onChange={(e) => update(w.id, { subtitle: e.target.value })}
                      placeholder="Subtitle"
                      className="editor-input"
                    />
                    {w.type === "hero" && (
                      <select
                        value={w.source ?? "latest"}
                        onChange={(e) =>
                          update(w.id, {
                            source: e.target.value as HomepageWidget["source"],
                          })
                        }
                        className="editor-input sm:col-span-2"
                      >
                        <option value="latest" className="bg-[#0b0b18]">
                          Source: Article banners — Latest
                        </option>
                        <option value="featured" className="bg-[#0b0b18]">
                          Source: Article banners — Featured
                        </option>
                        <option value="trending" className="bg-[#0b0b18]">
                          Source: Article banners — Trending
                        </option>
                        <option value="news" className="bg-[#0b0b18]">
                          Source: News headlines
                        </option>
                      </select>
                    )}
                    {w.type === "quote" && (
                      <>
                        <input
                          value={w.quote ?? ""}
                          onChange={(e) => update(w.id, { quote: e.target.value })}
                          placeholder="Quote text"
                          className="editor-input sm:col-span-2"
                        />
                        <input
                          value={w.quoteAuthor ?? ""}
                          onChange={(e) => update(w.id, { quoteAuthor: e.target.value })}
                          placeholder="Quote author"
                          className="editor-input"
                        />
                      </>
                    )}
                    {w.type === "banner" && (
                      <>
                        <input
                          value={w.bannerText ?? ""}
                          onChange={(e) => update(w.id, { bannerText: e.target.value })}
                          placeholder="Banner headline"
                          className="editor-input sm:col-span-2"
                        />
                        <input
                          value={w.bannerCtaLabel ?? ""}
                          onChange={(e) => update(w.id, { bannerCtaLabel: e.target.value })}
                          placeholder="Button label"
                          className="editor-input"
                        />
                        <input
                          value={w.bannerHref ?? ""}
                          onChange={(e) => update(w.id, { bannerHref: e.target.value })}
                          placeholder="Button link (/articles)"
                          className="editor-input"
                        />
                      </>
                    )}
                    {w.type === "custom-html" && (
                      <textarea
                        value={w.html ?? ""}
                        onChange={(e) => update(w.id, { html: e.target.value })}
                        placeholder="<div>Custom HTML…</div>"
                        rows={3}
                        className="editor-input font-mono sm:col-span-2"
                      />
                    )}
                    {w.type === "advertisement" && (
                      <input
                        value={w.adSlot ?? ""}
                        onChange={(e) => update(w.id, { adSlot: e.target.value })}
                        placeholder="Ad slot id"
                        className="editor-input"
                      />
                    )}
                    {!["quote", "banner", "custom-html"].includes(w.type) && (
                      <input
                        type="number"
                        min={1}
                        max={24}
                        value={w.maxItems ?? ""}
                        onChange={(e) =>
                          update(w.id, {
                            maxItems: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                        placeholder="Max items"
                        className="editor-input"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add widget */}
        <div className="mt-4">
          {adding ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="mb-3 text-sm font-medium">Add a widget</p>
              <div className="flex flex-wrap gap-2">
                {ADDABLE_WIDGET_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => add(t)}
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10"
                  >
                    {WIDGET_META[t]?.label ?? t}
                  </button>
                ))}
                <button
                  onClick={() => setAdding(false)}
                  className="rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5"
            >
              <Plus className="h-4 w-4" />
              Add widget
            </button>
          )}
        </div>
      </div>

      {/* Sidebar: actions */}
      <div>
        <div className="sticky top-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Publish layout
          </h3>
          <p className="mb-4 text-xs text-gray-500">
            {widgets.filter((w) => w.enabled).length} of {widgets.length} widgets
            enabled.
          </p>

          {devMode && (
            <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200">
              Dev mode — layout is editable but saving needs Supabase.
            </div>
          )}
          {message && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-200">
              <AlertTriangle className="h-4 w-4" />
              {message}
            </div>
          )}
          {saved && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-200">
              <Check className="h-4 w-4" />
              Layout saved.
            </div>
          )}

          <button
            onClick={save}
            disabled={pending}
            className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {pending ? "Saving…" : "Save layout"}
          </button>
          <Link
            href="/"
            target="_blank"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5"
          >
            <Eye className="h-4 w-4" />
            Preview homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
