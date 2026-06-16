'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

import { cn } from '../../helpers/cn';
import { Icon } from '../icon';
import { Popover, type PopoverPlacement } from '../popover';

// ─────────────────────────────────────────────────────────────────────────────
//  Public constants
// ─────────────────────────────────────────────────────────────────────────────

/** Item count above which `searchable="auto"` enables the search box. */
export const SEARCHABLE_AUTO_THRESHOLD = 6;

// ─────────────────────────────────────────────────────────────────────────────
//  Public types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Props the consumer must spread on their trigger element. The `ref` is a
 * callback ref so a single `{...triggerProps}` spread wires up everything
 * (positioning anchor, toggle, ARIA state).
 *
 * Consumers should NOT add their own onClick / aria-expanded /
 * aria-haspopup — they would override the listbox's wiring.
 */
export interface ListboxTriggerProps {
  ref: (el: HTMLElement | null) => void;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  'aria-haspopup': 'listbox';
  'aria-expanded': boolean;
  'aria-controls'?: string;
  disabled?: boolean;
}

export interface ListboxRenderTriggerState<T> {
  open: boolean;
  selected: T | null;
  triggerProps: ListboxTriggerProps;
}

export interface ListboxRenderItemState {
  /** Keyboard-highlighted (arrow keys). */
  active: boolean;
  /** Currently selected value. */
  selected: boolean;
}

interface ListboxCommonProps<T> {
  items: T[];
  /** Unique stable key per item — used for React keys + active tracking. */
  getKey: (item: T) => string;
  /** Plain text label per item — used for default substring filter, type-ahead, a11y. */
  getLabel: (item: T) => string;

  /** Render the consumer's trigger. Spread `triggerProps` on your button/field. */
  renderTrigger: (state: ListboxRenderTriggerState<T>) => ReactNode;
  /** Render each item's row body. Active / selected come from internal state. */
  renderItem: (item: T, state: ListboxRenderItemState) => ReactNode;

  /** Render a search input above the list. `true`/`false` force it; `"auto"` shows it only when the item count exceeds `SEARCHABLE_AUTO_THRESHOLD`. Default true. */
  searchable?: boolean | 'auto';
  searchPlaceholder?: string;
  /** Override default case-insensitive substring filter on `getLabel`. */
  filterItems?: (items: T[], query: string) => T[];

  /** Render section headers when items group; the function returns a group key per item. */
  groupBy?: (item: T) => string;
  /** Override the default group header rendering. */
  renderGroupHeader?: (group: string) => ReactNode;

  /** Shown in place of the list when the filter returns nothing. */
  emptyState?: ReactNode;

  /** Optional footer slot below the list (e.g. ColorPicker's "Custom hex" panel). Pass a function to receive `{ close }`. */
  footer?: ReactNode | ((api: { close: () => void }) => ReactNode);

  /** Disable an individual item — it won't be selectable or arrow-navigable. */
  isItemDisabled?: (item: T) => boolean;

  // Layout — forwarded to Popover.
  placement?: PopoverPlacement;
  /**
   * Match panel width to the positioning anchor (the trigger by
   * default, or `anchorRef` if provided). Default true.
   */
  matchAnchorWidth?: boolean;
  /** Min panel width when not matching anchor. */
  minPanelWidth?: number;
  /** Maximum panel width in px. */
  maxPanelWidth?: number;
  /** Render panel into a portal. Default true. */
  portal?: boolean;
  /**
   * Optional override for what the popover anchors against (positioning
   * + width matching). By default the trigger element from
   * `renderTrigger`'s `triggerProps.ref` is the anchor — that's what
   * users click, and that's what the panel sits below. Pass `anchorRef`
   * when the panel should size / position against a DIFFERENT element
   * than the click target — e.g. PhoneInput's country picker, where
   * the trigger is just the small country button but the panel should
   * span the full field width (anchor = field wrapper).
   */
  anchorRef?: React.RefObject<HTMLElement | null>;
  /**
   * Render the right-edge ✓ on the selected row. Default true. Set to
   * `false` for single-select pickers whose rows already have trailing
   * meta content (dial codes in PhoneInput, currency codes in
   * CurrencyInput) — the trailing visual + the selected row's bg/text
   * styling are enough; the extra ✓ creates visual noise + competes
   * with the meta for the right edge. Multi-select MultiListbox's
   * left-edge checkbox is unaffected.
   */
  showCheckmark?: boolean;

