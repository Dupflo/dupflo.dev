/**
 * ISO dates everywhere. They sort, they align in tabular figures, and they read
 * the same in both languages the site serves.
 */
export const iso = (date: Date): string => date.toISOString().slice(0, 10);

/** Rough reading time from the raw markdown body, at 220 words per minute. */
export const readingMinutes = (body: string | undefined): number => {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
};

/**
 * Every list row on the site shares this grid so the metadata gutter lines up
 * as one continuous column down the page. Change it here or not at all.
 */
export const ROW =
  'group -mx-3 grid gap-x-4 border-t px-3 hover:bg-raised';
/** Metadata gutter, content, trailing column. */
export const ROW_COLS = 'md:grid-cols-[10rem_1fr_auto]';
/** Same gutter, but the content runs to the edge. */
export const ROW_WIDE = 'md:grid-cols-[10rem_1fr]';

/**
 * Wraps a run of rows. The section header already draws a rule, so the first
 * row drops its own — two lines a few pixels apart read as a mistake.
 */
export const ROW_GROUP = 'border-b [&>a:first-child]:border-t-0';

export const STATUS_GLYPH = {
  live: '●',
  wip: '◐',
  archived: '○',
} as const satisfies Record<string, string>;
