# LifecycleNodeCard

The pill card used for each node on a BI lifecycle canvas — a fixed-width row with a kind-coloured `IconTile`, a kind label, a title, and an optional trailing badge.

`LifecycleNodeCard` composes the shared `Icon` + `IconTile` primitives and carries four semantic kinds: `state` (green accent, checkmark, optional action-count badge), `condition` (warm accent, question mark, optional expression badge), `task` (cool accent, gear), and `interaction` (green accent, exchange arrows). The first three describe **steps** in a lifecycle; `interaction` describes the **object** the lifecycle runs on — a Business Interaction — which is why it is its own kind rather than a `state` card with a substituted `kindLabel`. It keeps `state`'s green on purpose — a BI is marked green everywhere else in the product, and the glyph plus the label carry the distinction. Kind selection drives both the glyph and the colour scheme via `--kind-icon-*` and `--kind-badge-*` CSS variables defined on the kind modifier class — these bridge to the underlying `IconTile`'s own `--uxm-icon-tile-*` surface so the kind-aware tint flows down without re-declaring colours per consumer. Sibling of `LifecycleConnector`, `LifecycleEdgeLabel`, `LifecycleMinimap`, `LifecycleTerminal`, and `LifecycleZoomControl`.

## Usage

```tsx
import { LifecycleNodeCard } from '@viax.io/uxm';

function CanvasNodes() {
  return (
    <>
      <LifecycleNodeCard kind="state" title="In Cart" badge="2" />
      <LifecycleNodeCard
        kind="condition"
        title="Price > 100"
        badge="$data.price > 100"
      />
      <LifecycleNodeCard kind="task" title="Validate" active />
    </>
  );
}
```

## Props

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` — the native `title` attribute is dropped so the prop can carry `ReactNode` content for the primary label. Any other standard div attribute (id, style, data-*, aria-*) is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `kind` | `'state' \| 'condition' \| 'task' \| 'interaction'` | – | **Required.** Drives the icon glyph, default kind label, and accent colour. |
| `title` | `ReactNode` | – | **Required.** Primary text — typically the node name. |
| `badge` | `ReactNode` | – | Trailing pill content — e.g. action count or truncated expression. Hidden if not provided. |
| `kindLabel` | `ReactNode` | humanised `kind` (`interaction` → `Business Interaction`) | Override for the sub-text shown above the title. |
| `active` | `boolean` | `false` | Render the active/selected state. Adds the `--active` modifier class. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute except `title`)_ | – | – | Spread onto the root `<div>`. |

```ts
type LifecycleNodeKind = 'state' | 'condition' | 'task' | 'interaction';
```

Kind → glyph mapping (centralised so other lifecycle UI shares the same contract):

| Kind | Glyph |
|------|-------|
| `state` | `check-circle` |
| `condition` | `question-mark-circle` |
| `task` | `cog-6-tooth` |
| `interaction` | `business-interaction` (exchange arrows) |

## CSS variables

The card sets `box-sizing: border-box` on itself rather than inheriting it from the host, so every sized variable below means what it says: `width: 280px` is 280px of rendered card, and `min-height` is rendered height, not content height. `@viax.io/uxm/ui.css` ships no global reset, so without this a consumer that doesn't ship one either would silently get padding and border *added* on top of both numbers — and the whole point of `min-height` is that connector geometry can trust a single value.

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-lifecycle-node-card-bg` | `--color-card` | – | Root background. |
| `--uxm-lifecycle-node-card-border-color` | `--color-border` | – | Root border. |
| `--uxm-lifecycle-node-card-radius` | – | `6px` | Root border radius. |
| `--uxm-lifecycle-node-card-width` | – | `280px` | Root width (fixed) — total width, padding and border included. |
| `--uxm-lifecycle-node-card-min-height` | – | `0` | Opt-in minimum height for uniform-height nodes on a canvas. `0` keeps the default content-driven height. Equals the rendered card height, so connector endpoints can key off the same number. |
| `--uxm-lifecycle-node-card-padding-x` | – | `16px` | Horizontal padding. |
| `--uxm-lifecycle-node-card-padding-y` | – | `12px` | Vertical padding. |
| `--uxm-lifecycle-node-card-icon-size` | – | `32px` | Icon tile size (bridged into `--uxm-icon-tile-size`). |
| `--uxm-lifecycle-node-card-kind-size` | – | `11px` | Kind sub-label font size. |
| `--uxm-lifecycle-node-card-title-size` | – | `14px` | Title font size. |
| `--kind-icon-bg` | per-kind | – | IconTile background (bridged to `--uxm-icon-tile-bg`). |
| `--kind-icon-color` | per-kind | – | IconTile foreground (bridged to `--uxm-icon-tile-color`). |
| `--kind-badge-bg` | per-kind | – | Trailing badge background. |
| `--kind-badge-color` | per-kind | – | Trailing badge text. |

## Design tokens (MODO-configurable)

Per-kind accent colours are sourced from the shared accent / highlight tokens via `color-mix` so they pick up MODO brand changes automatically.

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Default card background. |
| `--color-border` | Borders / Border | Card border. |
| `--color-text` | Text / Text | Title colour. |
| `--color-text-muted` | Text / Text Muted | Kind sub-label colour. |
| `--color-accent-bold` | Accent / Accent Bold | `state` and `interaction` icon + badge tint. |
| `--color-accent` | Accent / Accent | Active border + glow. |
| `--color-highlight-warm` | Highlights / Highlight Warm | `condition` icon + badge tint. |
| `--color-on-highlight-warm` | Highlights / On Highlight Warm | `condition` icon + badge foreground. |
| `--color-highlight-cool` | Highlights / Highlight Cool | `task` icon + badge tint. |
| `--color-on-highlight-cool` | Highlights / On Highlight Cool | `task` icon + badge foreground. |


The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Kind: `state` | `kind="state"` | Green-tinted icon tile + badge (accent-bold mix), check-circle glyph. |
| Kind: `condition` | `kind="condition"` | Warm-tinted icon tile + badge, question-mark-circle glyph. |
| Kind: `task` | `kind="task"` | Cool-tinted icon tile + badge, cog-6-tooth glyph. |
| Kind: `interaction` | `kind="interaction"` | Same green tint as `state`, exchange-arrows glyph. Default kind label is `Business Interaction`. |
| Active | `active` prop true | Border switches to `--color-accent` with a 3px accent-mixed glow. |
| Custom kind label | `kindLabel` prop set | Sub-text replaces the default humanised kind. |
| No badge | `badge` omitted / null | Trailing pill not rendered. |
| Title overflow | Structural | Title clamped to one line with ellipsis. |

## Accessibility

- Renders a plain `<div>` by default — when the card represents a clickable node, wrap it (or render via consumer's interactive control) so keyboard / focus / activation are wired explicitly.
- The icon tile is marked `aria-hidden="true"` — the kind is conveyed through the textual sub-label (`State` / `Condition` / `Task`), so the icon never duplicates that announcement.
- Title clamps with `text-overflow: ellipsis`; truncated names are not surfaced as `title` attributes. If full titles are important to consumers, pass an `aria-label` via the spread props.
- The active state communicates selection visually (border + glow) only — if used in a selection list, also forward `aria-current="true"` or `aria-selected="true"` via the spread props.
- The trailing badge is rendered as a `<span>` with no role; for richer semantics (e.g. action count badges that link out), the consumer should provide an interactive element inside `badge`.
