import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const version = args.find((arg) => !arg.startsWith('--'));

if (!version || !/^\d+\.\d+\.\d+/.test(version)) {
  console.error('notify-slack: usage: node scripts/notify-slack.mjs <version> [--dry-run]');
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

const npmUrl = `https://www.npmjs.com/package/${pkg.name}/v/${version}`;
const repoUrl = (pkg.repository?.url ?? '').replace(/\.git$/, '');
const releaseUrl = repoUrl ? `${repoUrl}/releases/tag/v${version}` : '';

const links = [`<${npmUrl}|npm>`];

if (releaseUrl) {
  links.push(`<${releaseUrl}|release notes>`);
}

const text = `*${pkg.name} v${version}* published — ${links.join(' · ')}`;
const payload = JSON.stringify({ text });

if (dryRun) {
  process.stdout.write(`${payload}\n`);
  process.exit(0);
}

const webhook = process.env.SLACK_NOTIFICATION_URL;

if (!webhook) {
  process.stdout.write('notify-slack: SLACK_NOTIFICATION_URL is unset — skipping\n');
  process.exit(0);
}

let webhookHost;

try {
  webhookHost = new URL(webhook).host;
} catch {
  console.error('notify-slack: SLACK_NOTIFICATION_URL is not a valid URL');
  process.exit(1);
}

process.stdout.write(`notify-slack: posting to ${webhookHost}\n`);

const response = await fetch(webhook, {
  method: 'POST',
  headers: {
    'Content-type': 'application/json',
    'User-Agent': `viax-uxm-release-notifier/${pkg.version}`,
  },
  body: payload,
});

if (!response.ok) {
  const body = (await response.text()).replace(/\s+/g, ' ').trim().slice(0, 300);
  console.error(`notify-slack: webhook returned ${response.status} ${response.statusText}: ${body}`);
  process.exit(1);
}

process.stdout.write(`notify-slack: announced ${pkg.name} v${version}\n`);
