import type { PreviewProps } from '@/previews/types';
import { ConfigComponentRow, Icon, SegmentTreeRow } from '@/ui';

import type { CSSProperties } from 'react';

/**
 * Preview renders the real shipped `<SegmentTreeRow>` atom (not a hand-rolled
 * mock), projecting each registry knob onto its `--uxm-segment-tree-row-*`
 * custom property so the studio controls drive the component directly.
 */
const SAMPLE = [
  { name: 'Practice Name', type: 'Text', glyph: 'square' },
  { name: 'Practice Type', type: 'Options', glyph: 'list' },
  { name: 'Number of Operatories', type: 'Number', glyph: 'grid' },
];

export function SegmentTreeRowPreview({ styles, variants }: PreviewProps) {
  const expanded = (variants.state as string) !== 'collapsed';

  const vars = {
    '--uxm-segment-tree-row-background-color': styles.backgroundColor,
    '--uxm-segment-tree-row-border-color': styles.borderColor,
    '--uxm-segment-tree-row-border-radius': `${styles.borderRadius}px`,
    '--uxm-segment-tree-row-accent-color': styles.accentColor,
    '--uxm-segment-tree-row-accent-width': `${styles.accentWidth}px`,
    '--uxm-segment-tree-row-accent-height': `${styles.accentHeight}px`,
    '--uxm-segment-tree-row-title-size': `${styles.titleSize}px`,
    '--uxm-segment-tree-row-title-color': styles.titleColor,
    '--uxm-segment-tree-row-count-badge-bg': styles.countBadgeBg,
    '--uxm-segment-tree-row-count-badge-text': styles.countBadgeText,
    '--uxm-segment-tree-row-padding-x': `${styles.paddingX}px`,
    '--uxm-segment-tree-row-padding-y': `${styles.paddingY}px`,
  } as CSSProperties;

  return (
    <div style={{ width: 460 }}>
      {/* Uncontrolled + keyed on the variant: the State knob re-seeds the
          initial open state, while the caret stays interactive in the canvas. */}
      <SegmentTreeRow
        key={expanded ? 'expanded' : 'collapsed'}
        name="Practice Information"
        count={SAMPLE.length}
        dragHandle
        defaultOpen={expanded}
        style={vars}
      >
        {SAMPLE.map((c) => (
          <ConfigComponentRow
            key={c.name}
            icon={<Icon glyph={c.glyph} size={16} />}
            name={c.name}
            type={c.type}
          />
        ))}
      </SegmentTreeRow>
    </div>
  );
}
