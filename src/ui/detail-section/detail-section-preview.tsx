import type { PreviewProps } from '@/previews/types';
import { DetailSection } from '@/ui';
import { Icon } from '@/ui';

import type { CSSProperties } from 'react';

// The edge colours fall back to Border Color in the stylesheet. Projecting
// their registry default would pin them to --color-border and stop them
// following that knob, so they're projected only once set to something else.
// (An edge set to exactly var(--color-border) therefore previews as following
// Border Color; a save still writes it, since Studio stores the changed key.)
const edgeColor = (value: unknown) => (value && value !== 'var(--color-border)' ? (value as string) : undefined);

// Case and tracking: projected only once set. The stylesheet has no fallback
// for them (unset = inherit), so projecting the registry default would show
// `none` / `0em` where production inherits.
export function DetailSectionPreview({ styles }: PreviewProps) {
  // Each registry knob → matching CSS custom property; the preview consumes
  // the real component instead of reimplementing it inline.
  const cssVars = {
    '--uxm-detail-section-bg': styles.backgroundColor as string,
    '--uxm-detail-section-background': (styles.background as string) || undefined,
    '--uxm-detail-section-border-color': styles.borderColor as string,
    '--uxm-detail-section-border-top-width': `${styles.borderTopWidth}px`,
    '--uxm-detail-section-border-top-color': edgeColor(styles.borderTopColor),
    '--uxm-detail-section-border-bottom-width': `${styles.borderBottomWidth}px`,
    '--uxm-detail-section-border-bottom-color': edgeColor(styles.borderBottomColor),
    '--uxm-detail-section-radius': `${styles.borderRadius}px`,
    '--uxm-detail-section-padding': `${styles.padding}px`,
    '--uxm-detail-section-icon-bg': styles.iconBg as string,
    '--uxm-detail-section-icon-color': styles.iconColor as string,
    '--uxm-detail-section-title-size': `${styles.titleSize}px`,
    '--uxm-detail-section-title-text-transform': styles.titleTextTransform !== 'none' ? (styles.titleTextTransform as string) : undefined,
    '--uxm-detail-section-title-letter-spacing': styles.titleLetterSpacing ? `${styles.titleLetterSpacing}em` : undefined,
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
