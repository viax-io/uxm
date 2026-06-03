import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { TimeInput, type TimeInputFormat } from '@/ui';

type Styles = PreviewProps['styles'];

/**
 * Project every state knob as a `--uxm-time-input-*` custom prop on the
 * wrapper. The wrapper cascade reaches the inner <input> (where the
 * field's :hover / :focus / :disabled rules apply), the clock icon
 * (which reads --uxm-time-input-icon-color), and the AM/PM selector in
 * 12h mode (which reads --uxm-time-input-meridiem-* and re-tones via the
 * `--error` modifier on the wrapper).
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-time-input-background-color': styles.backgroundColor as string,
    '--uxm-time-input-border-color': styles.borderColor as string,
    '--uxm-time-input-color': styles.color as string,
    '--uxm-time-input-border-radius': `${styles.borderRadius}px`,
    '--uxm-time-input-padding-x': `${styles.paddingX}px`,
    '--uxm-time-input-padding-y': `${styles.paddingY}px`,
    '--uxm-time-input-font-size': `${styles.fontSize}px`,
    '--uxm-time-input-icon-color': styles.iconColor as string,
    '--uxm-time-input-icon-size': `${styles.iconSize}px`,
    '--uxm-time-input-icon-offset': `${styles.iconOffset}px`,
    '--uxm-time-input-icon-hover-color': styles.iconHoverColor as string,
    '--uxm-time-input-hover-bg': styles.hoverBg as string,
    '--uxm-time-input-hover-border': styles.hoverBorder as string,
    '--uxm-time-input-focus-border': styles.focusBorder as string,
    '--uxm-time-input-focus-ring': styles.focusRing as string,
    '--uxm-time-input-disabled-bg': styles.disabledBg as string,
    '--uxm-time-input-disabled-border': styles.disabledBorder as string,
    '--uxm-time-input-disabled-color': styles.disabledColor as string,
    '--uxm-time-input-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-time-input-error-bg': styles.errorBg as string,
    '--uxm-time-input-error-border': styles.errorBorder as string,
    '--uxm-time-input-error-color': styles.errorColor as string,
    '--uxm-time-input-meridiem-color': styles.meridiemColor as string,
    '--uxm-time-input-popover-bg': styles.popoverBg as string,
    '--uxm-time-input-popover-border': styles.popoverBorder as string,
    '--uxm-time-input-popover-radius': `${styles.popoverRadius}px`,
    '--uxm-time-input-popover-head-bg': styles.popoverHeadBg as string,
    '--uxm-time-input-popover-row-hover-bg': styles.popoverRowHoverBg as string,
    '--uxm-time-input-popover-row-selected-bg': styles.popoverRowSelectedBg as string,
    '--uxm-time-input-popover-row-selected-color': styles.popoverRowSelectedColor as string,
  } as CSSProperties;
}

export function TimeInputPreview({ styles, variants }: PreviewProps) {
  const format = ((variants.format as string) ?? '24h') as TimeInputFormat;
  const state = (variants.state as string) ?? 'default';
  return (
    <TimeInputDemo key={`${state}-${format}`} state={state} format={format} styles={styles} />
  );
}

// Keyed by state+format in the parent so changing either knob remounts
// and re-seeds `value` — no effect needed to sync.
function TimeInputDemo({
  state,
  format,
  styles,
}: {
  state: string;
  format: TimeInputFormat;
  styles: Styles;
}) {
  const isError = state === 'error';

  // Default state starts empty so the `HH:MM` placeholder is visible —
  // that's the canonical "fresh field" look designers need to theme.
  // Error mode pre-fills with a value that violates a hypothetical
  // "business hours only" rule (03:00 is too early), so the error UX
  // reads as a realistic failure rather than just an empty red border.
  const buildSeed = (errored: boolean, fmt: TimeInputFormat): string => {
    if (!errored) return '';
    return fmt === '12h' ? '03:00 AM' : '03:00';
  };

  const [value, setValue] = useState(buildSeed(isError, format));

  const cssVars = buildVars(styles);
  const width = format === '12h' ? 260 : 200;

  const forcedClass = cn(
    state === 'hover' && 'uxm-time-input--state-hover',
    state === 'focus' && 'uxm-time-input--state-focus',
    state === 'error' && 'uxm-time-input--error',
  );

  return (
    <div style={{ width, ...cssVars } as CSSProperties}>
      <TimeInput
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
          Pick a time between 09:00 and 17:00.
        </p>
      )}
    </div>
  );
}
