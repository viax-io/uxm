# Stack

A vertical flex column with a consistent gap — the boring layout primitive that replaces ad-hoc `flex flex-col gap-N` div soup across page layouts.

`Stack` exists so page authors and AI page-generation pipelines have a vocabulary for "items, stacked, with a consistent rhythm" without picking a Tailwind `gap-N` value every time. The gap is themable via `--uxm-stack-gap` (single editor knob) and overridable per instance through the `gap` prop. A `align` prop covers the cross-axis cases (`start` / `center` / `end` / `stretch`).

## Usage

```tsx
import { Stack } from '@viax.io/uxm';

function ProfileForm() {
  return (
    <Stack gap={24} align="stretch">
      <input placeholder="Name" />
      <input placeholder="Email" />
      <button>Save</button>
    </Stack>
  );
}
```

## Props

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute (id, style, data-*, aria-*) is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | `string \| number` | `16px` (via CSS var) | Gap between stacked items. Numbers are coerced to `${n}px`; strings pass through. Sets `--uxm-stack-gap` inline when provided. |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch'` | `'stretch'` | Cross-axis alignment of items within the stack's width. |
| `children` | `ReactNode` | – | Stacked items. |
| `className` | `string` | – | Merged with `uxm-stack` + the alignment modifier via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-stack-gap` | – | `16px` | Vertical gap between children. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Align: `stretch` | default | `align-items: stretch` — children span the full width. |
| Align: `start` | `align="start"` | `align-items: flex-start` — children left-aligned (or top in RTL inverted contexts). |
| Align: `center` | `align="center"` | `align-items: center` — children centred on the cross axis. |
| Align: `end` | `align="end"` | `align-items: flex-end` — children right-aligned. |

## Accessibility

- Layout-only primitive — renders a plain `<div>`. Semantics are entirely up to the children.
- No bundled ARIA. If the stack represents a list, prefer semantic `<ul>`/`<li>` children or pass `role="list"` via the spread `...rest` (with `role="listitem"` on each child).
- Tab / focus order follows DOM order — vertical flex layout doesn't affect traversal.
