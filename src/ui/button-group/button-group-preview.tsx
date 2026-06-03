import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { ButtonGroup } from '@/ui';

type Styles = PreviewProps['styles'];

const INTERACTIVE_OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

/**
 * Project every registry knob as a `--uxm-button-group-*` custom
 * property on the wrapper. Both the static showcase and the interactive
 * instance below read from the same vars; the showcase is inert
 * (`pointer-events: none` + `tabIndex={-1}`) so the forced state isn't
 * overridden by real input, and the interactive instance exercises the
 * production `:hover` / `:focus-visible` / `:disabled` rules on real
 * pointer + keyboard.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-button-group-border-color': styles.borderColor as string,
    '--uxm-button-group-border-radius': `${styles.borderRadius}px`,
    '--uxm-button-group-inactive-bg': styles.inactiveBg as string,
    '--uxm-button-group-inactive-text': styles.inactiveText as string,
    '--uxm-button-group-hover-bg': styles.hoverBg as string,
    '--uxm-button-group-hover-text': styles.hoverText as string,
    '--uxm-button-group-focus-text': styles.focusText as string,
    '--uxm-button-group-focus-ring': styles.focusRing as string,
    '--uxm-button-group-active-bg': styles.activeBg as string,
    '--uxm-button-group-active-text': styles.activeText as string,
    '--uxm-button-group-disabled-bg': styles.disabledBg as string,
    '--uxm-button-group-disabled-text': styles.disabledText as string,
    '--uxm-button-group-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-button-group-padding-x': `${styles.paddingX}px`,
    '--uxm-button-group-padding-y': `${styles.paddingY}px`,
    '--uxm-button-group-font-size': `${styles.fontSize}px`,
  } as CSSProperties;
}

/**
 * Static showcase — ONE item wrapped in a `.uxm-button-group` frame so
 * the rounded border + connecting border-right context reads (the
 * single-item version drops the border-right naturally via
 * `__item:last-child`). Inert: `pointer-events: none` blocks the
 * production `:hover` from firing on mouse-over, and `tabIndex={-1}`
 * keeps the button out of the focus order so `:focus-visible` can't
 * fire from a real Tab press.
 *
 * Hand-rendered (not the real `<ButtonGroup>` atom) because the atom
 * doesn't expose per-option `className` for the forced-state class.
 */
function StaticShowcase({ state }: { state: string }) {
  return (
    <div className="uxm-button-group" role="group" style={{ pointerEvents: 'none' }}>
      <button
        type="button"
        aria-pressed={state === 'active'}
        tabIndex={-1}
        className={cn(
          'uxm-button-group__item',
          state === 'active' && 'uxm-button-group__item--active',
          state === 'hover' && 'uxm-button-group__item--state-hover',
          state === 'focus' && 'uxm-button-group__item--state-focus',
        )}
        disabled={state === 'disabled'}
      >
        Week
      </button>
    </div>
  );
}

export function ButtonGroupPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  const [active, setActive] = useState(INTERACTIVE_OPTIONS[1].value);
  const cssVars = buildVars(styles);

  const sectionLabel = {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, ...cssVars } as CSSProperties}>
      <div>
        <div style={sectionLabel}>{state} state</div>
        <StaticShowcase state={state} />
      </div>

      {/* Interactive instance — full <ButtonGroup> atom with four
          options. Real `:hover` / `:focus-visible` / selection toggles
          exercise the production CSS via the projected vars above. The
          State dropdown only carries through to `disabled` here; the
          rest are exercised by real pointer + keyboard. */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Interactive</div>
        <ButtonGroup
          value={active}
          onChange={setActive}
          options={INTERACTIVE_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
            disabled: state === 'disabled',
          }))}
        />
      </div>
    </div>
  );
}
