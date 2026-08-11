import type { Lang } from '../i18n/ui';

/**
 * Career timeline. A plain data file rather than a content collection: there is
 * one page, no markdown body, and no reason to author these as separate files.
 *
 * Mirrors the Applyzi profile, minus the entries hidden there — that hiding is
 * an editorial choice already made, and this page respects it.
 */

type Localized = Record<Lang, string>;

export interface Role {
  company: string;
  position: Localized;
  /** Displayed as-is; `end` omitted means still ongoing. */
  start: string;
  end?: string;
  location: string;
  points: Record<Lang, string[]>;
  stack: string[];
  url?: string;
}

export const ROLES: Role[] = [
  {
    company: '@dupflodev',
    position: {
      en: 'Tech content creator — applied AI',
      fr: 'Créateur de contenu tech — IA appliquée',
    },
    start: '2026',
    location: 'France',
    url: 'https://www.tiktok.com/@dupflodev',
    points: {
      en: [
        'Sixty-two videos on agentic development, Claude Code and MCP — writing, narrative structure, motion design and editing.',
        'An industrialised production chain: custom Claude Code commands and skills, slides generated programmatically, codified visual charters.',
        'An editorial line I hold to: debunk received ideas, refuse unverifiable claims, credit every source.',
      ],
      fr: [
        'Soixante-deux vidéos sur le développement agentique, Claude Code et les MCP — écriture, structure narrative, motion design et montage.',
        'Une chaîne de production industrialisée : commandes et skills Claude Code sur mesure, slides générées par code, chartes graphiques codifiées.',
        'Une ligne éditoriale tenue : débunk des idées reçues, refus des promesses invérifiables, sources systématiquement créditées.',
      ],
    },
    stack: ['claude-code', 'mcp', 'node.js', 'motion design'],
  },
  {
    company: 'Anywwwhere',
    position: {
      en: 'Co-founder & CTO / Product Engineer',
      fr: 'Cofondateur & CTO / Product Engineer',
    },
    start: '2023',
    location: 'Rennes',
    url: 'https://anywwwhere.com',
    points: {
      en: [
        'Co-founded a studio built around UX, conversion and bespoke web products.',
        'Designed and built Applyzi: an MCP-native resume generator exposing 23 OAuth-authenticated tools — a resume is produced inside the app or from a third-party agent.',
        'Replaced an external gateway with an in-house agent (DeepSeek, function calling, schema-validated output with retry): 19 seconds of generation against a 5-minute timeout.',
        'Transactional credit model with Stripe in production, Typst document rendering, four languages.',
      ],
      fr: [
        'Cofondation d’une agence orientée UX, conversion et produits web sur mesure.',
        'Conception et développement d’Applyzi : générateur de CV MCP-natif exposant 23 outils authentifiés OAuth — un CV se génère dans l’app comme depuis un agent tiers.',
        'Remplacement d’une passerelle externe par un agent maison (DeepSeek, function calling, sortie validée par schéma et réessai) : 19 secondes de génération contre 5 minutes de timeout.',
        'Modèle de crédits transactionnel avec Stripe en production, rendu documentaire Typst, quatre langues.',
      ],
    },
    stack: ['next.js', 'typescript', 'supabase', 'mcp', 'stripe', 'typst'],
  },
  {
    company: 'Groupe ADP',
    position: {
      en: 'Lead Frontend / Fullstack Engineer',
      fr: 'Lead Frontend / Fullstack Engineer',
    },
    start: '2021',
    location: 'Paris',
    url: 'https://www.parisaeroport.fr',
    points: {
      en: [
        'High-traffic responsive interfaces, 500k to 2M visits a month, on Next.js / React / TypeScript.',
        'WCAG accessibility — keyboard navigation, screen readers — and web performance.',
        'Custom APIs and plugins on Strapi; environments industrialised through Docker, CI/CD and Azure DevOps.',
      ],
      fr: [
        'Interfaces responsive haute-charge, 500k à 2M visites par mois, sous Next.js / React / TypeScript.',
        'Accessibilité WCAG — navigation clavier, lecteurs d’écran — et performance web.',
        'APIs et plugins sur mesure sous Strapi ; environnements industrialisés via Docker, CI/CD et Azure DevOps.',
      ],
    },
    stack: ['next.js', 'typescript', 'strapi', 'docker', 'azure devops'],
  },
  {
    company: 'Absolunet',
    position: {
      en: 'Frontend Engineer',
      fr: 'Frontend Engineer',
    },
    start: '2021',
    end: '2022',
    location: 'Montréal',
    points: {
      en: [
        'International e-commerce platforms on React and Gatsby, wired to Shopify and third-party APIs.',
        'Performance, stability and cross-device rendering on business-critical components.',
      ],
      fr: [
        'Plateformes e-commerce internationales sous React et Gatsby, connectées aux APIs Shopify et à des services tiers.',
        'Performance, stabilité et rendu cross-device sur des composants à fort enjeu business.',
      ],
    },
    stack: ['react', 'gatsby', 'graphql', 'shopify', 'docker'],
  },
];

export interface Study {
  school: string;
  degree: Localized;
  start: string;
  end: string;
  location: string;
  /** Applyzi tracks whether the degree was actually obtained. */
  obtained: boolean;
}

export const STUDIES: Study[] = [
  {
    school: 'West Liberty University',
    degree: {
      en: 'MBA — Organisation & Management',
      fr: 'MBA — Organisation & Management',
    },
    start: '2018',
    end: '2020',
    location: 'West Liberty, USA',
    obtained: false,
  },
  {
    school: 'West Liberty University',
    degree: {
      en: 'BA — Digital Media and Design',
      fr: 'BA — Digital Medias and Design',
    },
    start: '2017',
    end: '2018',
    location: 'West Liberty, USA',
    obtained: true,
  },
  {
    school: 'Friends University',
    degree: { en: "Bachelor's degree — Marketing", fr: 'Bachelor — Marketing' },
    start: '2016',
    end: '2017',
    location: 'Wichita, USA',
    obtained: false,
  },
  {
    school: 'Le Mans Université',
    degree: {
      en: 'DUT — Multimedia and Internet',
      fr: 'DUT — Métiers du Multimédia et de l’Internet',
    },
    start: '2014',
    end: '2016',
    location: 'Laval',
    obtained: true,
  },
];
