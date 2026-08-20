import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';

import { Menu, type MenuEntry } from './menu';

import type { CSSProperties } from 'react';

type Styles = PreviewProps['styles'];

/**
 * Project every registry knob onto its CSS custom property. Names follow
 * `--uxm-menu-{kebab(key)}` — matches what generate-css's kebab fallback
 * path produces, so no PER_COMPONENT_MAPPING entry is needed (only a
 * PER_COMPONENT_SELECTOR so the portaled panel carries the saved vars).
 *
 * These vars feed BOTH the inline static showcase (where they cascade
 * naturally) AND the live `<Menu>`'s portaled panel (injected via
 * `panelStyle` so live tuning reflects before any save).
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-menu-panel-bg': styles.panelBg as string,
    '--uxm-menu-panel-border': styles.panelBorder as string,
    '--uxm-menu-panel-radius': `${styles.panelRadius}px`,
    '--uxm-menu-panel-max-height': `${styles.panelMaxHeight}px`,

    // Shadow composed from Color / Blur / Offset Y (mirrors the Calendar
    // atom's decomposed shadow knobs).
    '--uxm-menu-shadow-color': styles.shadowColor as string,
    '--uxm-menu-shadow-blur': `${styles.shadowBlur}px`,
    '--uxm-menu-shadow-offset-y': `${styles.shadowOffsetY}px`,

    '--uxm-menu-item-padding-x': `${styles.itemPaddingX}px`,
    '--uxm-menu-item-padding-y': `${styles.itemPaddingY}px`,
    '--uxm-menu-item-font-size': `${styles.itemFontSize}px`,
    '--uxm-menu-item-radius': `${styles.itemRadius}px`,
    '--uxm-menu-item-color': styles.itemColor as string,
    '--uxm-menu-item-active-bg': styles.itemActiveBg as string,
    '--uxm-menu-item-active-color': styles.itemActiveColor as string,
    '--uxm-menu-item-disabled-opacity':
      styles.itemDisabledOpacity != null ? String(styles.itemDisabledOpacity) : undefined,
    '--uxm-menu-item-danger-color': styles.itemDangerColor as string,
    '--uxm-menu-item-danger-active-bg': styles.itemDangerActiveBg as string,
    '--uxm-menu-item-icon-color': styles.itemIconColor as string,

    // Current row (a switcher's active entry) — weight + checkmark only; the
    // colour deliberately comes from `itemColor` / the danger tone.
    '--uxm-menu-item-current-bg': styles.itemCurrentBg as string,
    '--uxm-menu-item-current-font-weight': styles.itemCurrentFontWeight as string,

    // Trailing hint (shortcut echo).
    '--uxm-menu-item-hint-font-size': `${styles.itemHintFontSize}px`,
    '--uxm-menu-item-hint-color': styles.itemHintColor as string,

    // Two-line (headline + subtitle) rows.
    '--uxm-menu-item-subtitle-font-size': `${styles.itemSubtitleFontSize}px`,
    '--uxm-menu-item-subtitle-color': styles.itemSubtitleColor as string,
    '--uxm-menu-item-subtitle-gap': `${styles.itemSubtitleGap}px`,

    '--uxm-menu-separator-color': styles.separatorColor as string,
  } as CSSProperties;
}

/**
 * Demo data for the LIVE instance — the atom's TWO shapes, kept apart and
 * chosen by the `shape` variant.
 *
 * They were once a single list: row actions with a `current` workspace row
 * wedged in. That row stuck out precisely because the list told two stories at
 * once. But collapsing to only the switcher hid the other shape entirely, so
 * neither "one mixed list" nor "one shape" is right — which shape you're
 * looking at is a choice, and a choice belongs to a variant picker.
 *
 * Both are legitimately `Menu`. The switcher especially: it CONTAINS a command
 * ("New workspace") below a separator, which `role="listbox"` has no legal way
 * to hold — that is half the argument for why a switcher is not a `Select`.
 *
 * Each shape keeps ONE disabled row, because that is the one thing with unique
 * live BEHAVIOUR: arrow-key navigation must skip it. Only the action shape
 * carries a `danger` row — nothing destructive belongs in a switcher, and
 * danger has no behaviour of its own beyond its paint, which the static row's
 * Row State picker already covers.
 *
 * Neither carries `iconColor`. The atom supports per-row tints, but a tinted
 * glyph here silently ignores the **Icon → Color** knob beside it — the panel
 * would read "Text Strong" while one row stayed pink, which looks like a broken
 * knob rather than a per-row override. It is row DATA, not theme; the README's
 * switcher example is where it belongs.
 */
