/**
 * Splits markdown text into separate pages using standard page separators (--- or -----).
 */
export function splitMarkdownToPages(text: string): string[] {
  if (!text) return []
  // Split by standard page separators (e.g. 5 dashes or 3 dashes on a new line)
  let pages = text.split(/\r?\n-----\r?\n/)
  if (pages.length <= 1) {
    pages = text.split(/\r?\n---\r?\n/)
  }
  return pages.map((p) => p.trim()).filter((p) => p.length > 0)
}
