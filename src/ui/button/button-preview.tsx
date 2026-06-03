import { useState, type CSSProperties } from 'react';

import type { PreviewProps } from '@/previews/types';
import { ButtonGhost, ButtonPrimary, ButtonSecondary, ButtonTertiary } from '@/ui';
import { ButtonIcon } from '@/ui';
import { Icon } from '@/ui';
import { getIcon } from '@/ui';

type PlainButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost';

/**
 * State-aware style for plain buttons that adopt the per-state knob pattern.
 *
 * Default-state preview projects `backgroundColor`/`color`/`borderColor` as
 * CSS custom properties (e.g. `--uxm-button-primary-background-color`), NOT
 * inline `background-color`. That preserves real pointer `:hover` interaction
 * in the editor canvas — the base rule reads the var, and the `:hover` rule
 * reads its own var without an inline declaration to fight against.
 *
 * Forced-state preview (hover/active/focus/disabled selected in the panel)
 * inlines direct `background-color`/`color`/`border-color` so the forced
 * visual stays painted regardless of real pointer/keyboard interaction. The
 * tradeoff: real `:hover` is disabled in forced-state preview, which is
 * intended (the user is examining a specific state, not exercising it).
 */
function plainButtonStateStyle(
  props: PreviewProps,
  variant: PlainButtonVariant,
): { style: CSSProperties; disabled: boolean } {
  const { styles, variants } = props;
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
    : (styles.borderColor as string | undefined);

  const gapVar = `--uxm-button-${variant}-gap` as const;
  const cssVars: Record<string, string | undefined> = {
    // Default-state base — projected as custom props so the base CSS rule
    // reads them and `:hover` still wins on real pointer interaction.
    [`--uxm-button-${variant}-background-color`]: styles.backgroundColor as string | undefined,
    [`--uxm-button-${variant}-color`]: styles.color as string | undefined,
    [`--uxm-button-${variant}-border-color`]: styles.borderColor as string | undefined,
    // State-specific vars — production CSS pseudo-class rules read these.
    [`--uxm-button-${variant}-hover-background-color`]: styles.hoverBackgroundColor as string | undefined,
    [`--uxm-button-${variant}-hover-color`]: styles.hoverColor as string | undefined,
    [`--uxm-button-${variant}-hover-border-color`]: styles.hoverBorderColor as string | undefined,
    [`--uxm-button-${variant}-active-background-color`]: styles.activeBackgroundColor as string | undefined,
    [`--uxm-button-${variant}-active-color`]: styles.activeColor as string | undefined,
    [`--uxm-button-${variant}-active-border-color`]: styles.activeBorderColor as string | undefined,
    [`--uxm-button-${variant}-focus-ring-color`]: styles.focusRingColor as string | undefined,
    [`--uxm-button-${variant}-focus-color`]: styles.focusColor as string | undefined,
    [`--uxm-button-${variant}-disabled-opacity`]:
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    [`--uxm-button-${variant}-disabled-color`]: styles.disabledColor as string | undefined,
  };

  // Forced state — direct inline overrides win over CSS rules and keep the
  // selected state painted regardless of pointer/keyboard interaction. In
  // default state we skip these so real `:hover` etc. work.
  const forcedDirectOverrides: CSSProperties = isForcedState
    ? {
        backgroundColor: currentBg,
        color: currentColor,
        borderColor: currentBorder,
      }
    : {};

  const style: CSSProperties = {
    ...cssVars,
    ...forcedDirectOverrides,
    borderRadius: styles.borderRadius as number | undefined,
    padding: `${styles.paddingY}px ${styles.paddingX}px`,
    fontSize: styles.fontSize as number | undefined,
    fontWeight: styles.fontWeight as string | undefined,
    [gapVar]: styles.gap != null ? `${styles.gap}px` : undefined,
    ...(isDisabled ? { opacity: styles.disabledOpacity as number | undefined } : {}),
    ...(isFocused
      ? {
          outline: `2px solid ${styles.focusRingColor as string}`,
          outlineOffset: 2,
        }
      : {}),
  } as CSSProperties;

  return { style, disabled: isDisabled };
}

