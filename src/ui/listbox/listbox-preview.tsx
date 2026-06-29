'use client';

import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { ICONS, Icon } from '@/ui';

type Styles = PreviewProps['styles'];

/**
 * Project every registry knob onto its CSS custom property. Names follow
 * `--uxm-listbox-{kebab(key)}` — matches what save/route.ts's kebab
 * fallback path produces, so no PER_COMPONENT_MAPPING entry is needed.
 *
 * The same vars feed BOTH the static showcase (top) and the open-panel
 * demo (bottom). Both are rendered inline (no portal) so the vars on
 * the wrapper cascade naturally — no `panelStyle` injection needed.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-listbox-panel-bg': styles.panelBg as string,
    '--uxm-listbox-panel-border': styles.panelBorder as string,
    '--uxm-listbox-panel-radius': `${styles.panelRadius}px`,
    '--uxm-listbox-shadow-color': styles.shadowColor as string,
    '--uxm-listbox-shadow-blur': `${styles.shadowBlur}px`,
    '--uxm-listbox-shadow-offset-y': `${styles.shadowOffsetY}px`,
    '--uxm-listbox-panel-max-height': `${styles.panelMaxHeight}px`,

    '--uxm-listbox-search-border': styles.searchBorder as string,
    '--uxm-listbox-search-icon-color': styles.searchIconColor as string,
    '--uxm-listbox-search-color': styles.searchColor as string,
    '--uxm-listbox-search-placeholder-color': styles.searchPlaceholderColor as string,
    '--uxm-listbox-search-font-size': `${styles.searchFontSize}px`,

    '--uxm-listbox-option-padding-x': `${styles.optionPaddingX}px`,
    '--uxm-listbox-option-padding-y': `${styles.optionPaddingY}px`,
    '--uxm-listbox-option-font-size': `${styles.optionFontSize}px`,
    '--uxm-listbox-option-radius': `${styles.optionRadius}px`,
    '--uxm-listbox-option-default-bg': styles.optionDefaultBg as string,
    '--uxm-listbox-option-color': styles.optionColor as string,
    '--uxm-listbox-option-active-bg': styles.optionActiveBg as string,
    '--uxm-listbox-option-active-color': styles.optionActiveColor as string,
    '--uxm-listbox-option-selected-bg': styles.optionSelectedBg as string,
    '--uxm-listbox-option-selected-color': styles.optionSelectedColor as string,
    '--uxm-listbox-option-disabled-opacity':
      styles.optionDisabledOpacity != null ? String(styles.optionDisabledOpacity) : undefined,

    '--uxm-listbox-group-header-font-size': `${styles.groupHeaderFontSize}px`,
    '--uxm-listbox-group-header-color': styles.groupHeaderColor as string,

    '--uxm-listbox-empty-color': styles.emptyColor as string,
    '--uxm-listbox-footer-border': styles.footerBorder as string,
  } as CSSProperties;
}

/**
 * Render the leading checkbox slot (multi-select mode) — same DOM the
 * live atom emits. Slot is reserved on every row; the marker toggles
 * `--checked` based on the row's selected state.
 */
function renderCheckboxIndicator(isSelected: boolean) {
  // `uxm-checkbox` on the wrapper is intentional — it lets the saved
  // `.uxm-checkbox { --uxm-checkbox-*: … }` rule cascade into the
  // marker. Without it, tuning Checkbox colours in the workbench
  // wouldn't reach this preview. Mirrors the atom's DOM.
  return (
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
  );
}

/**
 * Render the trailing ✓ (single-select mode) — only on selected rows.
 * `margin-left: auto` in CSS pushes it to the row's right edge.
 */
function renderCheckmarkIndicator(isSelected: boolean) {
  if (!isSelected) return null;
  return (
    <span className="uxm-listbox__option-checkmark" aria-hidden="true">
      <Icon glyph="check" size={14} />
    </span>
  );
}

// Demo items — icon-glyph picker shape. Twelve total, split into two
// groups so the `withGroups` variant has something to demonstrate.
type Item = { id: string; label: string; iconGlyph: string; group: string };
const DEMO_ITEMS: Item[] = ICONS.slice(0, 12).map((g, i) => ({
  id: g.id,
  label: g.label,
  iconGlyph: g.id,
  group: i < 6 ? 'Common' : 'Other',
}));

