import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';
import { Tag, type TagSize, type TagType } from '@/ui';

import type { CSSProperties } from 'react';

const SAMPLE_LABEL: Record<TagType, string> = {
  accent: 'Featured',
  success: 'Approved',
  warning: 'Pending',
  danger: 'Rejected',
  info: 'In Review',
  neutral: 'Draft',
};

function CheckIcon() {
  return <Icon glyph="check" size={16} strokeWidth={2.5} aria-hidden />;
}

/**
 * Project the resolved style knobs onto `--uxm-tag-{kebab(key)}` CSS
 * custom properties, applied INLINE per-tag (not on a wrapper). Same
 * cascade-precedence reason as ChipPreview — saved overrides on
 * `.uxm-tag` would otherwise beat ancestor-inherited slider values.
 *
 * Per-size knobs (`smallPaddingX`, `mediumFontSize`, etc.) project as
 * `--uxm-tag-small-padding-x`, `--uxm-tag-medium-font-size`, etc. Each
 * size modifier rule reads its own namespace, so projecting all knobs
 * at once is safe — the inactive size's vars are simply unused.
 */
function stylesToCssVars(styles: PreviewProps['styles']): CSSProperties {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(styles)) {
    const cssVar = '--uxm-tag-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
    if (typeof value === 'boolean') {
      out[cssVar] = value ? '1' : '0';
    } else if (typeof value === 'number') {
      out[cssVar] = `${value}px`;
    } else {
      out[cssVar] = String(value);
    }
  }
  return out as CSSProperties;
}

export function TagPreview({ styles, variants }: PreviewProps) {
  const type = ((variants.type as string) ?? 'success') as TagType;
  const size = ((variants.size as string) ?? 'medium') as TagSize;
  const tagStyle = stylesToCssVars(styles);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Tag type={type} size={size} iconLeft={<CheckIcon />} style={tagStyle}>{SAMPLE_LABEL[type]}</Tag>
      <Tag type={type} size={size} style={tagStyle}>{SAMPLE_LABEL[type]}</Tag>
    </div>
  );
}
