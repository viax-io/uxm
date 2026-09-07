# TabsUnderline

A page-navigation style tab strip — text labels separated by spacing, with a coloured bar drawn under the active tab on top of a baseline rule.

`TabsUnderline` renders a `<div role="tablist">` containing one `<button role="tab">` per option. Unlike `Tabs`, the buttons are not stretched to fill — each is its own intrinsic width — and the active state is signalled by a `::after` bar rather than a pill background. Selection is controlled (`value` + `onChange`) or uncontrolled (`defaultValue`, falling back to the first option).

## Usage

```tsx
import { TabsUnderline } from '@viax.io/uxm';
import { Icon } from '@viax.io/uxm';

function Example() {
  return (
    <TabsUnderline
      defaultValue="overview"
      options={[
        { value: 'overview', label: 'Overview' },
        { value: 'activity', label: 'Activity', icon: <Icon glyph="activity" /> },
        { value: 'settings', label: 'Settings', disabled: true },
      ]}
      onChange={(value) => navigate(`/${value}`)}
    />
  );
}
```

## Props

### `TabsUnderlineProps`

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>` — any standard div attribute is forwarded to the root `<div role="tablist">`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `TabsUnderlineOption[]` | – | **Required.** Tab descriptors; render order matches array order. |
| `value` | `string` | – | Controlled active value. When set, internal state is ignored. |
| `defaultValue` | `string` | first option's `value` | Initial active value for uncontrolled usage. |
| `onChange` | `(value: string) => void` | – | Called with the next value on click. Fires for both controlled and uncontrolled modes. |
| `className` | `string` | – | Merged with the root class via `cn`. |

### `TabsUnderlineOption`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `value` | `string` | yes | Unique identifier; used as the React key and active-state comparator. |
| `label` | `ReactNode` | yes | Tab label content. |
| `icon` | `ReactNode` | no | Optional leading icon. |
| `disabled` | `boolean` | no | Renders the tab inert; clicks are no-ops. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-tabs-underline-track-border-color` | `--color-border` | – | Baseline rule under all tabs. |
| `--uxm-tabs-underline-gap` | – | `4px` | Gap between tab buttons. |
| `--uxm-tabs-underline-padding-x` | – | `12px` | Tab horizontal padding. |
| `--uxm-tabs-underline-padding-y` | – | `8px` | Tab vertical padding. |
| `--uxm-tabs-underline-font-size` | – | `13px` | Tab font size. |
| `--uxm-tabs-underline-font-weight` | – | `500` | Inactive font weight (active is bumped to `600`). |
| `--uxm-tabs-underline-icon-gap` | – | `6px` | Gap between icon and label. |
| `--uxm-tabs-underline-icon-size` | – | `14px` | Icon box dimensions. |
| `--uxm-tabs-underline-inactive-text` | `--color-text-muted` | – | Inactive tab text colour. |
| `--uxm-tabs-underline-hover-text` | `--color-text` | – | Hover text colour. |
| `--uxm-tabs-underline-active-text` | `--color-text` | – | Active tab text colour. |
| `--uxm-tabs-underline-bar-color` | `--color-accent-bold` | – | Active underline bar colour. |
| `--uxm-tabs-underline-bar-height` | – | `2px` | Active underline bar thickness. |
| `--uxm-tabs-underline-bar-radius` | – | `2px` | Active underline bar radius. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-border` | Borders / Border | Baseline rule. |
| `--color-text-muted` | Text / Text Muted | Inactive tab text. |
| `--color-text` | Text / Text | Hover + active tab text. |
| `--color-accent-bold` | Accent / Accent Bold | Active underline bar. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Inactive | `value !== option.value` | Muted text. |
| Hover | `:hover` | Text shifts to `--color-text` (0.15s transition). |
| Active | `value === option.value` | Accent text + bottom bar (`::after`) overlapping the baseline rule. |
| Disabled | `option.disabled` | Native `disabled` styling; click no-ops, removed from tab order. |

## Accessibility

- Renders `role="tablist"` on the wrapper and `role="tab"` + `aria-selected` on each button.
- No `aria-controls` wiring to a tab panel — consumers are responsible for that linkage and for marking the corresponding panel with `role="tabpanel"`.
- Keyboard: each button is independently focusable via `Tab`/`Shift+Tab`; activation via `Enter`/`Space`. Arrow-key navigation between tabs is not implemented.
- Disabled tabs use the native `disabled` attribute, which removes them from the tab order.
- The active-state underline depends on colour; pair with the text-weight bump (already automatic) to communicate selection without colour alone.
