import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { DateInput, type DateInputFormat, type DateInputMode } from '@/ui';

type Styles = PreviewProps['styles'];

/**
 * Project every state knob as a `--uxm-date-input-*` custom prop on the
 * wrapper. The wrapper cascade reaches both the inner <input> (where the
 * field's :hover / :focus / :disabled rules apply) and the trailing
 * calendar button (which reads --uxm-date-input-icon-color in default,
 * --uxm-date-input-icon-hover-color on :hover, and re-tones via the
 * `--error` modifier on the wrapper).
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-date-input-background-color': styles.backgroundColor as string,
    '--uxm-date-input-border-color': styles.borderColor as string,
    '--uxm-date-input-color': styles.color as string,
    '--uxm-date-input-border-radius': `${styles.borderRadius}px`,
    '--uxm-date-input-padding-x': `${styles.paddingX}px`,
    '--uxm-date-input-padding-y': `${styles.paddingY}px`,
    '--uxm-date-input-font-size': `${styles.fontSize}px`,
    '--uxm-date-input-icon-color': styles.iconColor as string,
    '--uxm-date-input-icon-size': `${styles.iconSize}px`,
    '--uxm-date-input-icon-offset': `${styles.iconOffset}px`,
    '--uxm-date-input-icon-hover-color': styles.iconHoverColor as string,
    '--uxm-date-input-hover-bg': styles.hoverBg as string,
    '--uxm-date-input-hover-border': styles.hoverBorder as string,
    '--uxm-date-input-focus-border': styles.focusBorder as string,
    '--uxm-date-input-focus-ring': styles.focusRing as string,
    '--uxm-date-input-disabled-bg': styles.disabledBg as string,
    '--uxm-date-input-disabled-border': styles.disabledBorder as string,
    '--uxm-date-input-disabled-color': styles.disabledColor as string,
    '--uxm-date-input-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-date-input-error-bg': styles.errorBg as string,
    '--uxm-date-input-error-border': styles.errorBorder as string,
    '--uxm-date-input-error-color': styles.errorColor as string,
  } as CSSProperties;
}

export function DateInputPreview({ styles, variants }: PreviewProps) {
  const format = ((variants.format as string) ?? 'mdy') as DateInputFormat;
  const mode = ((variants.mode as string) ?? 'single') as DateInputMode;
  const state = (variants.state as string) ?? 'default';
  return (
    <DateInputDemo
      key={`${state}-${format}-${mode}`}
      state={state}
      format={format}
      mode={mode}
      styles={styles}
    />
  );
}

// Keyed by state+format+mode in the parent so changing any knob remounts
// and re-seeds `value` — no effect needed to sync.
function DateInputDemo({
  state,
  format,
  mode,
  styles,
}: {
  state: string;
  format: DateInputFormat;
  mode: DateInputMode;
  styles: Styles;
}) {
  const isError = state === 'error';

  // Error: pre-fill with a date that violates the "future date" rule.
  // DateInput is run in controlled mode here because its internal
  // `useEffect(..., [mode])` resets internal state on mount, which
  // clobbers `defaultValue` — controlled mode side-steps that path
  // entirely (the value we pass in always wins).
  const errorPrefill = mode === 'range'
    ? (format === 'ymd' ? '2020-01-01 – 2020-01-15' : '01/01/2020 – 01/15/2020')
    : (format === 'ymd' ? '2020-01-01' : '01/01/2020');

  const [value, setValue] = useState(isError ? errorPrefill : '');

  const cssVars = buildVars(styles);
  const width = mode === 'range' ? 340 : 260;

  const forcedClass = cn(
    state === 'hover' && 'uxm-date-input--state-hover',
    state === 'focus' && 'uxm-date-input--state-focus',
    state === 'error' && 'uxm-date-input--error',
  );

  return (
    <div style={{ width, ...cssVars } as CSSProperties}>
      <DateInput
        mode={mode}
        format={format}
        value={value}
        onChange={setValue}
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
          Pick a date in the future.
        </p>
      )}
    </div>
  );
}
