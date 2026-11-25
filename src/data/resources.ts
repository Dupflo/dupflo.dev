/**
 * Free resources offered from the short-form videos. They are in French, like
 * the videos; the English home lists them too, flagged as French.
 * Short links (/cerveau, /kit, /opencode) live in vercel.json for DMs.
 */
export interface Resource {
  title: string;
  tagline: { en: string; fr: string };
  href: string;
  /** What the reader gets when they click. */
  kind: 'guide' | 'pdf' | 'list';
}

export const RESOURCES: Resource[] = [
  {
    title: 'Second cerveau',
    tagline: {
      en: 'Set up a second brain your AI reads before it answers. Claude, ChatGPT or Mistral.',
      fr: 'Installe un second cerveau que ton IA lit avant de te répondre. Claude, ChatGPT ou Mistral.',
    },
    href: '/fr/second-cerveau/',
    kind: 'guide',
  },
  {
    title: 'Guide OpenCode',
    tagline: {
      en: 'Code with AI without a subscription: free models, set up step by step.',
      fr: 'Coder avec l’IA sans abonnement : les modèles gratuits, pas à pas.',
    },
    href: '/guide-opencode.pdf',
    kind: 'pdf',
  },
  {
    title: 'Kit de survie numérique',
    tagline: {
      en: 'Five habits for the day your bank or your phone goes down.',
      fr: 'Cinq réflexes pour le jour où ta banque ou ton téléphone lâche.',
    },
    href: '/kit-survie-numerique.pdf',
    kind: 'pdf',
  },
  {
    title: 'Formation 101',
    tagline: {
      en: 'Build a professional website with AI. Waiting list, launch price.',
      fr: 'Construire ton site professionnel avec l’IA. Liste d’attente, prix de lancement.',
    },
    href: '/fr/liste-attente/',
    kind: 'list',
  },
];
