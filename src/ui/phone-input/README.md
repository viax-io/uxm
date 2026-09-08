# PhoneInput

A composite phone-number input with a leading country picker (flag + dial code + caret) and a national-number text field. The country button opens the shared `<Listbox>` — a searchable, scrollable panel (positioning, portal, dismiss, keyboard nav, and ARIA all owned by Listbox); selecting a country closes it.

The value is split into `{ country, number }` — country as an ISO-3166 alpha-2 code, number as raw digits (no formatting). Display formatting is applied via `maskNumber()` from the per-country `format` mask; the stored value stays normalized so consumers don't have to round-trip the mask. Uses `type="text"` + `inputMode="numeric"` (rather than `type="tel"`) to avoid browser phone-autofill heuristics that intercept keystrokes and fight controlled values.

Country list defaults to a curated set of ~30 entries (`CURATED_COUNTRIES`); pass a custom list for a region-restricted or extended global set.

## Usage

```tsx
import { PhoneInput, type PhoneValue } from '@viax.io/uxm';
import { useState } from 'react';

function ContactForm() {
  const [phone, setPhone] = useState<PhoneValue>({ country: 'US', number: '' });
  return (
    <PhoneInput value={phone} onChange={setPhone} placeholder="(555) 123-4567" />
  );
}
```

## Props

Extends `Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'type' | 'style'>` — most native input props pass through to the number field. `style` is applied to the WRAPPER (and forwarded to the Listbox panel via `panelStyle`) so CSS custom properties reach both the field and the picker.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `PhoneValue` | – | Controlled value (`{ country, number }`). Pair with `onChange`. |
| `defaultValue` | `PhoneValue` | `{ country: 'US', number: '' }` | Initial value for uncontrolled usage. |
| `onChange` | `(next: PhoneValue) => void` | – | Fires after each keystroke or country selection. |
| `countries` | `PhoneCountry[]` | `CURATED_COUNTRIES` | Country list shown in the picker. Each entry's `format` controls the per-country digit mask and `maxDigitsFor` cap. |
| `clearable` | `boolean` | `true` | Show a clear (✕) button at the trailing edge when the national number has a value. Clearing wipes the number and keeps the selected country; the component owns the reset (fires `onChange` with an empty number), so no `onClear` is needed. |
| `placeholder` | `string` | derived from country format | Placeholder for the national-number input. Defaults to the country's format string with `X` → `0`. |
| `disabled` | `boolean` | – | Disables the whole field (country button + input). |
| `className` | `string` | – | Merged with `uxm-phone-input` on the wrapper. |
| `style` | `CSSProperties` | – | Applied to the WRAPPER and forwarded to the Listbox panel (`panelStyle`). Use to set per-instance `--uxm-phone-input-*` vars. |
| _(any other native input attribute)_ | – | – | Spread onto the inner number `<input>`. |
| `clearLabel` | `string` | `'Clear'` | Accessible name for the clear button. |
| `chooseCountryLabel` | `string` | `'Choose country'` | Accessible name for the country picker trigger. |

### `PhoneValue`

