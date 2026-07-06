import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';

import { cn } from '../../helpers/cn';
import { Icon } from '../icon';
import { Popover, type PopoverPlacement } from '../popover';

// ─────────────────────────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * One actionable row in the menu. Selecting it fires `onSelect` and
 * closes the menu — menus are about INVOKING an action, not holding a
 * selected value (that's Listbox/Select). So there is no "selected"
 * state, no checkmarks: pick → act → dismiss.
 */
export interface MenuItem {
  /** Stable identity — used as React key and for keyboard focus tracking. */
  key: string;
  /** Row content. A plain string renders as the label; pass a node for richer rows. */
  label: ReactNode;
  /** Optional leading icon glyph (see icons.ts). */
  icon?: string;
  /** Optional trailing hint (e.g. a keyboard shortcut "⌘C"). */
  hint?: ReactNode;
  /** Invoked on click / Enter / Space. The menu closes afterward. */
  onSelect?: () => void;
  /** Greyed + non-interactive; skipped by keyboard nav. */
  disabled?: boolean;
  /** Destructive styling (danger color) — e.g. Delete. */
  danger?: boolean;
}

/** A non-interactive divider between groups of items. */
export interface MenuSeparator {
  separator: true;
  /** Optional key; falls back to positional. */
  key?: string;
}

export type MenuEntry = MenuItem | MenuSeparator;

function isSeparator(entry: MenuEntry): entry is MenuSeparator {
  return (entry as MenuSeparator).separator === true;
}

/**
 * Props spread onto the consumer's trigger element. Mirrors Listbox's
 * trigger contract — the consumer owns the trigger entirely (an
 * IconButton ⋮, a Button, anything) and the menu wires open/close +
 * ARIA through these. Do NOT add your own onClick / aria-expanded /
 * aria-haspopup — they would override the menu's wiring.
 */
export interface MenuTriggerProps {
  ref: (el: HTMLElement | null) => void;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
  'aria-controls'?: string;
}

export interface MenuProps {
  /** Menu entries — actionable items + separators, in display order. */
  items: MenuEntry[];
  /** Render the trigger. Spread `triggerProps` onto your interactive element. */
  renderTrigger: (api: { open: boolean; triggerProps: MenuTriggerProps }) => ReactNode;
  /** Preferred placement. Flips if it would clip. Default `bottom-end` (menus typically align to a trailing ⋮). */
  placement?: PopoverPlacement;
  /** Controlled open state. Pair with `onOpenChange`. Omit for uncontrolled. */
  open?: boolean;
  /** Called whenever the menu wants to open/close. Required if `open` is passed. */
  onOpenChange?: (open: boolean) => void;
  /** Minimum panel width in px. Default 160. */
  minWidth?: number;
  /** Maximum panel width in px — long labels truncate beyond it. Default 280. */
  maxWidth?: number;
  /** Accessible name for the menu panel. */
  'aria-label'?: string;
  /** Class on the in-page wrapper around the trigger. */
  className?: string;
  /** Class on the portaled panel. */
  panelClassName?: string;
  /** Style merged onto the portaled panel (after computed position). */
  panelStyle?: CSSProperties;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Menu
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Action / dropdown menu — a list of commands invoked from a
 * consumer-owned trigger. Built on the headless `Popover` (positioning,
 * portal, outside-click, Escape) with proper menu semantics
 * (`role="menu"` / `menuitem` / `separator`), arrow-key navigation that
 * skips separators + disabled rows, separators, leading icons, trailing
 * hints, and destructive (danger) items.
 *
 * Distinct from Listbox by design: a menu has NO selected value and NO
 * checkmarks — picking a row runs its action and closes the menu. Reach
 * for Listbox/Select when you need to hold a chosen value (`role=listbox`,
 * `aria-selected`); reach for Menu for row ⋮ actions, overflow menus,
 * and command lists (`role=menu`).
 *
 * Trigger ownership stays with the consumer (`renderTrigger` + spread
 * `triggerProps`) so an IconButton ⋮, a Button, or any surface works
 * without renderProp acrobatics — same contract as Listbox.
 */
export function Menu({
  items,
  renderTrigger,
  placement = 'bottom-end',
  open: openProp,
  onOpenChange,
  minWidth = 160,
  maxWidth = 280,
  'aria-label': ariaLabel,
  className,
  panelClassName,
  panelStyle,
}: MenuProps) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const panelId = useId();

  // Open state — controlled if `open` is provided, else internal.
  const [openInternal, setOpenInternal] = useState(false);
  const open = openProp ?? openInternal;
  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenInternal(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  // Flat list of indices into `items` that are focusable (enabled
  // actionable rows) — separators + disabled rows are skipped by
  // keyboard nav. `active` is an index INTO this array, not into `items`.
  const focusableIndices = useMemo(() => {
    const idx: number[] = [];
    items.forEach((entry, i) => {
      if (!isSeparator(entry) && !entry.disabled) idx.push(i);
    });
    return idx;
  }, [items]);

  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Reset highlight to the first item each time the menu opens, and move
  // focus into the panel so arrow keys navigate the menu (WAI-ARIA
  // menu-button pattern). The panel list is `tabIndex=-1` and owns the
  // keyboard handler — focusing it is what routes keys there.
  //
  // The focus is deferred to a macrotask: Popover mounts the panel
  // `visibility: hidden` and only flips it visible once it has measured +
  // positioned it, and `focus()` on a `visibility: hidden` element is a
  // no-op. A `setTimeout(0)` lands after that position-settle re-render
  // (and, unlike rAF, still fires when the tab is backgrounded). We own
  // this rather than leaning on Popover's `initialFocus` (which we still
  // pass, for focus restoration on close) — the menu's keyboard contract
  // is the atom's own responsibility.
  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot reset on open
    setActive(0);
    const t = setTimeout(() => listRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  // Keep the highlighted row scrolled into view after arrow nav.
  useEffect(() => {
    if (!open) return;
    const itemIndex = focusableIndices[active];
    if (itemIndex == null) return;
    const entry = items[itemIndex];
    if (isSeparator(entry)) return;
    itemRefs.current.get(entry.key)?.scrollIntoView({ block: 'nearest' });
  }, [active, open, items, focusableIndices]);

  const select = useCallback(
    (item: MenuItem) => {
      if (item.disabled) return;
      item.onSelect?.();
      setOpen(false);
    },
    [setOpen],
  );

  // Panel keyboard nav — the panel itself is focused on open (tabIndex
  // -1) so arrows work without any text input. Wraps at both ends, like
  // Listbox.
  const onPanelKeyDown = useCallback(
     
    (e: React.KeyboardEvent) => {
      const n = focusableIndices.length;
      if (n === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((i) => (i + 1) % n);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((i) => (i - 1 + n) % n);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setActive(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setActive(n - 1);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const itemIndex = focusableIndices[active];
        const entry = itemIndex != null ? items[itemIndex] : undefined;
        if (entry && !isSeparator(entry)) select(entry);
      }
      // Escape is handled globally by Popover.
    },
    [active, focusableIndices, items, select],
  );

  // Trigger keyboard — Enter/Space/ArrowDown open the menu, matching the
  // WAI-ARIA menu-button pattern.
  const onTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      }
    },
    [setOpen],
  );

  // Memoised so a single `{...triggerProps}` spread doesn't hand the
  // consumer a fresh `ref` callback every render — React would call the
  // old callback with `null` then the new one with the element on each
  // cycle, briefly nulling `triggerRef.current` (which Popover reads to
  // position the panel). Mirrors the Listbox implementation.
  const triggerProps: MenuTriggerProps = useMemo(
    () => ({
      ref: (el: HTMLElement | null) => {
        triggerRef.current = el;
      },
      onClick: () => setOpen(!open),
      onKeyDown: onTriggerKeyDown,
      'aria-haspopup': 'menu',
      'aria-expanded': open,
      'aria-controls': open ? panelId : undefined,
    }),
    [open, onTriggerKeyDown, panelId, setOpen],
  );

  return (
    <div className={cn('uxm-menu', className)}>
      {/* eslint-disable-next-line react-hooks/refs -- triggerProps contains a ref-setter callback; the rule flags the pattern but the callback is the React-blessed way to wire a ref through a consumer-rendered element (same as Listbox) */}
      {renderTrigger({ open, triggerProps })}
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchor={triggerRef}
        placement={placement}
        minWidth={minWidth}
        maxWidth={maxWidth}
        initialFocus={listRef as RefObject<HTMLElement | null>}
        role="menu"
        aria-label={ariaLabel}
        id={panelId}
        className={cn('uxm-menu__panel', panelClassName)}
        style={panelStyle}
      >
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- the panel carries role="menu" (set on the Popover above); this inner list is the focus target + key-router for WAI-ARIA menu nav, with full keyboard support via onKeyDown */}
        <div
          ref={listRef}
          className="uxm-menu__list"
          tabIndex={-1}
          onKeyDown={onPanelKeyDown}
        >
          {items.map((entry, i) => {
            if (isSeparator(entry)) {
              return (
                <div
                  key={entry.key ?? `__sep_${i}`}
                  className="uxm-menu__separator"
                  role="separator"
                />
              );
            }
            const isActive = focusableIndices[active] === i;
            return (
              <button
                key={entry.key}
                ref={(el) => {
                  if (el) itemRefs.current.set(entry.key, el);
                  else itemRefs.current.delete(entry.key);
                }}
                type="button"
                role="menuitem"
                aria-disabled={entry.disabled || undefined}
                disabled={entry.disabled || undefined}
                // mousedown (not click) so focus stays on the panel and a
                // pointer pick doesn't blur-then-reopen.
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(entry);
                }}
                onMouseEnter={() => {
                  if (entry.disabled) return;
                  const flatIdx = focusableIndices.indexOf(i);
                  if (flatIdx >= 0) setActive(flatIdx);
                }}
                className={cn(
                  'uxm-menu__item',
                  isActive && 'uxm-menu__item--active',
                  entry.disabled && 'uxm-menu__item--disabled',
                  entry.danger && 'uxm-menu__item--danger',
                )}
              >
                {entry.icon && (
                  <Icon glyph={entry.icon} size={16} className="uxm-menu__item-icon" />
                )}
                <span className="uxm-menu__item-label">{entry.label}</span>
                {entry.hint != null && (
                  <span className="uxm-menu__item-hint">{entry.hint}</span>
                )}
              </button>
            );
          })}
        </div>
      </Popover>
    </div>
  );
}
