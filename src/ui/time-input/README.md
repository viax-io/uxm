# TimeInput

A time-entry field with optional `HH:MM` typing mask, trailing clock icon, and three-column scroll picker popover (hour / minute / AM-PM).

`TimeInput` renders a positioning `<div className="uxm-time-input">` wrapping a masked `<input type="text" inputMode="numeric">`, an optional trailing clock control (a `<button>` when the picker is enabled, otherwise a decorative `<span>`), an optional read-only AM/PM badge in `12h` mode, and an absolutely positioned popover with up to three click-list columns. Typing is the primary entry path; the popover is a complementary affordance that the clock icon toggles. Format flips (`24h` ↔ `12h`) clear uncontrolled state, since stored values would become invalid under the new convention.

## Usage

```tsx
import { TimeInput } from '@viax/uxm';

function Example() {
  const [time, setTime] = useState('09:30 AM');
  return (
    <TimeInput
      format="12h"
      value={time}
      onChange={setTime}
      minuteStep={15}
    />
  );
}
```

## Props

Extends `Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'type' | 'style'>` — standard input attributes (`disabled`, `placeholder`, `name`, `aria-*`, etc.) are spread onto the inner `<input>`. `style` is applied to the WRAPPER `<div>`, not the input, so `--uxm-time-input-*` overrides cascade to every part (input, AM/PM badge, popover).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `format` | `'24h' \| '12h'` | `'24h'` | Clock convention. `24h` masks as `HH:MM`; `12h` masks as `HH:MM` plus AM/PM. Drives placeholder, popover column set, and trailing badge. |
| `value` | `string` | – | Controlled formatted string (e.g. `"09:30"` or `"09:30 AM"`). |
| `defaultValue` | `string` | `''` | Initial value for uncontrolled usage. Re-masked through `maskTime` on mount. |
| `onChange` | `(formatted: string) => void` | – | Called with the masked, formatted value after every keystroke, meridiem flip, or column pick. |
| `clock` | `boolean` | `true` | Render the trailing clock icon. Set `false` for an icon-less field. |
| `picker` | `boolean` | `true` | Mount the popover. When both `clock` and `picker` are on, the icon doubles as the toggle; otherwise the icon (if rendered) is decorative. |
| `minuteStep` | `number` | `1` | Minute-column step in the popover (1 / 5 / 15 / 30, etc.). Off-step current values are inserted at the correct sorted position so typed-then-picked values never disappear. |
| `placeholder` | `string` | `'HH:MM'` | Custom placeholder. Falls back to the `HH:MM` default. |
| `disabled` | `boolean` | – | Native disabled state on the inner `<input>`; the clock-button toggle is also suppressed. |
| `style` | `CSSProperties` | – | Inline style on the WRAPPER (not the input). Use to project `--uxm-time-input-*` overrides. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native input attribute)_ | – | – | Spread onto the inner `<input>`. |

The `TimeInputFormat` union (`'24h' \| '12h'`) is exported.

## CSS variables

### Field

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-time-input-background-color` | `--color-card` | – | Input background. |
| `--uxm-time-input-color` | `--color-text` | – | Input + popover row text colour. |
| `--uxm-time-input-border-color` | `--color-border` | – | Input border. |
| `--uxm-time-input-border-radius` | – | `8px` | Input radius. |
| `--uxm-time-input-padding-x` | – | `12px` | Input left padding. |
| `--uxm-time-input-padding-y` | – | `10px` | Input vertical padding. |
| `--uxm-time-input-font-size` | – | `14px` | Input font size. |
| `--uxm-time-input-icon-color` | `--color-text-muted` | – | Clock icon resting colour. |
| `--uxm-time-input-icon-hover-color` | `--color-text` | – | Clock icon hover colour (button variant). |
| `--uxm-time-input-icon-size` | – | `16px` | Clock icon dimensions. |
| `--uxm-time-input-icon-offset` | – | `12px` | Right-edge inset of the clock icon. |
| `--uxm-time-input-meridiem-width` | – | `24px` | Reserved width for the AM/PM badge in 12h mode. |
| `--uxm-time-input-meridiem-color` | `--color-text-muted` | – | AM/PM badge text colour. |

### States

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-time-input-hover-bg` | `--color-card` | – | Hover background. |
| `--uxm-time-input-hover-border` | `--color-accent` | – | Hover border. |
| `--uxm-time-input-focus-border` | `--color-accent` | – | Focus border. |
| `--uxm-time-input-focus-ring` | `--color-accent` | – | Focus outline colour. |
| `--uxm-time-input-disabled-bg` | `--color-surface-alt` | – | Disabled background. |
| `--uxm-time-input-disabled-border` | `--color-border` | – | Disabled border. |
| `--uxm-time-input-disabled-color` | `--color-text-muted` | – | Disabled text. |
| `--uxm-time-input-disabled-opacity` | – | `0.6` | Disabled opacity. |
| `--uxm-time-input-error-bg` | `--color-card` | – | Error background. |
| `--uxm-time-input-error-border` | `--color-danger-text` | – | Error border. |
| `--uxm-time-input-error-color` | `--color-danger-text` | – | Error icon + AM/PM colour. |

