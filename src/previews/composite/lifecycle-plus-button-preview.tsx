import { useState } from 'react';

import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';

export function LifecyclePlusButtonPreview({ styles }: PreviewProps) {
  const [hover, setHover] = useState(false);
  const size = styles.size as number;
  const iconSize = styles.iconSize as number;
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        backgroundColor: hover ? (styles.hoverBackgroundColor as string) : (styles.backgroundColor as string),
        color: styles.color as string,
        border: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
        transition: 'background-color 0.15s, transform 0.15s',
        transform: hover ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      <Icon glyph="plus" size={iconSize} strokeWidth={2.5} />
    </button>
  );
}
