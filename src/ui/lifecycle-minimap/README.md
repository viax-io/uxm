# LifecycleMinimap

A bird's-eye overview of a lifecycle canvas — a fixed-size frame containing scaled node rectangles, edge lines, and an optional viewport overlay.

`LifecycleMinimap` accepts node and edge data in normalised 0–1 coordinates so the same dataset works at any minimap size: the consumer picks dimensions and the component scales internally. Nodes render as small filled rectangles, edges as straight lines between node centres, and an optional `viewport` rectangle overlays the area currently visible in the main canvas. Visuals (background, node fill, edge stroke, viewport frame) are themable via `--uxm-lifecycle-minimap-*` custom properties. Sibling of `LifecycleConnector`, `LifecycleEdgeLabel`, `LifecycleNodeCard`, `LifecycleTerminal`, and `LifecycleZoomControl`.

## Usage

```tsx
import { LifecycleMinimap } from '@viax/uxm';

function CanvasMinimap() {
  const nodes = [
    { x: 0.5, y: 0.15, w: 0.3, h: 0.12 },
    { x: 0.5, y: 0.45, w: 0.3, h: 0.12 },
    { x: 0.25, y: 0.8, w: 0.3, h: 0.12 },
    { x: 0.75, y: 0.8, w: 0.3, h: 0.12 },
  ];
  const edges: [number, number][] = [[0, 1], [1, 2], [1, 3]];
  const viewport = { x: 0.2, y: 0.3, w: 0.5, h: 0.5 };

  return (
    <LifecycleMinimap
      width={240}
      height={104}
      nodes={nodes}
      edges={edges}
      viewport={viewport}
    />
  );
}
```

## Props

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute (id, style, data-*, aria-*) is forwarded to the root wrapper. `width` / `height` are applied via inline style and merged with any consumer `style`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `240` | Total width in pixels. |
| `height` | `number` | `104` | Total height in pixels. |
| `nodes` | `LifecycleMinimapNode[]` | – | **Required.** Nodes to render as small filled rectangles. |
| `edges` | `[number, number][]` | – | **Required.** Pairs of node indices `[a, b]` to draw a line between (uses node centres). |
| `viewport` | `LifecycleMinimapViewport` | – | Optional viewport-frame overlay showing where the user is currently scrolled. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

### `LifecycleMinimapNode`

| Field | Type | Description |
|-------|------|-------------|
| `x` | `number` | Centre X in 0–1 space. |
| `y` | `number` | Centre Y in 0–1 space. |
| `w` | `number` | Width in 0–1 space. |
| `h` | `number` | Height in 0–1 space. |

### `LifecycleMinimapViewport`

| Field | Type | Description |
|-------|------|-------------|
| `x` | `number` | Top-left X in 0–1 space. |
| `y` | `number` | Top-left Y in 0–1 space. |
| `w` | `number` | Width in 0–1 space. |
| `h` | `number` | Height in 0–1 space. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-lifecycle-minimap-bg` | `--color-surface-alt` | – | Root background. |
| `--uxm-lifecycle-minimap-border-color` | `--color-border` | – | Root border. |
| `--uxm-lifecycle-minimap-radius` | – | `6px` | Root border radius. |
| `--uxm-lifecycle-minimap-edge-color` | `--color-border` | – | Edge line stroke. |
| `--uxm-lifecycle-minimap-node-color` | `--color-text-muted` | – | Node rectangle fill. |
| `--uxm-lifecycle-minimap-viewport-fill` | `--color-accent` (10% mix) | – | Viewport overlay fill. |
| `--uxm-lifecycle-minimap-viewport-border` | `--color-accent-bold` | – | Viewport overlay border (1.5px). |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-surface-alt` | Surfaces / Surface Alt | Root background. |
| `--color-border` | Borders / Border | Root border, edge stroke. |
| `--color-text-muted` | Text / Text Muted | Node rectangle fill. |
| `--color-accent` | Accent / Accent | Viewport overlay fill (10% mix). |
| `--color-accent-bold` | Accent / Accent Bold | Viewport overlay border. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Background, bordered frame, nodes + edges scaled into the box. |
| With viewport | `viewport` prop set | Translucent accent rectangle overlaid at the supplied 0–1 coordinates, `pointer-events: none` so it doesn't intercept clicks. |
| Without viewport | `viewport` omitted | No overlay rendered. |

## Accessibility

- Renders a presentational `<div>` containing an inline `<svg>`. No role or label is set — the minimap is a visual aid; primary navigation should remain on the main canvas.
- For screen-reader-accessible canvases, pair the minimap with an off-screen text summary of node count / topology and ensure the main canvas exposes its own structured navigation.
- The viewport overlay has `pointer-events: none` — it never blocks underlying interaction; wire pan / drag on a sibling layer if needed.
- No keyboard navigation; consumers wanting click-to-pan should attach an `onClick` and translate the local coordinates back into 0–1 space using the supplied `width` / `height`.
