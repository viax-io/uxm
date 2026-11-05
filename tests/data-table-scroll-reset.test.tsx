import { render } from '@testing-library/react';
import { StrictMode } from 'react';
import { describe, expect, it } from 'vitest';

import { DataTable } from '@/ui';
import type { DataTableColumn } from '@/ui';

/**
 * `scrollResetKey` returns the horizontal scroller to its start edge when the
 * rows are replaced.
 *
 * The bug it fixes is in the browser's favour, not React's: the scroller is the
 * same element across a rows change, so nothing resets its `scrollLeft`.
 * Measured on 4.81.0 before this prop existed — scrolled to 200, sorted, still
 * 200, with 467px of scrollable width.
 */
interface Row {
  id: string;
  name: string;
  owner: string;
}

const COLUMNS: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name', width: 240, sticky: 'start' },
  { key: 'owner', header: 'Owner', width: 240 },
];

const ROWS: Row[] = [
  { id: 'r1', name: 'Alpha', owner: 'Ada' },
  { id: 'r2', name: 'Beta', owner: 'Grace' },
];
const OTHER_ROWS: Row[] = [{ id: 'r3', name: 'Gamma', owner: 'Linus' }];

/** The scroller only exists when the table scrolls — a sticky column implies it. */
const scrollerOf = (c: HTMLElement) =>
  c.querySelector<HTMLDivElement>('.uxm-data-table__scroller');

function table(rows: Row[], scrollResetKey?: string) {
  return (
    <DataTable<Row>
      columns={COLUMNS}
      rows={rows}
      rowKey={(r) => r.id}
      scrollResetKey={scrollResetKey}
      scrollLabel="Records"
    />
  );
}

