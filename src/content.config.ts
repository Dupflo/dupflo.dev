import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
// `z` re-exported from astro:content is deprecated in Astro 7.
import { z } from 'astro/zod';

const md = (dir: string) =>
  glob({ base: `./src/content/${dir}`, pattern: '**/*.{md,mdx}' });

/**
 * A string that exists in both languages. Used where the entry itself is
 * language-neutral and only its prose differs — a project has one status, one
 * stack and one URL, but two taglines.
 */
const localized = () => z.object({ en: z.string(), fr: z.string() });

/**
 * Technical articles, one file per language under posts/<lang>/.
 * Entries pair up through `translationKey`; an article without a twin simply
 * does not appear in the other language's list.
 *
 * This site is the canonical home; dev.to is a syndication target.
 * `canonicalUrl` exists for the reverse case only — an article first published
 * elsewhere that is being mirrored here.
 */
const posts = defineCollection({
  loader: md('posts'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      lang: z.enum(['fr', 'en']),
      /** Shared across translations of the same article. */
      translationKey: z.string(),
      tags: z.array(z.string()).default([]),
      canonicalUrl: z.url().optional(),
      cover: image().optional(),
      draft: z.boolean().default(false),
    }),
});

/**
 * Products and open-source work, split by `kind`. One file per project:
 * status, stack and links do not change with the language, so only the prose
 * is localized.
 * Ordered by `order` ascending; `featured` promotes an entry to the home page.
 */
const projects = defineCollection({
  loader: md('projects'),
  schema: z.object({
    title: z.string(),
    tagline: localized(),
    description: localized(),
    /** Products I own vs. code I published for other people to use. */
    kind: z.enum(['product', 'oss']),
    /** Applyzi portfolio entity id — the merge key when re-importing facts. */
    applyziId: z.string().optional(),
    status: z.enum(['live', 'wip', 'archived']),
    stack: z.array(z.string()),
    repo: z.url().optional(),
    url: z.url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

/**
 * TikTok / Instagram posts. Not localized: a French video keeps its French
 * title on the English pages, because that is its actual title.
 * Listing pages render a thumbnail and a link — never an iframe, which would
 * cost third-party JS on a static page.
 */
const videos = defineCollection({
  loader: md('videos'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      platform: z.enum(['tiktok', 'instagram']),
      url: z.url(),
      date: z.coerce.date(),
      description: z.string().optional(),
      series: z.string().optional(),
      /** Same video posted on TikTok, when it is a crosspost. */
      tiktokUrl: z.url().optional(),
      /** Instagram media id. Set by `npm run sync:videos`, its dedup key. */
      sourceId: z.string().optional(),
      /** Refreshed on every sync — these move after publication. */
      views: z.number().optional(),
      likes: z.number().optional(),
      /** Local, committed still. Falls back to a typographic tile when absent. */
      thumbnail: image().optional(),
    }),
});

/**
 * Lead magnets, one file per language under resources/<lang>/.
 * Served at /r/<slug> — deliberately unprefixed, short enough to say out loud
 * in a video or drop in a bio. `gated` is declared now and honoured later:
 * while false, the landing page links straight to the file.
 */
const resources = defineCollection({
  loader: md('resources'),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    lang: z.enum(['fr', 'en']),
    translationKey: z.string(),
    /** Path under /public, e.g. /downloads/mcp-starter-kit.zip */
    file: z.string().startsWith('/downloads/'),
    format: z.enum(['pdf', 'zip', 'md']),
    gated: z.boolean().default(false),
    relatedVideos: z.array(reference('videos')).default([]),
    relatedPosts: z.array(reference('posts')).default([]),
    published: z.boolean().default(true),
    order: z.number().default(0),
  }),
});

export const collections = { posts, projects, videos, resources };
