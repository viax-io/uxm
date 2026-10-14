import { describe, expect, it } from 'vitest';

import { rendersSomething } from '@/helpers';

/**
 * The gate every conditional slot in the library runs on. It shipped wrong once
 * (`!= null` let `false` through in 4.62.0), so its contract is pinned here
 * rather than re-derived per component.
 */
describe('rendersSomething', () => {
  it.each([
    ['null', null],
    ['undefined', undefined],
    ['false — the `cond && <X/>` conditional', false],
    ['true', true],
    ['an empty string', ''],
    ['an empty array — `items.map()` over nothing', []],
    ['an array of only falsy nodes', [false, null, undefined, '']],
    ['a nested array of nothing', [[], [false]]],
  ])('says %s renders nothing', (_label, node) => {
    expect(rendersSomething(node as never)).toBe(false);
  });

  it.each([
    ['zero — an action count, not an absence', 0],
    ['a string', 'Buyer'],
    ['a number', 42],
    ['an array with one real node', [false, 'x']],
  ])('says %s renders something', (_label, node) => {
    expect(rendersSomething(node as never)).toBe(true);
  });
});
