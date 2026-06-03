import type { PreviewProps } from '@/previews/types';
import { BackLink } from '@/ui';

import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';

export function BackLinkPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  const isHover = state === 'hover';
  const isPressed = state === 'active';
  const isFocused = state === 'focus';
  const isDisabled = state === 'disabled';
  const isForcedState = isHover || isPressed || isFocused || isDisabled;

  const fallback = <T,>(stateValue: T | undefined, base: T) =>
    stateValue !== undefined ? stateValue : base;

  // Resolve the current visible text color per forced state. Default state
  // skips the inline override so real pointer `:hover` works in the canvas.
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
    '--uxm-back-link-color': styles.color as string,
    '--uxm-back-link-hover-color': styles.hoverColor as string | undefined,
    '--uxm-back-link-active-color': styles.activeColor as string | undefined,
    '--uxm-back-link-focus-color': styles.focusColor as string | undefined,
    '--uxm-back-link-focus-ring-color': styles.focusRingColor as string | undefined,
    '--uxm-back-link-disabled-color': styles.disabledColor as string | undefined,
    '--uxm-back-link-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-back-link-font-size': `${styles.fontSize}px`,
    '--uxm-back-link-font-weight': styles.fontWeight as string,
    '--uxm-back-link-gap': `${styles.gap}px`,
    // Forced-state direct override so the previewed state stays painted
    // regardless of real pointer/keyboard interaction.
    ...(isForcedState ? { color: currentColor } : {}),
    ...(isFocused
      ? {
          outline: `2px solid ${styles.focusRingColor as string}`,
          outlineOffset: 2,
          borderRadius: 2,
        }
      : {}),
  } as CSSProperties;

  return (
    <BackLink
      href="#"
      onClick={(e: ReactMouseEvent<HTMLAnchorElement>) => e.preventDefault()}
      aria-disabled={isDisabled || undefined}
      style={cssVars}
    >
      Back to Dashboard
    </BackLink>
  );
}
