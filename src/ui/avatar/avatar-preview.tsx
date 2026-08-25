import type { PreviewProps } from '@/previews/types';
import { Avatar, type AvatarSize, type AvatarType } from '@/ui';

import type { CSSProperties } from 'react';

const TEXT_AVATARS = [
  { initials: 'SC', name: 'Sarah Chen' },
  { initials: 'MR', name: 'Marcus Rivera' },
  { initials: 'EZ', name: 'Emily Zhao' },
];

// Transparent-background SVG so the Avatar's `backgroundColor` knob remains
// visible in the editor preview. Mirrors the common brand-logo pattern:
// monochrome glyph on top of a tinted frame controlled by the bg knob.
// `encodeURIComponent` handles `#` escaping; don't pre-escape in the source.
const SAMPLE_LOGO = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'>
    <circle cx='40' cy='32' r='12' fill='#1f2937'/>
    <path d='M 16 70 Q 16 50 40 50 Q 64 50 64 70 Z' fill='#1f2937'/>
  </svg>`,
);

export function AvatarPreview({ styles, variants }: PreviewProps) {
  const type = ((variants.type as string) ?? 'text') as AvatarType;
  const sizePreset = ((variants.sizePreset as string) ?? 'medium') as AvatarSize;
  // The inline `width`/`height` below deliberately out-specifies the preset's
  // class (see avatar.scss), so it has to READ the active preset's knobs —
  // otherwise switching to Small would change the class and nothing visible.
  const size = (sizePreset === 'small' ? (styles.smallSize as number) : (styles.size as number)) ?? 40;
  const fontSize = (sizePreset === 'small' ? (styles.smallFontSize as number) : (styles.fontSize as number)) ?? 16;

  const sharedStyle = {
    width: size,
    height: size,
    '--uxm-avatar-border-radius': `${styles.borderRadius as number}px`,
    '--uxm-avatar-background-color': styles.backgroundColor as string,
    '--uxm-avatar-border-color': styles.borderColor as string,
    '--uxm-avatar-border-width': `${styles.borderWidth as number}px`,
    '--uxm-avatar-color': styles.color as string,
    // Keyed per preset. `--small` reads `--uxm-avatar-small-font-size`, so
    // writing the generic var while Small is active left the knob inert — the
    // avatar just kept whatever that other var resolved to. Branching here also
    // matches what a SAVED brand emits (generate-css maps `fontSize` to the
    // generic var and kebab-falls `smallFontSize` to the small one), so the
    // preview exercises the production path instead of a parallel one.
    [(sizePreset === 'small'
      ? '--uxm-avatar-small-font-size'
      : '--uxm-avatar-font-size') as string]: `${fontSize}px`,
    '--uxm-avatar-font-weight': styles.fontWeight as string,
  } as CSSProperties;

  if (type === 'image') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Avatar type="image" size={sizePreset} src={SAMPLE_LOGO} alt="MedTech" initials="MT" style={sharedStyle} />
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>MedTech</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {TEXT_AVATARS.map((a) => (
        <div
          key={a.initials}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <Avatar initials={a.initials} size={sizePreset} style={sharedStyle} />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{a.name}</span>
        </div>
      ))}
    </div>
  );
}
