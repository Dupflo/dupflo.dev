import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { renderCard } from '../../../lib/og';
import { iso, readingMinutes } from '../../../lib/entry';
import { stripLang } from '../../../i18n/ui';

/**
 * One card per article, at /og/blog/<lang>/<slug>.png. The language stays in
 * the path here — unlike page URLs — because two translations are two cards.
 */
export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: `${post.data.lang}/${stripLang(post.id)}` },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getCollection<'posts'>>>[number] };
  const { title, date, lang, tags } = post.data;

  const png = await renderCard({
    title,
    meta: `${iso(date)}   [${lang.toUpperCase()}]   ${readingMinutes(post.body)} MIN`,
    footer: tags.slice(0, 4).join('  ·  '),
  });

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
