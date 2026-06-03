import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';
import { InlineAction } from '@/ui';

import type { CSSProperties } from 'react';

export function InlineActionPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  const isHover = state === 'hover';
  const isPressed = state === 'active';
  const isFocused = state === 'focus';
  const isDisabled = state === 'disabled';

  const fallback = <T,>(stateValue: T | undefined, base: T) => (stateValue !== undefined ? stateValue : base);

  // Resolve current visible color for forced-state preview. Wrapper-cascade
  // pattern (vars on the wrapper rather than per-button) lets all three demo
  // instances share the same projected state.
  const currentColor = isDisabled
    ? fallback(styles.disabledColor as string | undefined, styles.color as string)
    : isPressed
    ? fallback(styles.activeColor as string | undefined, styles.color as string)
    : isHover
    ? fallback(styles.hoverColor as string | undefined, styles.color as string)
    : isFocused
    ? fallback(styles.focusColor as string | undefined, styles.color as string)
    : (styles.color as string);

  const cssVars = {
    '--uxm-inline-action-color': currentColor,
    '--uxm-inline-action-hover-color': styles.hoverColor as string,
    '--uxm-inline-action-active-color': styles.activeColor as string | undefined,
    '--uxm-inline-action-focus-color': styles.focusColor as string | undefined,
    '--uxm-inline-action-focus-ring-color': styles.focusRingColor as string | undefined,
    '--uxm-inline-action-disabled-color': styles.disabledColor as string | undefined,
    '--uxm-inline-action-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-inline-action-font-size': `${styles.fontSize}px`,
    '--uxm-inline-action-font-weight': styles.fontWeight as string,
    '--uxm-inline-action-gap': `${styles.gap}px`,
    '--uxm-inline-action-icon-size': `${styles.iconSize}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    minWidth: 200,
    ...(isDisabled ? { opacity: styles.disabledOpacity as number } : {}),
    ...(isFocused
      ? {
          // Outline applied to the wrapper so all three demo instances show
          // it together — keeps the focused-state preview synchronized.
          outline: `2px solid ${styles.focusRingColor as string}`,
          outlineOffset: 2,
          padding: 4,
        }
      : {}),
  } as CSSProperties;

  return (
    <div style={cssVars}>
      <InlineAction icon={<Icon glyph="refresh" strokeWidth={2.25} />} disabled={isDisabled}>
        Reset section
      </InlineAction>
      <InlineAction icon={<Icon glyph="arrow-down" strokeWidth={2.5} />} disabled={isDisabled}>
        Match in 4 other Inputs
      </InlineAction>
      <InlineAction disabled={isDisabled}>Edit</InlineAction>
    </div>
  );
}
