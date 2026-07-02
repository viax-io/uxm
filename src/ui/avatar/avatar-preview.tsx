import type { PreviewProps } from '@/previews/types';
import { Avatar, type AvatarType } from '@/ui';

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
  const size = (styles.size as number) ?? 40;

  const sharedStyle = {
    width: size,
    height: size,
    '--uxm-avatar-border-radius': `${styles.borderRadius as number}px`,
    '--uxm-avatar-background-color': styles.backgroundColor as string,
    '--uxm-avatar-border-color': styles.borderColor as string,
    '--uxm-avatar-border-width': `${styles.borderWidth as number}px`,
    '--uxm-avatar-color': styles.color as string,
    '--uxm-avatar-font-size': `${styles.fontSize as number}px`,
    '--uxm-avatar-font-weight': styles.fontWeight as string,
  } as CSSProperties;

  if (type === 'image') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Avatar type="image" src={SAMPLE_LOGO} alt="MedTech" initials="MT" style={sharedStyle} />
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
          <Avatar initials={a.initials} style={sharedStyle} />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{a.name}</span>
        </div>
      ))}
    </div>
  );
}
