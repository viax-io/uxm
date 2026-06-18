import { type CSSProperties } from 'react';

import type { PreviewProps } from '@/previews/types';
import { ColorPicker } from '@/ui';

const px = (v: unknown): string | undefined =>
  typeof v === 'number' ? `${v}px` : (v as string | undefined);

/**
 * Canvas preview for the ColorPicker atom. The registry knobs apply to the
 * trigger via `--uxm-color-picker-*` custom properties; click the trigger to
 * open the picker popover.
 */
export function ColorPickerPreview({ styles, variants }: PreviewProps) {
  const disabled = variants.state === 'disabled';
  const vars = {
    '--uxm-color-picker-bg': styles.backgroundColor as string | undefined,
    '--uxm-color-picker-border-color': styles.borderColor as string | undefined,
    '--uxm-color-picker-color': styles.color as string | undefined,
    '--uxm-color-picker-radius': px(styles.borderRadius),
    '--uxm-color-picker-padding-x': px(styles.paddingX),
    '--uxm-color-picker-padding-y': px(styles.paddingY),
    '--uxm-color-picker-font-size': px(styles.fontSize),
    '--uxm-color-picker-swatch-size': px(styles.swatchSize),
    '--uxm-color-picker-hover-border-color': styles.hoverBorderColor as string | undefined,
    '--uxm-color-picker-focus-ring': styles.focusRing as string | undefined,
    '--uxm-color-picker-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
  } as CSSProperties;

  return <ColorPicker defaultValue="#1E66D0" disabled={disabled} style={vars} />;
}
