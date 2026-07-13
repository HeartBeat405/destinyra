// Presentation helpers for the article Table of Contents.
// Pure functions — no business logic, no data access.

export type TocHeading = { id: string; text: string; level: 2 | 3 };

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/\*\*/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// Deterministic slugger that de-duplicates repeated headings identically to
// the way ArticleContent assigns ids (both walk the content in order).
export function createSlugger() {
  const seen = new Map<string, number>();
  return (text: string): string => {
    const base = slugifyHeading(text) || "section";
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n === 0 ? base : `${base}-${n + 1}`;
  };
}

// Extract H2/H3 headings from lightweight markdown for the TOC.
export function extractHeadings(content: string): TocHeading[] {
  const slug = createSlugger();
  const out: TocHeading[] = [];
  let inCode = false;

  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (line.startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    if (line.startsWith("### ")) {
      const text = line.slice(4).replace(/\*\*/g, "");
      out.push({ id: slug(text), text, level: 3 });
    } else if (line.startsWith("## ")) {
      const text = line.slice(3).replace(/\*\*/g, "");
      out.push({ id: slug(text), text, level: 2 });
    }
  }
  return out;
}