// ─────────────────────────────────────────────────────────────────────────────
//  Static showcase — ONE row inside panel chrome, state-driven by variant
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hand-rendered (not the real `<Listbox>`) because we need to FORCE a
 * specific row state regardless of pointer / keyboard. The open-panel
 * demo below also uses the real atom's DOM so production CSS still
 * exercises against it.
 *
 * `pointer-events: none` + `tabIndex={-1}` keep the showcase inert —
 * without that, hovering it would paint the `:hover`-style active bg
 * even when the user picked "default" in the variant, defeating the
 * forced-state mock.
 */
function StaticShowcase({
  state,
  mode,
}: {
  state: string;
  mode: 'single' | 'multi';
}) {
  const isSelected = state === 'selected';
  const isDisabled = state === 'disabled';
  // The atom's CSS class is named `--active` because it covers both
  // mouse hover and keyboard highlight (they paint identically). The
  // workbench variant label is "Hover" because that's the term
  // designers use — keep them in sync here.
  const className = cn(
    'uxm-listbox__option',
    state === 'hover' && 'uxm-listbox__option--active',
    isSelected && 'uxm-listbox__option--selected',
    isDisabled && 'uxm-listbox__option--disabled',
  );

  return (
    <div
      className="uxm-listbox__panel"
      style={{
        width: 280,
        // Override the live atom's `position: fixed` / `overflow: hidden`
        // since the showcase is rendered inline, not portaled. Without
        // these the panel collapses to zero size.
        position: 'static',
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <div className="uxm-listbox__list" style={{ overflowY: 'visible' }}>
        <button
          type="button"
          className={className}
          tabIndex={-1}
          disabled={isDisabled || undefined}
        >
          {/* Multi-select: left checkbox on every row. Single-select:
              right ✓ on selected only (rendered after content via
              renderCheckmarkIndicator). */}
          {mode === 'multi' && renderCheckboxIndicator(isSelected)}
          <Icon glyph="user" size={14} />
          <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Sample row — {state}
          </span>
          <span style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>meta</span>
          {mode === 'single' && renderCheckmarkIndicator(isSelected)}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Open panel — full panel rendered inline, always-open, no trigger
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The Listbox atom is fundamentally about the PANEL — triggers are
 * consumer-rendered. This section drops the (previously confusing)
 * "trigger + click to open" UX from the preview and renders the panel
 * directly so it's clear what's being tuned.
 *
 * Hand-rendered with the SAME DOM + classes the live `<Listbox>` emits
 * (`.uxm-listbox__panel`, `__search`, `__list`, `__option`, `__option--active`,
 * `__option--selected`, `__option-indicator`, `__option-checkmark`,
 * `__group-header`, `__footer`, `__empty`) so production CSS — and any
 * workbench tuning saved against `.uxm-listbox__panel` — applies the
 * same way it would in real consumers like PhoneInput and CurrencyInput.
 *
 * Interactivity is preview-only: typing in the search field filters
 * the list, clicking rows selects (single) or toggles (multi). No
 * keyboard nav / focus management — that's the atom's concern, and
 * users tuning visuals just need to see hover / selected / disabled
 * states paint correctly.
 */
function OpenPanel({
  withSearch,
  withGroups,
  withFooter,
  mode,
  showCheckbox,
}: {
  withSearch: boolean;
  withGroups: boolean;
  withFooter: boolean;
  mode: 'single' | 'multi';
  showCheckbox: boolean;
}) {
  const [search, setSearch] = useState('');
  const [singleValue, setSingleValue] = useState<Item | null>(null);
  const [multiValue, setMultiValue] = useState<Item[]>([]);

  const isSelected = (item: Item) =>
    mode === 'multi'
      ? multiValue.some((v) => v.id === item.id)
      : singleValue?.id === item.id;

  const filtered = search
    ? DEMO_ITEMS.filter((it) => it.label.toLowerCase().includes(search.toLowerCase()))
    : DEMO_ITEMS;

  const select = (item: Item) => {
    if (mode === 'multi') {
      const has = multiValue.some((v) => v.id === item.id);
      setMultiValue(has ? multiValue.filter((v) => v.id !== item.id) : [...multiValue, item]);
    } else {
      setSingleValue(singleValue?.id === item.id ? null : item);
    }
  };

  // Group the filtered list by `group` when the variant is on. Stable
  // group order — first appearance wins — matches the real atom's
  // grouping behavior.
  const grouped: Array<{ group: string; items: Item[] }> = withGroups
    ? (() => {
        const order: string[] = [];
        const map = new Map<string, Item[]>();
        for (const it of filtered) {
          if (!map.has(it.group)) {
            map.set(it.group, []);
            order.push(it.group);
          }
          map.get(it.group)!.push(it);
        }
        return order.map((g) => ({ group: g, items: map.get(g)! }));
      })()
    : [{ group: '', items: filtered }];

  const renderRow = (it: Item) => {
    const selected = isSelected(it);
    return (
      <button
        key={it.id}
        type="button"
        className={cn(
          'uxm-listbox__option',
          selected && 'uxm-listbox__option--selected',
        )}
        onClick={() => select(it)}
      >
        {mode === 'multi' && showCheckbox && renderCheckboxIndicator(selected)}
        <Icon glyph={it.iconGlyph} size={14} />
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {it.label}
        </span>
        {mode === 'single' && renderCheckmarkIndicator(selected)}
      </button>
    );
  };

  return (
    <div
      className="uxm-listbox__panel"
      style={{
        // Same `position: static` / `overflow: visible` override the
        // static showcase uses — the panel CSS is `position: fixed` for
        // the real portaled case; here we're inline so we need to
        // neutralize that.
        width: 280,
        position: 'static',
      }}
    >
      {withSearch && (
        <div className="uxm-listbox__search">
          <Icon
            glyph="search"
            size={14}
            className="uxm-listbox__search-icon"
          />
          <input
            type="text"
            className="uxm-listbox__search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      )}
      <div className="uxm-listbox__list">
        {filtered.length === 0 ? (
          <div className="uxm-listbox__empty">No matches</div>
        ) : (
          grouped.map((g) => (
            <div key={g.group || '_all'}>
              {withGroups && g.group && (
                <div className="uxm-listbox__group-header" role="presentation">
                  {g.group}
                </div>
              )}
              {g.items.map(renderRow)}
            </div>
          ))
        )}
      </div>
      {withFooter && (
        <div className="uxm-listbox__footer">
          <span style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>
            Footer slot — e.g. custom hex input
          </span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Entry — static showcase stacked above the always-open panel
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Two-section preview:
 *
 *   1. **Static showcase** (top) — one row rendered inert, with the
 *      `state` variant flipping the modifier classes. Lets the user
 *      see exactly what each state looks like, knob-by-knob, without
 *      having to hover / click anything in the panel below.
 *
 *   2. **Open panel** (bottom) — the panel rendered inline, always
 *      open. No trigger — Listbox is about the PANEL, and triggers
 *      are consumer-rendered (PhoneInput's country button,
 *      CurrencyInput's currency button, etc.). The preview avoids the
 *      "looks like a complete combobox" misread that the earlier
 *      trigger-and-open-on-click design produced.
 *
 *      Search + click-to-select are wired for visual feedback so all
 *      panel knob tuning is testable in place.
 */
export function ListboxPreview({ styles, variants }: PreviewProps & { componentId: string }) {
  const state = (variants.state as string) ?? 'default';
  const withSearch = (variants.withSearch ?? 'yes') === 'yes';
  const withGroups = (variants.withGroups ?? 'no') === 'yes';
  const withFooter = (variants.withFooter ?? 'no') === 'yes';
  const mode = ((variants.mode as string) ?? 'single') as 'single' | 'multi';
  // Multi-only design variant — checkbox indicator on/off. The
  // `excludeSelected` toggle (hide picked items) was intentionally
  // dropped from the workbench: it's a consumer-level decision (used
  // internally by PillSelect), not a panel-design choice.
  const showCheckbox = (variants.showCheckbox ?? 'on') === 'on';

  const cssVars = buildVars(styles);

  const sectionLabel: CSSProperties = {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, ...cssVars } as CSSProperties}>
      <div>
        <div style={sectionLabel}>{state} state</div>
        <StaticShowcase state={state} mode={mode} />
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Open panel</div>
        <OpenPanel
          withSearch={withSearch}
          withGroups={withGroups}
          withFooter={withFooter}
          mode={mode}
          showCheckbox={showCheckbox}
        />
      </div>
    </div>
  );
}