  /** Class applied to the panel root. */
  panelClassName?: string;
  panelStyle?: CSSProperties;
  /** Wrapper element class — only meaningful if you visually wrap the trigger. */
  className?: string;
  style?: CSSProperties;

  /** Block all interaction. */
  disabled?: boolean;

  /** Notified whenever the panel opens/closes. */
  onOpenChange?: (open: boolean) => void;

  'aria-label'?: string;
}

export interface ListboxProps<T> extends ListboxCommonProps<T> {
  /** Currently selected value. `null` = nothing selected. */
  value: T | null;
  /**
   * Selection callback. Called with the picked item, OR with `null`
   * when the consumer clears the selection (e.g. a ✕ button inside
   * their `renderTrigger`). The atom itself never invokes this with
   * `null` — picking an already-selected row in single-select mode
   * is a no-op visually. Clear behavior is consumer-driven so each
   * trigger can decide whether / how to expose a clear affordance.
   */
  onChange: (item: T | null) => void;
  /** Close the panel after a selection. Default true. */
  closeOnSelect?: boolean;
}

export interface MultiListboxProps<T> extends ListboxCommonProps<T> {
  value: T[];
  onChange: (items: T[]) => void;
  /** Hide items already in `value` from the panel list. Default false. */
  excludeSelected?: boolean;
  /** Close the panel after each selection. Default false. */
  closeOnSelect?: boolean;
  /**
   * Render a checkbox indicator at the leading edge of each row.
   * Default true (the standard multi-select pattern). Set to `false`
   * when the consumer ALREADY shows selection state outside the panel
   * (e.g. PillSelect's chips below the trigger) — the checkbox would
   * be redundant signal. Pair with `excludeSelected={true}` for the
   * classic "items disappear when picked, return to dropdown when
   * removed from chips" UX.
   */
  showCheckbox?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Internal: shared core
// ─────────────────────────────────────────────────────────────────────────────

interface ListboxCoreProps<T> extends ListboxCommonProps<T> {
  /** Set of selected keys. Single-mode passes a 0/1-sized set. */
  selectedKeys: Set<string>;
  /** Selected item passed back to `renderTrigger`. Single-mode = the one selected item; multi-mode = null (consumer reads its own value). */
  triggerSelected: T | null;
  /** Called when an item is chosen via click / Enter. */
  onSelect: (item: T) => void;
  /** Whether to close after select. */
  closeOnSelect: boolean;
  /**
   * Internal — which indicator pattern the row renders. Set by the
   * wrapper component:
   *   - `Listbox` → 'checkmark' (right-edge ✓ on selected)
   *   - `MultiListbox` with `showCheckbox=true` (default) → 'checkbox'
   *   - `MultiListbox` with `showCheckbox=false` → 'none' (used by
   *     PillSelect, where chips already represent the selection state
   *     and a checkbox in the dropdown would be redundant signal)
   * Not part of the public API; designers don't pick indicator styles.
   */
  indicator: 'checkmark' | 'checkbox' | 'none';
}

function ListboxCore<T>({
  items,
  getKey,
  getLabel,
  renderTrigger,
  renderItem,
  searchable = true,
  searchPlaceholder = 'Search…',
  filterItems,
  groupBy,
  renderGroupHeader,
  emptyState,
  footer,
  isItemDisabled,
  indicator,
  placement = 'bottom-start',
  matchAnchorWidth = true,
  minPanelWidth,
  maxPanelWidth,
  portal = true,
  anchorRef,
  showCheckmark = true,
  panelClassName,
  panelStyle,
  className,
  style,
  disabled = false,
  onOpenChange,
  'aria-label': ariaLabel,

  selectedKeys,
  triggerSelected,
  onSelect,
  closeOnSelect,
}: ListboxCoreProps<T>) {
  const [open, setOpenState] = useState(false);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(0);

  const showSearch = searchable === 'auto' ? items.length > SEARCHABLE_AUTO_THRESHOLD : searchable;

  const triggerRef = useRef<HTMLElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef(new Map<string, HTMLButtonElement>());

  const panelId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (next === open) return;
      setOpenState(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange],
  );

  // Default filter — case-insensitive substring on `getLabel`.
  const filtered = useMemo(() => {
    if (!search) return items;
    if (filterItems) return filterItems(items, search);
    const q = search.toLowerCase();
    return items.filter((it) => getLabel(it).toLowerCase().includes(q));
  }, [items, search, filterItems, getLabel]);

