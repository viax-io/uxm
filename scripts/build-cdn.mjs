#!/usr/bin/env node
// Build the CDN artifacts of @viax.io/uxm into dist-cdn/ and prove they work.
//
// Consumers of `dist/` need npm + a bundler: it is unbundled ESM/CJS with bare
// `react` imports. The CDN package is the handful of self-contained files a
// page can pull in with <script>/<link> tags instead:
//
//   uxm.esm.js                 ESM, React external   — pages that have React 19; also `VERSION`
//   uxm-generate-css.esm.js    ESM, no deps          — the theming applier portals import
//   uxm-studio.esm.js          ESM, React AND ui external (`./uxm.esm.js`) — the studio workbench
//   chunks/<locale>-<hash>.js  the studio's lazily loaded dictionaries, one per locale
//   uxm.standalone.js          IIFE `window.UXM`, React inside — pages without React
//   uxm.css                    tokens + every atom, flattened
//   uxm-studio.css             the studio's own (Tailwind) stylesheet — load after uxm.css
//   uxm.esm.d.ts               bundled types for uxm.esm.js (needs @types/react)
//   uxm-generate-css.esm.d.ts  bundled types for the applier
//   uxm-studio.esm.d.ts        bundled types for the studio
//   cdn-manifest.json          version, byte/gzip sizes, SRI hashes — chunks included
//
// Steps, in order:
//   1. refuse to run without a fresh `npm run build` (everything reads dist/);
//   2. wipe dist-cdn/ and run the tsup builds in tsup.cdn.config.ts
//      (ESM, studio, standalone, bundled .d.ts), then prove from the studio
//      build's metafile that it bundled no shared ui module;
//   3. flatten `dist/tokens/index.css` + the `dist/ui/styles.css` @import
//      aggregator into one minified uxm.css (cascade order preserved), and
//      minify `dist/studio/studio.css` into uxm-studio.css;
//   4. smoke — each artifact is exercised, not just emitted:
//        · uxm.esm.js imports in Node and exports exactly what dist/ui does,
//          plus `VERSION` === package.json's version;
//        · uxm-studio.esm.js imports in Node NEXT TO uxm.esm.js, exports exactly
//          what dist/studio does, and every locale's chunk loads;
//        · uxm.standalone.js runs in jsdom, `UXM.createRoot` renders a button;
//        · a tiny TSX consumer typechecks against the .d.ts with strict tsc;
//   5. gzip-size budgets — a sudden blow-up fails here, not on the CDN;
//   6. write cdn-manifest.json.
//
// Publishing is NOT done here — .github/workflows/release.yml uploads dist-cdn/
// on every release to `<version>/` (immutable) and `latest/` (mutable,
// no-cache, overwritten each release). Usage:
//   npm run build && npm run build:cdn
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

import * as esbuild from 'esbuild';
import { JSDOM } from 'jsdom';

import { isSharedUiModule } from './cdn/studio-bundle.mjs';

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
  // Studio, measured on v4.71.1 (26-10-2026): esm 125.6 with ui external (a
  // 181 KB figure from an earlier probe still carried a copy of ui), css 6.4,
  // d.ts 7.3.
  'uxm-studio.esm.js': 160,
  'uxm-studio.css': 10,
  'uxm-studio.esm.d.ts': 10,
};

/** Every `chunks/*.js` (one studio dictionary each, 32–47 KB gz on v4.71.1). */
const BUDGET_CHUNK_GZIP_KB = 55;

const log = (msg) => process.stdout.write(`${msg}\n`);
const fail = (msg) => {
  process.stderr.write(`\nbuild-cdn: ${msg}\n`);
  process.exit(1);
};

// 1. Preconditions — a stale or missing dist/ would silently ship old code.
for (const rel of [
  'ui/index.js',
  'ui/index.d.ts',
  'ui/styles.css',
  'tokens/index.css',
  'studio/index.js',
  'studio/index.d.ts',
  'studio/studio.css',
  'studio/persistence/generate-css.js',
]) {
  if (!existsSync(join(DIST, rel))) fail(`dist/${rel} is missing — run \`npm run build\` first`);
}

// 2. tsup: ESM + standalone + bundled .d.ts (see tsup.cdn.config.ts).
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
log('▸ tsup (esm, studio, standalone, dts)');
execFileSync(process.execPath, [require.resolve('tsup/dist/cli-default.js'), '--config', 'tsup.cdn.config.ts'], {
  cwd: ROOT,
  stdio: 'inherit',
});

// The studio build is the only one with a metafile (tsup.cdn.config.ts). It is
// the reliable witness for "no second copy of ui": minified code has no names
// left to grep for, but the metafile lists every module that went in.
log('▸ studio bundle: no copy of ui, one chunk per locale');
const metafilePath = join(OUT, 'metafile-esm.json');
const { inputs: studioInputs, outputs: studioOutputs } = JSON.parse(readFileSync(metafilePath, 'utf8'));
rmSync(metafilePath); // build-time evidence only — never published
const bundledUi = Object.keys(studioInputs).filter((input) => isSharedUiModule(resolve(ROOT, input)));
if (bundledUi.length) fail(`uxm-studio.esm.js bundled its own copy of ${bundledUi.length} ui module(s), e.g. ${bundledUi[0]}`);
const studioOut = Object.entries(studioOutputs).find(([file]) => file.endsWith('/uxm-studio.esm.js'))?.[1];
if (!studioOut?.imports.some((i) => i.external && i.path === './uxm.esm.js')) fail('uxm-studio.esm.js does not import ./uxm.esm.js');

