import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { SITE } from '../consts';

/**
 * Open Graph cards, rendered at build time.
 *
 * Satori cannot read woff2, so the two faces here are TTF copies kept only for
 * rendering — they are never served to a browser. The card repeats the site's
 * own type contrast: mono for metadata, display serif for the title.
 */

const WIDTH = 1200;
const HEIGHT = 630;

// Dark is the canonical theme, so the card is dark. No light variant: link
// previews do not follow the reader's system setting.
const BG = '#0b0b0c';
const INK = '#e8e4dc';
const DIM = '#85817a';
const ACCENT = '#f5a623';

const fonts = await Promise.all([
  readFile('src/assets/og-fonts/ibm-plex-mono-600.ttf'),
  readFile('src/assets/og-fonts/instrument-serif-400.ttf'),
]).then(([mono, serif]) => [
  { name: 'Mono', data: mono, weight: 600 as const, style: 'normal' as const },
  { name: 'Serif', data: serif, weight: 400 as const, style: 'normal' as const },
]);

export interface CardInput {
  title: string;
  /** Small mono line above the title — date, language, reading time. */
  meta: string;
  /** Optional mono line at the bottom left, e.g. tags. */
  footer?: string;
}

/** Title sizes step down so a long headline still fits the card. */
const titleSize = (title: string) =>
  title.length > 80 ? 60 : title.length > 50 ? 72 : 88;

export async function renderCard({
  title,
  meta,
  footer,
}: CardInput): Promise<Buffer> {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: WIDTH,
          height: HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: BG,
          color: INK,
          padding: '64px 72px',
          // The rule down the left edge is the site's structural device.
          borderLeft: `10px solid ${ACCENT}`,
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontFamily: 'Mono',
                fontSize: 24,
                letterSpacing: 2,
                color: DIM,
              },
              children: meta,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontFamily: 'Serif',
                fontSize: titleSize(title),
                lineHeight: 1.05,
                letterSpacing: -1,
                // Satori has no line clamp; the size step above does the work.
                maxWidth: 1000,
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'Mono',
                fontSize: 24,
                color: DIM,
              },
              children: [
                {
                  type: 'div',
                  props: { style: { display: 'flex' }, children: footer ?? '' },
                },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', color: ACCENT },
                    children: SITE.title,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    { width: WIDTH, height: HEIGHT, fonts },
  );

  return Buffer.from(new Resvg(svg).render().asPng());
}
