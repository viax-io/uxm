#!/usr/bin/env node
// Build the CDN artifacts of @viax.io/uxm into dist-cdn/ and prove they work.
//
// Consumers of `dist/` need npm + a bundler: it is unbundled ESM/CJS with bare
// `react` imports. The CDN package is the handful of self-contained files a
// page can pull in with <script>/<link> tags instead:
//
//   uxm.esm.js                 ESM, React external   — pages that have React 19
//   uxm-generate-css.esm.js    ESM, no deps          — the theming applier portals import
//   uxm.standalone.js          IIFE `window.UXM`, React inside — pages without React
//   uxm.css                    tokens + every atom, flattened
//   uxm.esm.d.ts               bundled types for uxm.esm.js (needs @types/react)
//   uxm-generate-css.esm.d.ts  bundled types for the applier
//   cdn-manifest.json          version, byte/gzip sizes, SRI hashes
//
// Steps, in order:
//   1. refuse to run without a fresh `npm run build` (everything reads dist/);
//   2. wipe dist-cdn/ and run the three tsup builds in tsup.cdn.config.ts
//      (ESM, standalone, bundled .d.ts);
//   3. flatten `dist/tokens/index.css` + the `dist/ui/styles.css` @import
//      aggregator into one minified uxm.css (cascade order preserved);
//   4. smoke — each artifact is exercised, not just emitted:
//        · uxm.esm.js imports in Node and exports exactly what dist/ui does;
//        · uxm.standalone.js runs in jsdom, `UXM.createRoot` renders a button;
//        · a tiny TSX consumer typechecks against the .d.ts with strict tsc;
//   5. gzip-size budgets — a sudden blow-up fails here, not on the CDN;
//   6. write cdn-manifest.json.
//
// Publishing is NOT done here (that is a later phase: versioned, immutable
// paths on the CDN; `latest` is a separate decision). Usage:
//   npm run build && npm run build:cdn
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

import * as esbuild from 'esbuild';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = resolve(ROOT, 'dist');
const OUT = resolve(ROOT, 'dist-cdn');
const pkg = require('../package.json');

/**
 * Gzip budgets in KB. Measured on v4.40.2 (11-09-2026):
 * esm 49, generate-css 5.3, standalone 111, css 28, esm.d.ts 64, generate-css.d.ts 1.1.
 * Headroom is deliberate but not generous — bump a number here on purpose,
 * with the reason in the commit, never silently.
 */
const BUDGET_GZIP_KB = {
  'uxm.esm.js': 64,
  'uxm-generate-css.esm.js': 8,
  'uxm.standalone.js': 132,
  'uxm.css': 40,
  'uxm.esm.d.ts': 80,
  'uxm-generate-css.esm.d.ts': 4,
};

const log = (msg) => process.stdout.write(`${msg}\n`);
const fail = (msg) => {
  process.stderr.write(`\nbuild-cdn: ${msg}\n`);
  process.exit(1);
};

// 1. Preconditions — a stale or missing dist/ would silently ship old code.
for (const rel of ['ui/index.js', 'ui/index.d.ts', 'ui/styles.css', 'tokens/index.css', 'studio/persistence/generate-css.js']) {
  if (!existsSync(join(DIST, rel))) fail(`dist/${rel} is missing — run \`npm run build\` first`);
}

// 2. tsup: ESM + standalone + bundled .d.ts (see tsup.cdn.config.ts).
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
log('▸ tsup (esm, standalone, dts)');
execFileSync(process.execPath, [require.resolve('tsup/dist/cli-default.js'), '--config', 'tsup.cdn.config.ts'], {
  cwd: ROOT,
  stdio: 'inherit',
});

// 3. CSS: tokens first, then the flattened aggregator — same order a consumer
//    gets from `@viax.io/uxm/tokens.css` + `@viax.io/uxm/ui.css`.
log('▸ css');
await esbuild.build({
  stdin: {
    contents: '@import "./dist/tokens/index.css";\n@import "./dist/ui/styles.css";\n',
    resolveDir: ROOT,
    loader: 'css',
  },
  bundle: true,
  minify: true,
  charset: 'utf8',
  banner: { css: `/*! ${pkg.name} v${pkg.version} | ${pkg.license} */` },
  outfile: join(OUT, 'uxm.css'),
  logLevel: 'warning',
});

// 4. Smoke.
log('▸ smoke: uxm.esm.js exports the /ui surface');
const names = (m) => Object.keys(m).filter((k) => k !== 'default').sort();
const [cdnUi, distUi] = await Promise.all([
  import(pathToFileURL(join(OUT, 'uxm.esm.js'))),
  import(pathToFileURL(join(DIST, 'ui/index.js'))),
]);
const missing = names(distUi).filter((n) => !(n in cdnUi));
const extra = names(cdnUi).filter((n) => !(n in distUi));
if (missing.length || extra.length) fail(`uxm.esm.js surface drifted — missing: [${missing}] extra: [${extra}]`);

