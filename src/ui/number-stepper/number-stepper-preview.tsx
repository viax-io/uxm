import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { FieldError, Icon, IconButton, NumberStepper } from '@/ui';

type Styles = PreviewProps['styles'];

/**
 * Project every registry knob as a `--uxm-number-stepper-*` custom
 * property on the wrapper. Both the static showcase and the
 * interactive instance below read from the same vars; the showcase
 * forces a state via the `--state-*` modifier class on the wrapper,
 * while the interactive instance exercises the production
 * `:hover` / `:focus-visible` / `:disabled` rules on real input.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-number-stepper-input-bg': styles.backgroundColor as string,
    '--uxm-number-stepper-input-border': styles.borderColor as string,
    '--uxm-number-stepper-input-color': styles.color as string,
    '--uxm-number-stepper-hover-bg': styles.hoverBg as string,
    '--uxm-number-stepper-hover-border': styles.hoverBorder as string,
    '--uxm-number-stepper-focus-border': styles.focusBorder as string,
    '--uxm-number-stepper-focus-ring': styles.focusRing as string,
    '--uxm-number-stepper-disabled-bg': styles.disabledBg as string,
    '--uxm-number-stepper-disabled-border': styles.disabledBorder as string,
    '--uxm-number-stepper-disabled-color': styles.disabledColor as string,
    '--uxm-number-stepper-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-number-stepper-error-bg': styles.errorBg as string,
    '--uxm-number-stepper-error-border': styles.errorBorder as string,
    '--uxm-number-stepper-error-color': styles.errorColor as string,
    '--uxm-number-stepper-error-message-size':
      styles.errorMessageSize != null ? `${styles.errorMessageSize}px` : undefined,
    '--uxm-number-stepper-input-width': `${styles.inputWidth}px`,
    '--uxm-number-stepper-input-radius': `${styles.borderRadius}px`,
    '--uxm-number-stepper-input-padding-x': `${styles.paddingX}px`,
    '--uxm-number-stepper-input-padding-y': `${styles.paddingY}px`,
    '--uxm-number-stepper-font-size': `${styles.fontSize}px`,
    '--uxm-number-stepper-gap': `${styles.gap}px`,
    '--uxm-number-stepper-unit-color': styles.unitColor as string,
    '--uxm-number-stepper-unit-size': `${styles.unitSize}px`,
  } as CSSProperties;
}

/**
 * Static showcase — ONE NumberStepper hand-rendered with the forced-
 * state class matching the State dropdown. Inert (`pointer-events:
 * none` + `tabIndex={-1}` on the input + `disabled` on the buttons)
 * so the forced state isn't overridden by real input. Composes the
 * real `IconButton` atom for the ± buttons so the showcase paints
 * the same visual treatment consumers will see in production — when
 * IconButton's theming changes, this showcase updates for free.
 */
function StaticShowcase({ state }: { state: string }) {
  const isDisabled = state === 'disabled';
  const isError = state === 'error';
  return (
    <div>
      <div
        className={cn(
          'uxm-number-stepper',
          state === 'hover' && 'uxm-number-stepper--state-hover',
          state === 'focus' && 'uxm-number-stepper--state-focus',
          isError && 'uxm-number-stepper--error',
        )}
        {...(isDisabled ? { 'aria-disabled': true } : {})}
        {...(isError ? { 'aria-invalid': true } : {})}
        style={{ pointerEvents: 'none' }}
      >
        {/* Pass `disabled` only when the State variant actually is
           "disabled" — otherwise the IconButton renders with disabled
           styling (lower opacity, muted color) even in the default
           showcase, making it visually mismatch the live interactive
           instance below. `pointer-events: none` on the wrapper plus
           `tabIndex={-1}` keeps the showcase inert without abusing
           the disabled prop. */}
        <IconButton tabIndex={-1} disabled={isDisabled} aria-label="Decrement">
          <Icon glyph="minus" size={12} strokeWidth={2} />
        </IconButton>
        <input
          type="number"
          defaultValue={16}
          tabIndex={-1}
          disabled={isDisabled}
          aria-label="Showcase value"
          className="uxm-number-stepper__input"
        />
        <IconButton tabIndex={-1} disabled={isDisabled} aria-label="Increment">
          <Icon glyph="plus" size={12} strokeWidth={2} />
        </IconButton>
        <span className="uxm-number-stepper__unit">px</span>
      </div>
      {isError && (
        // Same FieldError helper the real atom uses, so the showcase's
        // message matches the interactive instance below (icon + text).
        // Reads the projected `--uxm-number-stepper-error-*` vars.
        <FieldError className="uxm-number-stepper__error-message">
          Value must be between 0 and 64.
        </FieldError>
      )}
    </div>
  );
}

export function NumberStepperPreview({ styles, variants }: PreviewProps & { componentId: string }) {
  const state = (variants.state as string) ?? 'default';
  return <NumberStepperDemo key={state} state={state} styles={styles} />;
}

// Keyed by state in the parent so changing the State knob remounts this
// sub-component and `useState` re-seeds — no effect needed to sync.
function NumberStepperDemo({ state, styles }: { state: string; styles: Styles }) {
  const isErrorState = state === 'error';
  // The State variant seeds the initial value: error mode pre-fills
  // a value past `max={64}` so the realistic failure mode reads as
  // out-of-range rather than an empty red border. After mount,
  // the error treatment follows the ACTUAL value's validity (see
  // `isInvalid` below) — typing a valid number clears the error
  // border, matching real form-validation UX.
  const [value, setValue] = useState(isErrorState ? 128 : 16);
  const isInvalid = value < 0 || value > 64;
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

      {/* Interactive instance — real <NumberStepper> atom. Real
          `:hover` / `:focus-visible` exercise the production CSS via
          the projected vars above. Real ± clicks adjust the value.
          The State dropdown carries through to `disabled` and
          `error`; the rest fire on real input. The atom owns the
          error-message rendering (reads the projected `--uxm-number-
          stepper-error-*` vars), so the preview doesn't add its own. */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Interactive</div>
        <NumberStepper
          value={value}
          onChange={setValue}
          min={0}
          max={64}
          step={1}
          unit="px"
          disabled={state === 'disabled'}
          error={isInvalid ? 'Value must be between 0 and 64.' : undefined}
        />
      </div>
    </div>
  );
}
