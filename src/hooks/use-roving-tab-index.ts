import { useCallback, useRef } from 'react';

import type { KeyboardEvent, RefCallback } from 'react';

export type RovingTabIndexOrientation = 'horizontal' | 'vertical';

export interface UseRovingTabIndexOptions {
  /** Total number of items in the roving group. */
  count: number;
  /**
   * Index of the item that currently owns the roving tab stop
   * (`tabIndex={0}`) — every other item should render `tabIndex={-1}`.
   * For tabs/toolbars this is usually the active/selected item; for a
   * plain listbox it can be a locally-owned "highlighted" index that's
   * independent of the committed selection.
   */
  activeIndex: number;
  /**
   * Arrow-key axis: `horizontal` reads ArrowLeft/ArrowRight, `vertical`
   * reads ArrowUp/ArrowDown. Home/End work either way. Default `horizontal`.
   */
  orientation?: RovingTabIndexOrientation;
  /**
   * Items to skip while arrow-navigating (e.g. disabled tabs). Skipped
   * items are never landed on, so the group can't be arrowed into an
   * inert item and stays reachable.
   */
  isDisabled?: (index: number) => boolean;
  /**
   * Called with the index the roving focus should move to next. The
   * consumer decides what "moving" means — for tabs that's usually
   * "select AND focus"; for a listbox it can be just "highlight".
   */
  onNavigate: (index: number) => void;
}

export interface UseRovingTabIndexResult {
  /**
   * Ref callback — register each item's DOM node at `index` so arrow
   * navigation can call `.focus()` on it after `onNavigate` runs.
   */
  getItemRef: (index: number) => RefCallback<HTMLElement>;
  /**
   * Wire to each item's `onKeyDown`. Moves the roving tab stop with
   * ArrowLeft/Right (or Up/Down, per `orientation`) + Home/End; ignores
   * all other keys so native behavior (Enter/Space activation, etc.)
   * passes through untouched.
   */
  onItemKeyDown: (e: KeyboardEvent<HTMLElement>, index: number) => void;
}

/**
 * Roving-tabindex keyboard navigation for one-dimensional ARIA widgets
 * (tabs, toolbars, listboxes) where exactly one item is a Tab stop at a
 * time and Arrow keys move focus within the group.
 *
 * The hook is intentionally "controlled": it doesn't own any state itself.
 * The consumer passes the current `activeIndex` and receives the next
 * index via `onNavigate` to act on — select it, highlight it, whatever
 * fits the widget. That keeps a single source of truth for which item is
 * active, whether it changed via click, keyboard, or a controlled prop
 * from the parent.
 *
 * @example
 * const activeIndex = options.findIndex((o) => o.value === active);
 * const { getItemRef, onItemKeyDown } = useRovingTabIndex({
 *   count: options.length,
 *   activeIndex,
 *   isDisabled: (i) => !!options[i].disabled,
 *   onNavigate: (i) => select(options[i].value),
 * });
 *
 * <button
 *   ref={getItemRef(i)}
 *   tabIndex={i === activeIndex ? 0 : -1}
 *   onKeyDown={(e) => onItemKeyDown(e, i)}
 * />
 */
export function useRovingTabIndex({
  count,
  // `activeIndex` stays in the options type (consumers read it for their own
  // `tabIndex={i === activeIndex ? 0 : -1}`) but the hook body doesn't need it.
  orientation = 'horizontal',
  isDisabled,
  onNavigate,
}: UseRovingTabIndexOptions): UseRovingTabIndexResult {
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  const getItemRef = useCallback(
    (index: number): RefCallback<HTMLElement> =>
      (el) => {
        itemRefs.current[index] = el;
      },
    [],
  );

  const moveTo = useCallback(
    (index: number) => {
      onNavigate(index);
      itemRefs.current[index]?.focus();
    },
    [onNavigate],
  );

  const onItemKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>, index: number) => {
      const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
      const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';

      if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
        const step = e.key === 'Home' ? 1 : -1;
        let candidate = e.key === 'Home' ? 0 : count - 1;
        while (candidate >= 0 && candidate < count && isDisabled?.(candidate)) {
          candidate += step;
        }
        if (candidate >= 0 && candidate < count) moveTo(candidate);
        return;
      }

      let step = 0;
      if (e.key === prevKey) step = -1;
      else if (e.key === nextKey) step = 1;
      else return;

      e.preventDefault();
      let next = index + step;
      while (next >= 0 && next < count && isDisabled?.(next)) next += step;
      if (next >= 0 && next < count) moveTo(next);
    },
    [count, isDisabled, orientation, moveTo],
  );

  return { getItemRef, onItemKeyDown };
}
