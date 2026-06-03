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
  const def = getIcon(glyph);

  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const forced = state !== 'default';
  const isHover = forced ? state === 'hover' : hover;
  const isPressed = forced ? state === 'active' : pressed;
  const isFocused = state === 'focus';
  const isDisabled = state === 'disabled';
  const isForcedState = forced;

  const iconSize = styles.iconSize as number;

  const fallback = <T,>(stateValue: T | undefined, base: T) =>
    stateValue !== undefined ? stateValue : base;

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
