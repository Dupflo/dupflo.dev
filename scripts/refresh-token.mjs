/**
 * Turns a short-lived Graph API Explorer token into a permanent Page token.
 *
 *   npm run token:refresh
 *
 * Three steps, all against Meta:
 *   1. exchange the short-lived user token for a long-lived one (60 days)
 *   2. read /me/accounts with it — the Page token it returns does not expire
 *   3. verify with debug_token and write the result back into .env
 *
 * Nothing is printed except metadata: no secret, no token value.
 */
import { readFile, writeFile } from 'node:fs/promises';

const API = 'https://graph.facebook.com/v26.0';
const { IG_APP_ID, IG_APP_SECRET, IG_ACCESS_TOKEN } = process.env;

if (!IG_APP_ID || !IG_APP_SECRET || !IG_ACCESS_TOKEN) {
  console.error(
    'Missing IG_APP_ID, IG_APP_SECRET or IG_ACCESS_TOKEN in .env.\n' +
      'The App Secret is in your app dashboard under Settings → Basic.',
  );
  process.exit(1);
}

async function get(path, params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/${path}?${query}`);
  const body = await res.json();
  if (body.error) {
    const { message, code } = body.error;
    // 190 covers expired and malformed tokens — the only failure worth a hint.
    if (code === 190) {
      console.error(
        `The token in .env is no longer valid.\n  ${message}\n\n` +
          'Graph API Explorer tokens live about an hour. Generate a fresh one\n' +
          'at https://developers.facebook.com/tools/explorer/, paste it into\n' +
          'IG_ACCESS_TOKEN, and re-run this straight away.',
      );
      process.exit(1);
    }
    throw new Error(`${path}: ${message}`);
  }
  return body;
}

const day = (seconds) =>
  seconds ? new Date(seconds * 1000).toISOString().slice(0, 10) : 'never';

const longLived = await get('oauth/access_token', {
  grant_type: 'fb_exchange_token',
  client_id: IG_APP_ID,
  client_secret: IG_APP_SECRET,
  fb_exchange_token: IG_ACCESS_TOKEN,
});
console.log('1. long-lived user token obtained');

const { data: pages } = await get('me/accounts', {
  fields: 'name,access_token,instagram_business_account{id,username,media_count}',
  access_token: longLived.access_token,
});

const page = pages.find((p) => p.instagram_business_account);
if (!page) {
  console.error(
    'No Page with a linked Instagram professional account.\n' +
      'Link the account in Meta Business Suite, then re-run.',
  );
  process.exit(1);
}
const ig = page.instagram_business_account;
console.log(`2. page "${page.name}" → @${ig.username} (${ig.media_count} media)`);

const { data: debug } = await get('debug_token', {
  input_token: page.access_token,
  access_token: `${IG_APP_ID}|${IG_APP_SECRET}`,
});
console.log(`3. token type ${debug.type}, expires ${day(debug.expires_at)}`);

// Rewrite only the two lines we own; the rest of .env is left untouched.
const env = await readFile('.env', 'utf8');
const patched = env
  .replace(/^IG_ACCESS_TOKEN=.*$/m, `IG_ACCESS_TOKEN=${page.access_token}`)
  .replace(/^IG_USER_ID=.*$/m, `IG_USER_ID=${ig.id}`);
await writeFile('.env', patched);

console.log('\n.env updated.');
if (debug.expires_at) {
  console.warn('This token still expires — re-run before that date.');
} else {
  console.log('Permanent token. Copy it into the GitHub secrets and forget it.');
}
