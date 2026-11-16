import type { PreviewProps } from '@/previews/types';
import { ButtonPrimary, Icon, MediaObject } from '@/ui';

import type { CSSProperties } from 'react';

/**
 * A hero in the workbench: an illustration beside a heading, a line of copy and
 * a call to action. The Media Position, Align and Media Width variants switch
 * the props; the canvas is wide, so it shows the side-by-side layout.
 */
export function MediaObjectPreview({ styles, variants }: PreviewProps) {
  const position = ((variants.mediaPosition as string) ?? 'end') as
    'start' | 'end';
  const align = ((variants.align as string) ?? 'center') as
    'start' | 'center' | 'end';
  const width = (variants.mediaWidth as string) ?? '40%';
  const media = (
    <div
      style={{
        aspectRatio: '4 / 3',
        borderRadius: 12,
        background: 'var(--color-accent-subtle)',
        color: 'var(--color-accent-bold)',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Icon glyph="sparkle" size={56} strokeWidth={1.25} aria-hidden />
    </div>
  );
  // An explicit width: the canvas centres its content in a shrink-to-fit box,
  // and a size container contributes no width of its own (see the README).
  return (
    <div style={{ width: 720, maxWidth: '100%' }}>
      <MediaObject
        media={media}
        mediaPosition={position}
        align={align}
        mediaWidth={width}
        style={{ '--uxm-media-object-gap': `${styles.gap}px` } as CSSProperties}
      >
        <h2 style={{ margin: 0, fontSize: 22, color: 'var(--color-text)' }}>
          Good morning, Dr. Smith
        </h2>
        <p
          style={{
            margin: '8px 0 16px',
            color: 'var(--color-text-muted)',
            fontSize: 14,
          }}
        >
          Two chairs are due for service this month.
        </p>
        <ButtonPrimary>Book a visit</ButtonPrimary>
      </MediaObject>
    </div>
  );
}
