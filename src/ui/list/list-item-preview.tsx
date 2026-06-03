import { useState, type CSSProperties, type ReactNode } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';
import { List, ListItem } from '@/ui';
import { Tag, type TagType } from '@/ui';

type Styles = PreviewProps['styles'];
type Mode = 'static' | 'interactive';

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
    '--uxm-list-item-chevron-color': styles.chevronColor as string,
  } as CSSProperties;
}

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
): ReactNode {
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
  iconSize,
}: {
  mode: Mode;
  state: string;
  showValue: boolean;
  iconSize: number;
}) {
  const isInteractive = mode === 'interactive';
  const isActive = isInteractive && state === 'active';
  const isDisabled = state === 'disabled';
  const inner = (
    <>
      <span className="uxm-list-item__icon">
        <Icon glyph="square" size={iconSize * 0.6} />
      </span>
      <span className="uxm-list-item__content">
        <span className="uxm-list-item__title">Owner</span>
        {showValue && <span className="uxm-list-item__value">Alex Morgan</span>}
      </span>
      <span className="uxm-list-item__trailing">
        {trailingForMode(mode, 'Verified', 'success')}
      </span>
    </>
  );

  return (
    <List>
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
  const [activeKey, setActiveKey] = useState<string>('plan');
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
        <StaticShowcase
          mode={mode}
          state={state}
          showValue={showValue}
          iconSize={styles.iconSize as number}
        />
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
        <div style={sectionLabel}>{mode === 'interactive' ? 'Interactive' : 'Static'}</div>
        <List>
          {ROWS.map((row, i) => {
            const isInteractive = mode === 'interactive';
            return (
              <ListItem
                key={row.key}
                interactive={isInteractive}
                active={isInteractive && row.key === activeKey}
                // Disabled is a visual treatment that applies to both
                // interactive rows (CSS `:disabled` / `[aria-disabled]`)
                // and static rows (`[aria-disabled]` on `<div>`).
                disabled={state === 'disabled' && i === 1}
                icon={<Icon glyph="square" size={(styles.iconSize as number) * 0.6} />}
                value={showValue ? row.value : undefined}
                trailing={trailingForMode(mode, row.meta, row.tagType)}
                onClick={isInteractive ? () => setActiveKey(row.key) : undefined}
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
