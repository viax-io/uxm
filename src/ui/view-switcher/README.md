# ViewSwitcher

An icon-only segmented control — square buttons in a bordered track, one visually active at a time. Typical use: switching between list / grid / kanban views.

`ViewSwitcher` renders a `<div role="group">` containing fixed-size square `<button>`s, one per option. Each button carries an `aria-label` from `option.label` (the textual name; the button content itself is only the icon) and `aria-pressed` reflecting selection. Selection is controlled (`value` + `onChange`) or uncontrolled (`defaultValue`, falling back to the first option). Disabled options paint inert and no-op on click.

## Usage

```tsx
import { ViewSwitcher } from '@viax/uxm';
import { Icon } from '@viax/uxm';

function Example() {
  const [view, setView] = useState<'list' | 'grid' | 'kanban'>('list');
  return (
    <ViewSwitcher
      value={view}
      onChange={(v) => setView(v as typeof view)}
      options={[
        { value: 'list', icon: <Icon glyph="list" />, label: 'List view' },
        { value: 'grid', icon: <Icon glyph="grid" />, label: 'Grid view' },
        { value: 'kanban', icon: <Icon glyph="columns" />, label: 'Kanban view', disabled: true },
      ]}
    />
  );
}
```

## Props

### `ViewSwitcherProps`

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>` — any standard div attribute is forwarded to the root `<div role="group">`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `ViewSwitcherOption[]` | – | **Required.** Button descriptors; render order matches array order. |
| `value` | `string` | – | Controlled active value. When set, internal state is ignored. |
| `defaultValue` | `string` | first option's `value` | Initial active value for uncontrolled usage. |
| `onChange` | `(value: string) => void` | – | Called with the next value on click. Fires for both controlled and uncontrolled modes. |
| `className` | `string` | – | Merged with the root class via `cn`. |

### `ViewSwitcherOption`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `value` | `string` | yes | Unique identifier; used as the React key and active-state comparator. |
| `icon` | `ReactNode` | yes | Icon node rendered as the button's only visible content. |
| `label` | `string` | yes | Used as the button's `aria-label`. Required for screen readers since buttons are icon-only. |
| `disabled` | `boolean` | no | Renders the button inert (`disabled` attribute set); clicks are no-ops. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-view-switcher-track-bg` | `--color-surface` | – | Outer track background. |
| `--uxm-view-switcher-track-border` | `--color-border` | – | Outer track border. |
| `--uxm-view-switcher-track-radius` | – | `8px` | Outer track radius. |
| `--uxm-view-switcher-track-padding` | – | `2px` | Inner padding around buttons. |
| `--uxm-view-switcher-gap` | – | `0px` | Gap between buttons. |
| `--uxm-view-switcher-button-radius` | – | `6px` | Button corner radius. |
| `--uxm-view-switcher-button-size` | – | `28px` | Button width AND height (square). |
| `--uxm-view-switcher-inactive-icon` | `--color-text-muted` | – | Inactive icon colour. |
| `--uxm-view-switcher-active-bg` | `--color-card` | – | Active button background. |
| `--uxm-view-switcher-active-icon` | `--color-text` | – | Active icon colour. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-surface` | Surfaces / Surface | Track background fallback. |
| `--color-border` | Borders / Border | Track border fallback. |
| `--color-card` | Surfaces / Card | Active button background fallback. |
| `--color-text` | Text / Text | Active icon colour fallback. |
| `--color-text-muted` | Text / Text Muted | Inactive icon colour fallback. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Inactive | `value !== option.value` | Muted icon, transparent background. |
| Active | `value === option.value` | Card-coloured background, accent icon, `--shadow-xs` lift. |
| Disabled | `option.disabled` | Native `disabled` styling; click no-ops, removed from tab order. |
| Hover | `:hover` | Background/colour transition (0.15s). |

## Accessibility

- Renders `role="group"` on the wrapper so screen readers announce the buttons as a related set.
- Each `<button>` carries `aria-pressed` reflecting selection state — standard toggle-button pattern.
- Each `<button>` carries `aria-label={option.label}` — **`label` is required** since the visible content is only an icon.
- Disabled buttons use the native `disabled` attribute (removed from tab order).
- Keyboard: each button is independently focusable via `Tab`/`Shift+Tab`; activation via `Enter`/`Space`. Arrow-key navigation between buttons is not implemented.
- The active state combines colour + shadow lift; the shadow lift provides redundant signal so colour-only contrast loss does not destroy selection feedback.