const { STUDIO_LOCALE_LOADERS } = await import(pathToFileURL(join(DIST, 'studio/i18n/loaders.js')));
const chunkOf = (locale) =>
  Object.keys(studioOutputs).filter(
    (file) => file.includes('/chunks/') && Object.keys(studioOutputs[file].inputs).some((i) => i.endsWith(`/i18n/locales/${locale}.js`)),
  );
for (const locale of Object.keys(STUDIO_LOCALE_LOADERS)) {
  const chunks = chunkOf(locale);
  if (chunks.length !== 1) fail(`locale "${locale}" is in ${chunks.length} chunks, expected exactly 1`);
}

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
await esbuild.build({
  entryPoints: [join(DIST, 'studio/studio.css')],
  bundle: true,
  minify: true,
  charset: 'utf8',
  banner: { css: `/*! ${pkg.name} v${pkg.version} studio | ${pkg.license} */` },
  outfile: join(OUT, 'uxm-studio.css'),
  logLevel: 'warning',
  // Tailwind turns the literal "[file:line]" in studio copy into an arbitrary-
  // property utility (`.\[file\:line\]{file:line}`). Inert — no element uses
  // it — and already in dist/studio/studio.css; not worth a warning per build.
  logOverride: { 'unsupported-css-property': 'silent' },
});

// 4. Smoke.
log('▸ smoke: uxm.esm.js exports the /ui surface');
const names = (m) => Object.keys(m).filter((k) => k !== 'default').sort();
const [cdnUi, distUi] = await Promise.all([
  import(pathToFileURL(join(OUT, 'uxm.esm.js'))),
  import(pathToFileURL(join(DIST, 'ui/index.js'))),
]);
const missing = names(distUi).filter((n) => !(n in cdnUi));
const extra = names(cdnUi).filter((n) => !(n in distUi) && n !== 'VERSION');
if (missing.length || extra.length) fail(`uxm.esm.js surface drifted — missing: [${missing}] extra: [${extra}]`);
if (cdnUi.VERSION !== pkg.version) fail(`uxm.esm.js VERSION is "${cdnUi.VERSION}", expected "${pkg.version}"`);

log('▸ smoke: uxm-studio.esm.js loads next to uxm.esm.js, every dictionary chunk loads');
{
  const [cdnStudio, distStudio] = await Promise.all([
    import(pathToFileURL(join(OUT, 'uxm-studio.esm.js'))),
    import(pathToFileURL(join(DIST, 'studio/index.js'))),
  ]);
  if (names(cdnStudio).join() !== names(distStudio).join()) fail('uxm-studio.esm.js surface drifted from dist/studio');
  for (const file of readdirSync(join(OUT, 'chunks'))) {
    const chunk = await import(pathToFileURL(join(OUT, 'chunks', file)));
    if (!Object.keys(chunk).length) fail(`chunks/${file} exports nothing`);
  }
}

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
      "import { UxmApp, createReadOnlyPersistence } from '../uxm-studio.esm.js';",
      "import { VERSION } from '../uxm.esm.js';",
      "const p: ButtonProps = { children: 'ok', onClick: () => {} };",
      "const t: TagType = 'success';",
      'export const el = (<><ButtonPrimary {...p} /><TextInput error="x" /><Tag type={t}>a</Tag></>);',
      '// @ts-expect-error — a wrong variant must be rejected, proving the types are not `any`',
      'export const bad = <Tag type="nope">a</Tag>;',
      'export const css: string = generateOverridesCss({}, {});',
      'export const version: string = VERSION;',
      'export const studio = <UxmApp persistence={createReadOnlyPersistence({})} />;',
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
const chunkFiles = readdirSync(join(OUT, 'chunks')).map((f) => `chunks/${f}`);
for (const file of [...Object.keys(BUDGET_GZIP_KB), ...chunkFiles]) {
  const buf = readFileSync(join(OUT, file));
  const gzip = gzipSync(buf).length;
  const sri = `sha384-${createHash('sha384').update(buf).digest('base64')}`;
  manifest.files[file] = { bytes: buf.length, gzip, sri };
  const kb = gzip / 1024;
  const budget = BUDGET_GZIP_KB[file] ?? BUDGET_CHUNK_GZIP_KB;
  rows.push(`  ${file.padEnd(28)} ${(buf.length / 1024).toFixed(1).padStart(7)} KB  ${kb.toFixed(1).padStart(6)} KB gz  (budget ${budget})`);
  if (kb > budget) overBudget.push(`${file}: ${kb.toFixed(1)} KB gz > ${budget} KB`);
}
log(rows.join('\n'));
if (overBudget.length) fail(`over gzip budget —\n  ${overBudget.join('\n  ')}`);

writeFileSync(join(OUT, 'cdn-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
log(`✓ dist-cdn/ ready — ${pkg.name}@${pkg.version}, ${Object.keys(manifest.files).length} artifacts + cdn-manifest.json`);
