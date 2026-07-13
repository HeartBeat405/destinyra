import React from "react";
import { createSlugger } from "../../lib/util/toc";

// Dependency-free markdown renderer for seed content.
// Supports: ## h2, ### h3 (with anchor ids), > quote, "- " lists, **bold**,
// ``` fenced code, | pipe tables |, and > [!note] callouts.

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      <React.Fragment key={`${keyPrefix}-t-${i}`}>{part}</React.Fragment>
    )
  );
}

function HeadingAnchor({ id }: { id: string }) {
  return (
    <a
      href={`#${id}`}
      aria-label="Link to this section"
      className="heading-anchor ml-2 text-brand no-underline"
    >
      #
    </a>
  );
}

export default function ArticleContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const slug = createSlugger();
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let tableBuffer: string[] = [];
  let codeBuffer: string[] | null = null;
  let key = 0;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    const items = [...listBuffer];
    blocks.push(
      <ul key={`ul-${key++}`} className="my-6 space-y-2.5 pl-1">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            <span>{renderInline(item, `li-${key}-${i}`)}</span>
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  const flushTable = () => {
    if (tableBuffer.length === 0) return;
    const rows = tableBuffer
      .map((r) => r.trim())
      .filter((r) => !/^\|?[\s:-]+\|?[\s:|-]*$/.test(r)); // drop separator row
    const cells = rows.map((r) =>
      r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim())
    );
    const [head, ...body] = cells;
    const tkey = key++;
    blocks.push(
      <div key={`tbl-${tkey}`} className="my-7 overflow-x-auto">
        <table className="w-full border-collapse text-left text-[0.95rem]">
          {head && (
            <thead>
              <tr>
                {head.map((c, i) => (
                  <th
                    key={i}
                    className="border-b border-line px-4 py-2.5 font-sans text-sm font-semibold text-ink"
                  >
                    {renderInline(c, `th-${tkey}-${i}`)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri} className="border-b border-line/70">
                {row.map((c, ci) => (
                  <td key={ci} className="px-4 py-2.5 text-muted">
                    {renderInline(c, `td-${tkey}-${ri}-${ci}`)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableBuffer = [];
  };

  for (const raw of lines) {
    const line = raw.trim();

    // Fenced code blocks
    if (line.startsWith("```")) {
      if (codeBuffer === null) {
        flushList();
        flushTable();
        codeBuffer = [];
      } else {
        blocks.push(
          <pre
            key={`code-${key++}`}
            className="my-7 overflow-x-auto rounded-2xl border border-line bg-[#0f1222] p-5 text-sm leading-6 text-[#e6e8f0]"
          >
            <code>{codeBuffer.join("\n")}</code>
          </pre>
        );
        codeBuffer = null;
      }
      continue;
    }
    if (codeBuffer !== null) {
      codeBuffer.push(raw);
      continue;
    }

    // Tables
    if (line.startsWith("|")) {
      flushList();
      tableBuffer.push(line);
      continue;
    }
    if (tableBuffer.length) flushTable();

    if (line === "") {
      flushList();
      continue;
    }
    if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2));
      continue;
    }
    flushList();

    // Callout: > [!note] text
    const callout = line.match(/^>\s*\[!(\w+)\]\s*(.*)$/);
    if (callout) {
      blocks.push(
        <div
          key={`callout-${key++}`}
          className="my-7 rounded-2xl border border-brand/20 bg-brand-50 p-5"
        >
          <p className="mb-1 font-sans text-xs font-bold uppercase tracking-wide text-brand-700">
            {callout[1]}
          </p>
          <p className="text-ink/80">{renderInline(callout[2], `co-${key}`)}</p>
        </div>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      const text = line.slice(4);
      const id = slug(text.replace(/\*\*/g, ""));
      blocks.push(
        <h3
          key={`h3-${key++}`}
          id={id}
          className="group scroll-mt-28 mt-9 mb-3 font-sans text-xl font-bold text-ink"
        >
          {renderInline(text, `h3-${key}`)}
          <HeadingAnchor id={id} />
        </h3>
      );
    } else if (line.startsWith("## ")) {
      const text = line.slice(3);
      const id = slug(text.replace(/\*\*/g, ""));
      blocks.push(
        <h2
          key={`h2-${key++}`}
          id={id}
          className="group scroll-mt-28 mt-12 mb-4 font-sans text-2xl font-bold tracking-tight text-ink"
        >
          {renderInline(text, `h2-${key}`)}
          <HeadingAnchor id={id} />
        </h2>
      );
    } else if (line.startsWith("> ")) {
      blocks.push(
        <blockquote
          key={`q-${key++}`}
          className="my-8 border-l-4 border-brand pl-6 font-serif text-xl italic leading-relaxed text-ink"
        >
          {renderInline(line.slice(2), `q-${key}`)}
        </blockquote>
      );
    } else {
      blocks.push(
        <p key={`p-${key++}`} className="my-5">
          {renderInline(line, `p-${key}`)}
        </p>
      );
    }
  }

  flushList();
  flushTable();

  return <div className="article-body">{blocks}</div>;
}
