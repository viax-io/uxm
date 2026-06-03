import type { PreviewProps } from '@/previews/types';
import { Thumbnail, type ThumbnailFit } from '@/ui';

import type { CSSProperties } from 'react';

function stylesToCssVars(styles: PreviewProps['styles']): CSSProperties {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(styles)) {
    const cssVar = '--uxm-thumbnail-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
    if (typeof value === 'boolean') {
      out[cssVar] = value ? '1' : '0';
    } else if (typeof value === 'number') {
      out[cssVar] = `${value}px`;
    } else {
      out[cssVar] = String(value);
    }
  }
  return out as CSSProperties;
}

// Neutral grey landscape, 16:10 — wider than a square frame so `cover` (crop)
// and `contain` (letterbox) render visibly different against the frame's bg.
// `encodeURIComponent` handles `#` escaping; don't pre-escape in the source.
const SAMPLE_SRC =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 200'>
      <rect width='320' height='200' fill='#e5e7eb'/>
      <circle cx='240' cy='60' r='22' fill='#9ca3af'/>
      <polygon points='0,140 80,80 140,120 200,70 260,110 320,80 320,200 0,200' fill='#9ca3af' opacity='0.75'/>
      <polygon points='40,170 110,115 160,150 220,105 260,135 320,115 320,200 0,200' fill='#6b7280'/>
    </svg>`,
  );

export function ThumbnailPreview({ styles, variants }: PreviewProps) {
  const fit = ((variants.fit as string) ?? 'cover') as ThumbnailFit;
  const state = (variants.state as string) ?? 'image';
  const thumbStyle = stylesToCssVars(styles);

  if (state === 'placeholder') {
    return <Thumbnail style={thumbStyle} />;
  }

  return <Thumbnail src={SAMPLE_SRC} alt="Sample" fit={fit} style={thumbStyle} />;
}
