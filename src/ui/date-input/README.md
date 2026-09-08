# DateInput

A masked date entry field with an optional calendar popover. Supports single-date and date-range selection, three locale-driven formats, and a typing-only mode without the popover.

`DateInput` renders a wrapper `<div>` around a native `<input type="text" inputMode="numeric">` and an optional `<button>` icon that toggles a `<Calendar>` inside a `role="dialog"` popover. Typing is auto-masked per the chosen format (`mdy`, `dmy`, `ymd`); in `range` mode the input is read-only and the popover is the only entry path. The component supports both controlled (`value`) and uncontrolled (`defaultValue`) usage, mirrors typed input back into the calendar selection, and resets internal state on `mode` switches (with a first-run guard so a `defaultValue` mounted in single mode isn't wiped).

## Usage

```tsx
import { DateInput } from '@viax.io/uxm';

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
| `clearable` | `boolean` | `true` | Show a clear (✕) button when the field has a value. The ✕ sits just left of the calendar icon (or at the trailing edge when `calendar={false}`). The component owns the reset (fires `onChange("")`), so no `onClear` is needed. Works in single and range mode. |
| `placeholder` | `string` | format-derived | Defaults to `"MM/DD/YYYY"` etc., doubled with `" – "` in range mode. |
| `style` | `CSSProperties` | – | Applied to the **wrapper** (not the inner input) so `--uxm-date-input-*` overrides cascade to the popover too. |
| `className` | `string` | – | Merged onto the wrapper via `cn`. |
| `error` | `string` | – | Consumer-supplied error message. When non-empty it renders the error state (red border, `aria-invalid`, message below the field) and **wins over** the component's own inline invalid-date message. Omit (or pass `''`) for the normal state. |
| `clearLabel` | `string` | `'Clear'` | Accessible name for the clear button. |
| `openCalendarLabel` | `string` | `'Open calendar'` | Accessible name for the calendar trigger. |
| `calendarDialogLabel` | `string` | `'Choose date'` | Accessible name for the calendar popover dialog. |
| `invalidMessage` | `string` | `invalidDateMessage(format)` | Replaces the built-in blur-time "unparseable date" message — `` `Enter a valid date (MM/DD/YYYY)` ``. A translation should keep the mask in it, since that is what tells the user the expected shape. Unrelated to `error`, which is the consumer's own message and wins over both. |

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
| `--uxm-date-input-popover-shadow` | `--shadow-xl` | – | Calendar popover `drop-shadow()` (theme-aware via the global shadow scale). |

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
| Error | `--error` modifier on wrapper (driven by the `error` prop **or** the internal invalid-date state — see Validation) | Danger border on input; icon re-tints to danger; message rendered below via `FieldError`. |
| Typing-only | `calendar={false}` | Icon button and popover are not rendered. |
| Clearable | `clearable` (default) + non-empty value, non-disabled | Trailing ✕ (`.uxm-field-clear`, 22×22) sits just left of the calendar icon (or at the edge when `calendar={false}`); clears the value. |
| Popover open | Icon click toggles `isOpen` | Calendar appears 4px below input, with a `drop-shadow` filter; `aria-expanded` flips on the icon button. |
| Range mode | `mode="range"` | Input is read-only; placeholder doubles; popover stays open after the first click and closes only when `value.end` commits. |

## Validation

In `single` mode the field validates typed input itself:

- **Empty is always valid** — no error while the field is blank.
- **On blur**, a non-empty value that doesn't parse to a real date flips into
  the error state and shows `Enter a valid date (<mask>)` below the field. This
  covers both out-of-range input (`06/36/2024`) and impossible dates that JS
  `Date` would otherwise silently roll over — `parseDate` round-trips the
  constructed date, so `02/30/2024` (Feb 30) is rejected rather than becoming
  Mar 1.
- **Cleared the moment the user edits again** (or clears the field), and
  re-checked on the next blur.
- Picking from the calendar never yields an impossible date, so a calendar pick
  always clears the error.
- **`range` mode does not self-validate** — the input is read-only and filled
  only via the calendar, so there is nothing to reject.
- A consumer-supplied **`error` prop wins** over the internal message: pass it
  to surface your own validation and the field shows that instead.

## Accessibility

- The trailing calendar control is a real `<button type="button">` with `aria-label="Open calendar"` and `aria-expanded` reflecting the popover state.
- Popover is wrapped in `role="dialog"`. There is **no** focus trap or initial-focus management — keyboard focus stays on the trigger when the popover opens.
- Popover closes on outside `mousedown` and on `Escape`; listeners are mounted only while open.
- Clear button: `<button aria-label="Clear">`; `onMouseDown` is prevented so clearing doesn't refocus the input and re-open the calendar.
- The inner `<input>` uses `inputMode="numeric"` so mobile keyboards surface the digit pad.
- In `range` mode the input is rendered with `readOnly` — assistive tech announces it as non-editable; the calendar popover is the only entry path.
- Error state is wired automatically: whenever an error shows (from the `error` prop or internal invalid-date state) the input gets `aria-invalid="true"` and an `aria-describedby` pointing at the `FieldError` message. A caller-supplied `aria-describedby` is **preserved** — the component's error id is appended to it (both are announced), never overwritten.
- Disabled state uses the native `disabled` attribute; the calendar icon button is **not** automatically disabled in lockstep — consumers should hide or gate it externally if needed.
