// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

import { SITE } from './src/consts.ts';
import { pageAlternates, postAlternates } from './src/lib/alternates.ts';
import { rehypeFigure } from './src/lib/rehype-figure.mjs';

// Built once at config load; the sitemap serializer reads from it per URL.
// Both sources cover routes whose slug is translated — articles, read from the
// content files, and the identity pages, declared in src/i18n/pages.ts.
const ALTERNATES = new Map([
  ...pageAlternates(SITE.url),
  ...postAlternates(SITE.url),
]);

export default defineConfig({
  // `site` is required for sitemap, RSS and absolute canonical URLs.
  site: SITE.url,
  // Every page is prerendered. The adapter exists for one route — the write
  // endpoint behind the reaction button — which opts out with `prerender`.
  adapter: vercel(),
  integrations: [
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', fr: 'fr' } },
      // Translated slugs defeat the path-matching pairing; put them back.
      serialize(item) {
        const links = ALTERNATES.get(item.url);
        return links ? { ...item, links } : item;
      },
    }),
  ],
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    // English stays unprefixed: /blog/slug is the canonical URL sent to dev.to.
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
    // Vite blocks unknown Host headers; allow tunnels so `astro dev` can be
    // opened from a phone. Dev only — the built site is static files.
    server: { allowedHosts: ['.ngrok-free.app', '.ngrok.app', '.trycloudflare.com'] },
  },
  markdown: {
    // A markdown image title becomes a caption crediting the image's origin.
    rehypePlugins: [rehypeFigure],
    shikiConfig: {
      // Single theme: the site is dark-canonical, and a second theme would
      // double the inlined highlight CSS for no gain.
      theme: 'vesper',
      wrap: false,
    },
  },
});
