import type { Ref, RefCallback } from 'react';

/**
 * Merge several refs into one callback ref, so a single element can feed BOTH
 * a ref the component owns internally AND one passed in by the consumer.
 *
 * Handles function refs and object refs (`{ current }`); `null` / `undefined`
 * entries are skipped. Returns a `RefCallback` — assign it to the element's
 * `ref`. Callers should memoise the result (`useMemo`) on the external ref so
 * the callback identity is stable across renders and React doesn't detach /
 * reattach every commit.
 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        // Object ref — `.current` is readonly on RefObject<T> in the types, but
        // assigning it is exactly how React itself populates object refs.
        (ref as { current: T | null }).current = node;
      }
    }
  };
}
