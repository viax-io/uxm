import { useState } from 'react';

import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';

export function LifecycleConnectorKnobsPreview({ styles, variants }: PreviewProps) {
  const size = styles.size as number;
  const gap = styles.gap as number;
  const borderWidth = styles.borderWidth as number;
  const bg = styles.backgroundColor as string;
  const insertBorder = styles.insertBorderColor as string;
  const insertIcon = styles.insertIconColor as string;
  const editBorder = styles.editBorderColor as string;
  const editIcon = styles.editIconColor as string;
  const orientation = (variants.orientation as string) ?? 'horizontal';
  const isVertical = orientation === 'vertical';

  const [hoverInsert, setHoverInsert] = useState(false);
  const [hoverEdit, setHoverEdit] = useState(false);

  const circleStyle = (border: string, hover: boolean): React.CSSProperties => ({
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: bg,
    border: `${borderWidth}px solid ${border}`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.12s, box-shadow 0.12s',
    transform: hover ? 'scale(1.08)' : 'scale(1)',
    boxShadow: hover ? 'var(--shadow-sm)' : 'var(--shadow-xs)',
  });

  const iconSize = Math.round(size * 0.45);

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: isVertical ? 'column' : 'row',
        gap,
        padding: 12,
      }}
    >
      <button
        type="button"
        aria-label="Insert"
        onMouseEnter={() => setHoverInsert(true)}
        onMouseLeave={() => setHoverInsert(false)}
        style={circleStyle(insertBorder, hoverInsert)}
      >
        <Icon glyph="plus" size={iconSize} strokeWidth={2.5} style={{ color: insertIcon }} />
      </button>
      <button
        type="button"
        aria-label="Rename"
        onMouseEnter={() => setHoverEdit(true)}
        onMouseLeave={() => setHoverEdit(false)}
        style={circleStyle(editBorder, hoverEdit)}
      >
        {/* Visual delta accepted: registry has only outline `pencil`; the
            previous solid pencil is close enough for this preview. */}
        <Icon glyph="pencil" size={iconSize} style={{ color: editIcon }} />
      </button>
    </div>
  );
}
