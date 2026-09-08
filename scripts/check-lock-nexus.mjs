#!/usr/bin/env node
// Verify that every tarball package-lock.json resolves to can actually be
// fetched through the Nexus proxy CI installs from — with an EMPTY cache.
//
// Why: `npm audit fix` / `npm update` run against registry.npmjs.org (Nexus
// has no audit endpoint) can lock a version published minutes ago that the
// Nexus proxy's cached packument does not list yet. Locally everything works
// because ~/.npm already holds the tarball; CI has no cache and gets a 404
// from Nexus on `npm install` (job 1554352, electron-to-chromium@1.5.423 —
// see .claude/memory/gotchas.md). This is the same check as CI's install,
// minus the 8-minute pipeline.
//
// Usage: node scripts/check-lock-nexus.mjs   (exits 1 on any unreachable tarball)
import { readFileSync } from 'node:fs';

const NEXUS = 'https://nexus.viax.tech/repository/viax-npm/';
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const urls = [...new Set(Object.values(lock.packages)
  .map((p) => p.resolved)
  .filter((u) => typeof u === 'string' && /^https?:\/\//.test(u))
  // npm rewrites a registry.npmjs.org host to the configured registry at
  // install time (replace-registry-host=npmjs), so check the Nexus path.
  .map((u) => u.replace(/^https:\/\/registry\.npmjs\.org\//, NEXUS)))];

const CONCURRENCY = 8;
const missing = [];
let done = 0;
// A transport error (status 0) is retried once: with many parallel
// connections Nexus occasionally drops one, and that is not a missing tarball.
async function head(u) {
  const res = await fetch(u, { method: 'HEAD' }).catch(() => ({ status: 0 }));
  if (res.status !== 0) return res.status;
  await new Promise((r) => setTimeout(r, 500));
  return (await fetch(u, { method: 'HEAD' }).catch(() => ({ status: 0 }))).status;
}
async function worker(queue) {
  for (let u = queue.pop(); u; u = queue.pop()) {
    const status = await head(u);
    if (status !== 200) missing.push(`${status} ${u}`);
    done += 1;
    if (done % 200 === 0) process.stderr.write(`  checked ${done}/${urls.length}\n`);
  }
}
const queue = [...urls];
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue)));

if (missing.length) {
  console.error(`${missing.length} tarball(s) the lockfile needs are NOT served by Nexus:\n  ${missing.join('\n  ')}\n` +
    'Pin each to the newest version Nexus lists (`npm view <pkg>@latest version --prefer-online`) — see gotchas.md.');
  process.exit(1);
}
// eslint-disable-next-line no-console -- CLI summary line; this IS the program's output
console.log(`OK — all ${urls.length} lockfile tarballs are fetchable through Nexus`);
