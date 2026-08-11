# dupflo.dev

Personal site of [Florian Dupuis](https://dupflo.dev) — Senior Product Engineer.
Canonical home for the articles (syndicated to dev.to afterwards), the project
list, and the archive of the short-form videos published as
[@dupflodev](https://www.tiktok.com/@dupflodev).

Bilingual: English is unprefixed, French lives under `/fr`. Articles are written
once per language and paired by a `translationKey` — an article without a twin
simply does not appear in the other language's list.

## Stack

Astro with content collections and MDX, Tailwind, TypeScript in strict mode,
deployed static on Vercel. No CMS, no database, no client-side JavaScript: the
content lives in this repo as markdown and is committed by hand.

Three type roles, self-hosted, latin subset — IBM Plex Mono for the interface,
Instrument Serif for titles, Source Serif 4 for prose. Dark is the canonical
theme; light is derived from it.

## Content model

| Collection  | Shape                                                            |
| ----------- | ---------------------------------------------------------------- |
| `posts`     | One file per language under `posts/<lang>/`, paired by `translationKey` |
| `projects`  | One file per project. Status, stack and links are language-neutral; only the prose is localized |
| `videos`    | One file per reel, written by the sync script. Not translated — a French video keeps its French title everywhere |
| `resources` | Lead magnets, served at `/r/<slug>` — short enough to say out loud in a video |

## Scripts

```bash
npm run dev            # local server
npm run build          # astro check && astro build
npm run sync:videos    # pull Instagram reels into src/content/videos
npm run token:refresh  # swap a short-lived token for a permanent Page token
```

The Instagram sync writes markdown files and downloads thumbnails, so the build
never depends on the API or on a live token. Existing files are never
overwritten: once a video is imported, its frontmatter is yours to edit.

Copy `.env.example` to `.env` for the sync scripts. Nothing in `.env` is needed
to build or deploy the site.

## Why some things are the way they are

**Images live in `src/assets`, not `public`.** Anything under `public` escapes
Astro's image pipeline, and the article illustrations weigh 1.4 MB raw against
about 100 kB served.

**Absolute URLs are normalised in one place.** The build serves directory-style
paths, so `canonical`, `og:url` and `hreflang` all have to carry the trailing
slash — a canonical that redirects is a canonical that gets ignored.

**`hreflang` is only emitted when the twin page exists.** Declaring an
alternate that 404s is worse than declaring none.

**Open Graph cards are rendered at build time** with satori, from TTF copies of
the fonts kept in `src/assets/og-fonts`. Those are never served to a browser —
satori cannot read woff2.