type DemoRow = {
  key: string;
  label: string;
  subtitle: string;
  icon: string;
  hint?: string;
  disabled?: boolean;
  danger?: boolean;
  current?: boolean;
};
// Shape 1 — row actions: every row is a command, the destructive one last.
const ACTION_ROWS: DemoRow[] = [
  { key: 'edit', label: 'Edit', subtitle: 'Rename and change fields', icon: 'pencil', hint: '⌘E' },
  { key: 'duplicate', label: 'Duplicate', subtitle: 'Create a copy in this folder', icon: 'copy', hint: '⌘D' },
  { key: 'archive', label: 'Archive', subtitle: 'Move out of the active list', icon: 'archive-x', disabled: true },
];
const DANGER_ROW: DemoRow = {
  key: 'delete',
  label: 'Delete',
  subtitle: 'Remove permanently',
  icon: 'trash',
  hint: '⌫',
  danger: true,
};
// Shape 2 — a context switcher: sibling contexts, one of them current.
const WORKSPACE_ROWS: DemoRow[] = [
  { key: 'default', label: 'default', subtitle: 'Shared starting point', icon: 'product', hint: '⌘1' },
  { key: 'order-processing', label: 'order-processing', subtitle: 'Fulfilment and returns', icon: 'product', hint: '⌘2' },
  { key: 'pilot-2025', label: 'pilot-2025', subtitle: 'No access', icon: 'product', disabled: true },
  { key: 'support-triage', label: 'support-triage', subtitle: 'Current workspace', icon: 'product', hint: '⌘3', current: true },
];
// The command half of the switcher, below the separator — the row that makes it
// a Menu rather than a Select.
const COMMAND_ROW: DemoRow = {
  key: 'new',
  label: 'New workspace',
  subtitle: 'Start from an empty scope',
  icon: 'plus',
};

