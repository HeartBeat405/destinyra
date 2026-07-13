"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Save,
  AlertTriangle,
  Check,
  Megaphone,
} from "lucide-react";
import type { AdSlot, AdType, AdPlacement } from "../../lib/types";
import {
  AD_TYPES,
  AD_PLACEMENTS,
  AD_TYPE_LABEL,
  AD_PLACEMENT_LABEL,
} from "../../data/ads";
import { saveAdSlotsAction } from "../../lib/actions/ads.actions";
import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";
import Drawer from "./Drawer";
import { TextField, TextAreaField, SelectField, ToggleField } from "./form/Fields";

function emptySlot(index: number): AdSlot {
  return {
    id: `ad-${index}-${Math.round(performance.now())}`,
    name: "",
    type: "adsense",
    placement: "article-bottom",
    enabled: true,
    priority: 0,
  };
}

// Per-slot validation (Phase 5).
function slotWarnings(slot: AdSlot, all: AdSlot[]): string[] {
  const w: string[] = [];
  if (slot.type === "adsense") {
    if (!slot.publisherId?.trim()) w.push("Missing Publisher ID");
    if (!slot.slotId?.trim()) w.push("Missing Slot ID");
  }
  if ((slot.type === "html" || slot.type === "script") && !slot.html?.trim())
    w.push("Empty HTML/script");
  if ((slot.type === "image" || slot.type === "affiliate") && !slot.imageUrl?.trim())
    w.push("Missing image URL");
  const dup = all.filter(
    (s) => s.enabled && s.placement === slot.placement && s.id !== slot.id
  ).length;
  if (slot.enabled && dup > 0) w.push("Duplicate placement");
  return w;
}

