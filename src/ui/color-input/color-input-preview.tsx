import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { ColorInput, ColorInputPopover } from '@/ui';

type Styles = PreviewProps['styles'];

/**
 * Project the registry knobs onto the `--uxm-color-input-*` custom props the
 * SCSS reads. Set on the demo wrapper so they cascade into the inline panel
 * and the field chrome.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-color-input-bg': styles.backgroundColor as string,
    '--uxm-color-input-border-color': styles.borderColor as string,
    '--uxm-color-input-color': styles.color as string,
    '--uxm-color-input-border-radius': `${styles.borderRadius}px`,
    '--uxm-color-input-padding-x': `${styles.paddingX}px`,
    '--uxm-color-input-padding-y': `${styles.paddingY}px`,
    '--uxm-color-input-font-size': `${styles.fontSize}px`,
    '--uxm-color-input-area-height': `${styles.areaHeight}px`,
    '--uxm-color-input-hover-border': styles.hoverBorder as string,
    '--uxm-color-input-focus-border': styles.focusBorder as string,
    '--uxm-color-input-focus-ring': styles.focusRing as string,
    '--uxm-color-input-error-border': styles.errorBorder as string,
    '--uxm-color-input-error-color': styles.errorColor as string,
    '--uxm-color-input-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-color-input-panel-bg': styles.backgroundColor as string,
    '--uxm-color-input-panel-border': styles.borderColor as string,
  } as CSSProperties;
}

export function ColorInputPreview({ styles, variants }: PreviewProps) {
  const variant = (variants.variant as string) ?? 'inline';
  const state = (variants.state as string) ?? 'default';
  return (
    <ColorInputDemo
      key={`${variant}-${state}`}
      variant={variant}
      state={state}
      styles={styles}
    />
  );
}

// Keyed on variant+state in the parent so switching either knob remounts and
// re-seeds the color — no effect needed to sync. The representation (HEX / RGB
// / RGBA / HSL) is switched live from the component's own format select, and
// `onChange` always returns hex (the `outputFormat` default) regardless.
function ColorInputDemo({
  variant,
  state,
  styles,
}: {
  variant: string;
  state: string;
  styles: Styles;
}) {
  const [color, setColor] = useState('#4f46e5');
  const [open, setOpen] = useState(variant === 'popover' && state !== 'disabled');

  const cssVars = buildVars(styles);
  const isDisabled = state === 'disabled';
  const isError = state === 'error';

  const forcedClass = cn(
    state === 'hover' && 'uxm-color-input--state-hover',
    state === 'focus' && 'uxm-color-input--state-focus',
  );

  const shared = {
    value: color,
    onChange: setColor,
    disabled: isDisabled,
    error: isError ? 'Enter a valid color.' : undefined,
  };

  if (variant === 'popover') {
    return (
      <div style={cssVars}>
        <ColorInputPopover
          {...shared}
          open={open}
          onOpenChange={setOpen}
          triggerLabel="Choose color"
        />
      </div>
    );
  }

  return (
    <div style={cssVars}>
      <ColorInput {...shared} className={forcedClass || undefined} />
    </div>
  );
}
