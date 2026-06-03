import type { PreviewProps } from '@/previews/types';
import { ButtonWithIcon } from '@/ui';
import { Icon } from '@/ui';

import type { CSSProperties } from 'react';

export function ButtonWithIconPreview({ styles, variants }: PreviewProps) {
  const iconSize = styles.iconSize as number;
  const state = (variants.state as string) ?? 'default';
  const isHover = state === 'hover';
  const isPressed = state === 'active';
  const isFocused = state === 'focus';
  const isDisabled = state === 'disabled';
  const isForcedState = isHover || isPressed || isFocused || isDisabled;

  const fallback = <T,>(stateValue: T | undefined, base: T) => (stateValue !== undefined ? stateValue : base);

  const currentBg = isPressed
    ? fallback(styles.activeBackgroundColor as string | undefined, styles.backgroundColor as string)
    : isHover
    ? fallback(styles.hoverBackgroundColor as string | undefined, styles.backgroundColor as string)
    : (styles.backgroundColor as string);

  const currentColor = isDisabled
    ? fallback(styles.disabledColor as string | undefined, styles.color as string)
    : isPressed
    ? fallback(styles.activeColor as string | undefined, styles.color as string)
    : isHover
    ? fallback(styles.hoverColor as string | undefined, styles.color as string)
    : isFocused
    ? fallback(styles.focusColor as string | undefined, styles.color as string)
    : (styles.color as string);

  const currentBorder = isPressed
    ? fallback(styles.activeBorderColor as string | undefined, styles.borderColor as string)
    : isHover
    ? fallback(styles.hoverBorderColor as string | undefined, styles.borderColor as string)
    : (styles.borderColor as string);

  // Default-state preview projects custom props for bg/color/border so real
  // `:hover` still works in the editor canvas. Forced state inlines direct
  // overrides to keep the previewed state painted. Same rationale as
  // plainButtonStateStyle.
  const forcedDirectOverrides = isForcedState
    ? {
        backgroundColor: currentBg,
        color: currentColor,
        borderColor: currentBorder,
      }
    : {};

  const cssVars = {
    ...forcedDirectOverrides,
    borderRadius: styles.borderRadius as number,
    padding: `${styles.paddingY}px ${styles.paddingX}px`,
    fontSize: styles.fontSize as number,
    fontWeight: styles.fontWeight as string,
    '--uxm-button-with-icon-gap': styles.gap != null ? `${styles.gap}px` : undefined,
    '--uxm-button-with-icon-background-color': styles.backgroundColor as string | undefined,
    '--uxm-button-with-icon-color': styles.color as string | undefined,
    '--uxm-button-with-icon-border-color': styles.borderColor as string | undefined,
    '--uxm-button-with-icon-hover-background-color': styles.hoverBackgroundColor as string | undefined,
    '--uxm-button-with-icon-hover-color': styles.hoverColor as string | undefined,
    '--uxm-button-with-icon-hover-border-color': styles.hoverBorderColor as string | undefined,
    '--uxm-button-with-icon-active-background-color': styles.activeBackgroundColor as string | undefined,
    '--uxm-button-with-icon-active-color': styles.activeColor as string | undefined,
    '--uxm-button-with-icon-active-border-color': styles.activeBorderColor as string | undefined,
    '--uxm-button-with-icon-focus-ring-color': styles.focusRingColor as string | undefined,
    '--uxm-button-with-icon-focus-color': styles.focusColor as string | undefined,
    '--uxm-button-with-icon-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-button-with-icon-disabled-color': styles.disabledColor as string | undefined,
    ...(isDisabled ? { opacity: styles.disabledOpacity as number } : {}),
    ...(isFocused
      ? {
          outline: `2px solid ${styles.focusRingColor as string}`,
          outlineOffset: 2,
        }
      : {}),
  } as unknown as CSSProperties;

  return (
    <ButtonWithIcon
      icon={<Icon glyph="refresh" size={iconSize} />}
      style={cssVars}
      disabled={isDisabled}
    >
      Configure Lifecycle
    </ButtonWithIcon>
  );
}
