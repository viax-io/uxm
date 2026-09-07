# LifecycleEdgeLabel

A small inline-flex pill rendered on the midpoint of a `LifecycleConnector` to label its branch condition (true / false / neutral).

`LifecycleEdgeLabel` is a thin `<span>` wrapper with one of three colour variants. Variant communicates the semantic, not the literal text — a connector labelled "approved" can still be `variant="true"` to render in green. Positioning is the consumer's responsibility: the typical pattern is to wrap the label in an absolutely-positioned div pinned to the edge midpoint. Sibling of `LifecycleConnector`, `LifecycleNodeCard`, `LifecycleTerminal`, `LifecycleMinimap`, and `LifecycleZoomControl`.

## Usage

```tsx
import { LifecycleEdgeLabel } from '@viax.io/uxm';

function BranchLabels() {
  return (
    <>
      <LifecycleEdgeLabel variant="true">Yes</LifecycleEdgeLabel>
      <LifecycleEdgeLabel variant="false">No</LifecycleEdgeLabel>
      <LifecycleEdgeLabel>after deploy</LifecycleEdgeLabel>
    </>
  );
}
```

## Props

Extends `HTMLAttributes<HTMLSpanElement>` — any standard span attribute (id, style, data-*, aria-*) is forwarded to the root `<span>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'true' \| 'false' \| 'neutral'` | `'neutral'` | Colour variant. See [States](#states--variants). |
| `children` | `ReactNode` | – | **Required.** Label content. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native span attribute)_ | – | – | Spread onto the root `<span>`. |

```ts
type LifecycleEdgeLabelVariant = 'true' | 'false' | 'neutral';
```

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-lifecycle-edge-label-radius` | – | `999px` | Border radius (pill shape by default). |
| `--uxm-lifecycle-edge-label-border-width` | – | `1px` | Border thickness. |
| `--uxm-lifecycle-edge-label-font-size` | – | `12px` | Label font size. |
| `--uxm-lifecycle-edge-label-font-weight` | – | `500` | Label font weight. |
| `--uxm-lifecycle-edge-label-padding-x` | – | `12px` | Horizontal padding. |
| `--uxm-lifecycle-edge-label-padding-y` | – | `3px` | Vertical padding. |

## Design tokens (MODO-configurable)

Background colours use `color-mix(in srgb, <token> <pct>%, transparent)` for the true and false variants — a translucent tint over the canvas — while neutral uses a flat card background.

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-accent-light` | Accent / Accent Light | `true` background (40% mix). |
| `--color-accent-bold` | Accent / Accent Bold | `true` border + text. |
| `--color-highlight-warm` | Highlights / Highlight Warm | `false` background (35% mix). |
| `--color-on-highlight-warm` | Highlights / On Highlight Warm | `false` border + text. |
| `--color-card` | Surfaces / Card | `neutral` background. |
| `--color-border` | Borders / Border | `neutral` border. |
| `--color-text-muted` | Text / Text Muted | `neutral` text. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| `true` | `variant="true"` | Translucent green fill, accent-bold border + text. |
| `false` | `variant="false"` | Translucent warm fill, on-highlight-warm border + text. |
| `neutral` | `variant="neutral"` (default) | Card background, border-coloured outline, muted text. |

## Accessibility

- Renders a native `<span>` — purely presentational. The variant colour is a visual hint only; the textual content must carry the meaning.
- For high-contrast / colour-blind contexts, do not rely on green vs. warm alone — pair with explicit words ("Yes" / "No") in `children`.
- No interactive affordances; pass through `aria-*` props if the label is part of a larger interactive element (e.g. a clickable edge or connector control).
- Long labels are clipped horizontally by `white-space: nowrap` — keep copy short or override `white-space` per-instance.
