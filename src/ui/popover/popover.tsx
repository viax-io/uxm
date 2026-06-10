'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../helpers/cn';
import { useDismiss } from '../../hooks/use-dismiss';
import { useFocusOnMount } from '../../hooks/use-focus-on-mount';
import { usePortal } from '../../hooks/use-portal';

export type PopoverPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end';

export interface PopoverProps {
  /** Whether the popover is open. Controlled — pair with `onOpenChange`. */
  open: boolean;
  /** Called when the popover requests to close (outside click, Escape). */
  onOpenChange: (open: boolean) => void;
  /**
   * Element the popover anchors to. Used for both positioning and
   * click-outside exclusion (clicks inside `anchor` won't close the popover —
   * the consumer's trigger handles toggling instead).
   */
  anchor: RefObject<HTMLElement | null>;
  /** Popover content. Only mounted while `open`. */
  children: ReactNode;
  /** Preferred placement. Flips to the opposite side if it overflows. Default `bottom-start`. */
  placement?: PopoverPlacement;
  /** Gap in px between the anchor and the panel edge. Default 4. */
  offset?: number;
  /** Render into a portal at `document.body`. Default true — escapes overflow / transform parents. */
  portal?: boolean;
  /** Force the panel width to match the anchor width. Default false. */
  matchAnchorWidth?: boolean;
  /** Minimum panel width in px. Useful when `matchAnchorWidth` is false but you want a sensible floor. */
  minWidth?: number;
  /** Close on Escape keydown anywhere. Default true. */
  closeOnEscape?: boolean;
  /** Close on mousedown outside the anchor + panel. Default true. */
  closeOnOutsideClick?: boolean;
  /** Element to focus when the popover opens (e.g. a search input). */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Restore focus to the anchor on close. Default true. */
  restoreFocus?: boolean;
  /** Class applied to the panel root. */
  className?: string;
  /** Style applied to the panel root (merged after computed position). */
  style?: CSSProperties;
  /** ARIA role on the panel. Default `dialog` — pickers should override with `listbox`/`menu`. */
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  id?: string;
}

/**
 * Headless popover primitive — owns positioning, portal mounting,
 * click-outside, Escape, and optional focus management. No visual
 * chrome of its own; consumers style the panel via `className`.
 *
 * Trigger ownership stays with the consumer (pass a ref via `anchor`).
 * That keeps composite components like `PhoneInput` and `PillSelect`
 * — where the trigger lives inside a larger field surface — wire-able
 * without renderProps acrobatics.
 *
 * Position is recomputed on open, on window resize, and on scroll
 * within any ancestor scroll container. Placement flips along the
 * cross-axis if the preferred side would clip; we always use
 * `position: fixed` so transformed / clipped parents don't break us.
 */
