export type TocItem = {
  text: string;
  id: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

/** Pulls "## Heading" level markdown headings out of raw MDX for the "On this page" rail. */
export function extractHeadings(content: string): TocItem[] {
  const lines = content.split("\n");
  const headings: TocItem[] = [];

  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      const text = match[1].trim();
      headings.push({ text, id: slugify(text) });
    }
  }

  return headings;
}
