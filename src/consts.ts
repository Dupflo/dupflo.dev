/**
 * Single source of truth for site-level metadata.
 * Used by astro.config.mjs, <head>, the RSS feed and OG image generation.
 * Anything that changes with the language lives in src/i18n/ui.ts instead.
 */
export const SITE = {
  url: 'https://dupflo.dev',
  title: 'dupflo.dev',
  author: 'Florian Dupuis',
} as const;

/** Google Analytics 4. Loaded in production only, so local work stays out. */
export const GA_ID = 'G-K2T9YNTSVK';

export const DESCRIPTION = {
  en: 'Notes on agentic development, Claude Code and MCP, by Florian Dupuis — Senior Product Engineer.',
  fr: 'Notes sur le développement agentique, Claude Code et les MCP, par Florian Dupuis — Senior Product Engineer.',
} as const;

/** Same shape wherever an author is declared: JSON-LD, RSS, meta. */
export const AUTHOR = {
  '@type': 'Person',
  name: SITE.author,
  url: SITE.url,
  sameAs: [
    'https://github.com/Dupflo',
    'https://linkedin.com/in/florian-dupuis-701310b1',
    'https://www.tiktok.com/@dupflodev',
    'https://www.instagram.com/dupflodev',
    'https://www.youtube.com/@flo_dev',
  ],
} as const;

export const LINKS = [
  { href: 'https://github.com/Dupflo', label: 'GitHub' },
  { href: 'https://linkedin.com/in/florian-dupuis-701310b1', label: 'LinkedIn' },
  { href: 'https://www.tiktok.com/@dupflodev', label: 'TikTok' },
  { href: 'https://www.instagram.com/dupflodev', label: 'Instagram' },
  { href: 'https://www.youtube.com/@flo_dev', label: 'YouTube' },
  // TODO: swap for the address you actually want public.
  { href: 'mailto:hello@dupflo.dev', label: 'Email' },
  { href: '/rss.xml', label: 'RSS' },
] as const;
