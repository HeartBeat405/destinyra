import React from "react";

export type Column<T> = {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: string;
};

// Reusable admin table. Presentational only — receives already-loaded rows.
export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty = "Nothing here yet.",
}: Props<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center text-sm text-gray-400">
        {empty}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
              {columns.map((c, i) => (
                <th key={i} className={`px-5 py-3 font-semibold ${c.className ?? ""}`}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.03]"
              >
                {columns.map((c, i) => (
                  <td key={i} className={`px-5 py-4 align-middle ${c.className ?? ""}`}>
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
