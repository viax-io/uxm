# CurrencyInput

A monetary input with a leading interactive currency picker (the shared `<Listbox>` — searchable, keyboard-navigable). Value is `{ currency, amount }` — ISO 4217 code plus raw digit string.

Architecturally mirrors `PhoneInput`: the wrapper is the visible surface, the picker slot is a `<button>` that opens the shared `<Listbox>` (positioning, portal, dismiss, keyboard nav, search, and ARIA all owned by Listbox), and the inner `<input type="text">` handles the amount with `inputMode="decimal"` (or `"numeric"` for zero-decimal currencies like JPY). Display flips on focus: raw digits while the input has focus (easy to edit), locale-formatted thousands on blur (easy to read). The mask enforces the active currency's `decimals` precision; switching currencies re-masks the amount under the new precision (USD/2 → JPY/0 drops the decimals).

## Usage

```tsx
import { CurrencyInput, type CurrencyValue } from '@viax.io/uxm';

function Example() {
  const [value, setValue] = useState<CurrencyValue>({ currency: 'USD', amount: '' });
  return (
    <CurrencyInput
      value={value}
      onChange={setValue}
      locale="en-US"
      min={0}
      max={1_000_000}
    />
  );
}
```

## Props

`CurrencyInputProps` extends `Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'type' | 'min' | 'max' | 'style'>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `CurrencyValue` | – | Controlled value. Pair with `onChange`. |
| `defaultValue` | `CurrencyValue` | `{ currency: 'USD', amount: '' }` | Initial value for uncontrolled usage. |
| `onChange` | `(next: CurrencyValue) => void` | – | Fires on every keystroke and on currency pick with the next value. |
| `currencies` | `Currency[]` | `CURATED_CURRENCIES` (~20 entries) | Currency list shown in the picker. Pass a single-entry array to effectively lock currency selection. |
| `locale` | `string` | `'en-US'` | BCP-47 tag — drives the thousands-separator style on blur. Does NOT drive symbol position. |
| `min` | `number` | – | Clamp the committed amount down to this minimum on blur. |
| `max` | `number` | – | Clamp the committed amount up to this maximum on blur. |
| `allowNegative` | `boolean` | `false` | Allow a leading `-` sign (refunds / credits). |
| `clearable` | `boolean` | `true` | Show a clear (✕) button at the trailing edge when the amount has a value. Clearing wipes the amount and keeps the selected currency; the component owns the reset (fires `onChange` with an empty amount), so no `onClear` is needed. |
| `style` | `CSSProperties` | – | Inline style on the WRAPPER, forwarded to the Listbox panel (`panelStyle`). Custom-property declarations here reach the field and the picker. |
| `className` | `string` | – | Merged onto the wrapper via `cn`. |
| `disabled` | `boolean` | `false` | Disables both picker and amount input; adds the `--disabled` modifier. |
| `onFocus` / `onBlur` | `(e: FocusEvent) => void` | – | Forwarded after internal focus-state and clamp logic run. |
| `placeholder` | `string` | `'0.00'` (decimals > 0) / `'0'` (decimals = 0) | Forwarded to the amount input. |
| _(other native input attributes)_ | – | – | Spread onto the inner `<input>`. |
| `clearLabel` | `string` | `'Clear'` | Accessible name for the clear button. |
| `chooseCurrencyLabel` | `string` | `'Choose currency'` | Accessible name for the currency picker trigger. |

### `CurrencyValue`

```ts
interface CurrencyValue {
  currency: string; // ISO 4217 code
  amount: string;   // raw digit string with optional `.` decimal
}
```

| Field | Type | Description |
|-------|------|-------------|
| `currency` | `string` | ISO 4217 currency code (e.g. `"USD"`, `"EUR"`, `"JPY"`). |
| `amount` | `string` | Raw digit string — no thousands separators, no symbol. May contain a single `.` decimal and (if `allowNegative`) a leading `-`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-currency-input-background-color` | `--color-card` | – | Wrapper background. |
| `--uxm-currency-input-border-color` | `--color-border` | – | Wrapper border. |
| `--uxm-currency-input-border-radius` | – | `8px` | Wrapper border-radius. |
| `--uxm-currency-input-color` | `--color-text` | – | Default text colour (input, picker, code). |
| `--uxm-currency-input-padding-y` | – | `10px` | Vertical padding on the input + picker. |
| `--uxm-currency-input-padding-x` | – | `12px` | Horizontal padding on the input + picker. |
| `--uxm-currency-input-font-size` | – | `14px` | Input + picker font size. |
| `--uxm-currency-input-hover-bg` | `--color-card` | – | Wrapper hover background. |
| `--uxm-currency-input-hover-border` | `--color-accent` | – | Wrapper hover border. |
| `--uxm-currency-input-focus-border` | `--color-accent` | – | Focus-within border. |
| `--uxm-currency-input-focus-ring` | `--color-accent` | – | Focus-within outline. |
| `--uxm-currency-input-disabled-bg` | `--color-surface-alt` | – | Disabled wrapper background. |
| `--uxm-currency-input-disabled-border` | `--color-border` | – | Disabled wrapper border. |
| `--uxm-currency-input-disabled-color` | `--color-text-muted` | – | Disabled text colour. |
| `--uxm-currency-input-disabled-opacity` | – | `0.6` | Disabled wrapper opacity. |
| `--uxm-currency-input-error-bg` | `--color-card` | – | Error-state wrapper background. |
| `--uxm-currency-input-error-border` | `--color-danger-text` | – | Error-state wrapper border. |
| `--uxm-currency-input-error-color` | `--color-danger-text` | – | Error-state caret colour. |
| `--uxm-currency-input-divider-color` | `--color-border` | – | Border between picker and input. |
| `--uxm-currency-input-symbol-color` | `--color-text` | – | Currency symbol colour in the picker. |
| `--uxm-currency-input-caret-color` | `--color-text-muted` | – | Chevron colour in the picker. |
| `--uxm-currency-input-picker-hover-bg` | `--color-surface-alt` | – | Picker-button hover background. |

