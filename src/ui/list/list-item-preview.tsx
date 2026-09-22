import { useState, type CSSProperties, type ReactNode } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Icon, IconTile } from '@/ui';
import { List, ListItem, type ListVariant } from '@/ui';
import { Tag, type TagType } from '@/ui';
import { Thumbnail } from '@/ui';

import { LIST_ITEM_ICON_TILE_STYLE, LIST_ITEM_MEDIA_STYLE } from './list';

type Styles = PreviewProps['styles'];
type Mode = 'static' | 'interactive';
type Leading = 'icon' | 'media';

/**
 * Project every registry knob as a `--uxm-list-item-*` custom property
 * on the wrapper. Both the static showcase and the interactive list
 * below read from the same vars; the showcase forces a state via the
 * `--state-*` modifier class while the interactive list exercises the
 * production `:hover` / `:focus-visible` / `:disabled` rules on real
 * pointer + keyboard.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-list-item-inactive-bg': styles.inactiveBg as string,
    '--uxm-list-item-inactive-text': styles.inactiveText as string,
    '--uxm-list-item-hover-bg': styles.hoverBg as string,
    '--uxm-list-item-hover-text': styles.hoverText as string,
    '--uxm-list-item-focus-text': styles.focusText as string,
    '--uxm-list-item-focus-ring': styles.focusRing as string,
    '--uxm-list-item-active-bg': styles.activeBg as string,
    '--uxm-list-item-active-text': styles.activeText as string,
    '--uxm-list-item-disabled-bg': styles.disabledBg as string,
    '--uxm-list-item-disabled-text': styles.disabledText as string,
    '--uxm-list-item-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-list-item-border-color': styles.borderColor as string,
    '--uxm-list-item-border-radius': `${styles.borderRadius}px`,
    '--uxm-list-item-padding-x': `${styles.paddingX}px`,
    '--uxm-list-item-padding-y': `${styles.paddingY}px`,
    '--uxm-list-item-gap': `${styles.gap}px`,
    '--uxm-list-item-font-size': `${styles.fontSize}px`,
    '--uxm-list-item-value-color': styles.valueColor as string,
    '--uxm-list-item-value-size': `${styles.valueSize}px`,
    '--uxm-list-item-icon-bg': styles.iconBg as string,
    '--uxm-list-item-icon-color': styles.iconColor as string,
    '--uxm-list-item-icon-size': `${styles.iconSize}px`,
    '--uxm-list-item-icon-radius': `${styles.iconRadius}px`,
    '--uxm-list-item-media-size': `${styles.mediaSize}px`,
    '--uxm-list-item-chevron-color': styles.chevronColor as string,
  } as CSSProperties;
}

/**
 * The demo media node for the `leading: "media"` variant — a `Thumbnail`
 * with no `src`, so it renders the atom's own placeholder instead of
 * reaching for a network image the canvas may not be able to load. It
 * tracks the Media Size knob because the slot forwards
 * `--uxm-list-item-media-size` into `--uxm-thumbnail-size`
 * (`LIST_ITEM_MEDIA_STYLE`), so the frame AND its placeholder glyph scale
 * together — the row owns the leading geometry, the media owns its surface.
 * `alt=""` because the row's title is the accessible name; a described
 * image here would be concatenated into it.
 */
const DEMO_MEDIA = <Thumbnail alt="" />;

/**
 * Pick the canonical trailing element for the given mode. The trailing
 * slot is `ReactNode` on the atom — consumers can pass anything (Tag,
 * Badge, Avatar, custom node). The preview demos the canonical patterns:
 *   - interactive → chevron icon (the "tap to drill in" affordance)
 *   - static → Tag (status indicator for an info row)
 */
