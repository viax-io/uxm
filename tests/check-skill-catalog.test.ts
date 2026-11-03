import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

/**
 * The skill-catalog gate (scripts/check-skill-catalog.mjs), run for real
 * against a throwaway root. It reads its two inputs relative to the working
 * directory, so each case writes a minimal barrel and catalog and runs the
 * script from there.
 *
 * Pinned: the forward check (an export missing from the catalog fails), the
 * export forms the parser cannot read (they fail instead of being skipped),
 * and the reverse check on "Key exports" cells (a name that is no longer
 * exported fails) — while prose that backticks props or removed names does not.
 */
const SCRIPT = resolve(__dirname, '../scripts/check-skill-catalog.mjs');

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function run(barrel: string, catalog: string) {
  const root = mkdtempSync(join(tmpdir(), 'uxm-catalog-'));
  dirs.push(root);
  mkdirSync(join(root, 'src/ui'), { recursive: true });
  mkdirSync(join(root, 'skills/viax-uxm/references'), { recursive: true });
  writeFileSync(join(root, 'src/ui/index.ts'), barrel);
  writeFileSync(join(root, 'skills/viax-uxm/references/component-catalog.md'), catalog);
  const { status, stdout, stderr } = spawnSync(process.execPath, [SCRIPT], { cwd: root, encoding: 'utf8' });
  return { status, out: stdout + stderr };
}

const BARREL = [
  "export { Button } from './button';",
  "export type { ButtonProps } from './button';",
  "export { Menu, type MenuEntry, MenuItem as Item } from './menu';",
  '',
].join('\n');

const row = (name: string, exportsCell: string, text = 'A thing.') => `| **${name}** | ${exportsCell} | ${text} |`;

const CATALOG = [
  '| Component | Key exports | What it is |',
  '|---|---|---|',
  row('Button', '`Button`, `ButtonProps`', 'Takes `variant` and `--uxm-button-*`. Replaced `OldButton` in 2.0.0.'),
  row('Menu', '`Menu`, `MenuEntry`, `Item`'),
  '',
].join('\n');

describe('check-skill-catalog', () => {
  it('passes when every export is listed and every listed name is exported', () => {
    const { status, out } = run(BARREL, CATALOG);
    expect(out).toContain('OK');
    expect(status).toBe(0);
  });

  it('fails on an export the catalog never mentions', () => {
    const { status, out } = run(`${BARREL}export type { MenuProps } from './menu';\n`, CATALOG);
    expect(status).toBe(1);
    expect(out).toMatch(/not in the skill catalog[\s\S]*MenuProps/);
  });

  it.each([
    "export * from './tag';",
    "export * as icons from './icons';",
    'export const VERSION = 1;',
    'export function helper() {}',
    'export default Button;',
  ])('fails on an export form it cannot read: %s', (line) => {
    // Before, these were skipped: the names they export were never compared
    // with the catalog, and the run still printed OK.
    const { status, out } = run(`${BARREL}${line}\n`, CATALOG);
    expect(status).toBe(1);
    expect(out).toContain('export form this check cannot read');
    expect(out).toContain(line);
  });

  it('ignores an unsupported form inside a comment', () => {
    const { status } = run(`${BARREL}// export * from './tag';\n/* export const X = 1; */\n`, CATALOG);
    expect(status).toBe(0);
  });

  it('fails on a Key exports name that is no longer exported', () => {
    const catalog = CATALOG.replace('`Button`, `ButtonProps`', '`Button`, `ButtonProps`, `ButtonSize`');
    const { status, out } = run(BARREL, catalog);
    expect(status).toBe(1);
    expect(out).toMatch(/Key exports[\s\S]*ButtonSize/);
  });

  it('reads the Key exports cell of a row whose name carries a version', () => {
    const catalog = CATALOG.replace('| **Menu** |', '| **Menu** (2.6.0) |').replace('`Item`', '`Item`, `Gone`');
    const { status, out } = run(BARREL, catalog);
    expect(status).toBe(1);
    expect(out).toContain('Gone');
  });

  it('does not treat backticked prose as advertised exports', () => {
    // `variant`, `--uxm-button-*` and the removed `OldButton` sit in the
    // description cell of CATALOG — the passing case above already covers it,
    // so pin the reason explicitly: only the second cell is checked.
    const { status } = run(BARREL, `${CATALOG}\nSee also \`NotAnExport\` in the notes.\n`);
    expect(status).toBe(0);
  });
});
