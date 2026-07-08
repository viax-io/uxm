import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';
import { InputWithIcon } from '@/ui';

type Styles = PreviewProps['styles'];

function buildVars(styles: Styles): CSSProperties {
  const iconSize = styles.iconSize as number;
  return {
    '--uxm-input-with-icon-bg': styles.backgroundColor as string,
    '--uxm-input-with-icon-border-color': styles.borderColor as string,
    '--uxm-input-with-icon-radius': `${styles.borderRadius}px`,
    '--uxm-input-with-icon-padding-x': `${styles.paddingX}px`,
    '--uxm-input-with-icon-padding-y': `${styles.paddingY}px`,
    '--uxm-input-with-icon-font-size': `${styles.fontSize}px`,
    '--uxm-input-with-icon-color': styles.color as string,
    '--uxm-input-with-icon-icon-color': styles.iconColor as string,
    '--uxm-input-with-icon-icon-size': `${iconSize}px`,
    '--uxm-input-with-icon-icon-offset': `${styles.iconOffset}px`,
    '--uxm-input-with-icon-hover-bg': styles.hoverBg as string,
    '--uxm-input-with-icon-hover-border': styles.hoverBorder as string,
    '--uxm-input-with-icon-focus-border': styles.focusBorder as string,
    '--uxm-input-with-icon-focus-ring': styles.focusRing as string,
    '--uxm-input-with-icon-disabled-bg': styles.disabledBg as string,
    '--uxm-input-with-icon-disabled-border': styles.disabledBorder as string,
    '--uxm-input-with-icon-disabled-color': styles.disabledColor as string,
    '--uxm-input-with-icon-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-input-with-icon-error-bg': styles.errorBg as string,
    '--uxm-input-with-icon-error-border': styles.errorBorder as string,
    '--uxm-input-with-icon-error-color': styles.errorColor as string,
    '--uxm-input-with-icon-error-message-size':
      styles.errorMessageSize != null ? `${styles.errorMessageSize}px` : undefined,
    width: 320,
  } as CSSProperties;
}

export function InputWithIconPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  return <InputWithIconDemo key={state} state={state} styles={styles} />;
}

// Keyed by state in the parent so changing the State knob remounts this
// sub-component and `useState` re-seeds — no effect needed to sync.
function InputWithIconDemo({ state, styles }: { state: string; styles: Styles }) {
  const isError = state === 'error';
  const iconSize = styles.iconSize as number;

  // Error: pre-fill with a query that has no matches so the message reads true.
  const [value, setValue] = useState(isError ? 'macroFoo ' : '');

  const cssVars = buildVars(styles);

  // Forced state classes live on the wrapper. The inner `__input`
  // receives the visual via descendant selectors in styles.css. The error
  // state is NOT forced here — it goes through the real `error` prop so the
  // preview exercises the component's own error path (class + message).
  const forcedClass = cn(
    state === 'hover' && 'uxm-input-with-icon--state-hover',
    state === 'focus' && 'uxm-input-with-icon--state-focus',
  );

  return (
    <div style={cssVars}>
      <InputWithIcon
        type="search"
        placeholder="Search…"
        icon={<Icon glyph="search" size={iconSize} strokeWidth={1.5} />}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
        disabled={state === 'disabled'}
        error={isError ? 'No matching models.' : undefined}
        className={forcedClass || undefined}
      />
    </div>
  );
}