export default function AdsManager({
  initialSlots,
  devMode,
}: {
  initialSlots: AdSlot[];
  devMode: boolean;
}) {
  const router = useRouter();
  const [slots, setSlots] = useState<AdSlot[]>(initialSlots);
  const [pending, startTransition] = useTransition();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState<AdSlot>(() => emptySlot(0));
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const stats = useMemo(() => {
    return {
      total: slots.length,
      enabled: slots.filter((s) => s.enabled).length,
      disabled: slots.filter((s) => !s.enabled).length,
      html: slots.filter((s) => s.type === "html" || s.type === "script").length,
      adsense: slots.filter((s) => s.type === "adsense").length,
      affiliate: slots.filter((s) => s.type === "affiliate").length,
    };
  }, [slots]);

  function set<K extends keyof AdSlot>(k: K, v: AdSlot[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function persistLocal(next: AdSlot[]) {
    setSlots(next);
    setSaved(false);
  }
  function openNew() {
    setForm(emptySlot(slots.length));
    setDrawerOpen(true);
  }
  function openEdit(s: AdSlot) {
    setForm({ ...s });
    setDrawerOpen(true);
  }
  function applyForm() {
    const exists = slots.some((s) => s.id === form.id);
    persistLocal(
      exists ? slots.map((s) => (s.id === form.id ? form : s)) : [...slots, form]
    );
    setDrawerOpen(false);
  }
  function remove(id: string) {
    persistLocal(slots.filter((s) => s.id !== id));
  }
  function toggle(id: string, enabled: boolean) {
    persistLocal(slots.map((s) => (s.id === id ? { ...s, enabled } : s)));
  }

  function save() {
    setMessage(null);
    startTransition(async () => {
      const res = await saveAdSlotsAction(slots);
      if (res.ok) setSaved(true);
      else setMessage(res.message ?? "Save failed.");
    });
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Ad Slots" value={stats.total} iconName="Megaphone" />
        <StatCard label="Enabled" value={stats.enabled} iconName="CheckCircle2" gradient="from-emerald-500 to-teal-500" />
        <StatCard label="Disabled" value={stats.disabled} iconName="Circle" gradient="from-gray-500 to-gray-600" />
        <StatCard label="Manual HTML / Script" value={stats.html} iconName="FileText" gradient="from-blue-500 to-indigo-600" />
        <StatCard label="Google AdSense" value={stats.adsense} iconName="BarChart3" gradient="from-amber-500 to-orange-600" />
        <StatCard label="Affiliate" value={stats.affiliate} iconName="Tag" gradient="from-fuchsia-500 to-purple-600" />
      </div>

      {/* Toolbar */}
      <div className="mt-6 mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Ad Slots
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={openNew} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/5">
            <Plus className="h-4 w-4" />
            New Slot
          </button>
          <button onClick={save} disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            <Save className="h-4 w-4" />
            {pending ? "Saving…" : "Save all"}
          </button>
        </div>
      </div>

      {devMode && (
        <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-200">
          Dev mode — slots are editable, but saving needs Supabase.
        </div>
      )}
      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-200">
          <Check className="h-4 w-4" /> Ad slots saved.
        </div>
      )}
      {message && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-200">
          <AlertTriangle className="h-4 w-4" /> {message}
        </div>
      )}

      {/* Slots list */}
      {slots.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
          <Megaphone className="mb-3 h-8 w-8 text-gray-600" />
          <p className="text-sm text-gray-400">No ad slots yet.</p>
          <button onClick={openNew} className="mt-3 text-sm font-medium text-purple-300 hover:text-purple-200">
            Create your first slot
          </button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {[...slots]
            .sort((a, b) => b.priority - a.priority)
            .map((s) => {
              const warnings = slotWarnings(s, slots);
              return (
                <div key={s.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{s.name || "Untitled slot"}</p>
                        <StatusBadge status={s.enabled ? "live" : "draft"} />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {AD_TYPE_LABEL[s.type]} · {AD_PLACEMENT_LABEL[s.placement]} · priority {s.priority}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <label className="mr-1 flex items-center gap-1.5 text-xs text-gray-400">
                        <input type="checkbox" checked={s.enabled} onChange={(e) => toggle(s.id, e.target.checked)} className="accent-purple-500" />
                        {s.enabled ? "On" : "Off"}
                      </label>
                      <button onClick={() => openEdit(s)} className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-gray-300 hover:bg-white/10">Edit</button>
                      <button onClick={() => remove(s.id)} aria-label="Delete slot" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:bg-white/10 hover:text-rose-300"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>

                  {/* Placeholder preview (no live injection) */}
                  <div className="mt-4 flex min-h-[64px] items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-3 text-center">
                    {s.type === "image" || s.type === "affiliate" ? (
                      s.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.imageUrl} alt={s.name} className="max-h-24 rounded" />
                      ) : (
                        <span className="text-xs text-gray-600">Image banner placeholder</span>
                      )
                    ) : (
                      <span className="text-xs uppercase tracking-widest text-gray-600">
                        {AD_TYPE_LABEL[s.type]} placeholder
                      </span>
                    )}
                  </div>

                  {warnings.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {warnings.map((w) => (
                        <li key={w} className="flex items-center gap-1.5 text-xs text-amber-300">
                          <AlertTriangle className="h-3.5 w-3.5" /> {w}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* Editor drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={slots.some((s) => s.id === form.id) ? "Edit ad slot" : "New ad slot"}
        footer={
          <div className="flex gap-2">
            <button onClick={applyForm} className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white">Apply</button>
            <button onClick={() => setDrawerOpen(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5">Cancel</button>
          </div>
        }
      >
        <div className="space-y-4">
          <TextField id="ad-name" label="Name" required value={form.name} onChange={(v) => set("name", v)} />
          <div className="grid grid-cols-2 gap-3">
            <SelectField id="ad-type" label="Type" value={form.type} onChange={(v) => set("type", v as AdType)} options={AD_TYPES} />
            <SelectField id="ad-placement" label="Placement" value={form.placement} onChange={(v) => set("placement", v as AdPlacement)} options={AD_PLACEMENTS} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextField id="ad-priority" label="Priority" type="number" value={String(form.priority)} onChange={(v) => set("priority", Number(v) || 0)} />
            <ToggleField id="ad-enabled" label="Enabled" checked={form.enabled} onChange={(v) => set("enabled", v)} />
          </div>

          {form.type === "adsense" && (
            <div className="grid grid-cols-2 gap-3">
              <TextField id="ad-pub" label="Publisher ID" value={form.publisherId ?? ""} onChange={(v) => set("publisherId", v)} hint="ca-pub-…" />
              <TextField id="ad-slot" label="Slot ID" value={form.slotId ?? ""} onChange={(v) => set("slotId", v)} />
            </div>
          )}
          {(form.type === "html" || form.type === "script") && (
            <TextAreaField id="ad-html" label="HTML / Script" value={form.html ?? ""} onChange={(v) => set("html", v)} rows={4} />
          )}
          {(form.type === "image" || form.type === "affiliate") && (
            <>
              <TextField id="ad-img" label="Image URL" value={form.imageUrl ?? ""} onChange={(v) => set("imageUrl", v)} />
              <TextField id="ad-link" label="Link URL" value={form.link ?? ""} onChange={(v) => set("link", v)} />
            </>
          )}
        </div>
      </Drawer>
    </div>
  );
}
