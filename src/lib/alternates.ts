import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Language pairs for articles, for the sitemap.
 *
 * @astrojs/sitemap pairs locales by comparing paths — `/cv/` with `/fr/cv/`.
 * Articles break that: their slugs are translated too, so
 * `why-overkill-skills-…` and `pourquoi-les-skills-overkill-…` never match and
 * the pair is silently dropped. This reads `translationKey` from the source
 * files and rebuilds the mapping the path comparison cannot see.
 *
 * Runs at config load, so it reads the filesystem rather than the content
 * layer — the collections do not exist yet at that point.
 */

const POSTS = 'src/content/posts';

export interface Alternate {
  lang: string;
  url: string;
}

/** Absolute page URL → the alternates it should declare, itself included. */
export function postAlternates(site: string): Map<string, Alternate[]> {
  const byKey = new Map<string, Alternate[]>();

  for (const lang of ['en', 'fr']) {
    let files: string[];
    try {
      files = readdirSync(join(POSTS, lang));
    } catch {
      continue; // A language with no articles yet is not an error.
    }

    for (const file of files) {
      if (!/\.mdx?$/.test(file)) continue;
      const source = readFileSync(join(POSTS, lang, file), 'utf8');
      const key = source.match(/^translationKey:\s*(.+)$/m)?.[1]?.trim();
      if (!key) continue;
      if (source.match(/^draft:\s*true$/m)) continue;

      const slug = file.replace(/\.mdx?$/, '');
      const path = lang === 'en' ? `/blog/${slug}/` : `/fr/blog/${slug}/`;
      byKey.set(key, [
        ...(byKey.get(key) ?? []),
        { lang, url: new URL(path, site).href },
      ]);
    }
  }

  // A lone article has nothing to declare — one alternate is not a pair.
  const byUrl = new Map<string, Alternate[]>();
  for (const alternates of byKey.values()) {
    if (alternates.length < 2) continue;
    for (const { url } of alternates) byUrl.set(url, alternates);
  }
  return byUrl;
}
