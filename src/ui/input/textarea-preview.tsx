import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Textarea } from '@/ui';

type Styles = PreviewProps['styles'];

/**
 * The preview shows the bare textarea atom — no label. Labels are owned
 * entirely by `<FormField>`; wrap with FormField when you want a label.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-textarea-bg': styles.backgroundColor as string,
    '--uxm-textarea-border-color': styles.borderColor as string,
    '--uxm-textarea-color': styles.color as string,
    '--uxm-textarea-border-radius': `${styles.borderRadius}px`,
    '--uxm-textarea-padding-x': `${styles.paddingX}px`,
    '--uxm-textarea-padding-y': `${styles.paddingY}px`,
    '--uxm-textarea-font-size': `${styles.fontSize}px`,
    '--uxm-textarea-min-height': `${styles.minHeight}px`,
    '--uxm-textarea-hover-bg': styles.hoverBg as string,
    '--uxm-textarea-hover-border': styles.hoverBorder as string,
    '--uxm-textarea-focus-border': styles.focusBorder as string,
    '--uxm-textarea-focus-ring': styles.focusRing as string,
    '--uxm-textarea-disabled-bg': styles.disabledBg as string,
    '--uxm-textarea-disabled-border': styles.disabledBorder as string,
    '--uxm-textarea-disabled-color': styles.disabledColor as string,
    '--uxm-textarea-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-textarea-error-bg': styles.errorBg as string,
    '--uxm-textarea-error-border': styles.errorBorder as string,
  } as CSSProperties;
}

export function TextareaPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  return <TextareaDemo key={state} state={state} styles={styles} />;
}

// Keyed by state in the parent so changing the State knob remounts this
// sub-component and `useState` re-seeds — no effect needed to sync.
function TextareaDemo({ state, styles }: { state: string; styles: Styles }) {
  const isError = state === 'error';

  // Error state pre-fills with a value the message can plausibly call out.
  const ERROR_VALUE = 'thanks for the great service!! actually nevermind it was terrible';
  const [value, setValue] = useState(isError ? ERROR_VALUE : '');

  const cssVars = buildVars(styles);

  const forcedClass = cn(
    state === 'hover' && 'uxm-textarea--state-hover',
    state === 'focus' && 'uxm-textarea--state-focus',
    state === 'error' && 'uxm-textarea--error',
  );

  return (
    <div style={{ width: 320, ...cssVars } as CSSProperties}>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={state === 'disabled'}
        className={forcedClass || undefined}
        placeholder="Write your message..."
      />
      {isError && (
        <p
          style={{
            fontSize: (styles.errorMessageSize as number) ?? 12,
            color: styles.errorColor as string,
            marginTop: 4,
          }}
        >
          Message contradicts itself — please clarify.
        </p>
      )}
    </div>
  );
}
