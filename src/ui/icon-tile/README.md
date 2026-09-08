# IconTile

A small, rounded, coloured square that wraps an icon — the recurring "row icon" / "type chip" tile seen in front of list items, cards, and chips. Encapsulates rounded-square + flex-centering + tinted-background so the pattern stops drifting across templates.

`IconTile` takes the icon as a child rather than a glyph prop, so callers retain full control over which icon (and at what size) sits inside the tile. The `size`, `iconBg`, and `iconColor` props are projected to CSS custom properties on the root element so per-instance overrides compose cleanly with global defaults.

## Usage

```tsx
import { IconTile, Icon } from '@viax.io/uxm';

function Example() {
  return (
    <IconTile size={28} iconBg="var(--color-accent-subtle)" iconColor="var(--color-accent-bold)">
      <Icon glyph="folder" size={14} />
    </IconTile>
  );
}
```

## Props

### `IconTileProps`

Extends `HTMLAttributes<HTMLSpanElement>` — any standard span attribute (id, style, data-*, aria-*, onClick) is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** The icon to render — typically `<Icon glyph="…" size={14} />`. |
| `size` | `number` | `28` | Tile width and height in pixels. Projected as `--uxm-icon-tile-size`. |
| `iconBg` | `string` | – | Per-instance background override. Any CSS colour value (`var(--…)`, hex, etc.). Falls back to `--color-surface-alt`. |
| `iconColor` | `string` | – | Per-instance foreground override (applied via `color`, inherited by the inner icon as `currentColor`). Falls back to `--color-text-muted`. |
| `style` | `CSSProperties` | – | Merged after the CSS custom properties — any keys you set here win. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native span attribute)_ | – | – | Spread onto the root `<span>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-icon-tile-size` | – | `28px` | Tile width and height. |
| `--uxm-icon-tile-radius` | – | `6px` | Corner radius. |
| `--uxm-icon-tile-bg` | `--color-surface-alt` | – | Tile background. |
| `--uxm-icon-tile-color` | `--color-text-muted` | – | Icon colour (via `currentColor`). |

The `iconBg` / `iconColor` props set `--uxm-icon-tile-bg` and `--uxm-icon-tile-color` inline on the root. Set them on a parent scope instead for project-wide theming.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-surface-alt` | Surfaces / Surface Alt | Default tile background. |
| `--color-text-muted` | Text / Text Muted | Default icon colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Surface-alt background, muted icon, 28×28, 6px radius. |
| Custom tint | `iconBg` / `iconColor` provided | Inline CSS vars override the fallbacks (use for category-coloured tiles). |
| Sized | `size` prop | `--uxm-icon-tile-size` set inline; tile remains square. |

The tile itself has no interactive states — wrap it in an `IconButton` or `<a>` if you need clickability.

## Accessibility

- The root is a `<span>` — purely presentational and not in the tab order. If the tile represents an actionable element (e.g. a category filter), wrap it in an `IconButton` or `<button>`/`<a>` and supply an `aria-label`.
- The inner `Icon` inherits its own `aria-label` from the registry. For tiles that already have a labelled wrapper, mark the icon `aria-hidden="true"` to avoid double-announcement.
- Background/foreground combinations chosen by the consumer must meet WCAG contrast where the icon carries meaning. Default `surface-alt` + `text-muted` is intentionally low-contrast and best paired with a labelled sibling.
- `flex-shrink: 0` is enforced so the tile never collapses inside flex rows — keeps row-icon alignment stable when sibling text wraps.
