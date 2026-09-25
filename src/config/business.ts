/**
 * Publisher identity and compliance facts. Single source of truth.
 *
 * The legal pages, /contact, /about and the footer all read from here — no
 * SIREN, SIRET, address or phone number is written twice anywhere in the site.
 *
 * The registry values were read from the public INSEE/RNE record on
 * 2026-09-25: https://annuaire-entreprises.data.gouv.fr/entreprise/852600543
 * Fields still needing Florian's input are marked TODO.
 */
export const business = {
  /** An `entrepreneur individuel` trades under their own name — there is no company name. */
  legalName: 'Florian Dupuis',

  /** Short label, used in the footer and the identity blocks. */
  legalForm: {
    fr: 'Entrepreneur individuel (micro-entreprise)',
    en: 'Sole trader (micro-enterprise)',
  },

  /** Who answers for what is published. Required by French law. */
  publisher: 'Florian Dupuis',

  siren: '852 600 543',
  /** Head office establishment (NIC 00015). */
  siret: '852 600 543 00015',

  /** Main activity, as declared to INSEE. */
  ape: {
    code: '62.01Z',
    label: {
      fr: 'Programmation informatique',
      en: 'Computer programming',
    },
  },

  registry: {
    fr: 'Registre National des Entreprises (RNE)',
    en: 'French National Business Register (RNE)',
  },

  /** Registration date, ISO. Displayed as a year. */
  registeredSince: '2019-07-10',

  /** Head office, and the address that must appear in the mentions légales. */
  address: {
    street: '43 B rue Michel Grimault',
    postalCode: '44110',
    city: 'Châteaubriant',
    country: 'France',
  },

  email: 'hello@dupflo.dev',

  // TODO Florian: replace with the number you are willing to publish (a
  // reachable line — TikTok's reviewer may dial it). International format.
  phone: '+33 6 00 00 00 00',

  /** Franchise en base de TVA. Mandatory wording under the micro regime. */
  vat: {
    fr: 'TVA non applicable, article 293 B du Code général des impôts.',
    en: 'VAT not applicable — Article 293 B of the French General Tax Code.',
  },

  /** Verifiable third-party record of the entity, linked from the legal pages. */
  registryUrl: 'https://annuaire-entreprises.data.gouv.fr/entreprise/852600543',

  /** Named in the mentions légales, as French law requires. */
  host: {
    name: 'Vercel Inc.',
    address: '440 N Barranca Avenue #4133, Covina, CA 91723, USA',
    url: 'https://vercel.com',
  },

  // TODO Florian: bump this whenever you change the legal or privacy text.
  updatedAt: '2026-09-25',
} as const;

/** `43 B rue Michel Grimault, 44110 Châteaubriant, France` */
export const addressLine = (): string =>
  `${business.address.street}, ${business.address.postalCode} ${business.address.city}, ${business.address.country}`;

/** A date stored as ISO, shown the way each language writes dates. */
export const formatDate = (iso: string, lang: 'en' | 'fr'): string =>
  new Date(iso).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
