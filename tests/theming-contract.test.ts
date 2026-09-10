import { globSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * The theming contract: every `--uxm-*` variable the shipped stylesheets
 * read. Consumers override these (and the studio writes them), so renaming
 * or dropping one silently un-themes an app that set it — the same kind of
 * break as a removed export, and just as invisible to lint, typecheck and
 * build.
 *
 * The sorted, de-duplicated list is snapshotted. A minus line in the diff
 * means an existing override stops working (MAJOR, or keep the old name as a
 * fallback alias — see the legacy-alias chains in gotchas.md); a plus line is
 * a new knob (MINOR). Refresh with `npx vitest run -u`.
 *
 * Only `src/ui/**` SCSS counts: the `--color-*` layer is gated by
 * `check:tokens`, and registry-vs-SCSS state defaults by `check:drift`.
 */

const UI_DIR = resolve(__dirname, '../src/ui');

function stripComments(scss: string): string {
  return scss.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

describe('--uxm-* variables read by src/ui stylesheets', () => {
  const files = globSync('**/*.scss', { cwd: UI_DIR }).sort();

  it('covers every atom stylesheet', () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it('exports the pinned variable names', () => {
    const names = new Set<string>();
    for (const file of files) {
      const scss = stripComments(readFileSync(resolve(UI_DIR, file), 'utf8'));
      for (const match of scss.matchAll(/--uxm-[a-z0-9-]+/g)) names.add(match[0]);
    }
    const sorted = [...names].sort();
    expect(sorted.length).toBeGreaterThan(1000);
    expect(sorted).toMatchSnapshot();
  });
});