function trailingForMode(
  mode: Mode,
  meta: string,
  tagType: TagType,
  selectable: boolean,
): ReactNode {
  if (selectable) {
    // NOT the chevron. `mode` keeps its `interactive` default in selectable
    // mode (its picker is hidden, which does not reset the stored value), so
    // deriving trailing from it put a "tap to drill in" affordance on a row
    // that ticks a checkbox — two contradictory signals in the one place
    // consumers copy from. A multi-select row's trailing is meta: modo's real
    // rows put a price there.
    return meta;
  }
  if (mode === 'interactive') {
    // Color inherits via `currentColor` from `.uxm-list-item__trailing`,
    // which reads `--uxm-list-item-chevron-color`. Keeps saves working
    // (the var has a single source of truth instead of an inline JS
    // override that would shadow it after save).
    return <Icon glyph="chevron-right" size={16} />;
  }
  return <Tag type={tagType}>{meta}</Tag>;
}

/**
 * Static showcase — ONE row, rendering matches the `mode` variant.
 *   - `interactive` → `<button>` with the forced-state class so all
 *     state CSS rules can apply (inert via pointer-events: none and
 *     tabIndex={-1}, so the forced state isn't overridden by real
 *     input).
 *   - `static` → `<div>` with no state class. State CSS rules are
 *     scoped to button/anchor element selectors and don't fire on
 *     divs, so the static row stays truly static.
 *
 * Hand-rendered because the atom doesn't expose a way to set the
 * showcase-only `--state-*` modifier class.
 */
function StaticShowcase({
  mode,
  state,
  showValue,
  leading,
  container,
  selectable,
}: {
  mode: Mode;
  state: string;
  showValue: boolean;
  leading: Leading;
  container: ListVariant;
  selectable: boolean;
}) {
  // A selectable row is a <label> around a checkbox — it can never be the
  // <button> this showcase renders for `interactive`. Painting a forced state
  // on the wrong element is worse than painting none: the State picker is the
  // only place hover / focus / disabled are shown at all, so a designer would
  // be tuning against a row the atom cannot produce in this mode.
  const isInteractive = mode === 'interactive' && !selectable;
  const isActive = isInteractive && state === 'active';
  const isDisabled = state === 'disabled';
  const inner = (
    <>
      {/* Mirrors the atom's selection affordance — same classes the atom
          renders, so the forced state is shown on the real element. */}
      {selectable && (
        <span className="uxm-list-item__check">
          <input
            type="checkbox"
            className="uxm-checkbox__input"
            checked={state !== 'default'}
            disabled={isDisabled}
            readOnly
          />
          <span className="uxm-checkbox__box" aria-hidden="true">
            <Icon glyph="check" strokeWidth={3} />
          </span>
        </span>
      )}
      {/* Mirrors the atom's leading slot: an IconTile sized/coloured from the
          same forwarded knob vars (glyph size comes from the tile var), or the
          un-tiled media span when the Leading variant selects it. */}
      {leading === 'media' ? (
        <span className="uxm-list-item__media" style={LIST_ITEM_MEDIA_STYLE}>
          {DEMO_MEDIA}
        </span>
      ) : (
        <IconTile className="uxm-list-item__icon" style={LIST_ITEM_ICON_TILE_STYLE}>
          <Icon glyph="square" />
        </IconTile>
      )}
      <span className="uxm-list-item__content">
        <span className="uxm-list-item__title">Owner</span>
        {showValue && <span className="uxm-list-item__value">Alex Morgan</span>}
      </span>
      <span className="uxm-list-item__trailing">
        {trailingForMode(mode, 'Verified', 'success', selectable)}
      </span>
    </>
  );

  return (
    <List variant={container}>
      {isInteractive ? (
        <button
          type="button"
          tabIndex={-1}
          disabled={isDisabled}
          aria-pressed={isActive}
          className={cn(
            'uxm-list-item',
            isActive && 'uxm-list-item--active',
            state === 'hover' && 'uxm-list-item--state-hover',
            state === 'focus' && 'uxm-list-item--state-focus',
          )}
          style={{ pointerEvents: 'none' }}
        >
          {inner}
        </button>
      ) : selectable ? (
        // The atom's selectable element: a <label>, never a <button>.
        <label
          className={cn('uxm-list-item', 'uxm-list-item--selectable')}
          {...(isDisabled ? { 'aria-disabled': true } : {})}
        >
          {inner}
        </label>
      ) : (
        <div
          className="uxm-list-item"
          {...(isDisabled ? { 'aria-disabled': true } : {})}
        >
          {inner}
        </div>
      )}
    </List>
  );
}