describe('DataTable scrollResetKey', () => {
  it('returns to the start edge when the key changes', () => {
    const { container, rerender } = render(table(ROWS, 'query=a'));
    const scroller = scrollerOf(container)!;
    expect(scroller).not.toBeNull();

    scroller.scrollLeft = 200;
    rerender(table(OTHER_ROWS, 'query=b'));
    expect(scroller.scrollLeft).toBe(0);
  });

  it('keeps the position when the key is unchanged', () => {
    // "Load more": the rows grow, the key does not, and the reader stays put.
    const { container, rerender } = render(table(ROWS, 'query=a'));
    const scroller = scrollerOf(container)!;

    scroller.scrollLeft = 200;
    rerender(table([...ROWS, ...OTHER_ROWS], 'query=a'));
    expect(scroller.scrollLeft).toBe(200);
  });

  it('keeps the position when no key is passed at all', () => {
    // The long-standing behaviour, and the reason this is opt-in.
    const { container, rerender } = render(table(ROWS));
    const scroller = scrollerOf(container)!;

    scroller.scrollLeft = 200;
    rerender(table(OTHER_ROWS));
    expect(scroller.scrollLeft).toBe(200);
  });

  it('does not touch the scroller on the first render', () => {
    // Observing `scrollLeft` after mount cannot see this: it is 0 either way,
    // so the obvious version of this test passed with the mount-skip removed.
    // Count the ASSIGNMENTS instead, which means installing the spy before the
    // effect has a chance to run.
    // `scrollLeft` is an accessor on Element.prototype, not on the div's own
    // prototype — reaching for HTMLDivElement here finds nothing.
    const proto = Element.prototype;
    const original = Object.getOwnPropertyDescriptor(proto, 'scrollLeft')!;
    const writes: number[] = [];
    Object.defineProperty(proto, 'scrollLeft', {
      configurable: true,
      get: original.get,
      set(this: HTMLDivElement, v: number) {
        writes.push(v);
        original.set?.call(this, v);
      },
    });

    try {
      const { rerender } = render(table(ROWS, 'query=a'));
      expect(writes, 'mount must not write scrollLeft').toEqual([]);
      // ...and the same spy proves the write DOES happen once the key moves,
      // so an empty array above cannot be the spy simply not working.
      rerender(table(OTHER_ROWS, 'query=b'));
      expect(writes).toEqual([0]);
    } finally {
      Object.defineProperty(proto, 'scrollLeft', original);
    }
  });

  it('resets when the key returns to a value it held before', () => {
    // The reset has to record the key it acted on. Left at its initial value,
    // every later key still differs from it and the first two changes look
    // right — until the key comes back round and the reset silently stops.
    const { container, rerender } = render(table(ROWS, 'a'));
    const scroller = scrollerOf(container)!;

    rerender(table(OTHER_ROWS, 'b'));
    scroller.scrollLeft = 200;
    rerender(table(ROWS, 'a'));
    expect(scroller.scrollLeft).toBe(0);
  });

  it('resets again on every later change, not only the first', () => {
    const { container, rerender } = render(table(ROWS, 'a'));
    const scroller = scrollerOf(container)!;

    scroller.scrollLeft = 200;
    rerender(table(OTHER_ROWS, 'b'));
    expect(scroller.scrollLeft).toBe(0);

    scroller.scrollLeft = 150;
    rerender(table(ROWS, 'c'));
    expect(scroller.scrollLeft).toBe(0);
  });

  it('forces an instant scroll even under scroll-behavior: smooth', () => {
    // Setting `scrollLeft` honours the element's computed `scroll-behavior`, so
    // a consumer with `smooth` on this scroller gets the reset ANIMATED across
    // hundreds of pixels — measured in Chrome, where the offset was unchanged
    // immediately after the write. The effect pins `auto` for the write and
    // restores whatever was there.
    // jsdom implements neither smooth scrolling nor paint, so asserting the
    // OUTCOME here proves nothing — `scrollLeft = 0` lands instantly whatever
    // `scroll-behavior` says, and this test passed with the fix removed. Record
    // the interleaving instead: the behaviour must be pinned to `auto` BEFORE
    // the scroll write and restored after.
    const { container, rerender } = render(table(ROWS, 'a'));
    const scroller = scrollerOf(container)!;
    scroller.style.scrollBehavior = 'smooth';
    scroller.scrollLeft = 200;

    const log: string[] = [];
    const proto = Element.prototype;
    const original = Object.getOwnPropertyDescriptor(proto, 'scrollLeft')!;
    Object.defineProperty(proto, 'scrollLeft', {
      configurable: true,
      get: original.get,
      set(this: HTMLDivElement, v: number) {
        log.push(`scrollLeft=${v} (behavior=${this.style.scrollBehavior})`);
        original.set?.call(this, v);
      },
    });
    try {
      rerender(table(OTHER_ROWS, 'b'));
    } finally {
      Object.defineProperty(proto, 'scrollLeft', original);
    }

    expect(log, 'the write must happen while behavior is auto').toEqual([
      'scrollLeft=0 (behavior=auto)',
    ]);
    expect(scroller.scrollLeft).toBe(0);
    // ...and the consumer's own value is put back, not left on 'auto'.
    expect(scroller.style.scrollBehavior).toBe('smooth');
  });

  it('skips the mount write under StrictMode too', () => {
    // Effects run mount → unmount → mount in dev. The second pass must still
    // find its own key recorded, or the "skip the first render" guard only
    // holds in production.
    const proto = Element.prototype;
    const original = Object.getOwnPropertyDescriptor(proto, 'scrollLeft')!;
    const writes: number[] = [];
    Object.defineProperty(proto, 'scrollLeft', {
      configurable: true,
      get: original.get,
      set(this: HTMLDivElement, v: number) {
        writes.push(v);
        original.set?.call(this, v);
      },
    });
    try {
      const { rerender } = render(<StrictMode>{table(ROWS, 'a')}</StrictMode>);
      expect(writes, 'StrictMode mount must not write scrollLeft').toEqual([]);
      rerender(<StrictMode>{table(OTHER_ROWS, 'b')}</StrictMode>);
      expect(writes).toEqual([0]);
    } finally {
      Object.defineProperty(proto, 'scrollLeft', original);
    }
  });

  it('does nothing when the table does not scroll', () => {
    // No sticky column and no `scrollable`, so there is no scroller element to
    // reach for — the effect must not throw on the null ref.
    const plain: DataTableColumn<Row>[] = [{ key: 'name', header: 'Name' }];
    const { container, rerender } = render(
      <DataTable<Row> columns={plain} rows={ROWS} rowKey={(r) => r.id} scrollResetKey="a" />,
    );
    expect(scrollerOf(container)).toBeNull();
    expect(() =>
      rerender(
        <DataTable<Row> columns={plain} rows={OTHER_ROWS} rowKey={(r) => r.id} scrollResetKey="b" />,
      ),
    ).not.toThrow();
  });
});
