import type { PreviewProps } from '@/previews/types';
import { ButtonPrimary, ButtonTertiary } from '@/ui';
import { Icon } from '@/ui';
import { PageHeader } from '@/ui';
import { Tag } from '@/ui';

import type { CSSProperties } from 'react';

/** `iconGlyphSize`'s registry default — see the note on the knob below. */
const ICON_GLYPH_DEFAULT = 14;

export function PageHeaderPreview({ styles }: PreviewProps) {
  // Each registry knob → matching CSS custom property; the preview consumes
  // the real component, so the title's line height and the tile's glyph size
  // paint through page-header.scss exactly as they do in an app.
  const cssVars = {
    '--uxm-page-header-title-color': styles.titleColor as string,
    '--uxm-page-header-title-size': `${styles.titleSize}px`,
    '--uxm-page-header-title-line-height': String(styles.titleLineHeight),
    '--uxm-page-header-meta-color': styles.metaColor as string,
    '--uxm-page-header-meta-size': `${styles.metaSize}px`,
    '--uxm-page-header-icon-bg': styles.iconBg as string,
    '--uxm-page-header-icon-color': styles.iconColor as string,
    '--uxm-page-header-icon-size': `${styles.iconSize}px`,
    // Omitted at the registry default so the fallback chain stays live in the
    // canvas. The chain is `page-header knob → --uxm-icon-tile-icon-size → 14px`,
    // and an inline value satisfies the first var, so projecting 14px
    // unconditionally pinned the glyph: with the global `icon-tile` Icon Size
    // set to 20px an app painted 20px while the workbench painted 14px. That
    // is the divergence the `titleLineHeight` select exists to avoid, and this
    // knob fell into it. Omitting at the default costs nothing, because Studio
    // already deletes an override equal to its default.
    ...(styles.iconGlyphSize === ICON_GLYPH_DEFAULT
      ? {}
      : { '--uxm-page-header-icon-glyph-size': `${styles.iconGlyphSize}px` }),
    '--uxm-page-header-gap': `${styles.gap}px`,
    '--uxm-page-header-padding-x': `${styles.paddingX}px`,
    '--uxm-page-header-padding-y': `${styles.paddingY}px`,
    width: 520,
  } as CSSProperties;

  return (
    <PageHeader
      style={cssVars}
      icon={<Icon glyph="chat-bubble" strokeWidth={1.5} />}
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          Billing Automation
          <Tag type="accent" size="small">Active</Tag>
        </span>
      }
      meta="End-to-end invoicing across subscription and usage plans"
      actions={
        <>
          <ButtonTertiary>Edit</ButtonTertiary>
          <ButtonPrimary>Publish</ButtonPrimary>
        </>
      }
    />
  );
}
