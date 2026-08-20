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
| `labelTint` | `'default' \| 'muted' \| 'strong'` | `'strong'` | Label **colour** emphasis (the tint). `strong` = strong text (default, unchanged); `default` = normal text; `muted` = dimmed, for detail panels where the label is secondary to the value. Applies to **both** label variants — the variant owns typography, the tint owns colour. Each tint's colour is themable via `--uxm-form-field-label-tint-*`; an explicit `--uxm-form-field-label-color` still overrides. |
| `labelVariant` | `'default' \| 'overline'` | `'default'` | Label **typography**. `default` = normal label; `overline` = small uppercase, letter-spaced "eyebrow" caps for caps labels above editable fields. Its defaults match `PropertyField`'s look but it has its **own** `--uxm-form-field-overline-*` tokens (nothing shared with PropertyField). Typography only — colour comes from `labelTint`. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div class="uxm-form-field">`. |

### `FormFieldLabelPosition` / `FormFieldLabelTint`

```ts
type FormFieldLabelPosition = 'top' | 'side';
type FormFieldLabelTint = 'default' | 'muted' | 'strong';
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
| `--uxm-form-field-side-label-valign` | – | `center` | Label vertical alignment (`align-self`) within its cell in `side` layout — `center` (default) / `start` / `end`. Set `start` to top-align the label next to a tall control (radio group / checkbox list). Only the label cell moves; the control cell follows the grid's `align-items`. |
| `--uxm-form-field-label-tint-strong` | `--color-text-strong` | – | Colour of the `strong` tint (`labelTint`). |
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

## Implementation notes

- **A labelled field is a definite-width context, and tells its control so.** The control column is whatever the label leaves over, so a nested control must fit that width rather than assert one of its own. `FormField` sets two knobs on the control wrapper (`.uxm-form-field__control`) — **not** on the cell via a child selector — so they inherit to an `EditableCell` at any depth, including one wrapped in a row that pairs it with a translation count or a unit suffix:

  - `--uxm-editable-cell-outdent: 1` — the cell pulls itself back by its own text inset so its **text** lands on the label's content grid while the hover pill bleeds into the gutter. A flag, not a length, deliberately: `--uxm-editable-cell-text-inset` is declared *by* the cell and resolves nowhere above it, so a host computing the length itself silently gets the fallback (9px, the `small` value) instead of the real one — a 4px error at `medium`. The cell also owns the direction: `align-right` pulls on the trailing side, `align-center` not at all. A cell that isn't on its column's leading edge opts out with `--uxm-editable-cell-outdent: 0`.
  - `--uxm-editable-cell-editing-track-floor: 0` — switches the cell's edit-mode track off the `max-content` floor that exists to keep an *auto-sized* table column from jumping. There is no auto column here, and that floor is what pushed a long draft out through the `Card`.

  Same division of labour in both cases: the cell owns the mechanism and publishes the knob, `FormField` only states which behaviour its context wants. Boxed inputs (`TextInput` etc.) read neither knob — their visible border makes the inset intentional.

  Because both are **inherited** custom properties, they also reach cells this field never meant to touch. A component that renders its own `EditableCell`s inside a control — a `DataTable` nested in a form field — resets both on its own root so it keeps the anti-jump floor and stays un-outdented; `DataTable` does this. Anything else that composes cells should do the same.
- **The side layout's control column is `minmax(0, 1fr)`, not `1fr`.** The two are not interchangeable: `1fr` means `minmax(auto, 1fr)`, whose automatic minimum is the column's min-content width, and a control that can't wrap contributes its full single-line width to that. An `EditableCell` is exactly such a control (it ellipsizes, so `white-space: nowrap`), so a long value grew the column instead of truncating in it and pushed the field out of its `Card`. The explicit `0` minimum lets the column shrink to the space that's actually there and hands the overflow decision back to the control. Nothing relies on the auto minimum here — the label column is a fixed width and this one is purely the remainder. Worth copying into any consumer-side grid that holds a truncating control. ⚠️ The `0` minimum applies to **every** control composed into a side field, not just `EditableCell`: a child that doesn't manage its own overflow can now be compressed and visually clip, where the implicit min-content floor used to widen the field instead. Most UXM input atoms fill `width: 100%` and truncate their own text, so this is usually invisible — but three shipped atoms do not, and will clip in a control column narrower than their content:

  - **`ColorInput`** is a fixed `width: var(--uxm-color-input-width, 260px)`, not `100%`, and does not shrink.
  - **`RadioGroup`'s `--horizontal` layout** is a `flex-direction: row` container at the default `nowrap`, with no truncation on the option labels.
  - **`PillSelect`'s `--chips-below` trigger** forces `flex-wrap: nowrap` but gives its placeholder/summary text no `min-width: 0` or `text-overflow`, unlike `Select`'s `__trigger-label`, which has both.

  Give any of those a wider label column, or an explicit width, when the value can get long. Hand-rolled content (a row of fixed-width chips, say) has the same exposure.

## Accessibility

- Renders a native `<label htmlFor={id}>` associated with the control automatically: it prefers an explicit `htmlFor`, else reuses the child's own `id`, else generates one (`useId()`) and injects it via `cloneElement`. Screen readers announce the label on focus and clicking it focuses the control. Note: the injection only works when the child accepts an `id` (plain inputs do); a non-input child (e.g. an `EditableCell`, whose display state is a `<button>` that doesn't take `id`) is left with a dangling `htmlFor` — rely on that control's own `aria-label` there.
- The hint is a plain `<span>` and is not wired via `aria-describedby` to the control. If the hint contains critical guidance, link it explicitly: pass `id` to the hint and `aria-describedby` on the control.
- Layout switching (`top` / `side`) is purely visual — no ARIA implications. The `overline` label variant is also purely visual (typography only).
- Label colour defaults to the `strong` tint (`--color-text-strong`) for contrast; the `muted` tint is dimmer by design — verify it against your surface (the workbench WCAG panel checks each tint's Label Color).
