# LifecycleConnector

An SVG `<g>` fragment that draws one edge between two lifecycle nodes — a stroked path with a start dot and an arrowhead, themable per state.

`LifecycleConnector` is rendered inside a parent `<svg>` (typical for a full lifecycle canvas). `routing` picks the route shape — the default `auto` keeps the historical behaviour (vertically aligned anchors produce a straight line, anything else a cubic Bezier pulled toward the vertical midpoint: the smooth swooping "branch" of the lifecycle modeler), while `straight`, `bezier` and `orthogonal` force one shape regardless of the anchors. `orthogonal` draws an elbow — stem, cross, drop, all axis-aligned — so a tree with square corners needs one connector per edge rather than one per segment. Stroke colour and width are kept on `--uxm-lifecycle-connector-*` CSS custom properties so a single `state` modifier re-tints all three sub-elements (start dot, path, arrowhead) in lockstep. Sits alongside `LifecycleNodeCard`, `LifecycleEdgeLabel`, `LifecycleTerminal`, `LifecycleMinimap`, and `LifecycleZoomControl` in the lifecycle component family.

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

A square-cornered fan-out — one connector per child, each an elbow whose cross
segment sits on a shared bus level. `startDot` is left on for the first edge
only, so the parent anchor shows one dot instead of one per child:

```tsx
const parent = { x: 300, y: 80 };
const busAt = 0.45;

children.map((child, i) => (
  <LifecycleConnector
    key={child.id}
    from={parent}
    to={child.anchor}
    routing="orthogonal"
    crossAt={busAt}
    startDot={i === 0}
  />
));
```

Note that overlapping strokes are the caller's problem: N elbows sharing a
`crossAt` stack N cross segments on the same line, which is invisible on a solid
stroke but shows as artifacts with `state="dashed"` or a translucent colour.

## Props

Extends `Omit<SVGAttributes<SVGGElement>, 'from' | 'to'>` — `from` and `to` are repurposed from their SMIL animation meaning to carry the actual node-anchor coordinates. Any other standard SVG group attribute (id, style, data-*, aria-*) is forwarded to the root `<g>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `from` | `{ x: number; y: number }` | – | **Required.** Source point in the parent SVG's coordinate system. |
| `to` | `{ x: number; y: number }` | – | **Required.** Destination point — the arrowhead is placed here. |
| `state` | `'idle' \| 'active' \| 'dashed'` | `'idle'` | Visual state. See [States](#states--variants). |
| `routing` | `'auto' \| 'straight' \| 'bezier' \| 'orthogonal'` | `'auto'` | Route shape. `auto` = straight when `from.x === to.x`, Bezier otherwise. See [Routing](#states--variants). |
| `crossAt` | `number` | `0.5` | Where the elbow's cross segment sits along the vertical span, `0` (level with `from`) → `1` (level with `to`). Read only when the resolved routing is `orthogonal`. |
| `cornerRadius` | `number` | `4` | Corner rounding in px for the elbow's turns; `0` for square corners. Clamped per corner to half the shorter adjoining run. Read only when the resolved routing is `orthogonal`. |
| `startDot` | `boolean` | `true` | Render the dot at the source anchor. |
| `arrowSize` | `number` | `7` | Arrowhead size in px. The line is also pulled back by this amount so the tip lands cleanly on the node edge. |
| `dashPattern` | `string` | `'6 4'` | SVG `stroke-dasharray` pattern used when `state === 'dashed'`. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native SVG group attribute)_ | – | – | Spread onto the root `<g>`. |

```ts
type LifecycleConnectorState = 'idle' | 'active' | 'dashed';
type LifecycleConnectorRouting = 'auto' | 'straight' | 'bezier' | 'orthogonal';
```

## CSS variables

Defined on `.uxm-lifecycle-connector` and consumed by all three sub-elements (start dot, path, arrowhead). Each state modifier rewrites these vars so a single theme rule re-tints the whole connector.

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-lifecycle-connector-idle-color` | `--color-text-subtle` | – | Stroke / dot / arrow in the idle state. |
| `--uxm-lifecycle-connector-idle-stroke-width` | – | `1.5` | Path stroke width, idle. |
| `--uxm-lifecycle-connector-active-color` | `--color-accent` | – | Stroke / dot / arrow in the active state. |
| `--uxm-lifecycle-connector-active-stroke-width` | – | `2` | Path stroke width, active. |
| `--uxm-lifecycle-connector-dashed-color` | `--color-text-muted` | – | Stroke / dot / arrow in the dashed state. |
| `--uxm-lifecycle-connector-dashed-stroke-width` | – | `1.5` | Path stroke width, dashed. |
| `--uxm-lifecycle-connector-dash-pattern` | – | `6 4` | `stroke-dasharray`, dashed state only. |
| `--uxm-lifecycle-connector-arrow-size` | – | `7` | Arrowhead size + path pullback. **Read back — see below.** |

### Why `arrow-size` is read, not applied

