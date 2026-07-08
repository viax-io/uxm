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
    '--uxm-currency-input-error-message-size':
      styles.errorMessageSize != null ? `${styles.errorMessageSize}px` : undefined,
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
  return <CurrencyInputDemo key={state} state={state} styles={styles} />;
}

// Keyed by state in the parent so changing the knob remounts and re-seeds
// `value` — no effect needed to sync.
function CurrencyInputDemo({ state, styles }: { state: string; styles: Styles }) {
  const isError = state === 'error';

  // Error state pre-fills an over-limit amount so the message reads true;
  // otherwise start empty. USD in the leading picker is the canonical layout.
  const [value, setValue] = useState<CurrencyValue>(
    isError ? { currency: 'USD', amount: '9999999' } : { currency: 'USD', amount: '' },
  );

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
        locale="en-US"
        max={1_000_000}
        disabled={state === 'disabled'}
        className={forcedClass || undefined}
      />
      {isError && (
        <p
          style={{
            fontSize: 'var(--uxm-currency-input-error-message-size, 12px)',
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
