/**
 * Prepares an article for dev.to, Medium and the rest.
 *
 *   npm run syndicate why-overkill-skills-lead-to-ai-workslop
 *
 * Two things make a copy-paste fail elsewhere, and both are handled here:
 *
 *   Images are relative paths into src/assets — meaningless outside this repo.
 *   They are copied once into public/syndication/<slug>/, which gives them a
 *   stable URL that survives every rebuild. The hashed /_astro/ filenames the
 *   build produces would not: they change, and an external post lives for years.
 *
 *   dev.to tags reject hyphens, so `claude-code` becomes `claudecode`, and it
 *   takes four at most.
 */
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';

const SITE = 'https://dupflo.dev';
const POSTS = 'src/content/posts';
const OUT = 'syndication';

const slugArg = process.argv[2];
if (!slugArg) {
  console.error('Usage: npm run syndicate <slug>');
  process.exit(1);
}

/** Finds the article in whichever language folder holds it. */
async function locate(slug) {
  for (const lang of ['en', 'fr']) {
    const dir = join(POSTS, lang);
    const files = await readdir(dir).catch(() => []);
    const match = files.find((f) => f.replace(/\.mdx?$/, '') === slug);
    if (match) return { lang, path: join(dir, match), slug };
  }
  return null;
}

const found = await locate(slugArg);
if (!found) {
  console.error(`No article called "${slugArg}" under ${POSTS}/<lang>/.`);
  process.exit(1);
}

const source = await readFile(found.path, 'utf8');
const [, frontmatter, body] = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];
if (!frontmatter) {
  console.error('Could not read the frontmatter.');
  process.exit(1);
}

const field = (name) =>
  frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim() ?? '';

const title = field('title');
const description = field('description');
const tags = (field('tags').match(/\[(.*)\]/)?.[1] ?? '')
  .split(',')
  .map((t) => t.trim().replace(/-/g, ''))
  .filter(Boolean)
  .slice(0, 4); // dev.to caps at four, and rejects hyphens.

const canonical = `${SITE}${
  found.lang === 'en' ? '' : '/fr'
}/blog/${found.slug}/`;

// Copy every referenced image to a stable public path, rewriting as we go.
const imageDir = join('public', OUT, found.slug);
await mkdir(imageDir, { recursive: true });
const copied = [];

let out = body;
for (const [, alt, relative] of body.matchAll(/!\[([^\]]*)\]\((\.[^)]+)\)/g)) {
  const from = resolve(dirname(found.path), relative);
  const name = basename(relative);
  await copyFile(from, join(imageDir, name));
  const url = `${SITE}/${OUT}/${found.slug}/${name}`;
  out = out.replace(`](${relative})`, `](${url})`);
  copied.push(name);
}

const cover = field('cover')
  ? `${SITE}/${OUT}/${found.slug}/${basename(field('cover'))}`
  : '';
if (field('cover') && !copied.includes(basename(field('cover')))) {
  await copyFile(
    resolve(dirname(found.path), field('cover')),
    join(imageDir, basename(field('cover'))),
  );
  copied.push(basename(field('cover')));
}

const devto = [
  '---',
  `title: ${title}`,
  'published: false',
  `description: ${description}`,
  `tags: ${tags.join(', ')}`,
  `canonical_url: ${canonical}`,
  cover ? `cover_image: ${cover}` : null,
  '---',
  '',
  out.trim(),
  '',
]
  .filter((line) => line !== null)
  .join('\n');

await mkdir(OUT, { recursive: true });
const target = join(OUT, `${found.slug}.devto.md`);
await writeFile(target, devto);

console.log(`${target}`);
console.log(`  canonical : ${canonical}`);
console.log(`  tags      : ${tags.join(', ')}`);
console.log(`  images    : ${copied.length} copied to ${imageDir}`);
console.log(`\nCommit public/${OUT}/ so the images resolve, then paste the file.`);
console.log('For Medium, do not paste — use medium.com/p/import on the canonical URL.');
