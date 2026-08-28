# NumberStepper

A themable numeric field with explicit `−` / `+` step buttons and an optional unit suffix. The browser's native spinner is suppressed unconditionally — the explicit buttons own that affordance.

The ± buttons **compose the [`IconButton`](../icon-button/README.md) atom** rather than rendering bespoke `<button>` elements. Visual treatment (background, hover, active, focus ring, radius, size) flows from IconButton's own variables, so icon buttons look identical everywhere in the app; this atom owns only the semantic wiring — the `onClick` handlers that do the ± maths and clamp to `min`/`max`, and the `aria-label`s that name the operation. IconButton knows nothing about numbers, NumberStepper knows nothing about how a button looks. That is why there is deliberately **no `.uxm-number-stepper__button` ruleset**: a button-specific knob here would silently diverge from IconButton elsewhere.

**Bare control — no label.** The studio's `NumberInput` knob wraps this to add the label row.

## Sister atoms

| Atom | Use when |
|------|----------|
| `NumberStepper` | A bounded value that benefits from step affordances. |
| [`NumberInput`](../number-input/README.md) | Typing-only numeric field, no buttons — unbounded values or raw digits (IDs). |
| [`CurrencyInput`](../currency-input/README.md) | Monetary values — typing + locale formatting + currency picker. |

## Usage

```tsx
import { NumberStepper } from '@viax/uxm/ui';

const [size, setSize] = useState(12);

<NumberStepper
  value={size}
  onChange={setSize}
  min={8}
  max={72}
  step={2}
  unit="px"
  aria-label="Font size"
/>

// Invalid state — the message renders below the field.
<NumberStepper
  value={size}
  onChange={setSize}
  error={size > 72 ? 'Maximum is 72px' : undefined}
  aria-label="Font size"
/>
```

## Props

Does **not** extend a native attribute interface — the prop list is closed, and only `className`, `style` and `aria-label` pass through.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | – | **Required.** Controlled value. There is no uncontrolled mode. |
| `onChange` | `(value: number) => void` | – | **Required.** Fires on typing and on either step button. |
| `min` | `number` | – | Lower clamp for the step buttons; also set as the input's `min`. |
| `max` | `number` | – | Upper clamp for the step buttons; also set as the input's `max`. |
| `step` | `number` | `1` | Increment applied by the ± buttons. |
| `unit` | `string` | – | Small suffix after the field (e.g. `"px"`). Occupies a fixed 20px slot so the layout doesn't shift between `px` and `rem`. |
| `disabled` | `boolean` | `false` | Disables the input and both buttons, and sets `aria-disabled` on the wrapper, which dims the whole field. |
| `error` | `string` | – | Non-empty marks the field invalid: adds `--error`, sets `aria-invalid` + `aria-describedby`, renders the message below. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| `style` | `CSSProperties` | – | Applied to the wrapper — the usual place to project CSS variables. |
| `aria-label` | `string` | – | Accessible name for the `<input>`. See Accessibility. |
| `decrementLabel` | `string` | `'Decrement'` | Accessible name for the − button. |
| `incrementLabel` | `string` | `'Increment'` | Accessible name for the + button. |
| `id` / `aria-describedby` | `string` | – | Forwarded to the field wrapper. `FormField` injects both (label association + hint), so the atom is hint-associable; describedby merges with the atom's own error-message id, consumer ids first. |

The component carries a static `NumberStepper.hasError = true` flag, which the studio reads to know the atom has an error state.

