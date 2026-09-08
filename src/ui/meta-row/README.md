# MetaRow

A dot-separated inline metadata strip — "v1.2 · 3 days ago · Sarah" — that previously appeared hand-rolled in card footers across modo.

Each child becomes one segment; a small circular dot separator is rendered between every pair of siblings. The component is children-based (rather than `items={[]}`) so callers can mix plain text, `<span>`s, links, and any inline node without losing rich-content support. `Children.toArray` drops `null` / `undefined` / `false` entries automatically.

## Usage

```tsx
import { MetaRow } from '@viax.io/uxm';

function CardFooter() {
  return (
    <MetaRow>
      <span>v1.2</span>
      <span>3 days ago</span>
      <a href="/users/sarah">Sarah</a>
    </MetaRow>
  );
}
```

## Props

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** Each child becomes one segment; dots are interleaved automatically. |
| `className` | `string` | – | Merged with `uxm-meta-row` via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div className="uxm-meta-row">`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-meta-row-color` | `--color-text-muted` | – | Text color of all segments. |
| `--uxm-meta-row-font-size` | – | `12px` | Base font size for segments. |
| `--uxm-meta-row-gap` | – | `12px` | Horizontal gap between segments and the dot. |
| `--uxm-meta-row-dot-color` | `color-mix(--color-text 20%)` | – | Dot fill. Defaults to a 20% mix of `--color-text` so it tracks the brand text colour without a hard-coded grey. |
| `--uxm-meta-row-dot-size` | – | `4px` | Diameter of the circular dot. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text-muted` | Text / Text Muted | Segment text colour. |
| `--color-text` | Text / Text | Mix source for the dot colour (20% mixed with transparent). |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`).

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Muted text, evenly-spaced segments separated by a 4px circular dot. |
| Empty children | `Children.toArray` filters falsy | Component renders the wrapper but no segments / dots. |
| Single child | One segment | No separator drawn. |

## Accessibility

- Renders a plain `<div>` of `<span>` segments — assistive tech reads the segments in source order with natural whitespace pauses between them.
- The dot is marked `aria-hidden="true"` so screen readers ignore the decorative separator and announce only the metadata content.
- No keyboard semantics — interactive children (e.g. links) retain their own focus/activation behaviour.
- Contrast: default `--color-text-muted` is intended for secondary metadata; verify against `--color-card` / `--color-surface` backgrounds if you override the colour token.
