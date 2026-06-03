# NumberField

A themable numeric input with optional `−` / `+` step buttons and an optional unit suffix. Suppresses the native browser spinner unconditionally; explicit stepper buttons render via the `withSteppers` prop (default `true`).

Bare control — no label. The editor's `NumberInput` knob wraps this atom to add the label row. Architecturally the sister atom of `NumberInput` (typing-only, no buttons); reach for `NumberField` when the explicit ± affordance carries information (e.g. spacing knobs, quantity pickers).

## Usage

```tsx
import { NumberField } from '@viax/uxm';
import { useState } from 'react';

function PaddingKnob() {
  const [px, setPx] = useState(12);
  return (
    <NumberField
      value={px}
      onChange={setPx}
      min={0}
      max={64}
      step={2}
      unit="px"
      aria-label="Padding"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | – | **Required.** Current numeric value. |
| `onChange` | `(value: number) => void` | – | **Required.** Fires on every keystroke and on each stepper click; emitted value is clamped to `[min, max]` for stepper-driven changes. |
| `min` | `number` | – | Lower bound; clamps stepper output. Also forwarded to the underlying `<input type="number">`. |
| `max` | `number` | – | Upper bound; clamps stepper output. Also forwarded to the underlying `<input type="number">`. |
| `step` | `number` | `1` | Delta applied per stepper click and forwarded to the native input. |
| `unit` | `string` | – | Small text suffix (e.g. `"px"`, `"%"`). Hidden when omitted. |
| `withSteppers` | `boolean` | `true` | Render the `−` / `+` buttons either side of the input. Set `false` for a clean keyboard-only field. |
| `disabled` | `boolean` | `false` | Disables input and both steppers; sets `aria-disabled` on the wrapper. |
| `className` | `string` | – | Merged with `uxm-number-field`. |
| `style` | `CSSProperties` | – | Inline style on the wrapper; ideal for overriding `--uxm-number-field-*` vars per instance. |
| `aria-label` | `string` | – | Accessible name for the underlying `<input>`. Provide when there is no visible label. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-number-field-gap` | – | `4px` | Horizontal gap between steppers / input / unit. |
| `--uxm-number-field-input-bg` | `--color-surface` | – | Input background. |
| `--uxm-number-field-input-border` | `--color-border` | – | Input border colour. |
| `--uxm-number-field-input-radius` | – | `6px` | Input border radius. |
| `--uxm-number-field-font-size` | – | `12px` | Input font size. |
| `--uxm-number-field-input-padding-y` | – | `4px` | Input vertical padding. |
| `--uxm-number-field-input-padding-x` | – | `8px` | Input horizontal padding. |
| `--uxm-number-field-input-width` | – | `64px` | Input fixed width. |
| `--uxm-number-field-focus-border` | `--color-accent` | – | Input border on `:focus`. |
| `--uxm-number-field-stepper-radius` | – | `6px` | Stepper button corner radius. |
| `--uxm-number-field-stepper-size` | – | `24px` | Square stepper button size. |
| `--uxm-number-field-unit-color` | `--color-text-subtle` | – | Trailing unit text colour. |
| `--uxm-number-field-unit-size` | – | `11px` | Unit font size. |
| `--uxm-number-field-unit-width` | – | `20px` | Unit fixed width (keeps right edge aligned across rows). |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-surface` | Surfaces / Surface | Default input background; default stepper hover background. |
| `--color-border` | Borders / Border | Default input border. |
| `--color-text-strong` | Text / Text Strong | Input text colour. |
| `--color-text-subtle` | Text / Text Subtle | Default stepper icon colour; default unit text colour. |
| `--color-text` | Text / Text | Stepper icon colour on hover. |
| `--color-accent` | Accent / Accent | Default focused-input border. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Surface-filled input, two outlined-text steppers, optional unit suffix. |
| Focused | `:focus` on input | Input border shifts to `--uxm-number-field-focus-border`. |
| Stepper hover | `:hover` on `__stepper` | Background fills with `--color-surface`; icon colour shifts to `--color-text`. |
| Disabled | `disabled` prop | `aria-disabled` on wrapper; both steppers and input receive native `disabled`. CSS does not impose extra opacity — consumers can layer that on. |
| No steppers | `withSteppers={false}` | Only the input and (optional) unit render. |
| Without unit | `unit` omitted | Unit slot is not rendered (no reserved width). |

## Accessibility

- Renders a native `<input type="number">` — full keyboard arrow-key step increment/decrement is available even with `withSteppers={false}`.
- Stepper buttons are `<button type="button">` with `aria-label="Decrement"` / `"Increment"` so screen readers announce them clearly.
- Provide `aria-label` for the input (no visible label) or wrap in a `<label>` when a visible label is present.
- `disabled` propagates to all three controls and the wrapper carries `aria-disabled="true"`.
- Clamping happens on stepper clicks; values typed directly into the input are forwarded as-is to `onChange` and not clamped — the consumer is responsible if strict bounds are required.
- The native spinner is suppressed via `appearance: textfield` + `-webkit-*-spin-button: none` so the explicit stepper buttons own that affordance and remain the keyboard focus targets.