// ─────────────────────────────────────────────────────────────────────────────
//  Static showcase — ONE row inside panel chrome, state-driven by variant
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hand-rendered (not the real `<Menu>`) so we can FORCE a row state
 * regardless of pointer / keyboard, and so the panel renders inline (the live
 * atom's panel is `position: fixed` + portaled). Uses the exact DOM + classes
 * the atom emits, so production CSS — and any saved `.uxm-menu__panel` tuning
 * — exercises against it identically.
 *
 * ONE row, not a whole menu. Matches `Listbox`'s showcase: the row states are
 * exclusive, so a four-row mock could only ever paint the picked state on one
 * of them and left the other three as noise competing for attention. The
 * composition of a real menu — several rows, a separator between groups — is
 * what the live instance below is for.
 *
 * Everything is shown AT REST. No state is forced on top of another: painting
 * the highlight over the `current` pick made the showcase contradict its own
 * knobs (`itemCurrentBg` defaults to `transparent`) and read as "current has a
 * background". The knobs that only exist in combination — the danger tone's
 * Hover Background, the separator's colour — are exercised by hovering /
 * opening the live menu.
 *
 * `pointer-events: none` + `tabIndex={-1}` keep it inert, so hovering can't
 * paint `:hover` over the forced state the user picked.
 */
function StaticShowcase({
  state,
  withIcons,
  withSubtitles,
  withHints,
}: {
  state: string;
  withIcons: boolean;
  withSubtitles: boolean;
  withHints: boolean;
}) {
  const isDisabled = state === 'disabled';
  const isCurrent = state === 'current';

  return (
    <div
      className="uxm-menu__panel"
      style={{
        width: 260,
        // Override the live atom's `position: fixed` / `overflow: hidden` —
        // the showcase renders inline, not portaled, and without these the
        // panel collapses to zero size.
        position: 'static',
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <div className="uxm-menu__list" style={{ overflowY: 'visible' }}>
        <button
          type="button"
          tabIndex={-1}
          disabled={isDisabled || undefined}
          className={cn(
            'uxm-menu__item',
            // The atom's class is `--active` because it covers mouse hover AND
            // keyboard highlight (they paint identically); the workbench calls
            // it "Hover" because that's the designers' word. Keep in sync.
            state === 'hover' && 'uxm-menu__item--active',
            isDisabled && 'uxm-menu__item--disabled',
            state === 'danger' && 'uxm-menu__item--danger',
            isCurrent && 'uxm-menu__item--current',
          )}
        >
          {withIcons && <Icon glyph="user" size={16} className="uxm-menu__item-icon" />}
          {withSubtitles ? (
            <span className="uxm-menu__item-text">
              <span className="uxm-menu__item-label">Sample row — {state}</span>
              <span className="uxm-menu__item-subtitle">Supporting line beneath</span>
            </span>
          ) : (
            <span className="uxm-menu__item-label">Sample row — {state}</span>
          )}
          {withHints && <span className="uxm-menu__item-hint">⌘E</span>}
          {isCurrent && (
            <span className="uxm-menu__item-checkmark" aria-hidden="true">
              <Icon glyph="check" size={14} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Entry — static showcase + a live ⋮ menu (real atom)
// ─────────────────────────────────────────────────────────────────────────────

export function MenuPreview({ styles, variants }: PreviewProps & { componentId: string }) {
  const state = (variants.state as string) ?? 'default';
  const withIcons = (variants.withIcons ?? 'yes') === 'yes';
  const withSeparator = (variants.withSeparator ?? 'yes') === 'yes';
  const withSubtitles = (variants.withSubtitles ?? 'no') === 'yes';
  const withHints = (variants.withHints ?? 'no') === 'yes';
  const shape = ((variants.shape as string) ?? 'actions') as 'actions' | 'switcher';

  const cssVars = buildVars(styles);

  // Live items — the real atom. Exercises what the single-row showcase above
  // cannot: the portaled panel, arrow-key nav skipping the disabled row,
  // `aria-current` + the trailing ✓, the separator between rows, and the
  // `--current` × `--active` composition when you hover the current row.
  // `panelStyle={cssVars}` pushes live knob values onto the portaled panel.
  const toItem = (r: DemoRow) => ({
    key: r.key,
    label: r.label,
    icon: withIcons ? r.icon : undefined,
    subtitle: withSubtitles ? r.subtitle : undefined,
    hint: withHints ? r.hint : undefined,
    disabled: r.disabled,
    danger: r.danger,
    current: r.current,
  });
  const separator = withSeparator ? ([{ separator: true, key: 'sep' }] as MenuEntry[]) : [];
  const liveItems: MenuEntry[] =
    shape === 'switcher'
      ? [...WORKSPACE_ROWS.map(toItem), ...separator, toItem(COMMAND_ROW)]
      : [...ACTION_ROWS.map(toItem), ...separator, toItem(DANGER_ROW)];

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
        <StaticShowcase
          state={state}
          withIcons={withIcons}
          withSubtitles={withSubtitles}
          withHints={withHints}
        />
      </div>

      {/* The real atom, HELD OPEN. Requiring a click made the section useless
          for tuning: the panel is portaled and dismisses on outside click, so
          it closed again the moment the user touched a knob in the properties
          panel. `open` is pinned true and `onOpenChange` deliberately ignores
          close requests, which means Escape / outside-click are NOT exercised
          here — they belong to `Popover`'s own contract and its own entry.
          What this section does exercise is everything the hand-rendered
          showcase above cannot: the real portaled panel, `renderTrigger` +
          `triggerProps` wiring (`aria-expanded`, `aria-controls`), arrow-key
          navigation, `aria-current`, the separator between rows, and the
          `--current` × `--active` composition when you hover the current row.
          Rows stay clickable and never dismiss. */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Live {shape === 'switcher' ? 'switcher' : 'action menu'}</div>
        <Menu
          // Remount on a shape change. The panel is held open, so `open` never
          // flips and the atom's open-transition effect would not re-run —
          // the highlight would carry over from the previous shape, hiding the
          // very rule this section should show (a menu WITH a `current` row
          // opens with nothing highlighted; one without still lights row one).
          key={shape}
          items={liveItems}
          aria-label={shape === 'switcher' ? 'Switch workspace' : 'Row actions'}
          open
          onOpenChange={() => {}}
          // `bottom-start`, overriding the atom's `bottom-end` default. That
          // default is right for a real ⋮ at a row's trailing edge (the panel
          // grows leftwards, staying inside the container), but here the anchor
          // sits at the canvas's left edge and the panel is portaled
          // `position: fixed` — held open, it painted straight over the
          // studio's own sidebar. Preview framing only; the atom's default is
          // unchanged.
          placement="bottom-start"
          panelStyle={cssVars}
          renderTrigger={({ triggerProps }) => (
            // An invisible anchor, not a ⋮ button. With the panel held open the
            // trigger has nothing left to do for the user — a kebab that opens
            // nothing is dead UI — but `Popover` measures against it, so it has
            // to stay in the DOM. Zero height, full width so the panel lands at
            // the section's left edge.
            //
            // Only `ref` is taken from `triggerProps`, not the whole spread:
            // the click / key handlers are inert here (nothing to toggle) and
            // `aria-haspopup` / `aria-expanded` / `aria-controls` would describe
            // a control this element no longer is. Better to not claim them
            // than to spread them and paper over it with `aria-hidden`.
            <span
              ref={triggerProps.ref}
              aria-hidden="true"
              style={{ display: 'block', width: '100%', height: 0 }}
            />
          )}
        />
      </div>

    </div>
  );
}
