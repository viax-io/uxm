import { useId, useLayoutEffect, useState, type CSSProperties } from 'react';

/** Lines shown before the text clamps — the value both `ExpandableText` and `EditableCell type="textarea"` default to. */
export const DEFAULT_EXPANDABLE_LINES = 4;

export interface UseExpandableTextOptions {
  /** Lines shown while collapsed. Non-finite or below 1 falls back to the default. */
  lines?: number;
  /** Controlled expanded state. When defined, the hook never owns the state. */
  expanded?: boolean;
  /** Initial expanded state when uncontrolled. */
  defaultExpanded?: boolean;
  /** Fires with the next state on every toggle, controlled or not. */
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Anything whose change means the content may now be longer or shorter. A
   * clamped box that is already at its line limit does not resize when its text
   * grows, so the `ResizeObserver` cannot see that change — this is the other
   * half of the measurement. Pass the content (or the value it renders).
   */
  measureKey?: unknown;
  /** Off = no measuring, no clamp, no toggle. `EditableCell` runs this hook for every type and turns it on for `textarea` only. */
  enabled?: boolean;
}

/**
 * The clamp + measure + toggle state shared by `ExpandableText` and
 * `EditableCell type="textarea"`. Internal — not part of the public surface.
 *
 * Attach `contentRef` to the element that carries the clamp (a non-button block
 * or span: Chrome will not `-webkit-line-clamp` a `<button>`), and `contentId`
 * to the same element so the toggle's `aria-controls` resolves.
 *
 * The toggle is offered only while the collapsed content actually overflows —
 * `scrollHeight > clientHeight + 1`, re-measured by a `ResizeObserver` — or
 * while expanded, so an open text can always be collapsed again.
 *
 * @example
 * const t = useExpandableText<HTMLDivElement>({ lines: 3, measureKey: children });
 * <div ref={t.contentRef} id={t.contentId} style={t.clampStyle}>{children}</div>
 * {t.showToggle && <button onClick={t.toggle} aria-expanded={t.expanded} aria-controls={t.contentId} />}
 */
export function useExpandableText<T extends HTMLElement>({
  lines = DEFAULT_EXPANDABLE_LINES,
  expanded: controlledExpanded,
  defaultExpanded = false,
  onExpandedChange,
  measureKey,
  enabled = true,
}: UseExpandableTextOptions = {}) {
  const contentId = useId();
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded);
  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : uncontrolledExpanded;

  // The element lives in state (a callback ref), not a ref object: `EditableCell`
  // unmounts and remounts its display span around every edit, and the measuring
  // effect has to re-attach to the new node — a ref object would not tell it.
  const [node, setNode] = useState<T | null>(null);
  const [overflows, setOverflows] = useState(false);

  // Layout effect, so the toggle is in place before the first paint instead of
  // popping in a frame later and shifting what is below it.
  useLayoutEffect(() => {
    if (!enabled || !node || expanded) return undefined;
    const measure = () => setOverflows(node.scrollHeight > node.clientHeight + 1);
    measure();
    // jsdom / non-browser hosts have no ResizeObserver; the one-off measure above still runs.
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
    // `measureKey` and `lines` are not read inside the effect — they are the
    // re-measure triggers (see `measureKey` above).
  }, [enabled, node, expanded, lines, measureKey]);

  const toggle = () => {
    const next = !expanded;
    if (!isControlled) setUncontrolledExpanded(next);
    onExpandedChange?.(next);
  };

  const clamped = enabled && !expanded;
  const clampLines = Number.isFinite(lines) && lines >= 1 ? Math.floor(lines) : DEFAULT_EXPANDABLE_LINES;
  // Inline, and a bare number: `-webkit-line-clamp` through `var()` is fragile
  // in some engines, so the count cannot ride a custom property like other
  // dynamic values do.
  const clampStyle: CSSProperties | undefined = clamped ? { WebkitLineClamp: clampLines } : undefined;

  return {
    expanded,
    toggle,
    contentId,
    contentRef: setNode,
    clamped,
    clampStyle,
    showToggle: enabled && (expanded || (node !== null && overflows)),
  };
}
