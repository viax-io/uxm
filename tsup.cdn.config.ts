import { createRequire } from 'node:module';

import { defineConfig } from 'tsup';

/**
 * CDN artifacts — `npm run build:cdn` (scripts/build-cdn.mjs drives this file,
 * then flattens the CSS, writes the manifest and runs the smoke checks).
 *
 * Everything here reads from `dist/`, never from `src/`: by then `@/` aliases
 * are plain relative imports, so JS, CSS and types come from ONE build. Run
 * `npm run build` first; the driver script refuses to start otherwise.
 *
 * Three independent builds (tsup runs each array entry on its own):
 *
 *  1. `uxm.esm.js` + `uxm-generate-css.esm.js` — ESM, react/react-dom/jsx-runtime
 *     external. For pages that already have React 19 (import map, or a
 *     vendored copy behind a bundler alias).
 *  2. `uxm.standalone.js` — IIFE, `window.UXM`, React bundled in and re-exported
 *     as `UXM.React` / `UXM.createRoot`. For pages WITHOUT React. Never load it
 *     next to another React instance (two Reacts break hooks/context).
 *     React 19 ships no UMD, so this is the only bundler-free shape possible.
 *  3. `uxm.esm.d.ts` + `uxm-generate-css.esm.d.ts` — one bundled declaration
 *     file per JS artifact, built from `dist/**\/*.d.ts` (byte-identical to a
 *     build from src/, 20× faster). Named like the JS so TypeScript resolves
 *     `./uxm.esm.js` → `./uxm.esm.d.ts` as a sibling with no `paths` mapping.
 *
 * Two tsup traps, both already paid for:
 *  - output names MUST come from this config's `entry` object. The CLI form
 *    `--entry.uxm.esm …` breaks — the dot in the name is parsed as a nested
 *    key — and a positional `.d.ts` entry is emitted as `index.d.d.ts`.
 *  - this file must live in the repo tree; tsup config outside it cannot
 *    resolve `tsup` itself (ERR_MODULE_NOT_FOUND).
 *
 * The DTS-OOM note in `tsup.config.ts` does not apply: that was 100+ unbundled
 * entries in one worker. Two bundled entries finish in well under a second.
 */

const pkg = createRequire(import.meta.url)('./package.json') as { name: string; version: string; license: string };
const banner = `/*! ${pkg.name} v${pkg.version} | ${pkg.license} | https://github.com/viax-io/uxm */`;

const shared = {
  outDir: 'dist-cdn',
  clean: false, // the driver wipes dist-cdn/ once; three builds must not wipe each other
  target: 'es2020',
  platform: 'browser',
  minify: true,
  sourcemap: false,
  splitting: false, // one self-contained file per entry — no shared chunks on a CDN
  treeshake: true,
  banner: { js: banner },
} as const;

export default defineConfig([
  {
    ...shared,
    entry: {
      'uxm.esm': 'dist/ui/index.js',
      'uxm-generate-css.esm': 'dist/studio/persistence/generate-css.js',
    },
    format: ['esm'],
    external: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  {
    ...shared,
    entry: { 'uxm.standalone': 'scripts/cdn/standalone-entry.mjs' },
    format: ['iife'],
    globalName: 'UXM',
    outExtension: () => ({ js: '.js' }), // tsup's default is `.global.js` for IIFE
    noExternal: [/.*/], // bundle React, ReactDOM and scheduler in
    env: { NODE_ENV: 'production' }, // without it React dev branches hit `process is not defined`
  },
  {
    entry: {
      'uxm.esm': 'dist/ui/index.d.ts',
      'uxm-generate-css.esm': 'dist/studio/persistence/generate-css.d.ts',
    },
    outDir: 'dist-cdn',
    clean: false,
    format: ['esm'],
    dts: { only: true, banner },
  },
]);
