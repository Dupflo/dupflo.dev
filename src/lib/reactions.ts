import { Redis } from '@upstash/redis';

/**
 * Storage for the "read and liked" signal.
 *
 * A counter is one INCR — no schema, no migration, no read path. The number is
 * deliberately never served: it is a signal for Florian, read from the Upstash
 * console, not a figure for the reader. A public count turns into a vanity
 * metric, and an article sitting at 3 reads as a failure to the next visitor.
 *
 * Vercel's Upstash integration injects KV_REST_API_*; a store wired by hand
 * uses UPSTASH_REDIS_REST_*. Both spellings are accepted.
 */

const url =
  import.meta.env.KV_REST_API_URL ?? import.meta.env.UPSTASH_REDIS_REST_URL;
const token =
  import.meta.env.KV_REST_API_TOKEN ?? import.meta.env.UPSTASH_REDIS_REST_TOKEN;

/** False when no store is wired — the button is not rendered at all then. */
export const reactionsEnabled = Boolean(url && token);

export const redis = reactionsEnabled
  ? new Redis({ url: url as string, token: token as string })
  : null;

/** `reaction:<lang>:<slug>` — one key per article per language. */
export const reactionKey = (lang: string, slug: string) =>
  `reaction:${lang}:${slug}`;