**Clamping is button-only.** `min`/`max` bound what the ± buttons produce, but a typed value is passed to `onChange` as-is — the native `min`/`max` attributes do not block typing. Out-of-range typed input is exactly what `error` is for.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-number-stepper-gap` | – | `4px` | Space between buttons, input and unit. |
| `--uxm-number-stepper-input-width` | – | `64px` | Field width. |
| `--uxm-number-stepper-input-radius` | – | `6px` | Field corner radius. |
| `--uxm-number-stepper-input-border` | `--color-border` | – | Field border, resting. |
| `--uxm-number-stepper-input-bg` | `--color-surface` | – | Field background, resting. |
| `--uxm-number-stepper-input-color` | `--color-text-strong` | – | Value text colour. |
| `--uxm-number-stepper-input-padding-y` | – | `4px` | Field vertical padding. |
| `--uxm-number-stepper-input-padding-x` | – | `8px` | Field horizontal padding. |
| `--uxm-number-stepper-font-size` | – | `12px` | Value font size. |
| `--uxm-number-stepper-hover-bg` | `--color-surface` | – | Field background on hover. |
| `--uxm-number-stepper-hover-border` | `--color-accent` | – | Field border on hover. |
| `--uxm-number-stepper-focus-border` | `--color-accent` | – | Field border on focus. |
| `--uxm-number-stepper-focus-ring` | `--color-accent` | – | Focus outline (2px, offset 1px). |
| `--uxm-number-stepper-disabled-bg` | `--color-surface-alt` | – | Field background when disabled. |
| `--uxm-number-stepper-disabled-border` | `--color-border` | – | Field border when disabled. |
| `--uxm-number-stepper-disabled-color` | `--color-text-muted` | – | Value colour when disabled. |
| `--uxm-number-stepper-disabled-opacity` | – | `0.6` | Opacity applied to the **whole field** via `[aria-disabled]`. |
| `--uxm-number-stepper-error-bg` | `--color-card` | – | Field background in the error state. |
| `--uxm-number-stepper-error-border` | `--color-danger-text` | – | Field border in the error state. |
| `--uxm-number-stepper-error-color` | `--color-danger-text` | – | Error message colour — also drives its icon via `currentColor`. |
| `--uxm-number-stepper-error-message-size` | – | `12px` | Error message font size — also sizes its icon, which is `1em`. |

The ± buttons expose none of their own here — re-theme them through `--uxm-icon-button-*`. The unit slot's 20px reserved width is a layout primitive, deliberately not a knob.

State rules are written as paired selectors: a `--state-hover` / `--state-focus` modifier class on the wrapper **alongside** the real `:hover` / `:focus-visible` pseudos. The modifiers let the studio show a state without synthesising a real pointer.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-border` | Borders / Border | Field border, resting and disabled. |
| `--color-surface` | Surfaces / Surface | Field background, resting and hover. |
| `--color-surface-alt` | Surfaces / Surface Alt | Field background when disabled. |
| `--color-card` | Surfaces / Card | Field background in the error state. |
| `--color-text-strong` | Text / Text Strong | Value text. |
| `--color-text-muted` | Text / Text Muted | Value text when disabled. |
| `--color-text-subtle` | Text / Text Subtle | Unit suffix. |
| `--color-accent` | Accent / Accent | Hover border, focus border and focus ring. |
| `--color-danger-text` | Semantic / Danger Text | Error border and error message. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Bordered field between two IconButtons. |
| Hover | pointer over the field, when not disabled | Accent border. |
| Focus | keyboard focus in the field | Accent border plus a 2px accent outline, offset 1px. |
| Disabled | `disabled` | Whole field at 0.6 opacity, `not-allowed` cursor, muted value on `surface-alt`. |
| Error | `error` non-empty | Field border switches to danger; **the ± buttons stay unchanged** — error is the field's concern, not the affordance's, matching how `input-with-icon` leaves its icon untouched. |
| With unit | `unit` set | Fixed-width suffix after the increment button. |

## Accessibility

- **Pass `aria-label`.** The atom renders no label of its own, so without it the `<input>` has no accessible name. Either provide one or wrap the control in a labelled field.
- The step buttons have no visible text, so `decrementLabel` / `incrementLabel` are the **only** thing assistive tech announces for them. They default to English (`"Decrement"` / `"Increment"`) — pass translations in a localised UI.
- `error` wires up the full invalid contract: `aria-invalid` and `aria-describedby` on the wrapper, pointing at a `useId()`-generated id on the message. The message itself is rendered by [`FieldError`](../field-error/README.md), which prefixes an `exclamation-circle` glyph so the error is not signalled by colour alone.
- `disabled` sets both the native `disabled` on the input and both buttons (which blocks interaction) **and** `aria-disabled` on the wrapper (which drives the dimmed treatment). Note that natively disabled controls are removed from the tab order and are not announced by some screen readers.
- The native spinner is suppressed via `appearance: textfield` plus the `::-webkit-*-spin-button` reset, so the ± buttons are the only step affordance — but the input is still `type="number"`, so keyboard Up/Down arrows continue to work.
- Focus is visible on the field (2px accent outline) and on each button (IconButton's own focus ring).
