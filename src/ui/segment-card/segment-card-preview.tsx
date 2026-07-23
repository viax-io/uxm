import { useState } from 'react';

import { DemoRowActions } from '@/previews/demo-row-actions';
import type { PreviewProps } from '@/previews/types';
import { ComponentRow, Icon, OptionList, SegmentCard, SegmentRow } from '@/ui';

import type { CSSProperties, ReactNode } from 'react';

/**
 * SegmentCard is the segment-tree container: it wraps a SegmentRow header
 * over an inset body built from the sibling
 * building blocks — ComponentRow, OptionList, and nested SegmentCards. This
 * preview projects the SegmentCard knobs onto the outer card (they cascade to
 * the nested card) and composes a real, collapsible segment tree.
 */
const OPTIONS = [{ label: 'General Dentistry' }, { label: 'Orthodontics' }, { label: 'Oral Surgery' }];

/** A collapsible segment: SegmentRow header wired to hide/show the body. */
function Segment({
  name,
  count,
  vars,
  children,
}: {
  name: string;
  count: number;
  vars?: CSSProperties;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <SegmentCard
      style={vars}
      header={<SegmentRow name={name} count={count} dragHandle open={open} onOpenChange={setOpen} actions={DemoRowActions} />}
    >
      {open ? children : null}
    </SegmentCard>
  );
}

export function SegmentCardPreview({ styles }: PreviewProps) {
  const vars = {
    '--uxm-segment-card-background': styles.backgroundColor,
    '--uxm-segment-card-border-color': styles.borderColor,
    '--uxm-segment-card-border-width': `${styles.borderWidth}px`,
    '--uxm-segment-card-border-radius': `${styles.borderRadius}px`,
    '--uxm-segment-card-padding-x': `${styles.paddingX}px`,
    '--uxm-segment-card-padding-y': `${styles.paddingY}px`,
    '--uxm-segment-card-children-inset-x': `${styles.childrenInsetX}px`,
    '--uxm-segment-card-children-inset-y': `${styles.childrenInsetY}px`,
    '--uxm-segment-card-children-gap': `${styles.childrenGap}px`,
    '--uxm-segment-card-divider-color': styles.dividerColor,
    '--uxm-segment-card-divider-width': `${styles.dividerWidth}px`,
  } as CSSProperties;

  return (
    <div style={{ width: 520 }}>
      <Segment name="Practice Information" count={4} vars={vars}>
        <ComponentRow
          icon={<Icon glyph="square" size={14} />}
          name="Practice Name"
          type="Text"
          iconBg="color-mix(in srgb, var(--color-accent-light) 24%, transparent)"
          iconColor="var(--color-accent-bold)"
          dragHandle
        />
        <ComponentRow
          icon={<Icon glyph="list" size={14} />}
          name="Practice Type"
          type="Predefined Options"
          chevron
          open
          iconBg="color-mix(in srgb, var(--color-highlight-cool) 20%, transparent)"
          iconColor="var(--color-on-highlight-cool)"
          dragHandle
        />
        <OptionList options={OPTIONS} />

        {/* A nested segment reuses the same SegmentCard container. */}
        <Segment name="Location Details" count={2}>
          <ComponentRow
            icon={<Icon glyph="square" size={14} />}
            name="Address"
            type="Address"
            iconBg="color-mix(in srgb, var(--color-highlight-warm) 28%, transparent)"
            iconColor="var(--color-on-highlight-warm)"
            dragHandle
          />
          <ComponentRow
            icon={<Icon glyph="grid" size={14} />}
            name="Operating Hours"
            type="Range"
            iconBg="color-mix(in srgb, var(--color-accent-light) 24%, transparent)"
            iconColor="var(--color-accent-bold)"
            dragHandle
          />
        </Segment>
      </Segment>
    </div>
  );
}
