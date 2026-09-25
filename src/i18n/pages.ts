import { otherLang, type Lang } from './ui';

/**
 * The publisher-identity pages.
 *
 * Their slugs are translated, so no rule can derive one language's path from
 * the other's the way `localePath` does for /blog or /cv. This table is the
 * only place that pairing exists: the footer builds its links from it, each
 * page reads its own twin for hreflang, and the sitemap uses it to declare the
 * alternates @astrojs/sitemap's path comparison cannot see.
 */
export const IDENTITY_PAGES = [
  { key: 'legal', en: '/legal-notice', fr: '/fr/mentions-legales' },
  { key: 'privacy', en: '/privacy', fr: '/fr/confidentialite' },
  { key: 'contact', en: '/contact', fr: '/fr/contact' },
  { key: 'about', en: '/about', fr: '/fr/a-propos' },
] as const;

export type IdentityKey = (typeof IDENTITY_PAGES)[number]['key'];

/** This page's path in the given language. */
export const identityPath = (key: IdentityKey, lang: Lang): string => {
  const page = IDENTITY_PAGES.find((entry) => entry.key === key);
  if (!page) throw new Error(`Unknown identity page: ${key}`);
  return page[lang];
};

/** The same page in the other language — what `translationHref` expects. */
export const identityTwin = (key: IdentityKey, lang: Lang): string =>
  identityPath(key, otherLang(lang));
