import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import pkg from '../package.json';

/**
 * The public surface of `@viax.io/uxm`, pinned so it can only change on
 * purpose. Two things are gated here:
 *
 * 1. **What each entry exports.** The sorted export names of every subpath
 *    are snapshotted. A removed or renamed name shows up as a minus line in
 *    the snapshot diff — that is a MAJOR (constitution: Principle III). A
 *    new name is a MINOR; refresh the snapshot with `npx vitest run -u` and
 *    the diff in the PR is the API changelog.
 * 2. **That `dist/` actually loads.** The build's last two steps (`tsc-alias`
 *    rewriting `@/` imports, `fix-cjs-requires` patching the CJS output) have
 *    no other gate: a broken rewrite still typechecks and still builds. So
 *    every `import` / `require` entry in the exports map is loaded for real
 *    and both module formats must agree. Skipped when `dist/` is absent
 *    (a plain `npm test` before any build); CI always builds first.
 *
 * Types are not covered — an `interface` leaves no runtime trace.
 */

const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');
const hasDist = existsSync(DIST);
const requireCjs = createRequire(import.meta.url);

type ExportTarget = string | { types?: string; import?: string; require?: string };
const exportsMap = pkg.exports as Record<string, ExportTarget>;

/** Source module for each subpath — the same file the `types` entry points at. */
const SOURCE_ENTRIES: Record<string, () => Promise<Record<string, unknown>>> = {
  '.': () => import('@/index'),
  './ui': () => import('@/ui'),
  './tokens': () => import('@/tokens'),
  './hooks': () => import('@/hooks'),
  './previews': () => import('@/previews'),
  './studio': () => import('@/studio'),
  './studio/generate-css': () => import('@/studio/persistence/generate-css'),
};

const exportNames = (mod: Record<string, unknown>) => Object.keys(mod).filter((k) => k !== 'default').sort();

describe('@viax.io/uxm public surface', () => {
  it('every JS entry in the exports map has a source module to pin', () => {
    const jsEntries = Object.entries(exportsMap)
      .filter(([, target]) => typeof target === 'object')
      .map(([subpath]) => subpath)
      .sort();
    expect(jsEntries).toEqual(Object.keys(SOURCE_ENTRIES).sort());
  });

  for (const [subpath, load] of Object.entries(SOURCE_ENTRIES)) {
    it(`${subpath} exports the pinned names`, async () => {
      const names = exportNames(await load());
      expect(names.length).toBeGreaterThan(0);
      expect(names).toMatchSnapshot();
    });
  }
});

describe.skipIf(!hasDist)('dist/ (built package)', () => {
  it('ships every file the exports map points at', () => {
    const missing: string[] = [];
    for (const [subpath, target] of Object.entries(exportsMap)) {
      const files = typeof target === 'string' ? [target] : [target.types, target.import, target.require];
      for (const file of files) {
        if (file && !existsSync(resolve(ROOT, file))) missing.push(`${subpath} → ${file}`);
      }
    }
    expect(missing).toEqual([]);
  });

  for (const [subpath, target] of Object.entries(exportsMap)) {
    if (typeof target === 'string' || !target.import || !target.require) continue;
    const esmPath = resolve(ROOT, target.import);
    const cjsPath = resolve(ROOT, target.require);

    it(`${subpath} loads as ESM and CJS with the same exports`, async () => {
      const esm = (await import(esmPath)) as Record<string, unknown>;
      const cjs = requireCjs(cjsPath) as Record<string, unknown>;
      const esmNames = exportNames(esm);
      expect(esmNames.length).toBeGreaterThan(0);
      expect(exportNames(cjs)).toEqual(esmNames);
    });
  }
});
