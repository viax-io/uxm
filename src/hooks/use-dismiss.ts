'use client';

import { useEffect, type RefObject } from 'react';

export interface UseDismissOptions {
  /** Only attach listeners while true. */
  enabled: boolean;
  /** Called when the user requests dismissal (Escape or outside click). */
  onDismiss: () => void;
  /**
   * Refs whose elements are considered "inside" — clicks landing on these
   * (or their descendants) do NOT dismiss. Pass the trigger AND the panel
   * for popovers; pass just the panel for modal dialogs (clicks outside
   * the panel = backdrop = dismiss).
   */
  refs: Array<RefObject<HTMLElement | null>>;
  /**
   * Selectors that also count as "inside" via `closest()`. Use for
   * portaled child floating layers — a popover/listbox opened INSIDE a
   * dialog mounts to `document.body`, so it's not a DOM descendant of
   * the dialog's panel ref. Without this, picking an option in a nested
   * dropdown would dismiss the surrounding dialog.
   *
   * Conventional list for dialog-like consumers: `[".uxm-popover"]`.
   */
  excludeClosest?: string[];
  /** Default true. */
  closeOnEscape?: boolean;
  /** Default true. */
  closeOnOutsideClick?: boolean;
}

/**
 * Shared dismissal primitive for floating UI (popovers, dialogs, date/time
 * pickers). Replaces three near-identical copies that previously lived
 * across popover.tsx, date-input.tsx, and time-input.tsx.
 *
 * Why `mousedown` rather than `click`: mousedown fires BEFORE focus
 * shifts, so clicking a different focusable element closes us cleanly
 * without leaving the floating panel briefly focused.
 *
 * Why `stopPropagation` on Escape: nested floating things (popover
 * inside a dialog) should close one layer at a time. The innermost
 * handler stops propagation so the outer's Escape doesn't also fire.
 */
export function useDismiss({
  enabled,
  onDismiss,
  refs,
  excludeClosest,
  closeOnEscape = true,
  closeOnOutsideClick = true,
}: UseDismissOptions): void {
  useEffect(() => {
    if (!enabled || !closeOnOutsideClick) return;
    function onMouseDown(e: MouseEvent) {
      const target = e.target as Node | null;
      if (!target) return;
      for (const ref of refs) {
        if (ref.current?.contains(target)) return;
      }
      if (excludeClosest && target instanceof Element) {
        for (const selector of excludeClosest) {
          if (target.closest(selector)) return;
        }
      }
      onDismiss();
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [enabled, closeOnOutsideClick, refs, excludeClosest, onDismiss]);

  useEffect(() => {
    if (!enabled || !closeOnEscape) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onDismiss();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [enabled, closeOnEscape, onDismiss]);
}
