import type { APIRoute } from 'astro';
import { renderCard } from '../../lib/og';
import { SITE } from '../../consts';
import { UI } from '../../i18n/ui';

/** The fallback card, used by every page that is not an article. */
export const GET: APIRoute = async () => {
  const png = await renderCard({
    title: SITE.author,
    meta: UI.en.role.toUpperCase(),
    footer: 'AGENTIC AI  ·  CLAUDE CODE  ·  MCP',
  });

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
