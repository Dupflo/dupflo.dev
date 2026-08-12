export const LANGS = ['en', 'fr'] as const;
export type Lang = (typeof LANGS)[number];

/** English is unprefixed: /blog/slug is the canonical URL syndicated to dev.to. */
export const DEFAULT_LANG: Lang = 'en';

export const UI = {
  en: {
    role: 'Senior Product Engineer — agentic AI products & MCP',
    bio: [
      'Nine years shipping consumer, SaaS and e-commerce products. Co-founder and CTO of Anywwwhere.',
      'I build applications an agent can drive over MCP, not interfaces that call an LLM.',
      'Long-form in English here, short-form in French as @dupflodev.',
    ],
    nav: { blog: 'Writing', projects: 'Projects', videos: 'Videos', cv: 'Career' },
    sections: {
      writing: 'Writing',
      projects: 'Products',
      oss: 'Open source',
      video: 'Videos',
      resources: 'Resources',
    },
    all: 'All',
    seeAllVideos: (n: number) => `See all ${n} videos`,
    pages: {
      blog: 'Everything I have written here, newest first.',
      projects: 'What I ship, and what I published for other people to use.',
      videos: 'Short-form, in French. Thumbnails link straight to the post.',
      cv: 'Nine years of shipping, and where it happened.',
    },
    watchOn: 'Watch on',
    reaction: {
      prompt: 'I read this and I liked it',
      done: 'Noted — thank you',
    },
    experience: 'Experience',
    education: 'Education',
    ongoing: 'now',
    graduated: 'graduated',
    noPosts: 'Nothing here yet in English.',
    minutes: 'min',
    otherLang: 'Français',
    /** Shown on a list when the entry is not available in the current language. */
    onlyInOtherLang: 'in French',
    download: 'Download',
    status: { live: 'live', wip: 'wip', archived: 'archived' },
  },
  fr: {
    role: 'Senior Product Engineer — produits IA agentiques & MCP',
    bio: [
      'Neuf ans à lancer des produits consumer, SaaS et e-commerce. Cofondateur et CTO d’Anywwwhere.',
      'Je construis des applications qu’un agent peut piloter via MCP, pas des interfaces qui appellent un LLM.',
      'Articles longs en anglais ici, format court en français sous @dupflodev.',
    ],
    nav: { blog: 'Articles', projects: 'Projets', videos: 'Vidéos', cv: 'Parcours' },
    sections: {
      writing: 'Articles',
      projects: 'Produits',
      oss: 'Open source',
      video: 'Vidéos',
      resources: 'Ressources',
    },
    all: 'Tout',
    seeAllVideos: (n: number) => `Voir les ${n} vidéos`,
    pages: {
      blog: 'Tout ce que j’ai écrit ici, le plus récent en premier.',
      projects: 'Ce que je livre, et ce que j’ai publié pour les autres.',
      videos: 'Format court, en français. Les vignettes ouvrent la publication.',
      cv: 'Neuf ans à livrer, et les endroits où ça s’est passé.',
    },
    watchOn: 'Voir sur',
    reaction: {
      prompt: 'J’ai lu et j’ai aimé',
      done: 'C’est noté — merci',
    },
    experience: 'Expérience',
    education: 'Formation',
    ongoing: 'auj.',
    graduated: 'diplômé',
    noPosts: 'Rien ici pour l’instant en français.',
    minutes: 'min',
    otherLang: 'English',
    onlyInOtherLang: 'en anglais',
    download: 'Télécharger',
    status: { live: 'en ligne', wip: 'en cours', archived: 'archivé' },
  },
} as const satisfies Record<Lang, unknown>;

export const t = (lang: Lang) => UI[lang];

/** The language a page is not currently in. Two locales, so this is total. */
export const otherLang = (lang: Lang): Lang => (lang === 'en' ? 'fr' : 'en');

/** Prefix a root-relative path with the locale, except for the default one. */
export const localePath = (lang: Lang, path = '/'): string => {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === DEFAULT_LANG) return clean;
  return clean === '/' ? '/fr/' : `/fr${clean}`;
};

/** Entry ids are `<lang>/<slug>`; URLs are not. */
export const stripLang = (id: string): string => id.replace(/^(en|fr)\//, '');
