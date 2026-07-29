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
| `labelTone` | `'default' \| 'muted' \| 'strong'` | `'strong'` | Label **colour** emphasis (the tint). `strong` = strong text (default, unchanged); `default` = normal text; `muted` = dimmed, for detail panels where the label is secondary to the value. Applies to **both** label variants — the variant owns typography, the tint owns colour. Each tint's colour is themable via `--uxm-form-field-label-tint-*`; an explicit `--uxm-form-field-label-color` still overrides. |
| `labelVariant` | `'default' \| 'overline'` | `'default'` | Label **typography**. `default` = normal label; `overline` = small uppercase, letter-spaced "eyebrow" caps for caps labels above editable fields. Its defaults match `PropertyField`'s look but it has its **own** `--uxm-form-field-overline-*` tokens (nothing shared with PropertyField). Typography only — colour comes from `labelTone`. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div class="uxm-form-field">`. |

### `FormFieldLabelPosition` / `FormFieldLabelTone`

```ts
type FormFieldLabelPosition = 'top' | 'side';
type FormFieldLabelTone = 'default' | 'muted' | 'strong';
type FormFieldLabelVariant = 'default' | 'overline';
```

Exported as string unions so consumers can build toggle controls without re-declaring the literals.

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
| `--uxm-form-field-label-tint-strong` | `--color-text-strong` | – | Colour of the `strong` tint (`labelTone`). |
| `--uxm-form-field-label-tint-default` | `--color-text` | – | Colour of the `default` tint. |
| `--uxm-form-field-label-tint-muted` | `--color-text-muted` | – | Colour of the `muted` tint. |
| `--uxm-form-field-overline-size` | – | `11px` | Overline label font size (`labelVariant="overline"`). |
| `--uxm-form-field-overline-weight` | – | `600` | Overline label font weight. |
| `--uxm-form-field-overline-letter-spacing` | – | `0.06em` | Overline label letter spacing. |

An `EditableCell` child is outdented by a negative margin so its **text** lands on the label's edge while its hover pill bleeds into the gutter. The distance is not FormField's to know: it reads `--uxm-editable-cell-text-inset`, which `EditableCell` publishes as its own text-to-box-edge measurement. Right-aligned cells are outdented on the trailing edge instead; centered cells aren't outdented at all. Boxed inputs (`TextInput` etc.) are never outdented — their visible border makes the inset intentional.

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

- Renders a native `<label htmlFor={id}>` associated with the control automatically: it prefers an explicit `htmlFor`, else reuses the child's own `id`, else generates one (`useId()`) and injects it via `cloneElement`. Screen readers announce the label on focus and clicking it focuses the control. Note: the injection only works when the child accepts an `id` (plain inputs do); a non-input child (e.g. an `EditableCell`, whose display state is a `<button>` that doesn't take `id`) is left with a dangling `htmlFor` — rely on that control's own `aria-label` there.
- The hint is a plain `<span>` and is not wired via `aria-describedby` to the control. If the hint contains critical guidance, link it explicitly: pass `id` to the hint and `aria-describedby` on the control.
- Layout switching (`top` / `side`) is purely visual — no ARIA implications. The `overline` label variant is also purely visual (typography only).
- Label colour defaults to the `strong` tint (`--color-text-strong`) for contrast; the `muted` tint is dimmer by design — verify it against your surface (the workbench WCAG panel checks each tint's Label Color).
