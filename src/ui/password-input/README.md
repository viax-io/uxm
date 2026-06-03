# PasswordInput

A password field with an optional trailing show / hide eye toggle. Mirrors `DateInput`'s inner-styled-atom shape: the root `.uxm-password-input` is a positioning wrapper; the visible field lives on `.uxm-password-input__input`.

The trailing element is a real `<button>` so the same hover colour-shift pattern works for it. No popover — toggling visibility is a synchronous prop flip on the inner `<input type>`, so there is nothing to anchor below the field. When showing the value as plain text, the letter-spacing override is dropped so normal strings read correctly.

## Usage

```tsx
import { PasswordInput } from '@viax/uxm';

function LoginForm() {
  return (
    <PasswordInput
      name="password"
      placeholder="Password"
      autoComplete="current-password"
      defaultVisible={false}
    />
  );
}
```

## Props

Extends `Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>` — `type` is owned by the component (flipped between `"password"` and `"text"`). All other native input attributes pass through.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `toggle` | `boolean` | `true` | Render the trailing eye toggle. Set `false` for a strict masked field (kiosk / policy contexts). |
| `defaultVisible` | `boolean` | `false` | Initial visibility for uncontrolled toggle. |
| `visible` | `boolean` | – | Controlled visibility. Pair with `onToggleVisible`. |
| `onToggleVisible` | `(visible: boolean) => void` | – | Fires when the toggle is clicked; receives the next visibility. Useful for form-level "show all" affordances. |
| `autoComplete` | `string` | `'current-password'` | Forwarded to the input. Override to `'new-password'` for sign-up forms. |
| `className` | `string` | – | Merged with `uxm-password-input` on the wrapper. |
| _(any other native input attribute)_ | – | – | Spread onto the inner `<input>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-password-input-background-color` | `--color-card` | – | Input background. |
| `--uxm-password-input-color` | `--color-text` | – | Input text colour. |
| `--uxm-password-input-border-color` | `--color-border` | – | Input border. |
| `--uxm-password-input-border-radius` | – | `8px` | Input corner radius. |
| `--uxm-password-input-padding-y` | – | `10px` | Vertical input padding. |
| `--uxm-password-input-padding-x` | – | `12px` | Left padding (right is computed to leave room for the toggle). |
| `--uxm-password-input-font-size` | – | `14px` | Input font size. |
| `--uxm-password-input-icon-offset` | – | `12px` | Distance from the right edge to the toggle. |
| `--uxm-password-input-icon-size` | – | `16px` | Toggle icon size. |
| `--uxm-password-input-icon-color` | `--color-text-muted` | – | Toggle icon default colour. |
| `--uxm-password-input-icon-hover-color` | `--color-text` | – | Toggle icon colour on hover. |
| `--uxm-password-input-hover-bg` | `--color-card` | – | Input hover background. |
| `--uxm-password-input-hover-border` | `--color-accent` | – | Input hover border. |
| `--uxm-password-input-focus-border` | `--color-accent` | – | Input focused border. |
| `--uxm-password-input-focus-ring` | `--color-accent` | – | Outline ring on focus. |
| `--uxm-password-input-disabled-bg` | `--color-surface-alt` | – | Disabled background. |
| `--uxm-password-input-disabled-border` | `--color-border` | – | Disabled border. |
| `--uxm-password-input-disabled-color` | `--color-text-muted` | – | Disabled text. |
| `--uxm-password-input-disabled-opacity` | – | `0.6` | Disabled opacity. |
| `--uxm-password-input-error-bg` | `--color-card` | – | Error background. |
| `--uxm-password-input-error-border` | `--color-danger-text` | – | Error border. |
| `--uxm-password-input-error-color` | `--color-danger-text` | – | Toggle icon colour in error mode. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Default and hover background. |
| `--color-text` | Text / Text | Input text; toggle hover colour. |
| `--color-text-muted` | Text / Text Muted | Default toggle icon colour; disabled text. |
| `--color-border` | Borders / Border | Default and disabled border. |
| `--color-accent` | Accent / Accent | Hover / focus border + focus outline ring. |
| `--color-surface-alt` | Surfaces / Surface Alt | Disabled background. |
| `--color-danger-text` | Semantic / Danger Text | Error border + error-mode toggle icon. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default (masked) | – | Card-filled input with bullet glyphs; eye icon trailing. |
| Visible | `visible={true}` (or toggle clicked uncontrolled) | Renders as `type="text"`; toggle shows `eye-slash`; letter-spacing returns to normal. |
| Hover | `:hover` on input (or `--state-hover` on wrapper) | Border shifts to accent. |
| Focus | `:focus` on input (or `--state-focus` on wrapper) | Accent border + 2px accent outline ring. |
| Disabled | `disabled` attribute | Surface-alt fill, muted text, 0.6 opacity, `not-allowed`. |
| Error | `.uxm-password-input--error` on wrapper | Danger-text border + danger-tinted toggle icon. |
| No toggle | `toggle={false}` | Toggle button is not rendered; right padding is still reserved. |

## Accessibility

- Renders a native `<input>` with `type` flipped between `"password"` and `"text"` — assistive tech announces the correct field type and `autoComplete` continues to work.
- Toggle is a `<button type="button">` with dynamic `aria-label` (`"Show password"` / `"Hide password"`) and `aria-pressed` reflecting the current visibility — screen readers announce the toggle state.
- Default `autoComplete="current-password"`; override to `"new-password"` for sign-up flows so password managers behave correctly.
- The wrapper does not currently associate the toggle with the input via `aria-controls`; consumers wiring the input into a `<label>` should label the input directly so both controls inherit the form-level name.
- Forced state modifiers (`--state-hover`, `--state-focus`) are visual-only — use only in preview / catalog contexts.
- The default `letter-spacing: 0.02em` on the masked input keeps bullet glyphs visually even across the brand font cascade; it's dropped automatically when the value becomes visible.
