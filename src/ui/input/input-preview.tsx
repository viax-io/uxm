import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { TextInput } from '@/ui';

type Styles = PreviewProps['styles'];

/**
 * Project every state knob onto the wrapper as a `--uxm-input-text-*`
 * custom prop. The single <TextInput> below reads them through the
 * styles.css `:hover` / `:focus` / `:disabled` / `--error` rules — so
 * live edits paint immediately and real pointer / keyboard interaction
 * exercises the same production CSS that ships to consumers.
 *
 * The preview shows the bare input atom — no label. Labels are owned
 * entirely by `<FormField>`; consumers wrap with FormField when they
 * want a label. This keeps the input editor focused on input shape and
 * state, and routes all label theming questions to FormField.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-input-text-bg': styles.backgroundColor as string,
    '--uxm-input-text-border-color': styles.borderColor as string,
    '--uxm-input-text-color': styles.color as string,
    '--uxm-input-text-border-radius': `${styles.borderRadius}px`,
    '--uxm-input-text-padding-x': `${styles.paddingX}px`,
    '--uxm-input-text-padding-y': `${styles.paddingY}px`,
    '--uxm-input-text-font-size': `${styles.fontSize}px`,
    '--uxm-input-text-hover-bg': styles.hoverBg as string,
    '--uxm-input-text-hover-border': styles.hoverBorder as string,
    '--uxm-input-text-focus-border': styles.focusBorder as string,
    '--uxm-input-text-focus-ring': styles.focusRing as string,
    '--uxm-input-text-disabled-bg': styles.disabledBg as string,
    '--uxm-input-text-disabled-border': styles.disabledBorder as string,
    '--uxm-input-text-disabled-color': styles.disabledColor as string,
    '--uxm-input-text-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-input-text-error-bg': styles.errorBg as string,
    '--uxm-input-text-error-border': styles.errorBorder as string,
  } as CSSProperties;
}

export function InputPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  return <InputDemo key={state} state={state} styles={styles} />;
}

// Keyed by state in the parent so changing the State knob remounts this
// sub-component and `useState` re-seeds — no effect needed to sync.
function InputDemo({ state, styles }: { state: string; styles: Styles }) {
  const isError = state === 'error';

  // Error state pre-fills with visibly bad input so the full error UX
  // (red border + message) reads as a realistic failure, not just
  // "input with a red border."
  const [value, setValue] = useState(isError ? 'bad@' : '');

  const cssVars = buildVars(styles);

  // Forced-state modifier class. `--state-hover` and `--state-focus`
  // mirror the `:hover` / `:focus` pseudo styles via shared CSS selectors,
  // so the visual fires without needing real interaction. Disabled
  // engages via the HTML `disabled` attribute; error uses the existing
  // `--error` modifier.
  const forcedClass = cn(
    state === 'hover' && 'uxm-input-text--state-hover',
    state === 'focus' && 'uxm-input-text--state-focus',
    state === 'error' && 'uxm-input-text--error',
  );

  return (
    <div style={{ width: 300, ...cssVars } as CSSProperties}>
      <TextInput
        type="email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={state === 'disabled'}
        className={forcedClass || undefined}
        placeholder="you@example.com"
      />
      {isError && (
        <p
          style={{
            fontSize: (styles.errorMessageSize as number) ?? 12,
            color: styles.errorColor as string,
            marginTop: 4,
          }}
        >
          Please enter a valid email address.
        </p>
      )}
    </div>
  );
}
