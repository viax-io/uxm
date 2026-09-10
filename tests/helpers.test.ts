import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { cn, mergeDescribedBy, mergeRefs } from '@/helpers';

// The three helpers every atom is built on. `mergeRefs` and `mergeDescribedBy`
// exist precisely because a bare spread lost the consumer's ref / describedby,
// so the tests pin that the consumer's half survives.

describe('cn', () => {
  it('drops falsy parts and joins the rest with single spaces', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
    expect(cn()).toBe('');
    expect(cn('uxm-button', undefined)).toBe('uxm-button');
  });
});

describe('mergeRefs', () => {
  it('feeds the node to function refs and object refs, skipping empty slots', () => {
    const fn = vi.fn();
    const obj = createRef<HTMLDivElement>();
    const node = document.createElement('div');
    const merged = mergeRefs<HTMLDivElement>(fn, obj, undefined, null);

    const cleanup = merged(node);
    expect(fn).toHaveBeenCalledWith(node);
    expect(obj.current).toBe(node);

    (cleanup as () => void)();
    expect(fn).toHaveBeenLastCalledWith(null);
    expect(obj.current).toBeNull();
  });

  it('runs a React 19 ref-callback cleanup instead of calling the callback with null', () => {
    const cleanup = vi.fn();
    const ref = vi.fn(() => cleanup);
    const node = document.createElement('div');
    const detach = mergeRefs<HTMLDivElement>(ref)(node) as () => void;
    detach();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(ref).toHaveBeenCalledTimes(1);
  });
});

describe('mergeDescribedBy', () => {
  it('keeps the consumer ids first and the managed id last', () => {
    expect(mergeDescribedBy('hint-1 hint-2', 'error-1')).toBe('hint-1 hint-2 error-1');
    expect(mergeDescribedBy('hint-1', undefined)).toBe('hint-1');
    expect(mergeDescribedBy(undefined, 'error-1')).toBe('error-1');
  });

  it('returns undefined when there is nothing to describe', () => {
    expect(mergeDescribedBy(undefined, undefined)).toBeUndefined();
    expect(mergeDescribedBy('', '')).toBeUndefined();
  });
});
