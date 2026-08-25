# Tabs

A segmented tab strip — pill-style buttons inside a bordered track, with one tab visually active at any time.

`Tabs` renders a `<div role="tablist">` containing one `<button role="tab">` per option. Tabs equally split the available width (`flex: 1`). Selection is controlled (`value` + `onChange`) or uncontrolled (`defaultValue`, falling back to the first option). Each option can carry a left-side icon and a `disabled` flag that paints the disabled styling and no-ops on click.

## Usage

```tsx
import { Tabs } from '@viax/uxm';
import { Icon } from '@viax/uxm';

function Example() {
  return (
    <Tabs
      defaultValue="day"
      options={[
        { value: 'day', label: 'Day', icon: <Icon glyph="sun" /> },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month', disabled: true },
      ]}
      onChange={(value) => console.log(value)}
    />
  );
}
```

## Props

### `TabsProps`

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>` — any standard div attribute is forwarded to the root `<div role="tablist">`. `onChange` is overridden with the single-value signature below.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `TabsOption[]` | – | **Required.** Tab descriptors; render order matches array order. |
| `value` | `string` | – | Controlled active value. When set, internal state is ignored. |
| `defaultValue` | `string` | first option's `value` | Initial active value for uncontrolled usage. |
| `onChange` | `(value: string) => void` | – | Called with the next value on click. Fires for both controlled and uncontrolled modes. |
| `className` | `string` | – | Merged with the root class via `cn`. |

### `TabsOption`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `value` | `string` | yes | Unique identifier; used as the React key and the active-state comparator. |
| `label` | `ReactNode` | yes | Tab label content. |
| `icon` | `ReactNode` | no | Optional leading icon node. |
| `disabled` | `boolean` | no | Renders the tab inert (`disabled` attribute set); clicks are no-ops. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-tabs-track-bg` | `--color-surface` | – | Outer track background. |
| `--uxm-tabs-track-border` | `--color-border` | – | Outer track border colour. |
| `--uxm-tabs-track-radius` | – | `8px` | Outer track radius. |
| `--uxm-tabs-track-padding` | – | `2px` | Inner padding around tabs. |
| `--uxm-tabs-gap` | – | `0px` | Gap between tab buttons. |
| `--uxm-tabs-tab-radius` | – | `6px` | Tab button radius. |
| `--uxm-tabs-padding-x` | – | `12px` | Tab horizontal padding. |
| `--uxm-tabs-padding-y` | – | `6px` | Tab vertical padding. |
| `--uxm-tabs-font-size` | – | `12px` | Tab label font size. |
| `--uxm-tabs-font-weight` | – | `500` | Inactive tab font weight (active is bumped to `600`). |
| `--uxm-tabs-icon-gap` | – | `6px` | Gap between icon and label. |
| `--uxm-tabs-icon-size` | – | `12px` | Icon box dimensions. |
| `--uxm-tabs-inactive-text` | `--color-text-muted` | – | Inactive tab text colour. |
| `--uxm-tabs-active-bg` | `--color-card` | – | Active tab background. |
| `--uxm-tabs-active-text` | `--color-text` | – | Active tab text colour. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-surface` | Surfaces / Surface | Track background fallback. |
| `--color-border` | Borders / Border | Track border fallback. |
| `--color-card` | Surfaces / Card | Active tab background fallback. |
| `--color-text` | Text / Text | Active tab text fallback. |
| `--color-text-muted` | Text / Text Muted | Inactive tab text fallback. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Inactive | `value !== option.value` | Muted text, transparent background. |
| Active | `value === option.value` | Card-coloured background, accent text, `--shadow-xs` lift, `font-weight: 600`. |
| Disabled | `option.disabled` | Native `disabled` styling; click no-ops, removed from tab order. |
| Hover | `:hover`, tab not active or disabled | `--color-surface-alt` background, text to `--color-text` (0.15s transition). |

## Accessibility

- Renders `role="tablist"` on the wrapper and `role="tab"` + `aria-selected` on each button — assistive tech announces the tab set and current selection.
- The tabs do **not** manage `aria-controls` linkage to a tab panel; consumers wiring tabs to panels should add `aria-controls` and ensure the panel uses `role="tabpanel"`.
- Keyboard: each button is independently focusable. Arrow-key navigation between tabs is **not** implemented — only `Tab`/`Shift+Tab` traversal and `Enter`/`Space` activation. Implement arrow-key handlers externally if WAI-ARIA tab-pattern compliance is required.
- Disabled tabs use the native `disabled` attribute, which removes them from the tab order.