export function ButtonPreview(props: PreviewProps) {
  const { componentId } = props;

  if (componentId === 'button-icon') {
    return <ButtonIconStatePreview {...props} />;
  }

  if (componentId === 'button-secondary') {
    const { style, disabled } = plainButtonStateStyle(props, 'secondary');
    return (
      <ButtonSecondary
        style={{ ...style, borderStyle: 'solid', borderWidth: 1.5 }}
        disabled={disabled}
      >
        Secondary Button
      </ButtonSecondary>
    );
  }

  if (componentId === 'button-tertiary') {
    const { style, disabled } = plainButtonStateStyle(props, 'tertiary');
    return (
      <ButtonTertiary
        style={{ ...style, borderStyle: 'solid', borderWidth: 1 }}
        disabled={disabled}
      >
        Tertiary Button
      </ButtonTertiary>
    );
  }

  if (componentId === 'button-ghost') {
    const { style, disabled } = plainButtonStateStyle(props, 'ghost');
    return (
      <ButtonGhost style={style} disabled={disabled}>
        Ghost Button
      </ButtonGhost>
    );
  }

  const { style, disabled } = plainButtonStateStyle(props, 'primary');
  return (
    <ButtonPrimary style={style} disabled={disabled}>
      Primary Button
    </ButtonPrimary>
  );
}

/**
 * Renders the real <ButtonIcon> so the editor preview exercises the same
 * `.uxm-button-icon` CSS path as production. Forced states (hover/active/
 * disabled chosen in the panel) override the live pointer state so designers
 * can see each state without interaction.
 */
function ButtonIconStatePreview({ styles, variants }: PreviewProps) {
  const glyph = (variants.glyph as string) ?? 'plus';
  const state = (variants.state as string) ?? 'default';
  const def = getIcon(glyph);

  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const forced = state !== 'default';
  const isHover = forced ? state === 'hover' : hover;
  const isPressed = forced ? state === 'active' : pressed;
  const isFocused = state === 'focus';
  const isDisabled = state === 'disabled';

  const iconSize = styles.iconSize as number;

  // Resolve current-state visible values for forced-state preview. Default
  // state skips direct overrides so real `:hover` / `:active` rules win;
  // see plainButtonStateStyle for the full rationale.
  const currentBg = isDisabled
    ? (styles.backgroundColor as string)
    : isPressed
    ? (styles.activeBackgroundColor as string)
    : isHover
    ? (styles.hoverBackgroundColor as string)
    : (styles.backgroundColor as string);
  const currentColor = isDisabled
    ? (styles.disabledColor as string)
    : isPressed
    ? (styles.activeColor as string)
    : isHover
    ? (styles.hoverColor as string)
    : isFocused
    ? (styles.focusColor as string)
    : (styles.color as string);

  const forcedDirectOverrides: CSSProperties = forced
    ? { backgroundColor: currentBg, color: currentColor }
    : {};

  const cssVars: CSSProperties = {
    '--uxm-button-icon-size': `${styles.size}px`,
    '--uxm-button-icon-icon-size': `${iconSize}px`,
    '--uxm-button-icon-background-color': styles.backgroundColor as string,
    '--uxm-button-icon-color': styles.color as string,
    '--uxm-button-icon-hover-background-color': styles.hoverBackgroundColor as string,
    '--uxm-button-icon-hover-color': styles.hoverColor as string,
    '--uxm-button-icon-active-background-color': styles.activeBackgroundColor as string,
    '--uxm-button-icon-active-color': styles.activeColor as string,
    '--uxm-button-icon-focus-ring-color': styles.focusRingColor as string,
    '--uxm-button-icon-focus-color': styles.focusColor as string,
    '--uxm-button-icon-disabled-opacity': (styles.disabledOpacity as number).toString(),
    '--uxm-button-icon-disabled-color': styles.disabledColor as string,
    ...forcedDirectOverrides,
    borderRadius: styles.borderRadius as number,
    ...(isFocused ? {
      outline: `2px solid ${styles.focusRingColor as string}`,
      outlineOffset: 2,
    } : {}),
  } as CSSProperties;

  return (
    <div style={{ padding: 16, display: 'inline-flex' }}>
      <ButtonIcon
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
        <Icon glyph={glyph} size={iconSize} />
      </ButtonIcon>
    </div>
  );
}
