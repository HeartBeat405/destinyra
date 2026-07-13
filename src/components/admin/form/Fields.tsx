"use client";

import React from "react";

// Reusable admin form fields (dark admin theme) with floating labels and
// inline validation. Shared across all taxonomy managers.

const inputBase =
  "peer w-full rounded-xl border border-white/10 bg-white/5 px-3 pb-2 pt-5 text-sm text-white outline-none transition-colors focus:border-purple-400 aria-[invalid=true]:border-rose-400/60";

const labelBase =
  "pointer-events-none absolute left-3 top-4 text-sm text-gray-500 transition-all peer-focus:top-1.5 peer-focus:text-[11px] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[11px]";

function Error({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-rose-300">{msg}</p>;
}

type Base = {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  required,
  type = "text",
  hint,
}: Base & {
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          aria-invalid={Boolean(error)}
          className={inputBase}
        />
        <label htmlFor={id} className={labelBase}>
          {label}
          {required && " *"}
        </label>
      </div>
      {hint && !error && <p className="mt-1 text-xs text-gray-600">{hint}</p>}
      <Error msg={error} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  error,
  rows = 3,
}: Base & { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <div className="relative">
        <textarea
          id={id}
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          aria-invalid={Boolean(error)}
          className={`${inputBase} resize-y`}
        />
        <label htmlFor={id} className={labelBase}>
          {label}
        </label>
      </div>
      <Error msg={error} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  error,
}: Base & {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-[11px] font-medium text-gray-400"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-purple-400"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0b0b18]">
            {o.label}
          </option>
        ))}
      </select>
      <Error msg={error} />
    </div>
  );
}

export function ToggleField({
  id,
  label,
  checked,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
      <span>
        <span className="block text-sm text-white">{label}</span>
        {hint && <span className="text-xs text-gray-500">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        id={id}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-purple-500" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[11px] font-medium text-gray-400">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#6c63ff"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-white/10 bg-transparent"
          aria-label={`${label} color picker`}
        />
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-purple-400"
          placeholder="#6C63FF"
        />
      </div>
    </div>
  );
}
