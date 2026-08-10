import { useState } from 'react';

import type { PreviewProps } from '@/previews/types';
import { Icon, ICONS, InputWithIcon } from '@/ui';

import type { CSSProperties } from 'react';

/**
 * Renders the WHOLE icon set as a labelled, searchable grid rather than a
 * single glyph behind a select — so the panel answers "which icons exist
 * and what are they called" at a glance, and stays usable as the set grows.
 * Each cell shows the real <Icon> atom (so both path- and body-based glyphs
 * render) above its `id` — the exact string you pass to `glyph=` — with the
 * human label as a tooltip. The search filters on both id and label.
 *
 * Relies on the registry's `canvasFill` so the canvas fills width + top-
 * aligns: the grid flows a flexible column count with the pane width, and
 * typing in the search filters the grid in place — the block stays anchored
 * to the top instead of re-centring and jumping as the result count changes.
 *
 * The size / stroke / colour knobs tune every icon at once. Colour flows
 * through the atom's own `--uxm-icon-color` re-theme surface (the same
 * variable a production consumer would set); Icon's stroke defaults to
 * `currentColor`, so the wrapper colour is enough.
 */
export function IconPreview({ styles }: PreviewProps) {
  const size = styles.size as number;
  const strokeWidth = styles.strokeWidth as number;
  const color = styles.color as string;

  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const matches = q
    ? ICONS.filter((d) => d.id.toLowerCase().includes(q) || d.label.toLowerCase().includes(q))
    : ICONS;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Search + count sit directly on the canvas above the grid — no bar,
          no sticky. Top-aligned (via the def's canvasFill) so typing filters
          the grid in place without the block re-centring. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <InputWithIcon
          type="search"
          icon={<Icon glyph="search" size={16} />}
          placeholder="Search icons…"
          aria-label="Search icons"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
        />
        {/* Live region: filtering is a purely visual change to the grid below,
            so without this a screen-reader user typing in the search gets no
            feedback that anything happened. `polite` waits for a pause rather
            than interrupting each keystroke. */}
        <div
          role="status"
          aria-live="polite"
          style={{ fontSize: 12, color: 'var(--color-text-muted)' }}
        >
          {matches.length === ICONS.length
            ? `${ICONS.length} icons`
            : `${matches.length} of ${ICONS.length} icons`}
        </div>
      </div>

      {matches.length === 0 ? (
        <div style={{ fontSize: 13, color: 'var(--color-text-muted)', padding: '24px 0' }}>
          No icons match “{query.trim()}”.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            // Flexible: auto-fill packs as many ≥88px cells as the pane width
            // allows and reflows as it changes — no fixed column count/width.
            gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
            gap: 8,
            width: '100%',
          }}
        >
          {matches.map((def) => (
            <div
              key={def.id}
              title={def.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: '14px 8px',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                backgroundColor: 'var(--color-card)',
                minWidth: 0,
              }}
            >
              <Icon
                glyph={def.id}
                size={size}
                strokeWidth={strokeWidth}
                style={{ ['--uxm-icon-color' as string]: color } as CSSProperties}
              />
              <code
                style={{
                  // Wrap (don't ellipsis) so the full glyph id — the exact
                  // string you pass to `glyph=` — is always readable, even long
                  // ones like `question-mark-circle`. Label rides `title`.
                  maxWidth: '100%',
                  overflowWrap: 'anywhere',
                  textAlign: 'center',
                  lineHeight: 1.3,
                  fontSize: 11,
                  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                  color: 'var(--color-text-muted)',
                }}
              >
                {def.id}
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