const ROWS: Array<{
  key: string;
  title: string;
  value: string;
  meta: string;
  tagType: TagType;
}> = [
  // One row per Tag type, with a label that matches the type's
  // semantic meaning — so two tags never read the same word with
  // different visual treatments.
  { key: 'plan', title: 'Plan', value: 'Enterprise', meta: 'Pro', tagType: 'accent' },
  { key: 'billing', title: 'Billing', value: 'Visa •• 4242', meta: 'Action needed', tagType: 'warning' },
  { key: 'owner', title: 'Owner', value: 'Alex Morgan', meta: 'Verified', tagType: 'success' },
  { key: 'activity', title: 'Last activity', value: '2 hours ago', meta: 'Recent', tagType: 'neutral' },
];

export function ListItemPreview({ styles, variants }: PreviewProps) {
  const mode = ((variants.mode as string) ?? 'interactive') as Mode;
  const state = (variants.state as string) ?? 'default';
  const showValue = ((variants.value as string) ?? 'shown') === 'shown';
  const leading = ((variants.leading as string) ?? 'icon') as Leading;
  const container = ((variants.container as string) ?? 'card') as ListVariant;
  const selectable = ((variants.selection as string) ?? 'none') === 'selectable';
  const [activeKey, setActiveKey] = useState<string>('plan');
  // Selectable mode is controlled, so the preview has to hold the set —
  // the same thing a consumer does. Two ticked by default so the checked
  // and unchecked box are both on screen without touching anything.
  const [picked, setPicked] = useState<string[]>(['plan', 'owner']);
  const cssVars = buildVars(styles);

  const sectionLabel = {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 380, ...cssVars } as CSSProperties}>
      <div>
        <div style={sectionLabel}>{state} state</div>
        <StaticShowcase mode={mode} state={state} showValue={showValue} leading={leading} container={container} selectable={selectable} />
      </div>

      {/* List — interactivity is driven by the `mode` variant. Trailing
          slot is set by the preview to the canonical example for each
          mode: chevron for interactive (the "tap to drill in" cue),
          Tag for static (status indicator).
          interactive → all rows render as <button>; the State dropdown
          carries through to `disabled` (applied to the second row),
          and real `:hover` / `:focus-visible` exercise the production
          CSS via the projected vars above.
          static → all rows render as <div>; the interactive states
          (hover / focus / active) are filtered out of the State picker
          via the registry's showWhen. `disabled` still applies to divs
          via `[aria-disabled]`. */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>{selectable ? 'Selectable' : mode === 'interactive' ? 'Interactive' : 'Static'}</div>
        <List variant={container}>
          {ROWS.map((row, i) => {
            const isInteractive = mode === 'interactive';
            return (
              <ListItem
                key={row.key}
                {...(selectable
                  ? {
                      selected: picked.includes(row.key),
                      onSelectedChange: (on: boolean) =>
                        setPicked((prev) =>
                          on ? [...prev, row.key] : prev.filter((k) => k !== row.key),
                        ),
                    }
                  : {
                      interactive: isInteractive,
                      active: isInteractive && row.key === activeKey,
                      onClick: isInteractive ? () => setActiveKey(row.key) : undefined,
                    })}
                // Disabled is a visual treatment that applies to both
                // interactive rows (CSS `:disabled` / `[aria-disabled]`)
                // and static rows (`[aria-disabled]` on `<div>`).
                disabled={state === 'disabled' && i === 1}
                {...(leading === 'media'
                  ? { media: DEMO_MEDIA }
                  : { icon: <Icon glyph="square" /> })}
                value={showValue ? row.value : undefined}
                trailing={trailingForMode(mode, row.meta, row.tagType, selectable)}
              >
                {row.title}
              </ListItem>
            );
          })}
        </List>
      </div>
    </div>
  );
}
