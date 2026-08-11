import type { APIRoute } from 'astro';
import { redis, reactionsEnabled, reactionKey } from '../../lib/reactions';

/** The one route on the site that is not prerendered. */
export const prerender = false;

const LANGS = new Set(['en', 'fr']);
/** Slugs are generated from filenames, so this is the whole alphabet. */
const SLUG = /^[a-z0-9-]{1,120}$/;

export const POST: APIRoute = async ({ request }) => {
  if (!reactionsEnabled || !redis) {
    return new Response(null, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const { slug, lang } = (body ?? {}) as { slug?: string; lang?: string };
  if (!slug || !lang || !LANGS.has(lang) || !SLUG.test(slug)) {
    return new Response(null, { status: 400 });
  }

  // No IP, no cookie, no fingerprint: nothing here is personal data, so the
  // count is approximate by design and carries no GDPR surface.
  await redis.incr(reactionKey(lang, slug));

  return new Response(null, { status: 204 });
};
