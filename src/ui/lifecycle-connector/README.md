# LifecycleConnector

An SVG `<g>` fragment that draws one edge between two lifecycle nodes — a stroked path with a start dot and an arrowhead, themable per state.

`LifecycleConnector` is rendered inside a parent `<svg>` (typical for a full lifecycle canvas). Routing is automatic: vertically aligned source/destination points produce a straight line, anything else produces a cubic Bezier with control points pulled toward the vertical midpoint (the smooth swooping "branch" shape used by the lifecycle modeler). Stroke colour and width are kept on `--uxm-lifecycle-connector-*` CSS custom properties so a single `state` modifier re-tints all three sub-elements (start dot, path, arrowhead) in lockstep. Sits alongside `LifecycleNodeCard`, `LifecycleEdgeLabel`, `LifecycleTerminal`, `LifecycleMinimap`, and `LifecycleZoomControl` in the lifecycle component family.

## Usage

```tsx
import { LifecycleConnector } from '@viax/uxm';

function Canvas() {
  return (
    <svg width={600} height={400}>
      <LifecycleConnector from={{ x: 100, y: 80 }} to={{ x: 100, y: 200 }} />
      <LifecycleConnector
        from={{ x: 100, y: 200 }}
        to={{ x: 260, y: 320 }}
        state="active"
      />
      <LifecycleConnector
        from={{ x: 100, y: 200 }}
        to={{ x: -60, y: 320 }}
        state="dashed"
      />
    </svg>
  );
}
```

## Props

Extends `Omit<SVGAttributes<SVGGElement>, 'from' | 'to'>` — `from` and `to` are repurposed from their SMIL animation meaning to carry the actual node-anchor coordinates. Any other standard SVG group attribute (id, style, data-*, aria-*) is forwarded to the root `<g>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `from` | `{ x: number; y: number }` | – | **Required.** Source point in the parent SVG's coordinate system. |
| `to` | `{ x: number; y: number }` | – | **Required.** Destination point — the arrowhead is placed here. |
| `state` | `'idle' \| 'active' \| 'dashed'` | `'idle'` | Visual state. See [States](#states--variants). |
| `arrowSize` | `number` | `7` | Arrowhead size in px. The line is also pulled back by this amount so the tip lands cleanly on the node edge. |
| `dashPattern` | `string` | `'6 4'` | SVG `stroke-dasharray` pattern used when `state === 'dashed'`. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native SVG group attribute)_ | – | – | Spread onto the root `<g>`. |

```ts
type LifecycleConnectorState = 'idle' | 'active' | 'dashed';
```

## CSS variables

Defined on `.uxm-lifecycle-connector` and consumed by all three sub-elements (start dot, path, arrowhead). Each state modifier rewrites these vars so a single theme rule re-tints the whole connector.

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-lifecycle-connector-color` | `--color-border` (idle), `--color-accent` (active), `--color-text-muted` (dashed) | – | Path stroke, start dot fill, arrowhead fill. |
| `--uxm-lifecycle-connector-width` | – | `1.5` (idle/dashed), `2` (active) | Path stroke width. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-border` | Borders / Border | Idle stroke / dot / arrow colour. |
| `--color-accent` | Accent / Accent | Active stroke / dot / arrow colour. |
| `--color-text-muted` | Text / Text Muted | Dashed stroke / dot / arrow colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| `idle` | default | Thin grey path (`1.5px`), border-coloured dot + arrow. |
| `active` | `state="active"` | Bolder accent-coloured path (`2px`), accent dot + arrow. |
| `dashed` | `state="dashed"` | Muted dashed path with `dashPattern` (default `6 4`). Often used for "after deploy" / future branches. |
| Straight routing | `from.x === to.x` | `M from L lineEnd` — pulled back by `arrowSize` so the tip sits on the node edge. |
| Curved routing | `from.x !== to.x` | Cubic Bezier with control points at the vertical midpoint — smooth S-curve to a sibling column. |

## Accessibility

- Renders an SVG `<g>` with no role or label — connectors are decorative. Convey edge semantics in the surrounding diagram description, not on the connector itself.
- For screen-reader-accessible flow diagrams, attach `aria-label` or `aria-describedby` to the parent `<svg>` and provide a text alternative summarising the graph topology.
- No keyboard interaction — the component is presentational. Selection / hover behaviour, if needed, must be wired by the consumer (e.g. by setting `pointer-events` and listeners on the `<g>`).
- The arrowhead is rendered as a `<polygon>` filled with the same stroke colour — ensures sufficient contrast against the canvas background in the consumer's hands.
