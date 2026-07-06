import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { PhoneInput, type PhoneValue } from '@/ui';

type Styles = PreviewProps['styles'];

/**
 * Project every state knob as a `--uxm-phone-input-*` custom prop and hand
 * the bag to `PhoneInput` as its `style`. The wrapper IS the visible surface
 * here (border + bg live on `.uxm-phone-input` itself), unlike
 * date/time/password which put those on the inner input. The country popover
 * portals out to document.body, so it can't inherit the wrapper cascade —
 * PhoneInput forwards this same `style` onto the popover panel, keeping the
 * popover + country-button knobs live in the preview.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-phone-input-background-color': styles.backgroundColor as string,
    '--uxm-phone-input-border-color': styles.borderColor as string,
    '--uxm-phone-input-color': styles.color as string,
    '--uxm-phone-input-divider-color': styles.dividerColor as string,
    '--uxm-phone-input-caret-color': styles.caretColor as string,
    '--uxm-phone-input-border-radius': `${styles.borderRadius}px`,
    '--uxm-phone-input-padding-x': `${styles.paddingX}px`,
    '--uxm-phone-input-padding-y': `${styles.paddingY}px`,
    '--uxm-phone-input-font-size': `${styles.fontSize}px`,
    '--uxm-phone-input-hover-bg': styles.hoverBg as string,
    '--uxm-phone-input-hover-border': styles.hoverBorder as string,
    '--uxm-phone-input-country-hover-bg': styles.countryHoverBg as string,
    '--uxm-phone-input-focus-border': styles.focusBorder as string,
    '--uxm-phone-input-focus-ring': styles.focusRing as string,
    '--uxm-phone-input-disabled-bg': styles.disabledBg as string,
    '--uxm-phone-input-disabled-border': styles.disabledBorder as string,
    '--uxm-phone-input-disabled-color': styles.disabledColor as string,
    '--uxm-phone-input-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-phone-input-error-bg': styles.errorBg as string,
    '--uxm-phone-input-error-border': styles.errorBorder as string,
    '--uxm-phone-input-error-color': styles.errorColor as string,
    '--uxm-phone-input-popover-bg': styles.popoverBg as string,
    '--uxm-phone-input-popover-border': styles.popoverBorder as string,
    '--uxm-phone-input-popover-radius': `${styles.popoverRadius}px`,
    '--uxm-phone-input-popover-row-hover-bg': styles.popoverRowHoverBg as string,
    '--uxm-phone-input-popover-row-selected-bg': styles.popoverRowSelectedBg as string,
    '--uxm-phone-input-popover-row-selected-color': styles.popoverRowSelectedColor as string,
  } as CSSProperties;
}

export function PhoneInputPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  const isError = state === 'error';

  // Default state starts empty so the country-specific placeholder shape
  // is visible. Error mode pre-fills with too-short digits so the error
  // UX reads as realistic failure. State variant changes are wired
  // through a `key` on the inner host below — flipping state remounts
  // the host, which re-seeds via `useState`. This avoids a
  // `useEffect(setValue, [state])` reset that, with object-valued state,
  // races against typing under React 19 + StrictMode (a new object ref
  // each effect tick can synchronously re-revert the controlled value
  // mid-keystroke, eating the typed character).
  const seed: PhoneValue = isError
    ? { country: 'US', number: '555' }
    : { country: 'US', number: '' };

  const cssVars = buildVars(styles);

  const forcedClass = cn(
    state === 'hover' && 'uxm-phone-input--state-hover',
    state === 'focus' && 'uxm-phone-input--state-focus',
    state === 'error' && 'uxm-phone-input--error',
  );

  return (
    <div style={{ width: 320 }}>
      <PhoneInputHost
        key={state}
        seed={seed}
        disabled={state === 'disabled'}
        className={forcedClass || undefined}
        style={cssVars}
      />
      {isError && (
        <p
          className="uxm-phone-input__error-message"
          style={{
            '--uxm-phone-input-error-message-size':
              styles.errorMessageSize != null ? `${styles.errorMessageSize}px` : '12px',
          } as CSSProperties}
        >
          Enter a complete phone number.
        </p>
      )}
    </div>
  );
}

/**
 * Inner host owning the controlled value state. Keyed by the State
 * variant in the parent — flipping State unmounts and remounts this
 * host, which re-seeds `value` via `useState`. Avoids the
 * `useEffect(setValue, [state])` reset that bit phone-input under
 * React 19 + StrictMode: with an object-valued seed, the effect's
 * fresh object reference would race the controlled-input flow and
 * synchronously revert the DOM value mid-keystroke, eating typed
 * characters. Re-mounting on State change keeps the seeding logic
 * but never re-runs during typing.
 */
function PhoneInputHost({
  seed,
  disabled,
  className,
  style,
}: {
  seed: PhoneValue;
  disabled: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const [value, setValue] = useState<PhoneValue>(seed);
  return (
    <PhoneInput
      value={value}
      onChange={setValue}
      disabled={disabled}
      className={className}
      style={style}
    />
  );
}
