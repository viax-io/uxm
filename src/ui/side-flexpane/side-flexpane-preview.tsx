import type { PreviewProps } from '@/previews/types';
import { ButtonPrimary, ButtonTertiary, Icon, IconButton, IconTile, SideFlexpane } from '@/ui';

import type { CSSProperties } from 'react';

/**
 * Preview renders the real shipped `<SideFlexpane>` atom, projecting each
 * registry knob onto its `--uxm-side-flexpane-*` custom property. It exercises
 * the extended surface — leading icon, subtitle, back-link, header actions,
 * and the expand toggle — while the left edge stays drag-resizable.
 */
export function SideFlexpanePreview({ styles }: PreviewProps) {
  const vars = {
    '--uxm-side-flexpane-width': `${styles.width}px`,
    '--uxm-side-flexpane-background-color': styles.backgroundColor,
    '--uxm-side-flexpane-border-color': styles.borderColor,
    '--uxm-side-flexpane-border-radius': `${styles.borderRadius}px`,
    '--uxm-side-flexpane-padding-x': `${styles.paddingX}px`,
    '--uxm-side-flexpane-padding-y': `${styles.paddingY}px`,
    '--uxm-side-flexpane-title-size': `${styles.titleSize}px`,
    '--uxm-side-flexpane-label-color': styles.labelColor,
  } as CSSProperties;

  return (
    <div style={{ display: 'flex', height: 420 }}>
      <SideFlexpane
        style={vars}
        eyebrow="Edit"
        title="Participants"
        subtitle="Business Interaction · 4 fields"
        icon={
          <IconTile>
            <Icon glyph="user" size={18} />
          </IconTile>
        }
        backLabel="All segments"
        onBack={() => {}}
        expandable
        actions={
          <IconButton aria-label="Delete">
            <Icon glyph="trash" size={16} />
          </IconButton>
        }
        onClose={() => {}}
        footer={
          <div style={{ display: 'flex', gap: 8 }}>
            <ButtonTertiary style={{ flex: 1 }}>Cancel</ButtonTertiary>
            <ButtonPrimary style={{ flex: 1 }}>Save</ButtonPrimary>
          </div>
        }
      >
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
          Panel body — scrolls independently of the header and footer. The left edge stays
          drag-resizable; the expand toggle maximises the pane to its expanded width.
        </p>
      </SideFlexpane>
    </div>
  );
}
