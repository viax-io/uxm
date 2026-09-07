# ResponsiveGrid

A breakpoint-free CSS grid layout — drop N children inside and the browser fits as many columns as the available width allows, single-column otherwise.

`ResponsiveGrid` renders a single `<div>` with `grid-template-columns: repeat(auto-fit, minmax(min, 1fr))`. There's no media-query scaffolding, no `useResizeObserver`, no per-breakpoint prop ladder — the layout reacts to container width purely via CSS. Theming knobs live on `--uxm-responsive-grid-{min,gap}` so the MODO editor can tune the wrap point and gap globally; per-instance `min` / `gap` props override per render.

## Usage

```tsx
import { ResponsiveGrid } from '@viax.io/uxm';

function CardGrid({ items }) {
  return (
    <ResponsiveGrid min="240px" gap={20}>
      {items.map((item) => (
        <Card key={item.id} {...item} />
      ))}
    </ResponsiveGrid>
  );
}
```

## Props

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute (id, style, data-*, aria-*) is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `min` | `string` | `200px` (via CSS var) | Minimum column width before wrapping. Any CSS length: `"200px"`, `"20rem"`, `"20ch"`. Sets `--uxm-responsive-grid-min` inline. |
| `gap` | `string \| number` | `16px` (via CSS var) | Gap between cells. Numbers are coerced to `${n}px`; strings pass through. Sets `--uxm-responsive-grid-gap` inline. |
| `children` | `ReactNode` | – | Grid items. |
| `className` | `string` | – | Merged with `uxm-responsive-grid` via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-responsive-grid-min` | – | `200px` | `minmax()` lower bound — the wrap threshold. |
| `--uxm-responsive-grid-gap` | – | `16px` | Row + column gap. |

Set globally for editor-driven defaults; per-instance props override by writing the inline custom property.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Wide container | `container width >= 2 * min + gap` | Multi-column layout, columns split available width equally. |
| Narrow container | `container width < min + gap` | Single column, items full-width. |
| Intermediate | – | Browser auto-fits as many columns as possible at `min` width minimum. |

## Accessibility

- Layout-only primitive — renders a plain `<div>`. Semantics are entirely up to the children.
- No bundled ARIA — if the grid represents a list, wrap usage with `role="list"` and give children `role="listitem"` (or use semantic `<ul>`/`<li>` children directly).
- Keyboard traversal follows DOM order. CSS Grid does not affect tab order, so children are reached in source order regardless of visual column.
