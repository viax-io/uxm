# ButtonGroup

A segmented control — renders a row of mutually-exclusive `<button>`s sharing a single rounded border. Supports both controlled and uncontrolled selection.

`ButtonGroup` is a `<div role="group">` whose children are real `<button type="button">`s with `aria-pressed` reflecting the active selection. Internal state seeds from `defaultValue` (or the first option) and is bypassed when `value` is provided. The border + per-item divider share a single `--uxm-button-group-border-color` variable so a single saved knob themes the whole track.

## Usage

```tsx
import { ButtonGroup } from '@viax.io/uxm';

function Example() {
  const [view, setView] = useState('list');

  return (
    <ButtonGroup
      value={view}
      onChange={setView}
      options={[
        { value: 'list', label: 'List' },
        { value: 'grid', label: 'Grid' },
        { value: 'kanban', label: 'Kanban', disabled: true },
      ]}
    />
  );
}
```

## Props

### `ButtonGroupProps`

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>` — `onChange` is replaced with a typed `(value: string) => void` signature; every other div attribute (id, style, data-*, aria-*) is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `ButtonGroupOption[]` | – | **Required.** Ordered list of segments. |
| `value` | `string` | – | Controlled selected value. When provided, the component is fully controlled and internal state is ignored. |
| `defaultValue` | `string` | first option's `value` | Initial uncontrolled selection. Only consulted on mount. |
| `onChange` | `(value: string) => void` | – | Called with the new value on every selection — fires for both controlled and uncontrolled usage. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div role="group">`. |

### `ButtonGroupOption`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `value` | `string` | yes | Stable identifier; used as the React key and the selection token. |
| `label` | `string` | yes | Button text content. |
| `disabled` | `boolean` | no | When true, the button is inert (`disabled` attribute) and selection is a no-op. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-button-group-border-color` | `--color-border` | – | Root border + per-item right divider. |
| `--uxm-button-group-inactive-bg` | `--color-card` | – | Resting background of unselected items. |
| `--uxm-button-group-inactive-text` | `--color-text-muted` | – | Resting text colour of unselected items. |
| `--uxm-button-group-active-bg` | `--color-accent-subtle` | – | Background of the active item. |
| `--uxm-button-group-active-text` | `--color-accent-bold` | – | Text colour of the active item. |
| `--uxm-button-group-font-size` | – | `13px` | Item font size. |
| `--uxm-button-group-padding-y` | – | `8px` | Item vertical padding. |
| `--uxm-button-group-padding-x` | – | `16px` | Item horizontal padding. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-border` | Borders / Border | Root border + per-item divider. |
| `--color-card` | Surfaces / Card | Inactive item background. |
| `--color-text-muted` | Text / Text Muted | Inactive item text. |
| `--color-accent-subtle` | Accent / Accent Subtle | Active item background. |
| `--color-accent-bold` | Accent / Accent Bold | Active item text. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Inactive | `option.value !== active` | `inactive-bg` / `inactive-text`, font-weight 500. |
| Active | `option.value === active` | `active-bg` / `active-text`, font-weight 600; `aria-pressed="true"`. |
| Hover | `:hover` | 0.15s transition on background + text colour (no explicit hover palette defined — inherits resting). |
| Disabled | `option.disabled` | Native `disabled` attribute; selecting is a no-op. No explicit disabled palette is defined in the SCSS — rely on the browser default dimming. |
| Last item | Structural | Right-divider is removed so it doesn't double up with the root border. |
| Controlled | `value` provided | Internal state is ignored; `value` is the single source of truth. |
| Uncontrolled | `value` omitted | Internal state initialised from `defaultValue` (or first option). |

## Accessibility

- Root carries `role="group"` so the segmented control is announced as a related cluster.
- Each segment is a native `<button type="button">` with `aria-pressed` reflecting the active state — screen readers correctly announce toggle state.
- Disabled segments use the native `disabled` attribute (removed from tab order, announced as unavailable).
- Keyboard interaction relies on native button semantics — `Tab` moves between segments, `Enter` / `Space` activates. There is **no** roving-tabindex / arrow-key navigation between segments; this is a `group`, not a `radiogroup`.
- If your group is conceptually a single radio choice, prefer `role="radiogroup"` with `role="radio"` children — this component intentionally models a toggle-button group, not radios.
- No accessible name is set on the root — wrap with a `<fieldset>` + `<legend>`, or pass `aria-label` / `aria-labelledby` via the spread props.