```ts
interface PhoneValue {
  country: string; // ISO-3166 alpha-2, e.g. "US"
  number: string;  // raw digits, no formatting
}
```

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-phone-input-background-color` | `--color-card` | – | Wrapper background. |
| `--uxm-phone-input-border-color` | `--color-border` | – | Wrapper border. |
| `--uxm-phone-input-border-radius` | – | `8px` | Wrapper corner radius. |
| `--uxm-phone-input-padding-y` | – | `10px` | Vertical padding (country button + input). |
| `--uxm-phone-input-padding-x` | – | `12px` | Horizontal padding (country button + input). |
| `--uxm-phone-input-font-size` | – | `14px` | Country dial-code + input font size. |
| `--uxm-phone-input-color` | `--color-text` | – | Default text colour (input + country). |
| `--uxm-phone-input-divider-color` | `--color-border` | – | Border between country button and input. |
| `--uxm-phone-input-caret-color` | `--color-text-muted` | – | Country caret colour. |
| `--uxm-phone-input-country-hover-bg` | `--color-surface-alt` | – | Country button hover background. |
| `--uxm-phone-input-hover-bg` | `--color-card` | – | Wrapper hover background. |
| `--uxm-phone-input-hover-border` | `--color-accent` | – | Wrapper hover border. |
| `--uxm-phone-input-focus-border` | `--color-accent` | – | Wrapper focused border. |
| `--uxm-phone-input-focus-ring` | `--color-accent` | – | Wrapper focus outline ring. |
| `--uxm-phone-input-disabled-bg` | `--color-surface-alt` | – | Disabled background. |
| `--uxm-phone-input-disabled-border` | `--color-border` | – | Disabled border. |
| `--uxm-phone-input-disabled-color` | `--color-text-muted` | – | Disabled text. |
| `--uxm-phone-input-disabled-opacity` | – | `0.6` | Disabled opacity. |
| `--uxm-phone-input-error-bg` | `--color-card` | – | Error background. |
| `--uxm-phone-input-error-border` | `--color-danger-text` | – | Error border. |
| `--uxm-phone-input-error-color` | `--color-danger-text` | – | Country caret colour in error mode. |

The country picker panel is the shared `<Listbox>` (`.uxm-listbox__panel`) — its chrome (background, border, radius, row hover/selected states, search box) is themed once via the **Listbox** registry entry / `--uxm-listbox-*` vars, so PhoneInput has no popover vars of its own.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Wrapper + popover background; hover / error backgrounds. |
| `--color-border` | Borders / Border | Wrapper border; country / input divider; popover border. |
| `--color-text` | Text / Text | Input + country text. |
| `--color-text-muted` | Text / Text Muted | Caret, placeholder, search-icon, dial-code in rows. |
| `--color-surface-alt` | Surfaces / Surface Alt | Country-button hover; disabled bg; popover row hover. |
| `--color-accent` | Accent / Accent | Hover / focus border + focus ring; selected-row background. |
| `--color-text-inverse` | Text / Text Inverse | Selected-row text colour. |
| `--color-danger-text` | Semantic / Danger Text | Error border + error-mode caret. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Card-filled wrapper, leading country button (flag + dial + caret), divider, national-number input. |
| Hover | `:hover` (non-disabled, non-error) or `--state-hover` | Wrapper border shifts to accent. |
| Focus | `:focus-within` or `--state-focus` | Accent border + 2px accent outline ring. |
| Disabled | `disabled` prop / `--state-disabled` | Surface-alt fill, muted text, `not-allowed`, 0.6 opacity. |
| Error | `.uxm-phone-input--error` | Danger border; caret tinted danger. |
| Open popover | `isOpen` (country button click / `aria-expanded="true"`) | Anchored 4px below the field, full-width, drop-shadowed, max-height 320px scroll list with a leading search input. |
| Empty filter | `search` matches no countries | Single "No countries match." row. |
| Selected row | `c.iso === current.country` | Accent background + inverse text + bold weight. |
| Clearable | `clearable` (default) + non-empty number, non-disabled | Trailing ✕ (`.uxm-field-clear`, 22×22) clears the number, keeps the country. |

## Accessibility

- Country button: `<button>` with `aria-label="Country: {name}"`, `aria-expanded`, and `aria-haspopup="listbox"`.
- The country picker is the shared `Listbox`: the portaled panel is `role="listbox"` with `aria-label="Choose country"`, and each row is a `<button role="option">` with `aria-selected`. The search input carries `aria-label="Search countries"` and points `aria-activedescendant` at the arrow-highlighted row.
- Search input is auto-focused on popover open (via `requestAnimationFrame`) so users can filter immediately.
- Outside click and `Escape` close the popover.
- Clear button: `<button aria-label="Clear">`; `onMouseDown` is prevented so the click doesn't blur the input before the reset lands.
- National-number input uses `type="text"` + `inputMode="numeric"` for digit-only soft keyboards on mobile while avoiding `type="tel"`'s autofill collisions.
- Forced state modifiers (`--state-hover`, `--state-focus`, `--state-disabled`) are visual-only.
- The component does not provide a visible label — wrap with a `<label>` or supply `aria-label` / `aria-labelledby` on the input via spread props.
- Keyboard navigation inside the popover list is not implemented (no arrow-key roving); rows are tab-reachable and `Enter` activates them, but a long list isn't quickly navigable without a pointer.
