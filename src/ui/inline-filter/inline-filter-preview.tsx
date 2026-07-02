import { useState } from 'react';

import type { PreviewProps } from '@/previews/types';
import { Chip } from '@/ui';
import { Icon } from '@/ui';
import { InlineFilter } from '@/ui';
import { InputWithIcon } from '@/ui';

import type { CSSProperties } from 'react';

const FILTERS = ['All', 'Active', 'Draft', 'Archived'];

/**
 * Real atomic composition: InlineFilter's slots receive UXM atoms —
 *   `search`  → <InputWithIcon>      (atom owns its theming)
 *   `filters` → <Chip mode="filter"> (atom owns its theming)
 *
 * The chip-shape knobs that used to live in InlineFilter's registry are
 * gone; theming filter chips happens on the Chip atom's registry, and
 * those changes flow into every consumer (this preview included)
 * automatically — that's the whole point of the atomic split.
 *
 * InlineFilter's only remaining knob is `gap` (the spacing between the
 * three slots), which is a real CSS property.
 */
export function InlineFilterPreview({ styles }: PreviewProps) {
  const [active, setActive] = useState<string | null>('Active');
  const [search, setSearch] = useState('');

  return (
    <div style={{ width: 500 }}>
      <InlineFilter
        style={{ '--uxm-inline-filter-gap': `${styles.gap}px` } as CSSProperties}
        search={
          <InputWithIcon
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Icon glyph="search" size={14} strokeWidth={1.5} />}
          />
        }
        filters={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FILTERS.map((label) => (
              <Chip
                key={label}
                mode="filter"
                selected={active === label}
                onClick={() => setActive((curr) => (curr === label ? null : label))}
              >
                {label}
              </Chip>
            ))}
          </div>
        }
      />
    </div>
  );
}
