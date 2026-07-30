import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Icon, IconButton } from '@/ui';

import { Menu, type MenuEntry } from './menu';

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

    // Two-line (headline + subtitle) rows.
    '--uxm-menu-item-subtitle-font-size': `${styles.itemSubtitleFontSize}px`,
    '--uxm-menu-item-subtitle-color': styles.itemSubtitleColor as string,
    '--uxm-menu-item-subtitle-gap': `${styles.itemSubtitleGap}px`,

    '--uxm-menu-separator-color': styles.separatorColor as string,
  } as CSSProperties;
}

// Demo menu — a realistic row-action set: a couple of plain actions, a
// separator, then a destructive Delete. Shared shape between the static
// showcase and the live instance.
type DemoRow = { key: string; label: string; subtitle: string; icon: string; danger?: boolean };
const PLAIN_ROWS: DemoRow[] = [
  { key: 'edit', label: 'Edit', subtitle: 'Rename and change fields', icon: 'pencil' },
  { key: 'duplicate', label: 'Duplicate', subtitle: 'Create a copy in this folder', icon: 'copy' },
];
const DANGER_ROW: DemoRow = { key: 'delete', label: 'Delete', subtitle: 'Remove permanently', icon: 'trash', danger: true };

// ─────────────────────────────────────────────────────────────────────────────
//  Static showcase — full panel rendered inline with the real classes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hand-rendered (not the real `<Menu>`) so we can FORCE a row state
 * regardless of pointer / keyboard, and so the panel renders inline
 * (the live atom's panel is `position: fixed` + portaled). Uses the
 * exact DOM + classes the atom emits, so production CSS — and any saved
 * `.uxm-menu__panel` tuning — exercises against it identically.
 *
 * `pointer-events: none` keeps the showcase inert, so hovering it can't
 * paint `:hover` styling over the forced state the user picked.
 */
function StaticShowcase({
  state,
  withIcons,
  withSeparator,
  withSubtitles,
}: {
  state: string;
  withIcons: boolean;
  withSeparator: boolean;
  withSubtitles: boolean;
}) {
  const renderRow = (row: DemoRow, forceActive: boolean, forceDisabled: boolean) => (
    <button
      key={row.key}
      type="button"
      tabIndex={-1}
      disabled={forceDisabled || undefined}
      className={cn(
        'uxm-menu__item',
        forceActive && 'uxm-menu__item--active',
        forceDisabled && 'uxm-menu__item--disabled',
        row.danger && 'uxm-menu__item--danger',
      )}
    >
      {withIcons && <Icon glyph={row.icon} size={16} className="uxm-menu__item-icon" />}
      {withSubtitles ? (
        <span className="uxm-menu__item-text">
          <span className="uxm-menu__item-label">{row.label}</span>
          <span className="uxm-menu__item-subtitle">{row.subtitle}</span>
        </span>
      ) : (
        <span className="uxm-menu__item-label">{row.label}</span>
      )}
    </button>
  );

  // The forced state targets ONE representative row so the per-state
  // knobs are visible: hover/disabled hit the first plain row; danger
  // hits the Delete row in its highlighted (active) form so the
  // danger-hover background is visible.
  return (
    <div
      className="uxm-menu__panel"
      style={{
        width: 220,
        position: 'static',
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <div className="uxm-menu__list" style={{ overflowY: 'visible' }}>
        {PLAIN_ROWS.map((row, i) =>
          renderRow(row, state === 'hover' && i === 0, state === 'disabled' && i === 0),
        )}
        {withSeparator && <div className="uxm-menu__separator" role="separator" />}
        {renderRow(DANGER_ROW, state === 'danger', false)}
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

  const cssVars = buildVars(styles);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Live menu items — the real atom, exercising open/close, keyboard
  // nav, separators, disabled + danger rows. Icons and subtitles are gated
  // by their variants independently. `panelStyle={cssVars}` pushes the live
  // knob values onto the portaled panel.
  const liveItems: MenuEntry[] = [
    ...PLAIN_ROWS.map((r) => ({
      key: r.key,
      label: r.label,
      icon: withIcons ? r.icon : undefined,
      subtitle: withSubtitles ? r.subtitle : undefined,
      onSelect: () => setLastAction(r.label),
    })),
    {
      key: 'archive',
      label: 'Archive',
      icon: withIcons ? 'archive-x' : undefined,
      subtitle: withSubtitles ? 'Move out of the active list' : undefined,
      disabled: true,
    },
    ...(withSeparator ? ([{ separator: true, key: 'sep' }] as MenuEntry[]) : []),
    {
      key: DANGER_ROW.key,
      label: DANGER_ROW.label,
      icon: withIcons ? DANGER_ROW.icon : undefined,
      subtitle: withSubtitles ? DANGER_ROW.subtitle : undefined,
      danger: true,
      onSelect: () => setLastAction('Delete'),
    },
  ];

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
          withSeparator={withSeparator}
          withSubtitles={withSubtitles}
        />
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Live menu — click the ⋮</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Menu
            items={liveItems}
            aria-label="Row actions"
            panelStyle={cssVars}
            renderTrigger={({ open, triggerProps }) => (
              <IconButton
                {...triggerProps}
                aria-label="Open actions menu"
                className={cn(open && 'uxm-icon-button--active')}
              >
                <Icon glyph="kebab" size={18} />
              </IconButton>
            )}
          />
          <span style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>
            {lastAction ? `Last action: ${lastAction}` : 'No action yet'}
          </span>
        </div>
      </div>
    </div>
  );
}
