# ExplorerListItem

A label-first list row for component-explorer / file-tree style browsers. Distinct from `SidebarNavItem` (which is icon-tile-first for app-level navigation): here the primary affordance is the label, and the active state is communicated by a left accent rail rather than a filled background tile.

`ExplorerListItem` renders as a `<button>` because clicking selects an entry rather than navigating. It composes three optional children: the active-state rail (`&__rail`, shown only when `active`), the label (`&__label`, ellipsis-truncated), and an optional trailing slot (`&__trailing`, smaller and subtler — typically a count or category marker). Theming knobs are split between row body and rail so the indicator can be sized and tinted independently.

## Usage

```tsx
import { ExplorerListItem } from '@viax/uxm';

function Example() {
  return (
    <ExplorerListItem
      name="components/button.tsx"
      trailing="14"
      active
      onClick={() => select('button')}
    />
  );
}
```

## Props

### `ExplorerListItemProps`

Extends `Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'name'>` — the native `name` attribute (a form-control name string) is shadowed because this component repurposes `name` as the row's display label. All other native button attributes (`disabled`, `onClick`, `aria-*`, `data-*`) flow through to the root `<button>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `ReactNode` | – | **Required.** Primary label text rendered in `&__label`. |
| `trailing` | `ReactNode` | – | Optional trailing slot — typically a category meta or count. |
| `active` | `boolean` | `false` | Render the active (selected) state. Adds the `--active` modifier, surfaces the left accent rail, and sets `aria-pressed`. |
| `disabled` | `boolean` | `false` | Native disabled state — CSS `:disabled` paints the dimmed treatment and pointer events are blocked. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Overridden default — prevents accidental form submission. |
| `className` | `string` | – | Merged onto the root via `cn`. |
| _(any native button attribute)_ | – | – | Spread onto the root `<button>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-explorer-list-item-border-radius` | – | `8px` | Row corner radius. |
| `--uxm-explorer-list-item-inactive-color` | `--color-text-strong` | – | Label color (idle). |
| `--uxm-explorer-list-item-font-size` | – | `13px` | Row font size. |
| `--uxm-explorer-list-item-font-weight` | – | `500` | Row font weight. |
| `--uxm-explorer-list-item-gap` | – | `8px` | Gap between rail, label, and trailing slot. |
| `--uxm-explorer-list-item-padding-y` | – | `8px` | Vertical padding. |
| `--uxm-explorer-list-item-padding-x` | – | `12px` | Horizontal padding. |
| `--uxm-explorer-list-item-hover-bg` | `color-mix(srgb, --color-surface 60%, transparent)` | – | Background on hover. |
| `--uxm-explorer-list-item-hover-color` | `--color-text` | – | Label color on hover. |
| `--uxm-explorer-list-item-active-bg` | `--color-surface` | – | Background when active. |
| `--uxm-explorer-list-item-active-color` | `--color-text` | – | Label color when active. |
| `--uxm-explorer-list-item-rail-color` | `--color-accent` | – | Left rail fill. |
| `--uxm-explorer-list-item-rail-radius` | – | `999px` | Rail corner radius (pill by default). |
| `--uxm-explorer-list-item-rail-height` | – | `16px` | Rail height. |
| `--uxm-explorer-list-item-rail-width` | – | `2px` | Rail width. |
| `--uxm-explorer-list-item-trailing-color` | `--color-text-subtle` | – | Trailing-slot color. |
| `--uxm-explorer-list-item-trailing-size` | – | `10px` | Trailing-slot font size. |

The active row also applies `box-shadow: var(--shadow-xs)` — this is an external shadow token, not a component-scoped knob.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text-strong` | Text / Text Strong | Label color (idle). |
| `--color-text` | Text / Text | Label color on hover and active. |
| `--color-text-subtle` | Text / Text Subtle | Trailing slot text. |
| `--color-surface` | Surfaces / Surface | Hover bg (mixed) and active bg. |
| `--color-accent` | Accent / Accent | Active-state rail. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Idle | – | Transparent bg, strong text color. |
| Hover | `:hover` | Surface-mixed background, text shifts to standard text color (0.12s transition). |
| Active | `active={true}` | `--active` modifier — surface bg, full text color, `--shadow-xs`, left rail rendered. |
| With trailing | `trailing` provided | Right-aligned subtle slot, smaller font. |
| Disabled | `disabled` attribute | Native disabled treatment (UA defaults — no overrides in current SCSS). |

## Accessibility

- Renders a native `<button>` — full keyboard activation and screen-reader semantics come for free.
- `aria-pressed` is wired to the `active` prop, modeling the row as a toggle button. If the row is part of a single-selection list, consider `role="option"` inside a `role="listbox"` instead (would require composition outside this component).
- The rail span carries `aria-hidden="true"` — purely decorative.
- The label ellipsis-truncates — long names are visually clipped but remain available as the full DOM text node for screen readers.
- No `aria-label` fallback when `name` is non-textual — if `name` is an icon-only node, provide an explicit `aria-label` via `...rest`.
