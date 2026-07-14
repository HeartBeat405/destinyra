"use client";

import { useMemo, useState } from "react";
import { Download, Copy, Check, Search, Mail } from "lucide-react";
import type { Subscriber } from "../../lib/repositories/newsletter.repo";

export default function NewsletterTable({
  subscribers,
}: {
  subscribers: Subscriber[];
}) {
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s
      ? subscribers.filter((x) => x.email.toLowerCase().includes(s))
      : subscribers;
  }, [subscribers, q]);

  function exportCsv() {
    const header = ["email", "source", "confirmed", "subscribed_at"];
    const rows = [
      header,
      ...subscribers.map((s) => [
        s.email,
        s.source,
        String(s.confirmed),
        s.createdAt,
      ]),
    ];
    const csv = rows
      .map((r) =>
        r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "destinyra-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyEmails() {
    try {
      await navigator.clipboard.writeText(
        subscribers.map((s) => s.email).join(", ")
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search email…"
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-gray-600"
          />
        </div>
        <button
          onClick={copyEmails}
          disabled={subscribers.length === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/10 disabled:opacity-40"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "Copied" : "Copy emails"}
        </button>
        <button
          onClick={exportCsv}
          disabled={subscribers.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-sm text-gray-500">
          <Mail className="mb-3 h-8 w-8 text-gray-600" />
          {subscribers.length === 0
            ? "No subscribers yet. Signups from the site newsletter form will appear here."
            : "No emails match your search."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-3 py-2 font-semibold">Email</th>
                <th className="px-3 py-2 font-semibold">Source</th>
                <th className="px-3 py-2 font-semibold">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-white/5 hover:bg-white/[0.03]"
                >
                  <td className="px-3 py-2.5 font-medium">{s.email}</td>
                  <td className="px-3 py-2.5 capitalize text-gray-400">
                    {s.source}
                  </td>
                  <td className="px-3 py-2.5 text-gray-400">{s.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
