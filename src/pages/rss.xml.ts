import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE, DESCRIPTION } from '../consts';
import { localePath, stripLang } from '../i18n/ui';
import type { APIContext } from 'astro';

const lang = 'en' as const;

export async function GET(context: APIContext) {
  const posts = (
    await getCollection('posts', ({ data }) => !data.draft && data.lang === lang)
  ).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: `${SITE.title} — ${SITE.author}`,
    description: DESCRIPTION[lang],
    site: context.site ?? SITE.url,
    // The canonical URL is the point of this site; the feed repeats it.
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: localePath(lang, `/blog/${stripLang(post.id)}`),
      categories: [...post.data.tags],
      author: SITE.author,
    })),
    customData: `<language>${lang}</language>`,
  });
}
