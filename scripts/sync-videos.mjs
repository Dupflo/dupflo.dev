/**
 * Pulls Instagram Reels into the `videos` collection.
 *
 *   npm run sync:videos
 *
 * Writes one markdown file per reel and downloads its thumbnail, because the
 * URLs the Graph API returns live on a CDN and expire — they cannot be stored
 * and served as-is.
 *
 * Existing files are never overwritten. Once a video is imported it is yours:
 * edit the title, add `tiktokUrl`, set a `series`. Re-running the sync only
 * adds what is missing.
 */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Facebook Login for Business: the token is an `EA…` Meta token, so the call
// goes through graph.facebook.com. Instagram Login (`IGA…` tokens) would use
// graph.instagram.com instead — same fields, same shape.
const API = 'https://graph.facebook.com/v26.0';

const CONTENT_DIR = 'src/content/videos';
const THUMB_DIR = 'src/assets/videos';
const FIELDS =
  'id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,like_count';

const { IG_USER_ID, IG_ACCESS_TOKEN } = process.env;

if (!IG_USER_ID || !IG_ACCESS_TOKEN) {
  console.error(
    'Missing IG_USER_ID or IG_ACCESS_TOKEN.\n' +
      'Copy .env.example to .env and fill both in, then re-run.',
  );
  process.exit(1);
}

/** Walk the paginated media edge until Instagram stops handing us a cursor. */
async function fetchAllMedia() {
  const media = [];
  let url = `${API}/${IG_USER_ID}/media?fields=${FIELDS}&limit=50&access_token=${IG_ACCESS_TOKEN}`;

  while (url) {
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Graph API ${res.status}: ${body}`);
    }
    const page = await res.json();
    media.push(...(page.data ?? []));
    url = page.paging?.next ?? null;
  }
  return media;
}

/**
 * Metrics live behind the insights edge, one call per media.
 *
 * `total_views` and `total_likes`, not `views` and `like_count`: a reel
 * crossposted to the Facebook page earns most of its reach there, and the
 * total is the figure Instagram itself displays. One reel here reads 1,004
 * views on Instagram alone against 20,706 across Meta.
 */
async function fetchMetrics(id) {
  const res = await fetch(
    `${API}/${id}/insights?metric=total_views,total_likes&access_token=${IG_ACCESS_TOKEN}`,
  );
  if (!res.ok) return { views: null, likes: null };
  const body = await res.json();
  const byName = Object.fromEntries(
    (body.data ?? []).map((m) => [m.name, m.values?.[0]?.value ?? null]),
  );
  return { views: byName.total_views ?? null, likes: byName.total_likes ?? null };
}

/** Rewrites just the metric lines, leaving every hand-edited field alone. */
function patchMetrics(source, views, likes) {
  let out = source;
  for (const [key, value] of [['views', views], ['likes', likes]]) {
    if (value === null || value === undefined) continue;
    const line = `${key}: ${value}`;
    out = new RegExp(`^${key}: .*$`, 'm').test(out)
      ? out.replace(new RegExp(`^${key}: .*$`, 'm'), line)
      : out.replace(/^(sourceId: .*)$/m, `${line}\n$1`);
  }
  return out;
}

const slugify = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

/** First line of the caption, minus hashtags — that is the actual title. */
const titleFrom = (caption, timestamp) => {
  const firstLine = (caption ?? '')
    .split('\n')
    .map((l) => l.replace(/#\S+/g, '').trim())
    .find(Boolean);
  return firstLine || `Reel ${timestamp.slice(0, 10)}`;
};

const yaml = (value) => `"${String(value).replace(/"/g, '\\"')}"`;

async function main() {
  await mkdir(CONTENT_DIR, { recursive: true });
  await mkdir(THUMB_DIR, { recursive: true });

  // Anything already carrying a sourceId has been imported before.
  const existing = new Map();
  // Slugs already on disk, so a re-run never overwrites a neighbour.
  const taken = new Set();
  for (const file of await readdir(CONTENT_DIR)) {
    if (!file.endsWith('.md')) continue;
    taken.add(file.replace(/\.md$/, ''));
    const found = (await readFile(join(CONTENT_DIR, file), 'utf8')).match(
      /^sourceId:\s*"?([^"\n]+)"?/m,
    );
    if (found) existing.set(found[1], file);
  }

  const media = await fetchAllMedia();
  const reels = media.filter(
    (m) => m.media_type === 'VIDEO' || m.media_product_type === 'REELS',
  );
  console.log(`${media.length} items, ${reels.length} videos`);

  let added = 0;
  let refreshed = 0;

  // Metrics move, so they are refreshed on every run — unlike the rest of the
  // frontmatter, which is written once and then belongs to you.
  for (const [id, file] of existing) {
    const { views, likes } = await fetchMetrics(id);
    const path = join(CONTENT_DIR, file);
    const before = await readFile(path, 'utf8');
    const after = patchMetrics(before, views, likes);
    if (after !== before) {
      await writeFile(path, after);
      refreshed++;
    }
  }

  for (const item of reels) {
    if (existing.has(item.id)) continue;

    const date = item.timestamp.slice(0, 10);
    const title = titleFrom(item.caption, item.timestamp);
    // A series posted on one day shares its caption's first line, so the slug
    // collides. Fall back to the media id to keep every reel its own file.
    const base = slugify(title) ? `${date}-${slugify(title)}` : `${date}-${item.id}`;
    const slug = taken.has(base) ? `${base}-${item.id.slice(-6)}` : base;
    taken.add(slug);

    const thumbUrl = item.thumbnail_url ?? item.media_url;
    let thumbnail = '';
    if (thumbUrl) {
      const res = await fetch(thumbUrl);
      if (res.ok) {
        const bytes = Buffer.from(await res.arrayBuffer());
        await writeFile(join(THUMB_DIR, `${slug}.jpg`), bytes);
        thumbnail = `../../assets/videos/${slug}.jpg`;
      } else {
        console.warn(`  thumbnail failed for ${slug} (${res.status})`);
      }
    }

    const { views, likes } = await fetchMetrics(item.id);

    const frontmatter = [
      '---',
      `title: ${yaml(title)}`,
      'platform: instagram',
      `url: ${item.permalink}`,
      `date: ${date}`,
      thumbnail ? `thumbnail: ${thumbnail}` : null,
      views !== null ? `views: ${views}` : null,
      likes !== null ? `likes: ${likes}` : null,
      `sourceId: ${yaml(item.id)}`,
      '---',
      '',
    ]
      .filter(Boolean)
      .join('\n');

    await writeFile(join(CONTENT_DIR, `${slug}.md`), frontmatter);
    console.log(`  + ${slug}`);
    added++;
  }

  console.log(
    `\n${added} new, ${refreshed} metrics updated.` +
      (added || refreshed ? ' Review, then commit.' : ''),
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