The currency picker panel is the shared `<Listbox>` (`.uxm-listbox__panel`) — its chrome (background, border, radius, row states, search box) is themed once via the **Listbox** registry entry / `--uxm-listbox-*` vars, so CurrencyInput has no popover vars of its own.

The error state (`uxm-currency-input--error`) is driven by the `error?: string` prop: a non-empty value toggles the modifier class, sets `aria-invalid` on the amount input, and renders a `FieldError` message below the field.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Wrapper bg, popover bg. |
| `--color-surface-alt` | Surfaces / Surface Alt | Disabled bg, picker hover bg, popover row hover bg. |
| `--color-border` | Borders / Border | Wrapper border, picker divider, popover border + search divider. |
| `--color-text` | Text / Text | Default text, symbol colour. |
| `--color-text-muted` | Text / Text Muted | Caret, disabled text, placeholder, popover meta. |
| `--color-text-inverse` | Text / Text Inverse | Selected popover row text. |
| `--color-accent` | Accent / Accent | Hover border, focus border + outline, selected popover row bg. |
| `--color-danger-text` | Semantic / Danger Text | Error border + caret tone. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Card bg, border outline, leading currency picker with divider on its right edge; amount text left-aligned. |
| Hover | `:hover` on wrapper (not disabled / not error) | Border shifts to `--color-accent`; 0.15s transition. |
| Focus-within | `:focus-within` (input or popover search focused) | Border + 2px outline in `--color-accent`. |
| Disabled | `disabled` prop | `--disabled` modifier: muted text, surface-alt bg, 0.6 opacity, `cursor: not-allowed`. |
| Error | non-empty `error` prop | `--error` modifier: danger border + danger-toned caret + `aria-invalid` on the amount input + a `FieldError` message below. The amount text stays in default colour for readability. |
| Clearable | `clearable` (default) + non-empty amount, non-disabled | Trailing ✕ (`.uxm-field-clear`, 22×22) clears the amount, keeps the currency. |
| Focused (raw digits) | input has focus | Input shows raw `current.amount`; mask runs over keystrokes directly. |
| Blurred (formatted) | input loses focus | Input shows `Intl.NumberFormat(locale, { decimals })` of `amount`; on next change the value is parsed back through `parseFromDisplay`. |
| Popover open | picker click | Searchable list of currencies; search input auto-focused on next animation frame; outside-click or `Escape` closes. |
| Popover row selected | `c.code === current.currency` | Accent-bg highlight with inverse text. |
| Popover empty | search query matches nothing | Renders "No currencies match." |
| Currency switch | popover row click | Re-masks `amount` under the new currency's `decimals` (e.g. USD → JPY drops the decimal portion). |
| Blur clamp | `min` / `max` set | On blur, `amount` is parsed, clamped, and committed if it changed. |

## Accessibility

- Picker button carries `aria-label="Currency: {name}"`, `aria-expanded`, and `aria-haspopup="listbox"`.
- The picker panel is the shared `Listbox`: the portaled panel is `role="listbox"` with `aria-label="Choose currency"`, and each row is a `role="option"` button with `aria-selected` reflecting the active currency. The search input carries `aria-label="Search currencies"` and points `aria-activedescendant` at the arrow-highlighted row.
- The amount input uses `type="text"` + `inputMode="decimal"` (or `"numeric"` for zero-decimal currencies) and `autoComplete="off"` — same rationale as `PhoneInput`: native `type="number"` ships browser spinners and autofill heuristics that fight the mask.
- Outside-click and `Escape` close the popover; on open, focus moves to the search input via `requestAnimationFrame`.
- Clear button: `<button aria-label="Clear">`; `onMouseDown` is prevented so the click doesn't blur-clamp the input before the reset lands.
- The disabled state is implemented via both the `disabled` attribute on the picker and amount input AND the `--disabled` modifier class — assistive tech announces both controls as unavailable.
- The error state is wired from the `error` prop: a non-empty value sets `aria-invalid` on the amount input and renders a `FieldError` message below the field.
- Row symbols are wrapped in `aria-hidden="true"`; the accessible name of each option is the currency name and code.
