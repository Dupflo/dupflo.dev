/**
 * Email capture, ported from the Next.js landing pages so both live in one
 * place. Brevo already holds the list, so this adds a route, not a stack.
 *
 * Nothing here runs unless both variables are set: an unconfigured build
 * returns 503 and the form is not rendered at all.
 */
const API = 'https://api.brevo.com/v3/contacts';

const key = import.meta.env.BREVO_API_KEY;
const listId = import.meta.env.BREVO_LIST_ID;

export const subscribeEnabled = Boolean(key && listId);

/** Deliberately loose: rejecting valid addresses costs more than a bad row. */
export const looksLikeEmail = (value: string) =>
  /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(value) && value.length < 254;

export async function subscribe(
  email: string,
  source: string,
): Promise<'ok' | 'exists' | 'error'> {
  if (!subscribeEnabled) return 'error';

  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'api-key': key as string,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email,
      listIds: [Number(listId)],
      updateEnabled: true,
      // Which page earned the address, so the list stays readable later.
      attributes: { SOURCE: source },
    }),
  });

  if (res.ok) return 'ok';
  // Brevo answers 400 with duplicate_parameter when the contact already exists.
  if (res.status === 400) {
    const body = await res.json().catch(() => ({}));
    if (body?.code === 'duplicate_parameter') return 'exists';
  }
  return 'error';
}
