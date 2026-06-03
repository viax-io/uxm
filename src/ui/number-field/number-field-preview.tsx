import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';
import { NumberField } from '@/ui';

type Styles = PreviewProps['styles'];

/**
 * Project every registry knob as a `--uxm-number-field-*` custom
 * property on the wrapper. Both the static showcase and the
 * interactive instance below read from the same vars; the showcase
 * forces a state via the `--state-*` modifier class on the wrapper,
 * while the interactive instance exercises the production
 * `:hover` / `:focus-visible` / `:disabled` rules on real input.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-number-field-input-bg': styles.backgroundColor as string,
    '--uxm-number-field-input-border': styles.borderColor as string,
    '--uxm-number-field-input-color': styles.color as string,
    '--uxm-number-field-hover-bg': styles.hoverBg as string,
    '--uxm-number-field-hover-border': styles.hoverBorder as string,
    '--uxm-number-field-focus-border': styles.focusBorder as string,
    '--uxm-number-field-focus-ring': styles.focusRing as string,
    '--uxm-number-field-disabled-bg': styles.disabledBg as string,
    '--uxm-number-field-disabled-border': styles.disabledBorder as string,
    '--uxm-number-field-disabled-color': styles.disabledColor as string,
    '--uxm-number-field-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-number-field-input-width': `${styles.inputWidth}px`,
    '--uxm-number-field-input-radius': `${styles.borderRadius}px`,
    '--uxm-number-field-input-padding-x': `${styles.paddingX}px`,
    '--uxm-number-field-input-padding-y': `${styles.paddingY}px`,
    '--uxm-number-field-font-size': `${styles.fontSize}px`,
    '--uxm-number-field-gap': `${styles.gap}px`,
    '--uxm-number-field-stepper-size': `${styles.stepperSize}px`,
    '--uxm-number-field-stepper-radius': `${styles.stepperRadius}px`,
    '--uxm-number-field-unit-color': styles.unitColor as string,
    '--uxm-number-field-unit-size': `${styles.unitSize}px`,
  } as CSSProperties;
}

/**
 * Static showcase — ONE NumberField hand-rendered with the forced-
 * state class matching the State dropdown. Inert (`pointer-events:
 * none` + `tabIndex={-1}` on the input + `disabled` on the steppers)
 * so the forced state isn't overridden by real input. Hand-rendered
 * because the atom doesn't expose a way to set the showcase-only
 * `--state-*` modifier class.
 */
function StaticShowcase({ state }: { state: string }) {
  const isDisabled = state === 'disabled';
  return (
    <div
      className={cn(
        'uxm-number-field',
        state === 'hover' && 'uxm-number-field--state-hover',
        state === 'focus' && 'uxm-number-field--state-focus',
      )}
      {...(isDisabled ? { 'aria-disabled': true } : {})}
      style={{ pointerEvents: 'none' }}
    >
      <button
        type="button"
        tabIndex={-1}
        disabled
        className="uxm-number-field__stepper"
        aria-label="Decrement"
      >
        <Icon glyph="minus" size={12} strokeWidth={2} />
      </button>
      <input
        type="number"
        defaultValue={16}
        tabIndex={-1}
        disabled={isDisabled}
        aria-label="Showcase value"
        className="uxm-number-field__input"
      />
      <button
        type="button"
        tabIndex={-1}
        disabled
        className="uxm-number-field__stepper"
        aria-label="Increment"
      >
        <Icon glyph="plus" size={12} strokeWidth={2} />
      </button>
      <span className="uxm-number-field__unit">px</span>
    </div>
  );
}

export function NumberFieldPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  const [value, setValue] = useState(16);
  const cssVars = buildVars(styles);

  const sectionLabel = {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 200, ...cssVars } as CSSProperties}>
      <div>
        <div style={sectionLabel}>{state} state</div>
        <StaticShowcase state={state} />
      </div>

      {/* Interactive instance — real <NumberField> atom. Real
          `:hover` / `:focus-visible` exercise the production CSS via
          the projected vars above. Real ± clicks adjust the value.
          The State dropdown carries through to `disabled`; the rest
          fire on real input. */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Interactive</div>
        <NumberField
          value={value}
          onChange={setValue}
          min={0}
          max={64}
          step={1}
          unit="px"
          disabled={state === 'disabled'}
        />
      </div>
    </div>
  );
}
