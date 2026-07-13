"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Check, Search, X, Plus } from "lucide-react";

export type Option = { value: string; label: string; hint?: string };

function useOutsideClose(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [onClose]);
  return ref;
}

// ---------------------------------------------------------------------------
// SearchSelect — single, searchable, keyboard + ARIA. Reusable across the CMS.
// ---------------------------------------------------------------------------
export function SearchSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select…",
  clearable = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  clearable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const ref = useOutsideClose(() => setOpen(false));

  const filtered = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase())),
    [options, q]
  );
  const selected = options.find((o) => o.value === value);

  function pick(v: string) {
    onChange(v);
    setOpen(false);
    setQ("");
  }
  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[active]) pick(filtered[active].value);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="mb-3">
      <label className="mb-1 block text-[11px] font-medium text-gray-400">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm text-white outline-none focus:border-purple-400"
        >
          <span className={selected ? "" : "text-gray-500"}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
        </button>

        {open && (
          <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0b0b18] shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/10 px-3">
              <Search className="h-3.5 w-3.5 text-gray-500" />
              <input
                autoFocus
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKey}
                placeholder="Search…"
                className="w-full bg-transparent py-2 text-sm text-white outline-none placeholder:text-gray-600"
                role="combobox"
                aria-expanded={open}
                aria-controls={`${label}-listbox`}
              />
            </div>
            <ul id={`${label}-listbox`} role="listbox" className="max-h-56 overflow-y-auto p-1">
              {clearable && (
                <li role="option" aria-selected={value === ""}>
                  <button type="button" onClick={() => pick("")} className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 hover:bg-white/10">
                    — None —
                  </button>
                </li>
              )}
              {filtered.map((o, i) => (
                <li key={o.value} role="option" aria-selected={o.value === value}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => pick(o.value)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-white ${i === active ? "bg-white/10" : ""}`}
                  >
                    <span>
                      {o.label}
                      {o.hint && <span className="ml-2 text-xs text-gray-500">{o.hint}</span>}
                    </span>
                    {o.value === value && <Check className="h-4 w-4 text-purple-400" />}
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-3 py-2 text-sm text-gray-500">No results</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MultiSelect — chips + searchable dropdown, optional create. Reusable.
// Values are plain strings (option value, or a created label when allowCreate).
// ---------------------------------------------------------------------------
export function MultiSelect({
  label,
  values,
  onChange,
  options,
  allowCreate = false,
  placeholder = "Add…",
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  options: Option[];
  allowCreate?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useOutsideClose(() => setOpen(false));

  const filtered = useMemo(
    () =>
      options.filter(
        (o) =>
          o.label.toLowerCase().includes(q.toLowerCase()) &&
          !values.includes(o.value)
      ),
    [options, q, values]
  );

  const canCreate =
    allowCreate &&
    q.trim().length > 0 &&
    !options.some((o) => o.value.toLowerCase() === q.trim().toLowerCase()) &&
    !values.includes(q.trim());

  function add(v: string) {
    if (!v) return;
    onChange([...new Set([...values, v])]);
    setQ("");
  }
  function remove(v: string) {
    onChange(values.filter((x) => x !== v));
  }
  function labelFor(v: string) {
    return options.find((o) => o.value === v)?.label ?? v;
  }

  return (
    <div ref={ref} className="mb-3">
      <label className="mb-1 block text-[11px] font-medium text-gray-400">
        {label}
      </label>

      {values.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 px-2.5 py-1 text-xs text-purple-200"
            >
              {labelFor(v)}
              <button
                type="button"
                onClick={() => remove(v)}
                aria-label={`Remove ${labelFor(v)}`}
                className="text-purple-300 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 focus-within:border-purple-400">
          <Search className="h-3.5 w-3.5 text-gray-500" />
          <input
            value={q}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canCreate) {
                e.preventDefault();
                add(q.trim());
              }
            }}
            placeholder={placeholder}
            className="w-full bg-transparent py-2 text-sm text-white outline-none placeholder:text-gray-600"
            aria-label={label}
          />
        </div>

        {open && (filtered.length > 0 || canCreate) && (
          <ul role="listbox" className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#0b0b18] p-1 shadow-2xl">
            {canCreate && (
              <li>
                <button
                  type="button"
                  onClick={() => add(q.trim())}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-emerald-300 hover:bg-white/10"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create “{q.trim()}”
                </button>
              </li>
            )}
            {filtered.map((o) => (
              <li key={o.value} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => add(o.value)}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-white hover:bg-white/10"
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
