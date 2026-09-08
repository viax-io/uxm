import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_NOTES_LENGTH = 2500;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const version = args.find((arg) => !arg.startsWith('--'));

if (!version || !/^\d+\.\d+\.\d+/.test(version)) {
  console.error('notify-slack: usage: node scripts/notify-slack.mjs <version> [--dry-run]');
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

function readChangelogSection(changelog, target) {
  const lines = changelog.split('\n');
  const headingPattern = /^#{1,2} \[?(\d+\.\d+\.\d+[^\]\s]*)\]?/;
  const start = lines.findIndex((line) => {
    const match = line.match(headingPattern);
    return match?.[1] === target;
  });

  if (start === -1) return null;

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (headingPattern.test(lines[i])) {
      end = i;
      break;
    }
  }

  return lines.slice(start + 1, end).join('\n').trim();
}

const notes = readChangelogSection(readFileSync(join(root, 'CHANGELOG.md'), 'utf8'), version);

if (notes === null) {
  console.error(
    `notify-slack: no CHANGELOG.md section for ${version} — refusing to post a noteless announcement`,
  );
  process.exit(1);
}

if (notes === '') {
  console.error(
    `notify-slack: the CHANGELOG.md section for ${version} is empty — refusing to post a noteless announcement`,
  );
  process.exit(1);
}

const repoUrl = (pkg.repository?.url ?? '').replace(/\.git$/, '');
const releaseUrl = repoUrl ? `${repoUrl}/releases/tag/v${version}` : '';

function capNotes(body) {
  if (body.length <= MAX_NOTES_LENGTH) return body;
  const clipped = body.slice(0, MAX_NOTES_LENGTH);
  const lastBreak = clipped.lastIndexOf('\n');
  const head = (lastBreak > 0 ? clipped.slice(0, lastBreak) : clipped).trimEnd();
  return releaseUrl ? `${head}\n\n…full notes: ${releaseUrl}` : `${head}\n\n…`;
}

const npmUrl = `https://www.npmjs.com/package/${pkg.name}/v/${version}`;
const text = `*${pkg.name} v${version}* was published to npm.\n${npmUrl}\n\n${capNotes(notes)}`;
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

const response = await fetch(webhook, {
  method: 'POST',
  headers: { 'Content-type': 'application/json' },
  body: payload,
});

if (!response.ok) {
  console.error(
    `notify-slack: webhook returned ${response.status} ${response.statusText}: ${await response.text()}`,
  );
  process.exit(1);
}

process.stdout.write(`notify-slack: announced ${pkg.name} v${version}\n`);