export function Popover({
  open,
  onOpenChange,
  anchor,
  children,
  placement = 'bottom-start',
  offset = 4,
  portal = true,
  matchAnchorWidth = false,
  minWidth,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  initialFocus,
  restoreFocus = true,
  className,
  style,
  role = 'dialog',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  id,
}: PopoverProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number | undefined;
    placement: PopoverPlacement;
  } | null>(null);

  // SSR-safe mount gate — shared with Dialog and any future portaled atom.
  const mounted = usePortal();

  // eslint-disable-next-line react-hooks/preserve-manual-memoization -- updatePosition reads from refs (anchor, panelRef) inside the callback body; the deps list intentionally excludes them since ref reads are imperative, not reactive
  const updatePosition = useCallback(() => {
    const trigger = anchor.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return;

    const triggerRect = trigger.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    // Decide vertical side — flip if preferred side would clip and
    // the opposite side has more room.
    const wantsBottom = placement.startsWith('bottom');
    const spaceBelow = viewportH - triggerRect.bottom - offset;
    const spaceAbove = triggerRect.top - offset;
    const fitsBottom = spaceBelow >= panelRect.height;
    const fitsTop = spaceAbove >= panelRect.height;
    const useBottom = wantsBottom ? fitsBottom || !fitsTop : !(fitsTop || !fitsBottom);

    // Decide horizontal alignment — flip end/start if it would clip
    // off-screen on the chosen side.
    const wantsEnd = placement.endsWith('end');
    let left = wantsEnd
      ? triggerRect.right - panelRect.width
      : triggerRect.left;
    // Re-anchor if we overflow either edge.
    if (left + panelRect.width > viewportW - 4) {
      left = Math.max(4, triggerRect.right - panelRect.width);
    }
    if (left < 4) {
      left = Math.min(viewportW - panelRect.width - 4, triggerRect.left);
      if (left < 4) left = 4;
    }

    const top = useBottom
      ? triggerRect.bottom + offset
      : triggerRect.top - panelRect.height - offset;

    const resolvedPlacement: PopoverPlacement = `${useBottom ? 'bottom' : 'top'}-${
      wantsEnd ? 'end' : 'start'
    }` as PopoverPlacement;

    setPosition({
      top,
      left,
      width: matchAnchorWidth ? triggerRect.width : undefined,
      placement: resolvedPlacement,
    });
  }, [anchor, offset, placement, matchAnchorWidth]);

  // First-paint positioning + reposition on size / scroll changes.
  // `useLayoutEffect` so the panel's first paint includes the correct
  // coords (otherwise it flashes at 0,0).
  useLayoutEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear cached position on close so reopen recomputes
      setPosition(null);
      return;
    }
    updatePosition();
    // Re-run once after the browser settles a frame — handles cases where
    // the panel's intrinsic size depends on async content (e.g. fonts).
    const r = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(r);
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onResize = () => updatePosition();
    // Capture phase so we catch scrolls in any ancestor — using fixed
    // positioning means we must reposition on any scroll, not just window.
    const onScroll = () => updatePosition();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, true);

    // Re-measure if the panel itself changes size (filter typed, list
    // shortens). Without this, the flip / horizontal clamp from
    // `updatePosition` runs against stale dimensions.
    let ro: ResizeObserver | undefined;
    if (panelRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(updatePosition);
      ro.observe(panelRef.current);
    }
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll, true);
      ro?.disconnect();
    };
  }, [open, updatePosition]);

  // Dismissal — Escape + outside-click handled by the shared hook so
  // popover.tsx, dialog.tsx, date-input.tsx, and time-input.tsx all
  // share one implementation. Inside-region for popovers spans BOTH
  // the anchor (clicks on the trigger toggle via the consumer's own
  // handler, not via dismiss) and the panel itself.
  const dismissRefs = useMemo(() => [anchor, panelRef], [anchor]);
  useDismiss({
    enabled: open,
    onDismiss: () => onOpenChange(false),
    refs: dismissRefs,
    closeOnEscape,
    closeOnOutsideClick,
  });

  // Focus management — shared with Dialog. `useFocusOnMount` captures
  // `document.activeElement` at activate time and restores to it on
  // close, which gives Popover its "restore to anchor if anchor was
  // focused at open time, otherwise leave focus alone" semantic for
  // free (since anchor was the activeElement iff the user clicked it
  // to open).
  useFocusOnMount({
    active: open,
    initialFocus,
    returnFocus: restoreFocus,
  });

  if (!open || !mounted) return null;

  const panelStyle: CSSProperties = {
    position: 'fixed',
    top: position?.top ?? 0,
    left: position?.left ?? 0,
    width: position?.width,
    minWidth: minWidth,
    // Pre-paint: invisible until the first position measurement lands so
    // we never flash at 0,0. After that, full opacity. Pointer-events
    // also gated so a not-yet-positioned panel can't eat clicks.
    visibility: position ? 'visible' : 'hidden',
    pointerEvents: position ? 'auto' : 'none',
    ...style,
  };

  const panel = (
    <div
      ref={panelRef}
      id={id}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      data-placement={position?.placement ?? placement}
      className={cn('uxm-popover', className)}
      style={panelStyle}
    >
      {children}
    </div>
  );

  if (!portal) return panel;
  return createPortal(panel, document.body);
}
