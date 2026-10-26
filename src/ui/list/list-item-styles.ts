import type { CSSProperties } from 'react';

// Pure data, no component and no state, in its own module on purpose: the CDN
// studio bundle (tsup.cdn.config.ts) points every other `src/ui` module at the
// shared `uxm.esm.js`, but these two are not on the public `/ui` surface, and
// the studio preview (list-item-preview.tsx) needs them. A module of plain
// style objects is safe to duplicate into that bundle; list.tsx is not.

/**
 * Forward the studio icon knobs (projected as `--uxm-list-item-icon-*` on the
 * row) into the `IconTile` atom's own var namespace, so the accent-tile
 * pattern lives in one place — the `IconTile` atom — instead of being
 * re-implemented in `list.scss`. The glyph tracks the tile at 0.6× (the
 * row-icon proportion used across the design system). Kept as a module
 * constant so the studio preview can reuse the exact same forwarding.
 */
export const LIST_ITEM_ICON_TILE_STYLE = {
  '--uxm-icon-tile-bg': 'var(--uxm-list-item-icon-bg, var(--color-accent))',
  '--uxm-icon-tile-color': 'var(--uxm-list-item-icon-color, var(--color-card))',
  '--uxm-icon-tile-size': 'var(--uxm-list-item-icon-size, 24px)',
  '--uxm-icon-tile-radius': 'var(--uxm-list-item-icon-radius, 6px)',
  '--uxm-icon-tile-icon-size': 'calc(var(--uxm-list-item-icon-size, 24px) * 0.6)',
} as CSSProperties;

/**
 * Forward the row's media-size knob into the size vars of the atoms that
 * plausibly fill the `media` slot, so each one sizes itself through its OWN
 * machinery — frame, border, radius and inner glyph / initials all scale with
 * it — instead of being stretched from the outside. Mirrors
 * `LIST_ITEM_ICON_TILE_STYLE` above, and is the only order-independent fix:
 * both `Thumbnail` (`.uxm-thumbnail`, 0,1,0 but imported AFTER list in
 * `styles.css`) and `Avatar` (double-class size presets at 0,2,0, deliberately
 * so per its own note) would otherwise win or lose the cascade against a slot
 * rule purely on stylesheet order. The generic `> *` stretch in `list.scss`
 * stays as the fallback for a bare `<img>` / `<svg>` or any atom with no size
 * var of its own; both mechanisms resolve to the same number. Kept as a module
 * constant so the studio preview can reuse the exact same forwarding.
 */
export const LIST_ITEM_MEDIA_STYLE = {
  '--uxm-thumbnail-size': 'var(--uxm-list-item-media-size, 36px)',
  '--uxm-avatar-size': 'var(--uxm-list-item-media-size, 36px)',
  '--uxm-avatar-small-size': 'var(--uxm-list-item-media-size, 36px)',
} as CSSProperties;
