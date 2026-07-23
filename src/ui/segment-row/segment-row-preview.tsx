import { DemoRowActions } from '@/previews/demo-row-actions';
import type { PreviewProps } from '@/previews/types';
import { SegmentRow } from '@/ui';

import type { CSSProperties } from 'react';

/**
 * Preview renders the real shipped `<SegmentRow>` atom, projecting each
 * registry knob onto its `--uxm-segment-row-*` custom property so the studio
 * controls drive the component directly.
 */
export function SegmentRowPreview({ styles, variants }: PreviewProps) {
  const expanded = (variants.state as string) !== 'collapsed';

  const vars = {
    '--uxm-segment-row-padding-x': `${styles.paddingX}px`,
    '--uxm-segment-row-padding-y': `${styles.paddingY}px`,
    '--uxm-segment-row-gap': `${styles.gap}px`,
    '--uxm-segment-row-drag-color': styles.dragColor,
    '--uxm-segment-row-drag-hover-color': styles.dragHoverColor,
    '--uxm-segment-row-chevron-color': styles.chevronColor,
    '--uxm-segment-row-chevron-size': `${styles.chevronSize}px`,
    '--uxm-segment-row-accent-color': styles.accentColor,
    '--uxm-segment-row-accent-width': `${styles.accentWidth}px`,
    '--uxm-segment-row-accent-radius': `${styles.accentRadius}px`,
    '--uxm-segment-row-title-color': styles.titleColor,
    '--uxm-segment-row-title-size': `${styles.titleSize}px`,
    '--uxm-segment-row-title-weight': styles.titleWeight,
    '--uxm-segment-row-count-bg': styles.countBg,
    '--uxm-segment-row-count-color': styles.countColor,
    '--uxm-segment-row-count-size': `${styles.countSize}px`,
    '--uxm-segment-row-count-padding-x': `${styles.countPaddingX}px`,
    '--uxm-segment-row-count-padding-y': `${styles.countPaddingY}px`,
    '--uxm-segment-row-count-radius': `${styles.countRadius}px`,
    '--uxm-segment-row-row-hover-bg': styles.rowHoverBg,
    '--uxm-segment-row-row-hover-radius': `${styles.rowHoverRadius}px`,
  } as CSSProperties;

  return (
    <div style={{ width: 480 }}>
      <SegmentRow
        key={expanded ? 'expanded' : 'collapsed'}
        name="Practice Information"
        count={6}
        dragHandle
        defaultOpen={expanded}
        actions={DemoRowActions}
        style={vars}
      />
    </div>
  );
}