const [cdnGen, distGen] = await Promise.all([
  import(pathToFileURL(join(OUT, 'uxm-generate-css.esm.js'))),
  import(pathToFileURL(join(DIST, 'studio/persistence/generate-css.js'))),
]);
if (names(cdnGen).join() !== names(distGen).join()) fail('uxm-generate-css.esm.js surface drifted from dist/');

log('▸ smoke: uxm.standalone.js renders in jsdom');
{
  const dom = new JSDOM('<!doctype html><div id="root"></div>', { runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  try {
    window.eval(readFileSync(join(OUT, 'uxm.standalone.js'), 'utf8'));
  } catch (e) {
    fail(`standalone bundle threw at load: ${e}`);
  }
  const UXM = window.UXM;
  if (!UXM?.React?.createElement || !UXM.createRoot) fail('window.UXM lacks React/createRoot');
  if (!UXM.ButtonPrimary) fail('window.UXM lacks the /ui surface');
  UXM.createRoot(window.document.getElementById('root')).render(
    UXM.React.createElement(UXM.ButtonPrimary, null, 'cdn'),
  );
  // React schedules the commit; give jsdom's timers a tick.
  await new Promise((r) => setTimeout(r, 100));
  const btn = window.document.querySelector('.uxm-button-primary');
  if (!btn || btn.textContent !== 'cdn') fail('standalone: <ButtonPrimary> did not render');
  window.close();
}

log('▸ smoke: uxm.esm.d.ts typechecks a strict consumer');
{
  const smokeDir = join(OUT, '.smoke');
  mkdirSync(smokeDir, { recursive: true });
  writeFileSync(
    join(smokeDir, 'consumer.tsx'),
    [
      "import { ButtonPrimary, Tag, TextInput, type ButtonProps, type TagType } from '../uxm.esm.js';",
      "import { generateOverridesCss } from '../uxm-generate-css.esm.js';",
      "const p: ButtonProps = { children: 'ok', onClick: () => {} };",
      "const t: TagType = 'success';",
      'export const el = (<><ButtonPrimary {...p} /><TextInput error="x" /><Tag type={t}>a</Tag></>);',
      '// @ts-expect-error — a wrong variant must be rejected, proving the types are not `any`',
      'export const bad = <Tag type="nope">a</Tag>;',
      'export const css: string = generateOverridesCss({}, {});',
      '',
    ].join('\n'),
  );
  writeFileSync(
    join(smokeDir, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          strict: true,
          noEmit: true,
          jsx: 'react-jsx',
          module: 'esnext',
          moduleResolution: 'bundler',
          target: 'es2020',
          lib: ['dom', 'esnext'],
          skipLibCheck: false, // the bundled .d.ts itself must be clean
          types: [],
        },
        files: ['consumer.tsx'],
      },
      null,
      2,
    ),
  );
  try {
    execFileSync(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', smokeDir], { cwd: ROOT, stdio: 'inherit' });
  } catch {
    fail('the bundled .d.ts failed the consumer typecheck (see tsc output above)');
  }
  rmSync(smokeDir, { recursive: true, force: true });
}

// 5 + 6. Sizes, budgets, manifest.
log('▸ sizes');
const manifest = { name: pkg.name, version: pkg.version, builtAt: new Date().toISOString(), files: {} };
const overBudget = [];
const rows = [];
for (const file of Object.keys(BUDGET_GZIP_KB)) {
  const buf = readFileSync(join(OUT, file));
  const gzip = gzipSync(buf).length;
  const sri = `sha384-${createHash('sha384').update(buf).digest('base64')}`;
  manifest.files[file] = { bytes: buf.length, gzip, sri };
  const kb = gzip / 1024;
  const budget = BUDGET_GZIP_KB[file];
  rows.push(`  ${file.padEnd(28)} ${(buf.length / 1024).toFixed(1).padStart(7)} KB  ${kb.toFixed(1).padStart(6)} KB gz  (budget ${budget})`);
  if (kb > budget) overBudget.push(`${file}: ${kb.toFixed(1)} KB gz > ${budget} KB`);
}
log(rows.join('\n'));
if (overBudget.length) fail(`over gzip budget —\n  ${overBudget.join('\n  ')}`);

writeFileSync(join(OUT, 'cdn-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
log(`✓ dist-cdn/ ready — ${pkg.name}@${pkg.version}, ${Object.keys(manifest.files).length} artifacts + cdn-manifest.json`);