  // Build the render plan — group headers interleaved between items.
  // We also keep a parallel `selectableIndices` list so arrow nav skips
  // headers and disabled items cleanly.
  const { rows, selectableIndices } = useMemo(() => {
    type Row =
      | { kind: 'header'; group: string; key: string }
      | { kind: 'item'; item: T; key: string; disabled: boolean };
    const out: Row[] = [];
    const idx: number[] = [];
    if (groupBy) {
      // Stable group order — first appearance wins.
      const seen = new Set<string>();
      const order: string[] = [];
      for (const it of filtered) {
        const g = groupBy(it);
        if (!seen.has(g)) {
          seen.add(g);
          order.push(g);
        }
      }
      for (const g of order) {
        out.push({ kind: 'header', group: g, key: `__h_${g}` });
        for (const it of filtered) {
          if (groupBy(it) !== g) continue;
          const disabled = isItemDisabled?.(it) ?? false;
          out.push({ kind: 'item', item: it, key: getKey(it), disabled });
          if (!disabled) idx.push(out.length - 1);
        }
      }
    } else {
      for (const it of filtered) {
        const disabled = isItemDisabled?.(it) ?? false;
        out.push({ kind: 'item', item: it, key: getKey(it), disabled });
        if (!disabled) idx.push(out.length - 1);
      }
    }
    return { rows: out, selectableIndices: idx };
  }, [filtered, groupBy, getKey, isItemDisabled]);

  // Clamp active when the selectable set shrinks under us (typing in
  // the filter, items prop changes). Cascade is bounded — one extra
  // render then settled. No derivable-from-props alternative.
  useEffect(() => {
    if (selectableIndices.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clamp on shrinkage
      setActive(0);
      return;
    }
    if (active >= selectableIndices.length) {
      setActive(selectableIndices.length - 1);
    }
  }, [selectableIndices.length, active]);

  // Reset search + active on open. Default active to the currently
  // selected item if any, so Enter on first keystroke re-selects it.
  // One-shot reset on open transition; no derivable-from-props alternative.
  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot reset on open
    setSearch('');
    if (selectedKeys.size === 1) {
      const sel = [...selectedKeys][0];
      const flatIndex = selectableIndices.findIndex(
        (i) => rows[i].kind === 'item' && (rows[i] as { key: string }).key === sel,
      );
      setActive(flatIndex >= 0 ? flatIndex : 0);
    } else {
      setActive(0);
    }
    // Only on open — selectableIndices / rows recompute as search runs,
    // and we don't want to reset active on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Scroll the active option into view after arrow nav. `block: 'nearest'`
  // avoids jumping the page when the list is already fully visible.
  useEffect(() => {
    if (!open) return;
    const rowIdx = selectableIndices[active];
    if (rowIdx == null) return;
    const row = rows[rowIdx];
    if (!row || row.kind !== 'item') return;
    const el = optionRefs.current.get(row.key);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active, open, rows, selectableIndices]);

  const commitSelection = useCallback(
    (item: T) => {
      onSelect(item);
      if (closeOnSelect) setOpen(false);
    },
    [onSelect, closeOnSelect, setOpen],
  );

  // Keyboard nav — fired from both the search input (when searchable)
  // and the panel itself (when not searchable). Handlers are identical;
  // we just attach in the right place.
  const onPanelKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (selectableIndices.length === 0) return;
        setActive((i) => (i + 1) % selectableIndices.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (selectableIndices.length === 0) return;
        setActive((i) => (i - 1 + selectableIndices.length) % selectableIndices.length);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setActive(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        if (selectableIndices.length > 0) setActive(selectableIndices.length - 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const rowIdx = selectableIndices[active];
        const row = rowIdx != null ? rows[rowIdx] : undefined;
        if (row && row.kind === 'item') commitSelection(row.item);
      }
      // Escape is handled globally by Popover.
    },
    [active, rows, selectableIndices, commitSelection],
  );

