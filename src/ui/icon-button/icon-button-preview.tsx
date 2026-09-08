import { useState, type CSSProperties } from 'react';

import type { PreviewProps } from '@/previews/types';
import { getIcon } from '@/ui';
import { Icon } from '@/ui';
import { IconButton } from '@/ui';

/**
 * Renders the real <IconButton> with state-aware projection. Default-state
 * preview projects bg/color as custom properties (so real `:hover` works in
 * the editor canvas); forced states inline direct overrides so the chosen
 * state stays painted regardless of pointer/keyboard interaction. Mirrors
 * the same pattern used by `plainButtonStateStyle` for the labelled button
 * family.
 *
 * Uses the real <Icon> atom for the glyph render so every glyph type
 * works — both path- and body-based.
 */
export function IconButtonPreview({ styles, variants }: PreviewProps) {
  const glyph = (variants.glyph as string) ?? 'close';
  const state = (variants.state as string) ?? 'default';
  const filled = variants.variant === 'filled';
  const def = getIcon(glyph);

  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const forced = state !== 'default';
  const isHover = forced ? state === 'hover' : hover;
  const isPressed = forced ? state === 'active' : pressed;
  const isFocused = state === 'focus';
  const isDisabled = state === 'disabled';
  const isForcedState = forced;

  // Each variant owns its knob set; pick the active one so both the projected
  // vars and the forced-state overrides below paint the variant on canvas.
  const iconSize = (filled ? styles.filledIconSize : styles.iconSize) as number;
  const base = filled
    ? { bg: styles.filledBg, color: styles.filledColor, hoverBg: styles.filledHoverBg, hoverColor: styles.filledHoverColor, activeBg: styles.filledActiveBg, activeColor: styles.filledActiveColor }
    : { bg: styles.backgroundColor, color: styles.color, hoverBg: styles.hoverBackgroundColor, hoverColor: styles.hoverColor, activeBg: styles.activeBackgroundColor, activeColor: styles.activeColor };

  const fallback = <T,>(stateValue: T | undefined, base: T) =>
    stateValue !== undefined ? stateValue : base;

  const currentBg = isPressed
    ? fallback(base.activeBg as string | undefined, base.bg as string)
    : isHover
    ? fallback(base.hoverBg as string | undefined, base.bg as string)
    : (base.bg as string);
  const currentColor = isDisabled
    ? fallback(styles.disabledColor as string | undefined, base.color as string)
    : isPressed
    ? fallback(base.activeColor as string | undefined, base.color as string)
    : isHover
    ? fallback(base.hoverColor as string | undefined, base.color as string)
    : isFocused
    ? fallback(styles.focusColor as string | undefined, base.color as string)
    : (base.color as string);

  const cssVars: CSSProperties = {
    '--uxm-icon-button-size': `${styles.size}px`,
    '--uxm-icon-button-radius': `${styles.borderRadius}px`,
    '--uxm-icon-button-icon-size': `${iconSize}px`,
    '--uxm-icon-button-stroke-width': (styles.strokeWidth as number).toString(),
    // Default-state values projected as custom props so real `:hover` still
    // wins on actual pointer interaction in the editor canvas.
    '--uxm-icon-button-bg': styles.backgroundColor as string,
    '--uxm-icon-button-color': styles.color as string,
    // Per-state vars the production CSS rules read.
    '--uxm-icon-button-hover-bg': styles.hoverBackgroundColor as string,
    '--uxm-icon-button-hover-color': styles.hoverColor as string,
    '--uxm-icon-button-active-bg': styles.activeBackgroundColor as string | undefined,
    '--uxm-icon-button-active-color': styles.activeColor as string | undefined,
    '--uxm-icon-button-focus-ring-color': styles.focusRingColor as string | undefined,
    '--uxm-icon-button-focus-color': styles.focusColor as string | undefined,
    '--uxm-icon-button-disabled-opacity': (styles.disabledOpacity as number).toString(),
    '--uxm-icon-button-disabled-color': styles.disabledColor as string | undefined,
    // Filled-variant vars — read only by `.uxm-icon-button--filled`.
    '--uxm-icon-button-filled-size': `${styles.filledSize}px`,
    '--uxm-icon-button-filled-radius': `${styles.filledRadius}px`,
    '--uxm-icon-button-filled-icon-size': `${styles.filledIconSize}px`,
    '--uxm-icon-button-filled-bg': styles.filledBg as string,
    '--uxm-icon-button-filled-color': styles.filledColor as string,
    '--uxm-icon-button-filled-hover-bg': styles.filledHoverBg as string,
    '--uxm-icon-button-filled-hover-color': styles.filledHoverColor as string,
    '--uxm-icon-button-filled-active-bg': styles.filledActiveBg as string | undefined,
    '--uxm-icon-button-filled-active-color': styles.filledActiveColor as string | undefined,
    // Forced-state direct overrides keep the previewed state painted
    // regardless of real pointer/keyboard interaction. Default state skips
    // these so `:hover` etc. still trigger naturally.
    ...(isForcedState
      ? {
          backgroundColor: currentBg,
          color: currentColor,
        }
      : {}),
    ...(isFocused
      ? {
          outline: `2px solid ${styles.focusRingColor as string}`,
          outlineOffset: 2,
        }
      : {}),
  } as CSSProperties;

  return (
    <div style={{ padding: 16, display: 'inline-flex' }}>
      <IconButton
        variant={filled ? 'filled' : 'ghost'}
        aria-label={def?.label ?? glyph}
        disabled={isDisabled}
        onMouseEnter={() => !forced && setHover(true)}
        onMouseLeave={() => {
          if (!forced) {
            setHover(false);
            setPressed(false);
          }
        }}
        onMouseDown={() => !forced && setPressed(true)}
        onMouseUp={() => !forced && setPressed(false)}
        style={cssVars}
      >
        <Icon glyph={glyph} size={iconSize} strokeWidth={styles.strokeWidth as number} />
      </IconButton>
    </div>
  );
}
