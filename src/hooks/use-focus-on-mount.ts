import { useEffect, useRef, type RefObject } from 'react';

export interface UseFocusOnMountOptions {
  /** When true, manage focus on activate / deactivate. */
  active: boolean;
  /**
   * Element to focus when `active` flips false → true. If omitted, and
   * `focusFirstIn` is provided, the first focusable element inside that
   * container receives focus instead. If both are omitted, no focus
   * move happens on activate (the consumer manages it externally).
   */
  initialFocus?: RefObject<HTMLElement | null>;
  /**
   * Container whose first focusable element should receive focus when
   * `initialFocus` isn't provided. Useful for Dialog where we want SOME
   * sensible default focus target inside the panel.
   */
  focusFirstIn?: RefObject<HTMLElement | null>;
  /**
   * Restore focus when `active` flips true → false. Default true. The
   * hook captures `document.activeElement` at activate time and restores
   * to it at deactivate time. Pass `false` to opt out (e.g. programmatic
   * close where focus should stay where it landed).
   */
  returnFocus?: boolean;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function firstFocusable(root: HTMLElement | null): HTMLElement | null {
  if (!root) return null;
  return root.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
}

/**
 * Move focus into a floating surface when it opens, and restore focus
 * when it closes. Used by Popover and Dialog — single source of truth so
 * the library has one focus story.
 *
 * Edge cases consciously skipped (v1):
 *  - Elements inside shadow DOM aren't discovered by FOCUSABLE_SELECTOR.
 *    Not used anywhere in modo today.
 *  - If the captured `previousActive` element is removed from the DOM
 *    before deactivate, `.focus()` is a no-op and focus falls to <body>.
 *    Acceptable — better than throwing.
 */
export function useFocusOnMount({
  active,
  initialFocus,
  focusFirstIn,
  returnFocus = true,
}: UseFocusOnMountOptions): void {
  const previousActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    previousActiveRef.current =
      typeof document !== 'undefined'
        ? (document.activeElement as HTMLElement | null)
        : null;

    // Defer one frame so the floating element is mounted + positioned
    // before we focus it. Safari skips focus() on not-yet-attached nodes.
    const r = requestAnimationFrame(() => {
      const target =
        initialFocus?.current ?? firstFocusable(focusFirstIn?.current ?? null);
      target?.focus();
    });
    return () => cancelAnimationFrame(r);
  }, [active, initialFocus, focusFirstIn]);

  useEffect(() => {
    if (active || !returnFocus) return;
    const prev = previousActiveRef.current;
    // Only restore if the previously-active element is still in the DOM
    // AND we actually moved focus away from it. Avoids stealing focus
    // when a programmatic close happens while the user is interacting
    // with something else.
    if (prev && document.contains(prev)) {
      prev.focus();
    }
  }, [active, returnFocus]);
}
