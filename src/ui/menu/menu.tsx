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
 * selected value (that's Listbox/Select): pick → act → dismiss.
 *
 * `current` is not a counter-example. It marks where the user already IS
 * (the workspace they're in), which the menu reflects rather than owns —
 * there is still no value the menu holds, no `aria-selected`, and nothing
 * the atom mutates on pick. Reach for Listbox/Select the moment the panel
 * is supposed to OWN the chosen value.
 */
export interface MenuItem {
  /** Stable identity — used as React key and for keyboard focus tracking. */
  key: string;
  /** Row content. A plain string renders as the label; pass a node for richer rows. */
  label: ReactNode;
  /**
   * Optional secondary line rendered beneath `label`, turning the row into a
   * two-line item: `label` is the headline, `subtitle` the supporting text
   * (e.g. a description or the current value). Single-line rows omit it.
   */
  subtitle?: ReactNode;
  /** Optional leading icon glyph (see icons.ts). */
  icon?: string;
  /**
   * Per-row colour for the leading glyph, applied inline — overrides the
   * shared `--uxm-menu-item-icon-color` for THIS row only. For icons that
   * carry identity rather than decoration: a workspace's own colour, a
   * status tint.
   *
   * Prefer a token reference (`'var(--color-category-composite)'`) so MODO
   * re-tinting still reaches it. A raw hex is only legitimate when the
   * colour is entity DATA from a backend, not a brand choice — otherwise it
   * punches a hole in the two-layer theming model.
   *
   * Being inline it wins over the `color: inherit` that `--active` /
   * `--danger` rows apply to the glyph. Deliberate — an identity colour
   * should survive highlighting — but it also means a `danger` row keeps
   * this colour instead of folding to the danger tone.
   */
  iconColor?: string;
  /** Optional trailing hint (e.g. a keyboard shortcut "⌘C"). */
  hint?: ReactNode;
  /** Invoked on click / Enter / Space. The menu closes afterward. */
  onSelect?: () => void;
  /** Greyed + non-interactive; skipped by keyboard nav. */
  disabled?: boolean;
  /** Destructive styling (danger color) — e.g. Delete. */
  danger?: boolean;
  /**
   * Marks the row the user is currently ON — the workspace they're in, the
   * view they're looking at. Renders a trailing ✓ plus a heavier label, and
   * sets `aria-current="true"`.
   *
   * Named `current`, NOT `active`: `--active` already means "the row under
   * the keyboard cursor" throughout this atom. The two compose — `--current`
   * contributes weight + ✓, `--active` contributes the highlight surface —
   * so a row that is both reads as both.
   *
   * Deliberately not `aria-selected` (invalid on `menuitem`) and not
   * `role="menuitemradio"` + `aria-checked`, even though the latter is the
   * canonical ARIA answer for "one of a set is checked in a menu": a radio
   * set requires EVERY member to carry `aria-checked`, which a flat
   * `MenuEntry[]` cannot infer. Consumers would have to pass `current:
   * false` on every sibling, and forgetting one leaves a lone radio with no
   * set — worse than no role at all. `aria-current` is also already this
   * repo's idiom for "where you are" (sidebar-nav-item, breadcrumb,
   * calendar). Revisit `menuitemradio` if one panel ever needs TWO
   * independent switcher sets.
   */
  current?: boolean;
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
  /** Minimum panel width in px. Default 160 — unless `matchAnchorWidth` is set; see there. */
  minWidth?: number;
  /** Maximum panel width in px — long labels truncate beyond it. Default 280 — unless `matchAnchorWidth` is set; see there. */
  maxWidth?: number;
  /**
   * Tie the panel width to the trigger: `true` makes it equal, `'min'` makes
   * the trigger width a floor the panel may grow past. Default `false` —
   * width from content, clamped by `minWidth` / `maxWidth`.
   *
   * Which is right follows from what the trigger IS. A field-like trigger
   * that DISPLAYS a value (a workspace switcher, a scope picker) wants the
   * panel tied to it — the native `<select>` convention, where the panel
   * reads as a continuation of the control rather than a separate floating
   * card; `'min'` is the forgiving choice there, since user-authored labels
   * outgrow a fixed width. An icon-only or ⋮ trigger must NOT match, or you
   * get a 32px panel — which is exactly why the default is `false` and
   * `placement` is `bottom-end`: content width, aligned to the trailing
   * edge the ⋮ sits on.
   *
   * Setting this also drops the default 160/280 clamp. Popover applies
   * `maxWidth` unconditionally, so leaving 280 in place would paint a panel
   * NARROWER than a trigger wider than 280.
   *
   * On restoring bounds, mind the asymmetry — `Popover` treats the two
   * differently (popover.tsx: `minWidth: matchAnchorWidth === 'min' ?
   * anchorWidth : minWidth`):
   *   - `maxWidth` is always honoured, in either mode.
   *   - `minWidth` is honoured with `true`, but **ignored with `'min'`** — that
   *     mode makes the measured anchor width the floor and discards whatever
   *     you pass. So you cannot demand a floor WIDER than the trigger in
   *     `'min'` mode; use `true` plus an explicit `minWidth` if you need that.
   */
  matchAnchorWidth?: boolean | 'min';
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
 * hints, destructive (danger) items, and a `current` row for switchers.
 *
 * Distinct from Listbox by design: a menu holds NO value — picking a row
 * runs its action and closes. Reach for Listbox/Select when the panel must
 * OWN the chosen value (`role=listbox`, `aria-selected`); reach for Menu
 * for row ⋮ actions, overflow menus, command lists, and context switchers
 * (`role=menu`). A switcher marks where you are with `current`
 * (`aria-current` + a trailing ✓) — a reflection of state that lives
 * elsewhere, not a value the menu keeps.
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
  minWidth,
  maxWidth,
  matchAnchorWidth = false,
  'aria-label': ariaLabel,
  className,
  panelClassName,
  panelStyle,
}: MenuProps) {
  // Content-width defaults apply only while the panel is NOT tied to the
  // anchor. Popover always forwards `maxWidth`, so keeping 280 alongside
  // `matchAnchorWidth` would clamp a wide trigger's panel to less than the
  // trigger itself; the symmetric trap is a 160 floor making the panel wider
  // than a narrow trigger. An explicit `maxWidth` still wins either way; an
  // explicit `minWidth` wins with `true` but is discarded by Popover under
  // `'min'`, which always uses the measured anchor width as the floor.
  const anchorTied = matchAnchorWidth !== false;
  const resolvedMinWidth = minWidth ?? (anchorTied ? undefined : 160);
  const resolvedMaxWidth = maxWidth ?? (anchorTied ? undefined : 280);

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

  // A switcher already says where you are — the `current` row carries the ✓ and
  // the heavier label. Lighting a SECOND row on open then competes with it, and
  // because hover and keyboard highlight share one `--active` class, that row is
  // indistinguishable from "your pointer is here". So a menu that has a
  // `current` row opens with NOTHING highlighted (`active = -1`).
  //
  // Scoped to `current` on purpose: a plain action menu has no other way to say
  // "start here", so it keeps lighting row one exactly as before — no existing
  // consumer changes behaviour, since none of them pass `current` yet.
  const hasCurrent = useMemo(
    () => items.some((entry) => !isSeparator(entry) && entry.current),
    [items],
  );

  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);
  // Set by the trigger's key handler just before it opens, read once by the open
  // effect. A ref, not state — it has to be readable in the same commit that
  // flips `open`, without a render of its own. A keyboard-opened menu always
  // takes a position, `current` row or not: otherwise ArrowDown-to-open would
  // need a SECOND ArrowDown just to enter the list.
  const openedByKeyboard = useRef(false);

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
    if (!open) {
      // Also clear on close, not only after a successful open. In CONTROLLED
      // mode a consumer's `onOpenChange` may decline to flip `open` (gating it
      // behind async state), and without this the flag would survive to
      // mis-attribute a later pointer-open as a keyboard one.
      openedByKeyboard.current = false;
      return;
    }
    setActive(openedByKeyboard.current || !hasCurrent ? 0 : -1);
    openedByKeyboard.current = false;
    const t = setTimeout(() => listRef.current?.focus(), 0);
    return () => clearTimeout(t);
    // `hasCurrent` is read here but deliberately left OUT of the deps: this is a
    // one-shot reset for the open transition. Re-running it because the item set
    // gained or lost a `current` row mid-interaction would yank the highlight
    // and re-steal focus.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see above
  }, [open]);

  // Keep the highlighted row scrolled into view after arrow nav.
  useEffect(() => {
    if (!open || active < 0) return;
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
        // From "nothing highlighted" the first press lands on the FIRST row,
        // not the second.
        setActive((i) => (i < 0 ? 0 : (i + 1) % n));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((i) => (i < 0 ? n - 1 : (i - 1 + n) % n));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setActive(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setActive(n - 1);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (active < 0) return;
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
        openedByKeyboard.current = true;
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
        minWidth={resolvedMinWidth}
        maxWidth={resolvedMaxWidth}
        matchAnchorWidth={matchAnchorWidth}
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
            const isActive = active >= 0 && focusableIndices[active] === i;
            return (
              <button
                key={entry.key}
                ref={(el) => {
                  if (el) itemRefs.current.set(entry.key, el);
                  else itemRefs.current.delete(entry.key);
                }}
                type="button"
                role="menuitem"
                aria-current={entry.current ? 'true' : undefined}
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
                  entry.current && 'uxm-menu__item--current',
                )}
              >
                {entry.icon && (
                  <Icon
                    glyph={entry.icon}
                    size={16}
                    className="uxm-menu__item-icon"
                    style={entry.iconColor ? { color: entry.iconColor } : undefined}
                  />
                )}
                {entry.subtitle != null ? (
                  // Two-line row: headline + subtitle stacked in a column so
                  // the label keeps its ellipsis and the trailing hint still
                  // right-aligns against the block.
                  <span className="uxm-menu__item-text">
                    <span className="uxm-menu__item-label">{entry.label}</span>
                    <span className="uxm-menu__item-subtitle">{entry.subtitle}</span>
                  </span>
                ) : (
                  <span className="uxm-menu__item-label">{entry.label}</span>
                )}
                {entry.hint != null && (
                  <span className="uxm-menu__item-hint">{entry.hint}</span>
                )}
                {entry.current && (
                  // Trailing ✓, after any hint. It needs NO `margin-left:
                  // auto` — the label / text column already carries `flex: 1`
                  // and eats the free space. Adding one would split that space
                  // with the hint's own auto margin and float the hint
                  // mid-row. `aria-current` on the row already carries the
                  // meaning, so the glyph stays out of the a11y tree.
                  <span className="uxm-menu__item-checkmark" aria-hidden="true">
                    <Icon glyph="check" size={14} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Popover>
    </div>
  );
}