  // Trigger keyboard — Enter/Space toggles, ArrowDown opens + jumps to
  // first item. This matches WAI-ARIA combobox patterns.
  const onTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(!open);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      }
    },
    [disabled, open, setOpen],
  );

  // Memoised so the trigger callback ref + handlers don't re-create
  // every render — without this, consumers spreading {...triggerProps}
  // re-bind handlers on every render AND the ref callback fires extra
  // times, churning DOM ref state. Also pacifies the react-hooks/refs
  // rule which flags inline ref-writing callbacks as "ref access during
  // render".
  const triggerProps: ListboxTriggerProps = useMemo(
    () => ({
      ref: (el: HTMLElement | null) => {
        triggerRef.current = el;
      },
      onClick: () => {
        if (disabled) return;
        setOpen(!open);
      },
      onKeyDown: onTriggerKeyDown,
      'aria-haspopup': 'listbox',
      'aria-expanded': open,
      'aria-controls': open ? panelId : undefined,
      disabled: disabled || undefined,
    }),
    [disabled, open, setOpen, onTriggerKeyDown, panelId],
  );

  return (
    <div className={cn('uxm-listbox', className)} style={style}>
      {/* eslint-disable-next-line react-hooks/refs -- triggerProps is memoised above and contains a ref-setter callback; the rule flags the pattern but the callback is the React-blessed way to wire a ref through a consumer-rendered element */}
      {renderTrigger({ open, selected: triggerSelected, triggerProps })}
      <Popover
        open={open}
        onOpenChange={setOpen}
        // External anchor (PhoneInput's field wrapper, etc.) takes
        // precedence — that controls positioning + width matching.
        // Trigger ref stays the interactive surface (click target).
        anchor={(anchorRef ?? triggerRef) as React.RefObject<HTMLElement | null>}
        placement={placement}
        matchAnchorWidth={matchAnchorWidth}
        minWidth={minPanelWidth}
        maxWidth={maxPanelWidth}
        portal={portal}
        initialFocus={showSearch ? (searchRef as React.RefObject<HTMLElement | null>) : (listRef as React.RefObject<HTMLElement | null>)}
        role="listbox"
        aria-label={ariaLabel}
        id={panelId}
        className={cn('uxm-listbox__panel', panelClassName)}
        style={panelStyle}
      >
        {showSearch && (
          <div className="uxm-listbox__search">
            <Icon
              glyph="search"
              size={14}
              className="uxm-listbox__search-icon"
            />
            <input
              ref={searchRef}
              type="text"
              className="uxm-listbox__search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={onPanelKeyDown}
              placeholder={searchPlaceholder}
              autoComplete="off"
              spellCheck={false}
              aria-controls={panelId}
              aria-autocomplete="list"
            />
          </div>
        )}
        <div
          ref={listRef}
          className="uxm-listbox__list"
          // When not searchable, the panel itself is focusable so keyboard
          // nav works without a search input.
          tabIndex={showSearch ? undefined : -1}
          onKeyDown={showSearch ? undefined : onPanelKeyDown}
        >
          {selectableIndices.length === 0 ? (
            <div className="uxm-listbox__empty">
              {emptyState ?? 'No matches'}
            </div>
          ) : (
            rows.map((row, rowIdx) => {
              if (row.kind === 'header') {
                return (
                  <div key={row.key} className="uxm-listbox__group-header" role="presentation">
                    {renderGroupHeader ? renderGroupHeader(row.group) : row.group}
                  </div>
                );
              }
              const isActive = selectableIndices[active] === rowIdx;
              const isSelected = selectedKeys.has(row.key);
              return (
                <button
                  key={row.key}
                  ref={(el) => {
                    if (el) optionRefs.current.set(row.key, el);
                    else optionRefs.current.delete(row.key);
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={row.disabled || undefined}
                  disabled={row.disabled || undefined}
                  // mouseDown (not click) — keeps focus on the search input
                  // so consecutive selections via filter remain ergonomic.
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (row.disabled) return;
                    commitSelection(row.item);
                  }}
                  onMouseEnter={() => {
                    if (row.disabled) return;
                    const flatIdx = selectableIndices.indexOf(rowIdx);
                    if (flatIdx >= 0) setActive(flatIdx);
                  }}
                  className={cn(
                    'uxm-listbox__option',
                    isActive && 'uxm-listbox__option--active',
                    isSelected && 'uxm-listbox__option--selected',
                    row.disabled && 'uxm-listbox__option--disabled',
                  )}
                >
                  {indicator === 'checkbox' && (
                    // Multi-select pattern — left-aligned checkbox slot
                    // on every row, filled when selected. Visual-only
                    // (no real <input>) so nesting inside the row
                    // <button> stays valid HTML; the row button owns
                    // clicks + keys. `aria-hidden` because aria-selected
                    // on the parent already conveys state to AT.
                    //
                    // The `uxm-checkbox` class on the wrapper is what
                    // makes the saved `.uxm-checkbox { --uxm-checkbox-*: … }`
                    // rule from the Checkbox atom's workbench tuning
                    // reach down into our marker — CSS custom properties
                    // only cascade from where they're declared. Without
                    // this class, tuning Checkbox colours has no effect
                    // here. Base `.uxm-checkbox` styles (display, gap,
                    // cursor) are harmless overlap with the indicator's
                    // own inline-flex layout.
                    <span className="uxm-listbox__option-indicator uxm-checkbox" aria-hidden="true">
                      <span
                        className={cn(
                          'uxm-listbox__option-checkbox',
                          isSelected && 'uxm-listbox__option-checkbox--checked',
                        )}
                      >
                        {isSelected && <Icon glyph="check" size={10} />}
                      </span>
                    </span>
                  )}
                  {renderItem(row.item, { active: isActive, selected: isSelected })}
                  {indicator === 'checkmark' && isSelected && showCheckmark && (
                    // Single-select pattern — right-aligned ✓ on the
                    // selected row only. Reserving the slot on unselected
                    // rows would create a constant leading/trailing
                    // indent that reads as multi-select; right-edge +
                    // only-when-selected keeps unselected rows clean,
                    // and the row's other content stays put because
                    // `margin-left: auto` reflows from the trailing edge.
                    <span className="uxm-listbox__option-checkmark" aria-hidden="true">
                      <Icon glyph="check" size={14} />
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
        {footer && <div className="uxm-listbox__footer">{typeof footer === 'function' ? footer({ close: () => setOpen(false) }) : footer}</div>}
      </Popover>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Single-select Listbox
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Single-select dropdown. Owns ALL dropdown behavior — popover, search,
 * keyboard nav, ARIA — and is generic over `T`. Consumers only supply
 * data + a renderItem; the dropdown has no domain knowledge of what's
 * inside (countries, icons, colors, currencies — all just `T`).
 *
 * For multi-select, use `MultiListbox`.
 *
 * Themable through `--uxm-listbox-*` custom properties (panel chrome,
 * option states, search input). The trigger's visual is owned by the
 * consumer's `renderTrigger` callback — the atom only wires behavior.
 */
export function Listbox<T>({
  value,
  onChange,
  getKey,
  closeOnSelect = true,
  ...rest
}: ListboxProps<T>) {
  const selectedKeys = useMemo(
    () => (value ? new Set([getKey(value)]) : new Set<string>()),
    [value, getKey],
  );
  return (
    <ListboxCore<T>
      {...rest}
      getKey={getKey}
      selectedKeys={selectedKeys}
      triggerSelected={value}
      onSelect={onChange}
      closeOnSelect={closeOnSelect}
      indicator="checkmark"
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Multi-select MultiListbox
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Multi-select dropdown. Same behavior contract as `Listbox`, but accepts
 * an array `value` and toggles items in/out.
 *
 * Defaults are tuned for a standard checklist UX: every row shows a
 * checkbox indicator (`selectionIndicator="checkbox"`), already-selected
 * items remain visible (`excludeSelected=false`), and the panel stays
 * open across picks (`closeOnSelect=false`).
 *
 * For a "selected items disappear" pattern (PillSelect-style, where
 * selections render as chips in the trigger), pass
 * `selectionIndicator="none"` + `excludeSelected={true}`.
 */
export function MultiListbox<T>({
  value,
  onChange,
  items,
  getKey,
  excludeSelected = false,
  closeOnSelect = false,
  showCheckbox = true,
  ...rest
}: MultiListboxProps<T>) {
  const selectedKeys = useMemo(
    () => new Set(value.map(getKey)),
    [value, getKey],
  );

  // If `excludeSelected`, drop already-picked items from what the panel
  // shows. Filtering happens BEFORE search runs (search filters the
  // remainder). This matches the legacy PillSelect behavior.
  const visibleItems = useMemo(
    () => (excludeSelected ? items.filter((it) => !selectedKeys.has(getKey(it))) : items),
    [items, excludeSelected, selectedKeys, getKey],
  );

  const handleSelect = useCallback(
    (item: T) => {
      const k = getKey(item);
      if (selectedKeys.has(k)) {
        onChange(value.filter((v) => getKey(v) !== k));
      } else {
        onChange([...value, item]);
      }
    },
    [value, onChange, getKey, selectedKeys],
  );

  return (
    <ListboxCore<T>
      {...rest}
      items={visibleItems}
      getKey={getKey}
      selectedKeys={selectedKeys}
      // MultiListbox triggers usually render their own selection (chips),
      // so we don't pass a single "selected" — consumer owns the trigger
      // visual entirely.
      triggerSelected={null}
      onSelect={handleSelect}
      closeOnSelect={closeOnSelect}
      indicator={showCheckbox ? 'checkbox' : 'none'}
    />
  );
}
