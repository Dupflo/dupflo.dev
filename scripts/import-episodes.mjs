/**
 * Writes series metadata onto the video files.
 *
 *   npm run import:episodes
 *
 * Instagram captions are hooks, so they never name the tool an episode covers.
 * That knowledge only exists in the series page Florian maintains by hand, and
 * no amount of string matching recovers it — hence a mapping filled once, here.
 *
 * Only the series fields are touched. Everything the Instagram sync owns, and
 * anything edited by hand, is left alone.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const SHEET = 'scripts/episode-videos.tsv';
const DIR = 'src/content/videos';
const SERIES = '1jour1skill';

const rows = (await readFile(SHEET, 'utf8'))
  .split('\n')
  .filter((line) => line.trim() && !line.startsWith('#'))
  .slice(1) // header
  .map((line) => {
    const [episode, tool, pitch, toolUrl, slug] = line.split('\t');
    return { episode: Number(episode), tool, pitch, toolUrl, slug: slug?.trim() };
  })
  .filter((row) => row.slug);

if (rows.length === 0) {
  console.log(`No mapping filled in ${SHEET}. Nothing to do.`);
  process.exit(0);
}

const files = new Set(await readdir(DIR));
const yaml = (v) => `"${String(v).replace(/"/g, '\\"')}"`;

let written = 0;
for (const row of rows) {
  const file = `${row.slug}.md`;
  if (!files.has(file)) {
    console.warn(`  unknown video: ${row.slug}`);
    continue;
  }
  const path = join(DIR, file);
  let source = await readFile(path, 'utf8');

  const fields = {
    series: yaml(SERIES),
    episode: row.episode,
    tool: yaml(row.tool),
    pitch: yaml(row.pitch),
    toolUrl: yaml(row.toolUrl),
  };

  for (const [key, value] of Object.entries(fields)) {
    const line = `${key}: ${value}`;
    const existing = new RegExp(`^${key}: .*$`, 'm');
    source = existing.test(source)
      ? source.replace(existing, line)
      : source.replace(/^(sourceId: .*)$/m, `${line}\n$1`);
  }

  await writeFile(path, source);
  console.log(`  ${String(row.episode).padStart(2, '0')}  ${row.tool}  →  ${row.slug}`);
  written++;
}

console.log(`\n${written} episode(s) written. Review, then commit.`);