### Popover

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-time-input-popover-bg` | `--color-card` | – | Popover surface. |
| `--uxm-time-input-popover-border` | `--color-border` | – | Popover + column-divider borders. |
| `--uxm-time-input-popover-radius` | – | `8px` | Popover radius. |
| `--uxm-time-input-popover-head-bg` | `--color-surface-alt` | – | Column head background. |
| `--uxm-time-input-popover-row-hover-bg` | `--color-surface-alt` | – | Column row hover background. |
| `--uxm-time-input-popover-row-selected-bg` | `--color-accent` | – | Selected row background. |
| `--uxm-time-input-popover-row-selected-color` | `--color-text-inverse` | – | Selected row text. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Field + popover background. |
| `--color-text` | Text / Text | Field text. |
| `--color-text-muted` | Text / Text Muted | Clock icon + AM/PM + disabled text. |
| `--color-text-inverse` | Text / Text Inverse | Selected popover-row text. |
| `--color-border` | Borders / Border | Field + popover + column-divider borders. |
| `--color-surface-alt` | Surfaces / Surface Alt | Disabled background, column-head, row-hover. |
| `--color-accent` | Accent / Accent | Hover/focus border + ring, selected row background. |
| `--color-danger-text` | Semantic / Danger Text | Error border + tint. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Card background, muted clock icon. |
| Hover | `:hover` on input OR `.uxm-time-input--state-hover` modifier | Accent border. |
| Focus | `:focus` on input OR `.uxm-time-input--state-focus` modifier | Accent border + outline ring (2px, 2px offset). |
| Disabled | `disabled` prop | Surface-alt background, muted text, `0.6` opacity, `not-allowed` cursor; popover trigger suppressed. |
| Error | `.uxm-time-input--error` modifier on wrapper | Danger border on input; icon + AM/PM badge re-tone red. |
| Format 24h | `format="24h"` (default) | No AM/PM badge; two-column popover. |
| Format 12h | `format="12h"` | Trailing AM/PM badge inboard of icon; three-column popover. |
| Popover open | Click clock button | Three-column scroll picker with selected row centred. |
| Format switch | `format` prop changes | Uncontrolled state cleared; popover closes. |

## Accessibility

- The inner `<input type="text" inputMode="numeric">` is fully native — screen readers and IME work as expected.
- The clock toggle is a real `<button>` with `aria-label="Open time picker"` and `aria-expanded` reflecting popover state.
- The popover container has `role="dialog" aria-label="Pick a time"`; each column is `role="listbox"` with a column-named `aria-label`; rows are `role="option"` with `aria-selected`.
- AM/PM badge is `aria-hidden="true"` — the popover's AM/PM column is the sole interactive way to flip it. The value still surfaces to assistive tech because the formatted string lives in the input's value.
- Popover dismisses on outside-click and `Escape`. Listeners only mount while open.
- Keyboard navigation **within** the popover relies on `Tab` (no roving tab index / arrow-key navigation); rows activate via `Enter`/`Space` since they are real `<button>`s.
- Mask is permissive — `09:99` is not rejected at the input layer. Validate strictly downstream if business rules require it.
