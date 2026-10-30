import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DataTable } from '@/ui';
import type { DataTableColumn, DataTableStackAt } from '@/ui';

/**
 * `stackAt` moves the width at which rows reflow into stacked cards.
 *
 * It is a prop rather than a `--uxm-data-table-*` knob because a container
 * query will not read a custom property: `@container (max-width: var(--bp))`
 * parses, survives in `cssRules` with its `conditionText` intact, and then
 * never matches. Measured in Chrome, not assumed. So every threshold needs its
 * own `@container` block, and the prop's type has to be a closed set that
 * matches those blocks exactly — which is what the pairing test below pins.
 */
interface Row {
  id: string;
  name: string;
}

const ROWS: Row[] = [{ id: 'r1', name: 'Alpha' }];
const COLUMNS: DataTableColumn<Row>[] = [{ key: 'name', header: 'Name' }];

const rootOf = (c: HTMLElement) => c.querySelector('.uxm-data-table') as HTMLElement;
const table = (stackAt?: DataTableStackAt, className?: string) => (
  <DataTable rowKey={(r) => r.id} columns={COLUMNS} rows={ROWS} stackAt={stackAt} className={className} />
);

describe('DataTable stackAt', () => {
  it('emits no modifier at the default, so an unset table is untouched', () => {
    const { container } = render(table());
    expect(rootOf(container).className).not.toMatch(/--stack-/);
  });

  it('emits no modifier for an explicit 480 either', () => {
    // 480 is the stylesheet's UNCONDITIONAL threshold. A `--stack-480` class
    // would resolve its stacked rules at one extra class of specificity, so
    // `stackAt={480}` would quietly behave unlike every table that omits it.
    const { container } = render(table(480));
    expect(rootOf(container).className).not.toMatch(/--stack-/);
  });

  it.each([640, 768, 960] as const)('emits exactly one modifier for %i', (bp) => {
    const { container } = render(table(bp));
    const cls = rootOf(container).className;
    expect(cls).toContain(`uxm-data-table--stack-${bp}`);
    expect(cls.match(/--stack-\d+/g)).toHaveLength(1);
  });

  it('leaves the other root modifiers and a consumer className alone', () => {
    const { container } = render(table(768, 'mine'));
    const cls = rootOf(container).className;
    expect(cls).toContain('uxm-data-table--default'); // density
    expect(cls).toContain('mine');
  });
});

describe('DataTable stackAt — the prop and the stylesheet agree', () => {
  // Without this the prop is the "emitted but unread" shape: `stackAt={1024}`
  // would type-check, render a class, and style nothing, with every other test
  // in this file still green. Comments are stripped first, the way
  // `theming-contract.test.ts` does, so a value named only in prose cannot
  // satisfy either side.
  const strip = (src: string) =>
    src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
  const read = (p: string) =>
    strip(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../src', p), 'utf8'));

  const declared = () => {
    const m = read('ui/data-table/data-table.tsx').match(/export type DataTableStackAt =([^;]+);/);
    if (!m) throw new Error('DataTableStackAt union not found');
    return new Set(m[1].split('|').map((v) => Number(v.trim())));
  };

  const styled = () => {
    const scss = read('ui/data-table/data-table.scss');
    const each = scss.match(/@each \$bp in \(([^)]+)\)/);
    if (!each) throw new Error('opt-in @each loop not found');
    const set = new Set(each[1].split(',').map((v) => Number(v.trim())));
    // The base threshold has no loop entry — it is the unconditional block.
    expect(scss).toContain('@container (max-width: 480px)');
    set.add(480);
    return set;
  };

  it('reads a non-empty set from each side (a silent zero would pass the check below)', () => {
    expect(declared().size).toBeGreaterThan(1);
    expect(styled().size).toBeGreaterThan(1);
  });

  it('every value the prop accepts has a block, and every block has a value', () => {
    expect([...declared()].sort()).toEqual([...styled()].sort());
  });
});
