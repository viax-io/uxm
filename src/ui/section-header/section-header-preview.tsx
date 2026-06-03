import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';
import { InlineAction } from '@/ui';
import { SectionHeader } from '@/ui';

import type { CSSProperties } from 'react';

export function SectionHeaderPreview({ styles }: PreviewProps) {
  const cssVars = {
    '--uxm-section-header-title-color': styles.titleColor as string,
    '--uxm-section-header-title-size': `${styles.titleSize}px`,
    '--uxm-section-header-title-weight': styles.titleWeight as string,
    '--uxm-section-header-subtitle-color': styles.subtitleColor as string,
    '--uxm-section-header-subtitle-size': `${styles.subtitleSize}px`,
    '--uxm-section-header-gap': `${styles.gap}px`,
    '--uxm-section-header-margin-bottom': `${styles.marginBottom}px`,
    minWidth: 280,
  } as CSSProperties;

  return (
    <div style={cssVars}>
      <SectionHeader
        trailing={
          <InlineAction icon={<Icon glyph="refresh" strokeWidth={2.25} />}>
            Reset section
          </InlineAction>
        }
        subtitle={
          <>
            <span>Per Mode</span>
            <span>·</span>
            <span style={{ fontWeight: 600, color: 'var(--color-text-strong)' }}>Filter</span>
          </>
        }
      >
        Colors
      </SectionHeader>
    </div>
  );
}
