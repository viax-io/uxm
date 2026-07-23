import { useState } from 'react';

import type { PreviewProps } from '@/previews/types';
import { Icon, IconButton, OptionList } from '@/ui';

import type { CSSProperties } from 'react';

/**
 * Preview renders the real shipped `<OptionList>` atom, projecting each
 * registry knob onto its `--uxm-option-list-*` custom property. `rowActions`
 * supplies a hover-revealed delete button, wired to local state so it actually
 * removes a row on the canvas. The bullet colour is inherited from the parent
 * component's icon tint at runtime; a sample tint is set here.
 */
const INITIAL_OPTIONS = [
  { id: 'sfh', label: 'Single Family Home' },
  { id: 'mf', label: 'Multi Family' },
  { id: 'th', label: 'Townhouse' },
  { id: 'condo', label: 'Condo' },
];

export function OptionListPreview({ styles }: PreviewProps) {
  const [options, setOptions] = useState(INITIAL_OPTIONS);

  const vars = {
    '--uxm-option-list-indent': `${styles.indent}px`,
    '--uxm-option-list-background': styles.backgroundColor,
    '--uxm-option-list-border-color': styles.borderColor,
    '--uxm-option-list-border-width': `${styles.borderWidth}px`,
    '--uxm-option-list-border-radius': `${styles.borderRadius}px`,
    '--uxm-option-list-padding-x': `${styles.paddingX}px`,
    '--uxm-option-list-padding-y': `${styles.paddingY}px`,
    '--uxm-option-list-gap': `${styles.gap}px`,
    '--uxm-option-list-row-padding-x': `${styles.rowPaddingX}px`,
    '--uxm-option-list-row-padding-y': `${styles.rowPaddingY}px`,
    '--uxm-option-list-drag-color': styles.dragColor,
    '--uxm-option-list-drag-hover-color': styles.dragHoverColor,
    '--uxm-option-list-bullet-size': `${styles.bulletSize}px`,
    '--uxm-option-list-bullet-gap': `${styles.bulletGap}px`,
    '--uxm-option-list-name-color': styles.nameColor,
    '--uxm-option-list-name-size': `${styles.nameSize}px`,
    '--uxm-option-list-name-weight': styles.nameWeight,
    '--uxm-option-list-row-hover-bg': styles.rowHoverBg,
    '--uxm-option-list-row-hover-radius': `${styles.rowHoverRadius}px`,
    // Sample bullet tint (runtime-inherited from the parent component's icon).
    '--uxm-option-list-bullet-color': 'color-mix(in srgb, var(--color-highlight-cool) 40%, transparent)',
  } as CSSProperties;

  return (
    <div style={{ width: 480 }}>
      <OptionList
        options={options}
        style={vars}
        rowActions={(_item, i) => (
          <IconButton
            aria-label="Delete option"
            onClick={() => setOptions((prev) => prev.filter((_, idx) => idx !== i))}
          >
            <Icon glyph="trash" size={14} />
          </IconButton>
        )}
      />
    </div>
  );
}
