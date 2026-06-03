# FormField

A label-plus-control wrapper that pairs any UXM input atom (`TextInput`, `Textarea`, `Select`, `ToggleSwitch`, etc.) with a label and optional hint text. Sole owner of label theming across the form family.

`FormField` is the only component in the form stack that styles labels — input atoms intentionally do not own labels of their own. Edits to `FormField`'s label colour/size/weight or layout knobs propagate to every labeled field in the project. Two layouts are supported: `"top"` (label stacked above the control) and `"side"` (label in a left column, control in a right column, hint aligned under the control via grid placement).

Distinct from `PropertyField`, which is for read-only metadata (label + monospace value).

## Usage

```tsx
import { FormField, TextInput } from '@viax/uxm';

function Example() {
  return (
    <>
      <FormField label="Name">
        <TextInput defaultValue="Ada Lovelace" />
      </FormField>

      <FormField
        label="Email"
        labelPosition="side"
        hint="We'll never share your address."
      >
        <TextInput type="email" />
      </FormField>
    </>
  );
}
```

## Props

### `FormFieldProps`

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute (id, style, data-*, aria-*) is forwarded to the root wrapper.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | – | **Required.** Field label. Rendered inside `<span class="uxm-form-field__label">`. |
| `children` | `ReactNode` | – | **Required.** The input control. Typically a UXM input atom; any ReactNode is accepted. |
| `hint` | `ReactNode` | – | Optional helper text shown below the control. In `side` layout it is grid-placed in the control column. |
| `labelPosition` | `'top' \| 'side'` | `'top'` | Label placement. `top` stacks vertically with `margin-bottom` driving the gap; `side` switches to a 2-column grid. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div class="uxm-form-field">`. |

### `FormFieldLabelPosition`

```ts
type FormFieldLabelPosition = 'top' | 'side';
```

Exported as a string union so consumers can build layout-toggle controls without re-declaring the literals.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-form-field-label-size` | – | `13px` | Label font size. |
| `--uxm-form-field-label-weight` | – | `500` | Label font weight. |
| `--uxm-form-field-label-color` | `--color-text-strong` | – | Label colour. |
| `--uxm-form-field-gap` | – | `8px` | Label↔control vertical distance in `top` layout (zero in `side`). |
| `--uxm-form-field-hint-size` | – | `12px` | Hint font size. |
| `--uxm-form-field-hint-color` | `--color-text-muted` | – | Hint colour. |
| `--uxm-form-field-hint-gap` | – | `2px` | Hint top margin (distance below the control). |
| `--uxm-form-field-side-label-width` | – | `120px` | Width of the label column in `side` layout. |
| `--uxm-form-field-side-gap` | – | `16px` | Horizontal gap between label and control columns in `side` layout. |
| `--uxm-form-field-side-label-align` | – | `start` | Label text alignment within the side column (`start` / `end` / `center`). |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text-strong` | Text / Text Strong | Label colour. |
| `--color-text-muted` | Text / Text Muted | Hint colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Layout: `top` | Default | Label above control; gap owned by `--uxm-form-field-gap` (label's `margin-bottom`). |
| Layout: `side` | `labelPosition="side"` | 2-column grid (label \| control); hint placed in grid-column 2 so it aligns under the control. |
| With hint | `hint` prop provided | Hint span appears below the control with its own top margin. |
| Without hint | `hint` prop omitted | Hint span not rendered. |

## Accessibility

- Renders a plain `<span>` for the label — **not** a native `<label>` and not linked to the control via `htmlFor`/`id`. Screen readers will not announce the label when the control receives focus.
- Best practice: attach an `aria-label` or `aria-labelledby` to the control (matching an `id` on the label span), or wrap the control in your own `<label>` if you need native click-to-focus behaviour.
- The hint is also a plain `<span>` and is not wired via `aria-describedby` to the control. If the hint contains critical guidance, link it explicitly: pass `id` to the hint and `aria-describedby` on the control.
- Layout switching (`top` / `side`) is purely visual — no ARIA implications.
- Label colour defaults to `--color-text-strong` for contrast; verify combined label + hint contrast against your specific surface.
