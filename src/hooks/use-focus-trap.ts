'use client';

import { useEffect, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function focusableWithin(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
}

export interface UseFocusTrapOptions {
  active: boolean;
  /** Container whose focusable descendants form the trap boundary. */
  container: RefObject<HTMLElement | null>;
}

/**
 * Trap Tab / Shift+Tab cycling within `container` while `active` is true.
 * Used by Dialog (modal interruption); Popover does NOT use this — popovers
 * are non-modal and Tab should be able to leave them.
 *
 * Implementation: keydown listener at document level (capture phase) so it
 * sees Tab presses regardless of what's currently focused inside the
 * container. On Tab at the last focusable, wrap to first; on Shift+Tab at
 * the first, wrap to last. If focus is somehow OUTSIDE the container while
 * the trap is active, the next Tab pulls it back to the first focusable.
 *
 * Edge cases consciously skipped (v1):
 *  - Focusables added/removed dynamically during the open lifetime are
 *    re-queried on every Tab — correct, but O(n) per keydown. Negligible
 *    for realistic modal contents.
 *  - Elements made focusable via shadow DOM. Not used in modo today.
 *  - User Cmd-Tab / Alt-Tab away from the browser — out of scope; the
 *    trap is intra-document only.
 */
export function useFocusTrap({ active, container }: UseFocusTrapOptions): void {
  useEffect(() => {
    if (!active) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const root = container.current;
      if (!root) return;
      const focusables = focusableWithin(root);
      if (focusables.length === 0) {
        // Nothing to focus inside the panel — keep focus on the root
        // itself so Tab doesn't escape to the page behind. Container
        // needs tabIndex={-1} for this to succeed; consumers set that.
        e.preventDefault();
        root.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (!root.contains(current)) {
        e.preventDefault();
        first.focus();
        return;
      }
      if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
        return;
      }
      if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active, container]);
}
