import type { PreviewProps } from '@/previews/types';
import { DetailSection } from '@/ui';
import { Icon } from '@/ui';

import type { CSSProperties } from 'react';

export function DetailSectionPreview({ styles }: PreviewProps) {
  // Each registry knob → matching CSS custom property; the preview consumes
  // the real component instead of reimplementing it inline.
  const cssVars = {
    '--uxm-detail-section-bg': styles.backgroundColor as string,
    '--uxm-detail-section-border-color': styles.borderColor as string,
    '--uxm-detail-section-radius': `${styles.borderRadius}px`,
    '--uxm-detail-section-padding': `${styles.padding}px`,
    '--uxm-detail-section-icon-bg': styles.iconBg as string,
    '--uxm-detail-section-icon-color': styles.iconColor as string,
    '--uxm-detail-section-title-size': `${styles.titleSize}px`,
    '--uxm-detail-section-subtitle-color': styles.subtitleColor as string,
    '--uxm-detail-section-accent-width': `${styles.accentWidth}px`,
    '--uxm-detail-section-accent-color': styles.accentColor as string,
    width: 420,
  } as CSSProperties;

  return (
    <DetailSection
      style={cssVars}
      icon={<Icon glyph="menu" size={18} strokeWidth={1.5} />}
      title="Revenue Motions"
      subtitle="3 active configurations"
    >
      Defines how revenue is recognised across the customer lifecycle.
    </DetailSection>
  );
}
