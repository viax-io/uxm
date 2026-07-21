# OptionList

The list of options nested under a **Predefined Options** configuration component: a bordered, indented container of rows, each with a drag handle, a bullet, and a label.

`OptionList` owns both the container styling (indent, border, background, padding) and the per-row styling (paddings, drag handle, bullet, name). The bullet colour is meant to inherit from the parent component's icon tint at runtime — set `--uxm-option-list-bullet-color` on (or above) the list to match it.

## Usage

```tsx
import { OptionList } from '@viax/uxm';

<OptionList
  options={[
    { label: 'Single Family Home' },
    { label: 'Multi Family' },
    { label: 'Townhouse' },
  ]}
/>;
```

## Props

### `OptionListProps`

Extends `HTMLAttributes<HTMLDivElement>` — native `div` attributes (`style`, `className`, `data-*`, `id`, handlers) are forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `OptionListItem[]` | – | **Required.** The options to list, in order. Each is `{ id?: Key; label: ReactNode }`. |
| `dragHandle` | `boolean` | `true` | Show a leading drag-handle affordance on each row (visual only — wire your own DnD). |

## CSS variables

Set on the root (or an ancestor scope). Each falls back to a design token.

| Variable | Fallback | Controls |
|----------|----------|----------|
| `--uxm-option-list-indent` | `38px` | Left indent of the whole list |
| `--uxm-option-list-background` | `var(--color-surface)` | Container fill |
| `--uxm-option-list-border-color` / `-width` / `-radius` | `var(--color-border)` / `1px` / `8px` | Container border |
| `--uxm-option-list-padding-x` / `-y` | `8px` / `4px` | Container padding |
| `--uxm-option-list-gap` | `4px` | Gap between option rows |
| `--uxm-option-list-row-padding-x` / `-y` | `8px` / `12px` | Per-row padding |
| `--uxm-option-list-drag-color` / `-drag-hover-color` | `var(--color-text-muted)` | Drag handle idle / hover |
| `--uxm-option-list-bullet-size` | `6px` | Bullet diameter |
| `--uxm-option-list-bullet-gap` | `8px` | Bullet → name spacing |
| `--uxm-option-list-bullet-color` | `color-mix(highlight-cool 40%)` | Bullet fill (inherit the parent component tint) |
| `--uxm-option-list-name-color` / `-size` / `-weight` | `var(--color-text)` / `14px` / `400` | Option label |
| `--uxm-option-list-row-hover-bg` / `-row-hover-radius` | `color-mix(text 4%)` / `12px` | Row hover highlight |

## Design tokens (MODO-configurable)

| Token read | Group / Name |
|------------|--------------|
| `--color-surface` | Surfaces / Surface (container) |
| `--color-border` | Borders / Border |
| `--color-text` | Text / Text (option label) |
| `--color-text-muted` | Text / Text Muted (drag handle) |

## Accessibility

- Drag handles are decorative (`aria-hidden`); the affordance is visual only. Wire keyboard-accessible reordering separately if your consumer needs it.
- Bullets are `aria-hidden` decorative markers.
- Provide meaningful `label` content — screen readers read the option name directly.
