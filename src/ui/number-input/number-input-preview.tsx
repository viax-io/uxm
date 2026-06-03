import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { NumberInput } from '@/ui';

type Styles = PreviewProps['styles'];

/**
 * Project every state knob onto the input as a `--uxm-number-input-*`
 * custom prop. The single `<NumberInput>` below reads them through
 * styles.css's `:hover` / `:focus` / `:disabled` / `--error` rules,
 * so live edits paint immediately and real pointer / keyboard
 * interaction exercises the same production CSS that ships to
 * consumers.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-number-input-bg': styles.backgroundColor as string,
    '--uxm-number-input-border-color': styles.borderColor as string,
    '--uxm-number-input-color': styles.color as string,
    '--uxm-number-input-border-radius': `${styles.borderRadius}px`,
    '--uxm-number-input-padding-x': `${styles.paddingX}px`,
    '--uxm-number-input-padding-y': `${styles.paddingY}px`,
    '--uxm-number-input-font-size': `${styles.fontSize}px`,
    '--uxm-number-input-hover-bg': styles.hoverBg as string,
    '--uxm-number-input-hover-border': styles.hoverBorder as string,
    '--uxm-number-input-focus-border': styles.focusBorder as string,
    '--uxm-number-input-focus-ring': styles.focusRing as string,
    '--uxm-number-input-disabled-bg': styles.disabledBg as string,
    '--uxm-number-input-disabled-border': styles.disabledBorder as string,
    '--uxm-number-input-disabled-color': styles.disabledColor as string,
    '--uxm-number-input-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-number-input-error-bg': styles.errorBg as string,
    '--uxm-number-input-error-border': styles.errorBorder as string,
    '--uxm-number-input-text-align': styles.textAlign as string,
  } as CSSProperties;
}

export function NumberInputPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  return <NumberInputDemo key={state} state={state} styles={styles} />;
}

// Keyed by state in the parent so changing the State knob remounts this
// sub-component and `useState` re-seeds — no effect needed to sync.
function NumberInputDemo({ state, styles }: { state: string; styles: Styles }) {
  const isError = state === 'error';

  // Default state stays empty so the placeholder shows. Error mode
  // pre-fills a value that would fail a hypothetical "positive" rule.
  const [value, setValue] = useState(isError ? '-5' : '');

  const cssVars = buildVars(styles);

  const forcedClass = cn(
    state === 'hover' && 'uxm-number-input--state-hover',
    state === 'focus' && 'uxm-number-input--state-focus',
    state === 'error' && 'uxm-number-input--error',
  );

  return (
    <div style={{ width: 240, ...cssVars } as CSSProperties}>
      <NumberInput
        allowNegative
        allowDecimal
        decimals={2}
        value={value}
        onChange={setValue}
        disabled={state === 'disabled'}
        className={forcedClass || undefined}
        placeholder="0"
      />
      {isError && (
        <p
          style={{
            fontSize: (styles.errorMessageSize as number) ?? 12,
            color: styles.errorColor as string,
            marginTop: 4,
          }}
        >
          Enter a positive number.
        </p>
      )}
    </div>
  );
}
