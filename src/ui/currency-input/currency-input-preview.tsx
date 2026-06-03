import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { CurrencyInput, type CurrencyValue } from '@/ui';

type Styles = PreviewProps['styles'];

/**
 * Project every state knob as a `--uxm-currency-input-*` custom prop
 * on the wrapper. The wrapper IS the visible surface (border + bg on
 * `.uxm-currency-input` itself, with the picker button on the left
 * and the popover anchored below). State pseudos target the wrapper
 * directly; `:focus-within` lets the wrapper light up when the inner
 * amount input has focus.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-currency-input-background-color': styles.backgroundColor as string,
    '--uxm-currency-input-border-color': styles.borderColor as string,
    '--uxm-currency-input-color': styles.color as string,
    '--uxm-currency-input-divider-color': styles.dividerColor as string,
    '--uxm-currency-input-symbol-color': styles.symbolColor as string,
    '--uxm-currency-input-caret-color': styles.caretColor as string,
    '--uxm-currency-input-border-radius': `${styles.borderRadius}px`,
    '--uxm-currency-input-padding-x': `${styles.paddingX}px`,
    '--uxm-currency-input-padding-y': `${styles.paddingY}px`,
    '--uxm-currency-input-font-size': `${styles.fontSize}px`,
    '--uxm-currency-input-hover-bg': styles.hoverBg as string,
    '--uxm-currency-input-hover-border': styles.hoverBorder as string,
    '--uxm-currency-input-picker-hover-bg': styles.pickerHoverBg as string,
    '--uxm-currency-input-focus-border': styles.focusBorder as string,
    '--uxm-currency-input-focus-ring': styles.focusRing as string,
    '--uxm-currency-input-disabled-bg': styles.disabledBg as string,
    '--uxm-currency-input-disabled-border': styles.disabledBorder as string,
    '--uxm-currency-input-disabled-color': styles.disabledColor as string,
    '--uxm-currency-input-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-currency-input-error-bg': styles.errorBg as string,
    '--uxm-currency-input-error-border': styles.errorBorder as string,
    '--uxm-currency-input-error-color': styles.errorColor as string,
    '--uxm-currency-input-popover-bg': styles.popoverBg as string,
    '--uxm-currency-input-popover-border': styles.popoverBorder as string,
    '--uxm-currency-input-popover-radius': `${styles.popoverRadius}px`,
    '--uxm-currency-input-popover-row-hover-bg': styles.popoverRowHoverBg as string,
    '--uxm-currency-input-popover-row-selected-bg': styles.popoverRowSelectedBg as string,
    '--uxm-currency-input-popover-row-selected-color': styles.popoverRowSelectedColor as string,
  } as CSSProperties;
}

export function CurrencyInputPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  const pickerPosition = ((variants.pickerPosition as string) ?? 'left') as 'left' | 'right';
  return (
    <CurrencyInputDemo
      key={`${state}-${pickerPosition}`}
      state={state}
      pickerPosition={pickerPosition}
      styles={styles}
    />
  );
}

// Keyed by state+pickerPosition in the parent so changing either knob
// remounts and re-seeds `value` — no effect needed to sync.
function CurrencyInputDemo({
  state,
  pickerPosition,
  styles,
}: {
  state: string;
  pickerPosition: 'left' | 'right';
  styles: Styles;
}) {
  const isError = state === 'error';

  // Default to USD on the left (modern fintech convention) and EUR
  // on the right (European suffix convention) so the variant flip
  // also shows a realistic currency for the chosen layout.
  const buildSeed = (errored: boolean, position: 'left' | 'right'): CurrencyValue => {
    const cur = position === 'right' ? 'EUR' : 'USD';
    return errored
      ? { currency: cur, amount: '9999999' }
      : { currency: cur, amount: '' };
  };

  const [value, setValue] = useState<CurrencyValue>(buildSeed(isError, pickerPosition));

  // EU-style picker on the right pairs with a EUR-default and a
  // de-DE locale so blur-display formats as `1.234,56` (the suffix
  // read consumers actually see in EU receipts).
  const locale = pickerPosition === 'right' ? 'de-DE' : 'en-US';

  const cssVars = buildVars(styles);

  const forcedClass = cn(
    state === 'hover' && 'uxm-currency-input--state-hover',
    state === 'focus' && 'uxm-currency-input--state-focus',
    state === 'error' && 'uxm-currency-input--error',
  );

  return (
    <div style={{ width: 280, ...cssVars } as CSSProperties}>
      <CurrencyInput
        value={value}
        onChange={setValue}
        pickerPosition={pickerPosition}
        locale={locale}
        max={1_000_000}
        disabled={state === 'disabled'}
        className={forcedClass || undefined}
      />
      {isError && (
        <p
          style={{
            fontSize: (styles.errorMessageSize as number) ?? 12,
            color: styles.errorColor as string,
            marginTop: 4,
          }}
        >
          Amount exceeds the $1,000,000 limit.
        </p>
      )}
    </div>
  );
}
