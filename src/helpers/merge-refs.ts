import type { Ref, RefCallback } from 'react';

/**
 * Attach `node` to a single ref (function or object) and return a cleanup that
 * detaches it. For a React 19 ref callback that returns its own cleanup, that
 * cleanup is used; otherwise (legacy callback, object ref) the cleanup applies
 * the legacy detach — call the callback with `null`, or reset `.current`.
 */
function setRef<T>(ref: Ref<T> | undefined, node: T | null): () => void {
  if (!ref) return () => {};
  if (typeof ref === 'function') {
    const cleanup = ref(node);
    return typeof cleanup === 'function' ? cleanup : () => ref(null);
  }
  // Object ref — `.current` is readonly on RefObject<T> in the types, but
  // assigning it is exactly how React itself populates object refs.
  (ref as { current: T | null }).current = node;
  return () => {
    (ref as { current: T | null }).current = null;
  };
}

/**
 * Merge several refs into one callback ref, so a single element can feed BOTH
 * a ref the component owns internally AND one passed in by the consumer.
 *
 * Handles function refs and object refs (`{ current }`); `null` / `undefined`
 * entries are skipped. Returns a `RefCallback` — assign it to the element's
 * `ref`. Callers should memoise the result (`useMemo`) on the external ref so
 * the callback identity is stable across renders and React doesn't detach /
 * reattach every commit.
 *
 * React 19 aware: the returned callback returns an aggregate cleanup, so a
 * child ref callback that itself returns a cleanup (the React 19 style) has
 * that cleanup run on detach — while object refs and legacy `(node|null)`
 * callbacks are still reset on detach via the same aggregate.
 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node: T | null) => {
    const cleanups = refs.map((ref) => setRef(ref, node));
    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  };
}
