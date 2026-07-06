import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../helpers/cn';
import { useDismiss } from '../../hooks/use-dismiss';
import { useFocusOnMount } from '../../hooks/use-focus-on-mount';
import { useFocusTrap } from '../../hooks/use-focus-trap';
import { usePortal } from '../../hooks/use-portal';
import { useScrollLock } from '../../hooks/use-scroll-lock';

export interface DialogProps {
  /** Controlled — pair with `onOpenChange`. */
  open: boolean;
  /** Called when the user requests close (Escape, backdrop click). */
  onOpenChange: (open: boolean) => void;
  /** Panel content. Most consumers pass a `<Modal>`; bespoke surfaces work too. */
  children: ReactNode;
  /** Default true. */
  closeOnEscape?: boolean;
  /** Default true — clicks on the backdrop dismiss. */
  closeOnOutsideClick?: boolean;
  /**
   * Element to receive focus when the dialog opens. If omitted, focus
   * moves to the first focusable element inside the panel. Pass an
   * explicit ref when the default (often a Cancel/Close button) is the
   * wrong target — e.g. a search input that should be ready to type into.
   */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Restore focus to the previously-active element on close. Default true. */
  returnFocus?: boolean;
  /** ID of the element labelling the dialog (usually the title). */
  'aria-labelledby'?: string;
  /** ID of the element describing the dialog. */
  'aria-describedby'?: string;
  /** Class applied to the panel wrapper (the centering layer). */
  className?: string;
}

// Single-modal assertion for v1. Stacking support is a follow-up; if it
// ever lands, replace this with a refcount + per-layer z-index increments.
let __openCount = 0;

/**
 * Modal dialog — provides the mechanics for a centered, blocking
 * floating layer. Mirrors `Popover` for the non-modal floating case,
 * with extra responsibilities:
 *   1. Backdrop (covers viewport, dimmed via tokens).
 *   2. Body scroll-lock while open.
 *   3. Focus trap within the panel (Tab cycles, can't escape).
 *   4. `role="dialog"` + `aria-modal="true"` on the panel.
 *
 * The panel itself has NO visible styling — background, padding, and
 * shadow come from whatever the consumer renders inside (typically a
 * `<Modal>`). Same shape as Popover/Listbox: this component is invisible
 * behavior; the rendered child owns the look.
 *
 * Backdrop styling is global (token-driven, `--backdrop-color` /
 * `--backdrop-blur`) rather than per-modal — consistent feel across every
 * dialog in the app. Designers tune the tokens once.
 */
export function Dialog({
  open,
  onOpenChange,
  children,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  initialFocus,
  returnFocus = true,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  className,
}: DialogProps) {
  const mounted = usePortal();
  const panelRef = useRef<HTMLDivElement | null>(null);
  // Refs in `useDismiss` are compared by `.contains(target)`; the array
  // identity needs to be stable so useEffect inside useDismiss doesn't
  // re-subscribe on every render. useMemo with `[]` gives a one-time
  // array that captures the panelRef object (refs themselves are stable
  // across renders, so the inner reference is fine).
  const dismissRefs = useMemo(() => [panelRef], []);

  // Single-modal invariant (v1). Counter increments on mount-while-open
  // and decrements on close. A second simultaneous Dialog logs a warning
  // so the misuse surfaces. The warn fires in any environment — this
  // package is client-side and shouldn't reference Node's `process`
  // global; the situation only arises from a Dialog-stacking bug and
  // the warn is diagnostic, so leaving it always-on is fine.
  useEffect(() => {
    if (!open) return;
    __openCount += 1;
    if (__openCount > 1) {
      console.warn(
        '[Dialog] More than one Dialog is open simultaneously. v1 supports single-modal only; behavior is undefined.',
      );
    }
    return () => {
      __openCount -= 1;
    };
  }, [open]);

  useScrollLock(open);

  useDismiss({
    enabled: open,
    onDismiss: () => onOpenChange(false),
    refs: dismissRefs,
    // Allow clicks on portaled nested floating layers (Popovers, Listboxes)
    // opened INSIDE the dialog — those panels are siblings of our panel in
    // the body, not descendants, so the bare ref check would dismiss us
    // when the user picks a select option.
    excludeClosest: ['.uxm-popover'],
    closeOnEscape,
    closeOnOutsideClick,
  });

  useFocusOnMount({
    active: open,
    initialFocus,
    focusFirstIn: panelRef,
    returnFocus,
  });

  useFocusTrap({ active: open, container: panelRef });

  if (!open || !mounted) return null;

  const tree = (
    <div className="uxm-dialog__root" data-state="open">
      <div className="uxm-dialog__backdrop" aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        // tabIndex={-1} so `useFocusTrap` can park focus on the panel
        // itself when there are no focusable children (rare, but the trap
        // still has to keep focus from escaping).
        tabIndex={-1}
        className={cn('uxm-dialog__panel', className)}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(tree, document.body);
}
