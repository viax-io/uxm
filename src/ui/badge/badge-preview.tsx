import type { PreviewProps } from '@/previews/types';
import { Badge, type BadgeMode, type BadgeType } from '@/ui';

import type { CSSProperties } from 'react';

function stylesToCssVars(styles: PreviewProps['styles']): CSSProperties {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(styles)) {
    const cssVar = '--uxm-badge-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
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

export function BadgePreview({ styles, variants }: PreviewProps) {
  const mode = ((variants.mode as string) ?? 'count') as BadgeMode;
  const type = ((variants.type as string) ?? 'danger') as BadgeType;
  const badgeStyle = stylesToCssVars(styles);

  if (mode === 'dot') {
    return (
      <Badge mode="dot" type={type} style={badgeStyle}>
        Online
      </Badge>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Badge mode="count" type={type} count={3} style={badgeStyle} />
      <Badge mode="count" type={type} count={42} style={badgeStyle} />
      <Badge mode="count" type={type} count={128} style={badgeStyle} />
    </div>
  );
}
