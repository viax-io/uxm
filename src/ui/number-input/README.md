# NumberInput

A themable typing-only numeric input. No `−` / `+` buttons (use `NumberField` for that), no currency formatting (use `CurrencyInput`). Strips non-digit characters in real time; `min` / `max` clamping fires on blur so typing isn't yanked mid-character.

Architecturally mirrors `TextInput`: the root `<input>` IS the visible surface (no positioning wrapper), so the `--state-*` forced modifiers and `:hover` / `:focus` / `:disabled` pseudos all target the same element. Uses `type="text"` with `inputMode="numeric"` (or `"decimal"`) rather than `type="number"` to avoid browser spinner UI, autofill heuristics, and per-browser disagreement over accepted characters.

## Usage

```tsx
import { NumberInput } from '@viax.io/uxm';
import { useState } from 'react';

function QuantityField() {
  const [qty, setQty] = useState('');
  return (
    <NumberInput
      value={qty}
      onChange={setQty}
      min={0}
      max={9999}
      allowDecimal
      decimals={2}
      placeholder="0"
    />
  );
}
```

## Props

Extends `Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'type' | 'min' | 'max'>` — `placeholder`, `disabled`, `aria-*`, `onBlur`, etc. are forwarded to the inner `<input>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | – | Controlled value, as a digit string (e.g. `"1234"`, `"-12.5"`). |
| `defaultValue` | `string` | – | Initial value for uncontrolled usage. |
| `onChange` | `(value: string) => void` | – | Fires on every keystroke with the masked, digit-only string. |
| `min` | `number` | – | Clamps committed value on blur. |
| `max` | `number` | – | Clamps committed value on blur. |
| `allowNegative` | `boolean` | `false` | Allow a leading `-` sign. |
| `allowDecimal` | `boolean` | `false` | Allow a single `.` separator. |
| `decimals` | `number` | `2` | Maximum number of decimal places when `allowDecimal` is true. |
| `clearable` | `boolean` | `true` | Render a trailing clear (✕) button (the shared `.uxm-field-clear` affordance) when the input has a non-empty value and isn't disabled. Clearing wipes the value and fires `onChange('')`. |
| `error` | `string` | – | Non-empty string switches the input to its error state: the `--error` modifier re-tones background/border, `aria-invalid` + `aria-describedby` land on the `<input>`, and the message renders below. |
| `className` | `string` | – | Merged with `uxm-number-input`. |
| `onBlur` | `FocusEventHandler` | – | Invoked after blur-time clamping. |
| _(any other native input attribute)_ | – | – | Spread onto the `<input>`. |
| `clearLabel` | `string` | `'Clear'` | Accessible name for the clear button. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-number-input-bg` | `--color-card` | – | Input background. |
| `--uxm-number-input-color` | `--color-text` | – | Input text colour. |
| `--uxm-number-input-border-color` | `--color-border` | – | Input border colour. |
| `--uxm-number-input-border-radius` | – | `8px` | Border radius. |
| `--uxm-number-input-padding-y` | – | `10px` | Vertical padding. |
| `--uxm-number-input-padding-x` | – | `12px` | Horizontal padding. |
| `--uxm-number-input-font-size` | – | `14px` | Font size. |
| `--uxm-number-input-text-align` | – | `left` | Text alignment. |
| `--uxm-number-input-hover-bg` | `--color-card` | – | Hover background. |
| `--uxm-number-input-hover-border` | `--color-accent` | – | Hover border. |
| `--uxm-number-input-focus-border` | `--color-accent` | – | Focused border. |
| `--uxm-number-input-focus-ring` | `--color-accent` | – | `outline` colour on focus. |
| `--uxm-number-input-disabled-bg` | `--color-surface-alt` | – | Disabled background. |
| `--uxm-number-input-disabled-border` | `--color-border` | – | Disabled border. |
| `--uxm-number-input-disabled-color` | `--color-text-muted` | – | Disabled text. |
| `--uxm-number-input-disabled-opacity` | – | `0.6` | Disabled opacity. |
| `--uxm-number-input-error-bg` | `--color-card` | – | Error background. |
| `--uxm-number-input-error-border` | `--color-danger-text` | – | Error border. |
| `--uxm-number-input-error-color` | `--color-danger-text` | – | Error-message colour. |
| `--uxm-number-input-error-message-size` | – | `12px` | Error-message font size. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Default and hover background. |
| `--color-text` | Text / Text | Default text colour. |
| `--color-text-muted` | Text / Text Muted | Placeholder colour; disabled text. |
| `--color-border` | Borders / Border | Default and disabled border. |
| `--color-accent` | Accent / Accent | Hover / focus border + focus outline ring. |
| `--color-surface-alt` | Surfaces / Surface Alt | Disabled background. |
| `--color-danger-text` | Semantic / Danger Text | Error border. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Card-filled input with neutral border. |
| Hover | `:hover` (non-disabled, non-error) or `--state-hover` modifier | Border shifts to accent. |
| Focus | `:focus` or `--state-focus` modifier | Accent border + 2px accent outline ring with 2px offset. |
| Disabled | `disabled` attribute | Surface-alt fill, muted text, `not-allowed` cursor, 0.6 opacity. |
| Error | non-empty `error` prop (or `.uxm-number-input--error` class) | Danger-text border; message rendered below the input. |
| Clearable | `clearable` (default) + non-empty value | Trailing padding reserved; shared 22×22 `.uxm-field-clear` button with `close` icon. |
| Decimal mode | `allowDecimal={true}` | Allows a single `.`; trims excess decimal places to `decimals`. `inputMode="decimal"`. |
| Negative allowed | `allowNegative={true}` | Allows a leading `-`. |

## Accessibility

- Renders a native `<input type="text">` with `inputMode="numeric"` (or `"decimal"`) — mobile users get the digit-only soft keyboard without the side-effects of `type="number"`.
- `autoComplete="off"` is forced to prevent browser autofill from clobbering masked values.
- Supply a visible label or `aria-label` — the component does not render its own label.
- Forced state modifiers (`--state-hover`, `--state-focus`) are visual-only — they don't affect focus management, so use them only in preview / catalog contexts.
- Clamping is intentionally deferred to `blur` so users typing intermediate values (`"-"`, `"12."`) aren't disrupted mid-keystroke.
- A non-empty `error` sets `aria-invalid` on the `<input>` and links it to the message via `aria-describedby`, so assistive tech announces both the state and the reason.
- The clear button is a real `<button type="button">` with `aria-label="Clear"`; it keeps focus in the input (mousedown is prevented) so clearing doesn't trigger a blur-clamp on the wiped value.
