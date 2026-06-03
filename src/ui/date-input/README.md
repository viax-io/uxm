# DateInput

A masked date entry field with an optional calendar popover. Supports single-date and date-range selection, three locale-driven formats, and a typing-only mode without the popover.

`DateInput` renders a wrapper `<div>` around a native `<input type="text" inputMode="numeric">` and an optional `<button>` icon that toggles a `<Calendar>` inside a `role="dialog"` popover. Typing is auto-masked per the chosen format (`mdy`, `dmy`, `ymd`); in `range` mode the input is read-only and the popover is the only entry path. The component supports both controlled (`value`) and uncontrolled (`defaultValue`) usage, mirrors typed input back into the calendar selection, and resets internal state on `mode` switches (with a first-run guard so a `defaultValue` mounted in single mode isn't wiped).

## Usage

```tsx
import { DateInput } from '@viax/uxm';

function Example() {
  const [date, setDate] = useState('');
  return (
    <DateInput
      format="mdy"
      mode="single"
      value={date}
      onChange={setDate}
    />
  );
}
```

## Props

### `DateInputProps`

Extends `Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'type' | 'style'>` — all other native input attributes (`name`, `id`, `disabled`, `aria-*`, etc.) flow through to the inner `<input>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `format` | `'mdy' \| 'dmy' \| 'ymd'` | `'mdy'` | Mask shape, separator, and placeholder. Drives both the on-type masking and the Calendar ↔ input parsing. |
| `mode` | `'single' \| 'range'` | `'single'` | `single` closes the popover after one pick; `range` keeps it open until the second click commits the end, joins both halves with `" – "`, and makes the input read-only. |
| `value` | `string` | – | Controlled formatted value. In range mode use `"start – end"`. |
| `defaultValue` | `string` | – | Initial value for uncontrolled usage. Masked once on mount (single mode). |
| `onChange` | `(formatted: string) => void` | – | Fires with the masked, formatted value after every keystroke or calendar pick. |
| `calendar` | `boolean` | `true` | Render the calendar icon button and enable the popover. Pass `false` for a typing-only field. |
| `placeholder` | `string` | format-derived | Defaults to `"MM/DD/YYYY"` etc., doubled with `" – "` in range mode. |
| `style` | `CSSProperties` | – | Applied to the **wrapper** (not the inner input) so `--uxm-date-input-*` overrides cascade to the popover too. |
| `className` | `string` | – | Merged onto the wrapper via `cn`. |

### `DateInputFormat`

```ts
type DateInputFormat = 'mdy' | 'dmy' | 'ymd';
```

### `DateInputMode`

```ts
type DateInputMode = 'single' | 'range';
```

## CSS variables

Set these on the wrapper (via `style` or a higher scope) — because `style` is forwarded to the wrapper, custom-property overrides cascade into both the input and the popover.

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-date-input-background-color` | `--color-card` | – | Input background. |
| `--uxm-date-input-border-color` | `--color-border` | – | Input border (idle). |
| `--uxm-date-input-border-radius` | – | `8px` | Input corner radius. |
| `--uxm-date-input-color` | `--color-text` | – | Input text color. |
| `--uxm-date-input-font-size` | – | `14px` | Input font size. |
| `--uxm-date-input-padding-x` | – | `12px` | Horizontal padding (left). |
| `--uxm-date-input-padding-y` | – | `10px` | Vertical padding. |
| `--uxm-date-input-icon-color` | `--color-text-muted` | – | Calendar icon (idle). |
| `--uxm-date-input-icon-hover-color` | `--color-text` | – | Calendar icon on hover. |
| `--uxm-date-input-icon-offset` | – | `12px` | Right offset of the calendar icon button. |
| `--uxm-date-input-icon-size` | – | `16px` | Calendar icon svg width/height. |
| `--uxm-date-input-hover-bg` | `--color-card` | – | Input background on hover. |
| `--uxm-date-input-hover-border` | `--color-accent` | – | Input border on hover. |
| `--uxm-date-input-focus-border` | `--color-accent` | – | Input border on focus. |
| `--uxm-date-input-focus-ring` | `--color-accent` | – | Focus outline color. |
| `--uxm-date-input-disabled-bg` | `--color-surface-alt` | – | Input background when disabled. |
| `--uxm-date-input-disabled-border` | `--color-border` | – | Input border when disabled. |
| `--uxm-date-input-disabled-color` | `--color-text-muted` | – | Input text when disabled. |
| `--uxm-date-input-disabled-opacity` | – | `0.6` | Disabled-state opacity. |
| `--uxm-date-input-error-bg` | `--color-card` | – | Input background under `--error`. |
| `--uxm-date-input-error-border` | `--color-danger-text` | – | Input border under `--error`. |
| `--uxm-date-input-error-color` | `--color-danger-text` | – | Calendar icon under `--error`. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Input background (idle, hover, error). |
| `--color-surface-alt` | Surfaces / Surface Alt | Input background when disabled. |
| `--color-border` | Borders / Border | Input border (idle, disabled). |
| `--color-text` | Text / Text | Input text + icon hover color. |
| `--color-text-muted` | Text / Text Muted | Icon idle color, disabled text. |
| `--color-accent` | Accent / Accent | Hover/focus border + focus ring. |
| `--color-danger-text` | Semantic / Danger Text | Error border + icon. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Idle | – | Card background, border token, muted icon. |
| Hover | `:hover` on input, or `--state-hover` wrapper modifier | Border switches to accent. |
| Focus | `:focus` on input, or `--state-focus` wrapper modifier | Accent border + 2px accent outline (offset 2px). |
| Disabled | `disabled` attribute | Surface-alt background, muted text, `not-allowed` cursor, dimmed opacity. |
| Error | `--error` modifier on wrapper | Danger border on input; icon re-tints to danger. |
| Typing-only | `calendar={false}` | Icon button and popover are not rendered. |
| Popover open | Icon click toggles `isOpen` | Calendar appears 4px below input, with a `drop-shadow` filter; `aria-expanded` flips on the icon button. |
| Range mode | `mode="range"` | Input is read-only; placeholder doubles; popover stays open after the first click and closes only when `value.end` commits. |

## Accessibility

- The trailing calendar control is a real `<button type="button">` with `aria-label="Open calendar"` and `aria-expanded` reflecting the popover state.
- Popover is wrapped in `role="dialog"`. There is **no** focus trap or initial-focus management — keyboard focus stays on the trigger when the popover opens.
- Popover closes on outside `mousedown` and on `Escape`; listeners are mounted only while open.
- The inner `<input>` uses `inputMode="numeric"` so mobile keyboards surface the digit pad.
- In `range` mode the input is rendered with `readOnly` — assistive tech announces it as non-editable; the calendar popover is the only entry path.
- No `aria-invalid` is wired automatically when the `--error` modifier is applied; consumers should set it on the input via `...rest` when surfacing validation errors.
- Disabled state uses the native `disabled` attribute; the calendar icon button is **not** automatically disabled in lockstep — consumers should hide or gate it externally if needed.
