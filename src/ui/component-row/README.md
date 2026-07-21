# ComponentRow

A single configuration component (field) row: a drag handle, a coloured type-icon badge, an optional leading chevron (for expandable types like Predefined Options), the component name, and a type label.

`ComponentRow` is a building block of the Configuration segment tree — the leaf rows inside a [`SegmentCard`](../segment-card/README.md) body. The badge tint (`iconBg` / `iconColor`) comes from the consumer's per-type visual dictionary at runtime; it is not editor-controlled.

## Usage

```tsx
import { ComponentRow, Icon } from '@viax/uxm';

<ComponentRow
  icon={<Icon glyph="list" />}
  name="Practice Type"
  type="Predefined Options"
  chevron
  iconBg="color-mix(in srgb, var(--color-highlight-cool) 20%, transparent)"
  iconColor="var(--color-on-highlight-cool)"
  dragHandle
/>;
```

## Props

### `ComponentRowProps`

Extends `HTMLAttributes<HTMLDivElement>` (minus `title`).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | – | Leading glyph shown inside the coloured badge. |
| `name` | `ReactNode` | – | **Required.** Component display name. |
| `type` | `ReactNode` | – | Type label shown to the right (e.g. "Text", "Predefined Options"). |
| `chevron` | `boolean` | `false` | Show a leading expand chevron (for expandable types). |
| `open` | `boolean` | `false` | Chevron direction when `chevron` is set. |
| `iconBg` / `iconColor` | `string` | – | Badge background / foreground (per-type tint at runtime). |
| `dragHandle` | `boolean` | `false` | Show a leading drag-handle affordance (visual only). |
| `actions` | `ReactNode` | – | Trailing controls revealed on hover/focus. |

## CSS variables

Set on the root (or an ancestor scope); each falls back to a design token.

| Variable | Fallback | Controls |
|----------|----------|----------|
| `--uxm-component-row-padding-x` / `-y` | `12px` / `16px` | Row padding |
| `--uxm-component-row-gap` | `16px` | Gap between parts |
| `--uxm-component-row-drag-color` / `-drag-hover-color` | `text-subtle` / `text-muted` | Drag handle |
| `--uxm-component-row-icon-badge-size` / `-radius` / `-padding` | `30px` / `8px` / `8px` | Icon badge box |
| `--uxm-component-row-icon-badge-bg` / `-color` | `color-mix(highlight-cool 20%)` / `text-muted` | Badge tint (also via `iconBg`/`iconColor`) |
| `--uxm-component-row-name-color` / `-size` / `-weight` | `text` / `15px` / `500` | Name |
| `--uxm-component-row-type-label-color` / `-size` / `-weight` | `text-muted` / `12px` / `400` | Type label |
| `--uxm-component-row-chevron-color` / `-size` | `text-muted` / `16px` | Leading chevron |
| `--uxm-component-row-row-hover-bg` / `-row-hover-radius` | `color-mix(text 4%)` / `8px` | Row hover highlight |

## Design tokens (MODO-configurable)

`--color-text` (name) · `--color-text-muted` (type label, chevron) · `--color-text-subtle` (drag) · badge tints come from the consumer's per-type dictionary via `iconBg`/`iconColor`.

## Accessibility

- Drag handle, badge, and chevron are `aria-hidden` decorative.
- The row is presentational; attach behaviour (`onClick`, selection, DnD) via forwarded native props.
