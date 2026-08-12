import type { APIRoute } from 'astro';
import { subscribe, subscribeEnabled, looksLikeEmail } from '../../lib/subscribe';

export const prerender = false;

const SOURCE = /^[a-z0-9-]{1,60}$/;

export const POST: APIRoute = async ({ request }) => {
  if (!subscribeEnabled) return new Response(null, { status: 503 });

  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? '').trim().toLowerCase();
  const source = String(body?.source ?? '');

  if (!looksLikeEmail(email) || !SOURCE.test(source)) {
    return new Response(null, { status: 400 });
  }

  const result = await subscribe(email, source);
  // "Already on the list" is a success from the reader's point of view.
  return new Response(null, { status: result === 'error' ? 502 : 204 });
};
