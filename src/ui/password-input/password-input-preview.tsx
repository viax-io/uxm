import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { PasswordInput } from '@/ui';

type Styles = PreviewProps['styles'];

/**
 * Project every state knob as a `--uxm-password-input-*` custom prop on
 * the wrapper. The wrapper cascade reaches both the inner <input> (where
 * the field's :hover / :focus / :disabled rules apply) and the trailing
 * eye toggle (which reads --uxm-password-input-icon-color in default,
 * --uxm-password-input-icon-hover-color on :hover, and re-tones via the
 * `--error` modifier on the wrapper).
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-password-input-background-color': styles.backgroundColor as string,
    '--uxm-password-input-border-color': styles.borderColor as string,
    '--uxm-password-input-color': styles.color as string,
    '--uxm-password-input-border-radius': `${styles.borderRadius}px`,
    '--uxm-password-input-padding-x': `${styles.paddingX}px`,
    '--uxm-password-input-padding-y': `${styles.paddingY}px`,
    '--uxm-password-input-font-size': `${styles.fontSize}px`,
    '--uxm-password-input-icon-color': styles.iconColor as string,
    '--uxm-password-input-icon-size': `${styles.iconSize}px`,
    '--uxm-password-input-icon-offset': `${styles.iconOffset}px`,
    '--uxm-password-input-icon-hover-color': styles.iconHoverColor as string,
    '--uxm-password-input-hover-bg': styles.hoverBg as string,
    '--uxm-password-input-hover-border': styles.hoverBorder as string,
    '--uxm-password-input-focus-border': styles.focusBorder as string,
    '--uxm-password-input-focus-ring': styles.focusRing as string,
    '--uxm-password-input-disabled-bg': styles.disabledBg as string,
    '--uxm-password-input-disabled-border': styles.disabledBorder as string,
    '--uxm-password-input-disabled-color': styles.disabledColor as string,
    '--uxm-password-input-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-password-input-error-bg': styles.errorBg as string,
    '--uxm-password-input-error-border': styles.errorBorder as string,
    '--uxm-password-input-error-color': styles.errorColor as string,
  } as CSSProperties;
}

export function PasswordInputPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  return <PasswordInputDemo key={state} state={state} styles={styles} />;
}

// Keyed by state in the parent so changing the State knob remounts this
// sub-component and `useState` re-seeds — no effect needed to sync.
function PasswordInputDemo({ state, styles }: { state: string; styles: Styles }) {
  const isError = state === 'error';

  // Error: pre-fill with a value short enough to fail a typical "min 8 chars"
  // rule. Controlled mode so the value sticks across state flips without
  // wrestling the component's internal toggle state.
  const [value, setValue] = useState(isError ? 'weak' : 'hunter2!');

  const cssVars = buildVars(styles);

  const forcedClass = cn(
    state === 'hover' && 'uxm-password-input--state-hover',
    state === 'focus' && 'uxm-password-input--state-focus',
    state === 'error' && 'uxm-password-input--error',
  );

  return (
    <div style={{ width: 280, ...cssVars } as CSSProperties}>
      <PasswordInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={state === 'disabled'}
        className={forcedClass || undefined}
        placeholder="Enter your password"
      />
      {isError && (
        <p
          style={{
            fontSize: (styles.errorMessageSize as number) ?? 12,
            color: styles.errorColor as string,
            marginTop: 4,
          }}
        >
          Password must be at least 8 characters.
        </p>
      )}
    </div>
  );
}
