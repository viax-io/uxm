import { useEffect, useRef, type RefObject } from 'react';

/**
 * One enabled Escape layer. Identity is what the stack is keyed on, so the
 * object itself is the handle a layer removes itself by.
 */
interface EscapeLayer {
  /** Reads the caller's latest `onDismiss` at press time, not at push time. */
  dismiss: () => void;
  /** The caller's `refs`, read at press time — see `topOf`. */
  regions: () => Array<RefObject<HTMLElement | null>>;
}

/** Is any of `a`'s elements inside one of `b`'s? */
function isNestedIn(a: EscapeLayer, b: EscapeLayer): boolean {
  for (const inner of a.regions()) {
    const el = inner.current;
    if (!el) continue;
    for (const outer of b.regions()) {
      if (outer.current && outer.current !== el && outer.current.contains(el)) return true;
    }
  }
  return false;
}

/**
 * The layer Escape belongs to: the innermost one, falling back to the most
 * recently enabled.
 *
 * Push order alone is not enough, because it answers two different questions
 * with one signal. A layer enabled LATER is usually on top — a popover opened
 * inside an already-open dialog. But React runs a child's effects BEFORE its
 * parent's, so two layers that become enabled in the same commit push
 * inner-first, which reads as the outer one being newer. The library's own
 * atoms never hit this (a `Popover` cannot mount until its `Dialog`'s portal
 * exists, so the dialog really is pushed first), but a consumer nesting two
 * plain `useDismiss` layers does, immediately.
 *
 * Containment settles it, and it is the same mechanism the outside-click path
 * already trusts these refs for. Layers that are siblings — two portaled panels
 * in `document.body` — contain nothing of each other, so push order still
 * decides, which is the answer that case wants anyway.
 */
function topOf(stack: EscapeLayer[]): EscapeLayer | undefined {
  let top = stack[stack.length - 1];
  if (!top) return undefined;
  // Repeated passes, because containment here is NOT transitive. A `Popover`'s
  // refs are `[anchor, panel]` and the panel is portaled to `document.body`, so
  // a popover Q anchored inside popover P's panel gives Q ⊂ P and P ⊂ D without
  // giving Q ⊂ D. One pass that found P would never go on to compare Q against
  // it, and Escape went to the middle layer.
  //
  // Bounded rather than "until stable": two layers can each hold an element
  // inside the other, so there is no ordering to converge on and an unbounded
  // loop could ping-pong. Capped, it settles or gives up deterministically.
  for (let pass = 0; pass < stack.length; pass += 1) {
    let next = top;
    // Compared against `top`, not against `next`, so that among several layers
    // nested in the same one the LAST — most recently enabled — wins.
    for (const layer of stack) {
      if (layer !== top && isNestedIn(layer, top)) next = layer;
    }
    if (next === top) break;
    top = next;
  }
  return top;
}

/**
 * Every enabled `closeOnEscape` layer, oldest first. Escape goes to the last
 * one only.
 *
 * This exists because `stopPropagation()` cannot order these layers. Each
 * `useDismiss` used to add its own `keydown` listener to `document`, and
 * `stopPropagation` stops an event reaching the next NODE up, not the next
 * listener on the same node — so a Popover inside a Dialog fired both, and one
 * Escape closed the dialog underneath the popover it was aimed at.
 * `stopImmediatePropagation` would not have helped either: the dialog opened
 * first, so its listener was registered first and ran first.
 *
 * Module-level, so an app that bundles two copies of the library gets two
 * independent stacks — the same caveat `Dialog`'s open-count already carries.
 */
const escapeStack: EscapeLayer[] = [];

function onDocumentKeyDown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return;
  const top = topOf(escapeStack);
  if (!top) return;
  event.stopPropagation();
  top.dismiss();
}

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
   *
   * **Must be a stable/memoized array** (e.g. built with `useMemo`, or a
   * ref/module-level constant) — it's a direct dependency of the outside-click
   * effect below, so passing a fresh inline array literal on every render
   * causes the `mousedown` listener to be torn down and re-subscribed on
   * every render. See `popover.tsx`'s `dismissRefs` for the pattern.
   *
   * The Escape path reads this at press time instead, so an unstable array
   * still orders layers correctly — only the outside-click listener thrashes.
   * That makes the contract easy to break without noticing; it is still the
   * contract.
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
 * Escape closes ONE layer — the most recently enabled one. That ordering
 * comes from `escapeStack` above, not from `stopPropagation`, which cannot
 * order listeners that all sit on `document`. A layer joins the stack when it
 * becomes enabled and leaves when it is disabled or unmounts; a layer with
 * `closeOnEscape: false` never joins, so the layer beneath it still gets the
 * key.
 *
 * "Topmost" is the innermost layer by `refs` containment, and failing that the
 * most recently enabled. Containment is what makes the answer independent of
 * mount order: React runs a child's effects BEFORE its parent's, so two layers
 * enabled in the same commit push inner-first, and push order alone would read
 * that as the outer one being newer. Layers that contain nothing of each other
 * — two portaled panels sitting side by side in `document.body` — fall back to
 * push order, which is the answer that case wants anyway.
 *
 * Caller contract: `refs` (and `excludeClosest`, if passed) must be
 * stable/memoized — see the `refs` option doc below. An inline array
 * literal re-subscribes the outside-click listener on every render.
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

  // Read `onDismiss` at press time instead of depending on it. Callers pass an
  // inline arrow (`() => onOpenChange(false)`), so with it in the deps below
  // the effect re-ran on EVERY render — which for a stack keyed on push order
  // would quietly re-seat the layer on top. Measured before this change: a
  // Dialog with a Popover inside it subscribes
  // `+dialog -dialog +popover +dialog -popover +popover -popover +popover`,
  // i.e. the dialog re-subscribes after the popover. Escape would then have
  // followed whichever layer last re-rendered.
  const onDismissRef = useRef(onDismiss);
  const refsRef = useRef(refs);
  useEffect(() => {
    onDismissRef.current = onDismiss;
    refsRef.current = refs;
  });

  useEffect(() => {
    if (!enabled || !closeOnEscape) return;
    const layer: EscapeLayer = {
      dismiss: () => onDismissRef.current(),
      regions: () => refsRef.current,
    };
    escapeStack.push(layer);
    if (escapeStack.length === 1) document.addEventListener('keydown', onDocumentKeyDown);
    return () => {
      // Remove by identity, never `pop()`: layers are disabled out of order —
      // a dialog can close while a popover inside it is still enabled, and the
      // order React runs the two cleanups in is not ours to assume.
      const at = escapeStack.indexOf(layer);
      if (at !== -1) escapeStack.splice(at, 1);
      if (escapeStack.length === 0) document.removeEventListener('keydown', onDocumentKeyDown);
    };
  }, [enabled, closeOnEscape]);
}