Every var above it sets a real CSS property, so the cascade applies it and the component never looks. `arrow-size` can't work that way — it ends up as coordinates inside the arrowhead's `points` — yet it *is* a theme decision: every arrowhead in an app should agree. So the component reads it back off its own element with `getComputedStyle`, on mount and again whenever the document's `data-theme` flips, which makes it behave like the colour vars.

Resolution is **prop → CSS var → default**, so an explicit `arrowSize={10}` always beats a published theme, and passing the prop skips the DOM read entirely. The read runs in a layout effect, before paint, so a themed size never flashes at the default first.

`crossAt` and `cornerRadius` have **no** custom property on purpose. Where a cross bus sits and how sharp its turns are is per-edge layout — the same kind of value as `from` / `to` — so it belongs to the diagram's layout code, not to a saved theme. They are props only, and the studio deliberately exposes no knob for them.

The per-state vars resolve into two internal vars — `--uxm-lifecycle-connector-color` and `--uxm-lifecycle-connector-width` — which the three sub-elements (start dot, path, arrowhead) read, so one state modifier re-tints the whole connector in lockstep. Set the per-state names, not the internal pair.

> **Legacy alias.** Studio-published themes used to write a doubled segment —
> `--uxm-lifecycle-connector-connector-idle-color` and friends — because the
> generator prefixed an already-`connector`-prefixed knob key. Those spellings
> still resolve as a fallback for one minor; re-save the component in the studio
> to move a stored theme onto the canonical names.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text-subtle` | Text / Text Subtle | Idle stroke / dot / arrow colour. |
| `--color-accent` | Accent / Accent | Active stroke / dot / arrow colour. |
| `--color-text-muted` | Text / Text Muted | Dashed stroke / dot / arrow colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| `idle` | default | Thin subtle-grey path (`1.5px`), matching dot + arrow. |
| `active` | `state="active"` | Bolder accent-coloured path (`2px`), accent dot + arrow. |
| `dashed` | `state="dashed"` | Muted dashed path with `dashPattern` (default `6 4`). Often used for "after deploy" / future branches. |
| Auto routing | `routing="auto"` (default) | Straight when `from.x === to.x`, Bezier otherwise — the historical behaviour. |
| Straight routing | `routing="straight"` | `M from L lineEnd` — pulled back by `arrowSize` so the tip sits on the node edge. |
| Curved routing | `routing="bezier"` | Cubic Bezier with control points at the vertical midpoint — smooth S-curve to a sibling column. |
| Elbow routing | `routing="orthogonal"` | Stem down to `crossAt`, cross to the destination column, drop in — three axis-aligned runs, filleted by `cornerRadius` (`4` by default; pass `0` for square turns). The arrowhead takes its angle from the **last** run, so a vertical drop gets a vertical head. Runs that collapse (`crossAt` at 0 or 1, anchors sharing an x) are dropped before that angle is read, and the tip pullback is clamped to the final run, so the shape stays stable across the whole `crossAt` range. |
| No start dot | `startDot={false}` | The `__start` circle is omitted; the path is unchanged. Use on the non-first edge of a shared fan-out. |

## Accessibility

- Renders an SVG `<g>` with no role or label. A connector carries no text and exposes no semantics of its own; the edge it represents has to be conveyed by the diagram around it.
- **The parent `<svg>` MUST carry a text alternative describing the topology.** This is a requirement, not a nicety: a connector states *which two nodes are linked*, and that relationship exists nowhere else in the accessible tree. Give the `<svg>` an `aria-label` / `aria-describedby`, or pair it with a visually-hidden list of the edges ("Order → Fulfillment; Fulfillment → Invoice"). A diagram whose only expression of an edge is the stroke itself is not accessible, whatever colour that stroke is.
- **Stroke contrast is below the 3:1 UI floor, and that is only defensible because of the rule above.** Measured with the package's own `contrastRatio` against `--color-surface`: light idle `1.39:1`, dashed `2.37:1`, active `1.93:1`; dark `2.67:1` / `5.34:1` / `10.29:1`. Calling an edge "decorative" under WCAG 1.4.11 is a fair reading *only* once the topology is genuinely available as text — 1.4.11 exempts graphics that convey nothing, and a connector conveys nothing extra only when the description already carries it. If a consumer ships the diagram without that description, the exemption does not apply to them and the contrast is a real failure. Raise `--uxm-lifecycle-connector-idle-color` to `--color-text-strong` or darker to clear AA.
- Sighted low-vision users are not covered by the text alternative. If edge visibility matters for the product (dense graphs, print, projection), treat the defaults as a starting point and raise the stroke colour and `--uxm-lifecycle-connector-idle-stroke-width` rather than relying on the exemption.
- No keyboard interaction — the component is presentational. Selection / hover behaviour, if needed, must be wired by the consumer (e.g. by setting `pointer-events` and listeners on the `<g>`).
- The arrowhead is rendered as a `<polygon>` filled with the same stroke colour — ensures sufficient contrast against the canvas background in the consumer's hands.
