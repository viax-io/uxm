# Input

Three thin input atoms — `TextInput`, `Textarea`, `Select` — that share a single visual contract (background, border, radius, padding, focus ring). Each is a direct wrapper around its native element with one BEM-style class applied; all native attributes flow through.

These atoms intentionally do not own labels, hints, or error text — pair them with `FormField` for labelled rows or compose their `--error` modifier when you need to flag validation state. The shared CSS rule means a single token edit (`--color-border`, `--color-accent`, …) re-tints every input variant at once.

## Usage

```tsx
import { TextInput, Textarea, Select, FormField } from '@viax.io/uxm';

function Example() {
  return (
    <>
      <FormField label="Name">
        <TextInput defaultValue="Ada" />
      </FormField>

      <FormField label="Bio" hint="Markdown supported.">
        <Textarea rows={4} />
      </FormField>

      <FormField label="Role">
        <Select defaultValue="editor">
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </Select>
      </FormField>
    </>
  );
}
```

## Props

### `TextInput` — `TextInputProps`

Type alias for `InputHTMLAttributes<HTMLInputElement>`. Every native input attribute is forwarded as-is.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `'text'` | Overridden default — set explicitly for `'email'`, `'password'`, `'number'`, etc. |
| `className` | `string` | – | Merged with `uxm-input-text` via `cn`. Add `uxm-input-text--error` or `uxm-input-error` for the error state. |
| `clearLabel` | `string` | `'Clear'` | Accessible name for the clear button. |
| `inputRef` | `Ref<HTMLInputElement>` | – | Handle to the underlying `<input>`, merged with the atom's internal ref (self-clear keeps working). Use this to focus / select / insert-at-caret — a plain React `ref` on `<TextInput>` does **not** reach the element (it's consumed by `{...rest}` and overridden by the managed ref). |
| _(any native input attribute)_ | – | – | Spread onto the root `<input>`. |

### `Textarea` — `TextareaProps`

Type alias for `TextareaHTMLAttributes<HTMLTextAreaElement>`. Every native textarea attribute is forwarded as-is.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | – | Merged with `uxm-textarea` via `cn`. |
| `rows` | `number` | browser default | Initial row count; height also gated by `min-height: 100px` and `resize: vertical`. |
| `clearLabel` | `string` | `'Clear'` | Accessible name for the clear button. |
| `textareaRef` | `Ref<HTMLTextAreaElement>` | – | Handle to the underlying `<textarea>`, merged with the atom's internal ref. Use this to focus / select / insert-at-caret (e.g. drop a variable into a formula) — a plain React `ref` does **not** reach the element. |
| _(any native textarea attribute)_ | – | – | Spread onto the root `<textarea>`. |

### `Select` — `SelectProps`

`SelectProps` is a **discriminated union** on `mode`: `SelectSingleProps` (`mode="single"`, the default) | `SelectMultiProps` (`mode="multi"`). Both extend `SelectHTMLAttributes<HTMLSelectElement>` minus the five keys `mode` re-shapes — `value`, `defaultValue`, `onChange`, `required`, `multiple` — so every other native attribute (`onBlur`, `autoFocus`, `form`, `data-*`, …) still type-checks and is now forwarded onto the trigger.

The rendered trigger is a `<div role="combobox">`, not a `<select>` — the open-state UI is a `Listbox` panel so it looks identical across browsers. `<optgroup>` children are **not** supported; only `<option>` is parsed.

**Shared props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'single' \| 'multi'` | `'single'` | Picks the value shape and the trigger's selection display. |
| `children` | `ReactNode` | – | `<option>` elements. `<option value="" disabled>` is consumed as the placeholder, not listed. |
| `error` | `string` | – | Non-empty renders the error state (`--error` modifier, `aria-invalid`, `FieldError` below). Takes precedence over the internal `required` message. |
| `searchable` | `boolean \| 'auto'` | `'auto'` | `'auto'` shows the panel search box only past the shared Listbox threshold (6 options). |
| `required` | `boolean` | `false` | Flags an empty selection — it does **not** block. Adds `aria-required` and surfaces `requiredMessage` once the field is emptied (input-family live model). |
| `requiredMessage` | `string` | per mode | `'Select an option'` (single) / `'Select at least one option'` (multi, the shared `DEFAULT_MULTI_REQUIRED_MESSAGE`). |
| `clearLabel` | `string` | per mode | Accessible name for the trigger's clear button: `'Clear selection'` (single) / `'Clear all selections'` (multi). |
| `className` | `string` | – | Merged with `uxm-select-dropdown` via `cn`. |
| _(any other native select attribute)_ | – | – | Spread onto the trigger; `triggerProps` and the atom's own props win on collision. |

**`mode="single"` — `SelectSingleProps`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` / `defaultValue` | `string` | – | Controlled / uncontrolled, native-`<select>` duality. |
| `onChange` | `(e: ChangeEvent<HTMLSelectElement>) => void` | – | Receives a **synthesized** event — `e.target.value` / `e.currentTarget.value` / `type` / `name` are populated. |

**`mode="multi"` — `SelectMultiProps`**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` / `defaultValue` | `string[]` | `[]` | Array of selected option values. |
| `onChange` | `(next: string[]) => void` | – | Fires the full array on every toggle (live — the trigger shows a running `N selected`). |
| `clearable` | `boolean` | `false` | Renders a clear-all ✕ on the trigger **and** a "Clear all" action in the panel footer. |

Backed by `MultiListbox` in its default live `commitMode="change"`, with checkbox rows. For a chip-in-trigger multi picker use `PillSelect` instead.

**Clearing rule (single).** There is no `clearable` prop in single mode. A clear (✕) button appears automatically once a value is selected **iff the select declares a placeholder option** — `<option value="" disabled>…</option>`. That placeholder is what marks "no selection" as a valid state, so returning to it via ✕ is meaningful. A select without a placeholder is mandatory (a value is always chosen, like a native `<select>`), so no ✕ is rendered. In short: **want it clearable → give it a placeholder option.** The same condition drives the "Clear" action in the panel footer, so the trigger ✕ and the in-panel action always appear together.

## CSS variables

The shared rule reads no `--uxm-input-*` variables — every visual property reads design tokens directly or is a hard-coded literal (8px radius, 14px font size, 10px/12px padding, 100px textarea min-height, 32px select right padding).

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Field background. |
| `--color-border` | Borders / Border | Field border. |
| `--color-text` | Text / Text | Field text colour. |
| `--color-text-muted` | Text / Text Muted | Placeholder text. |
| `--color-accent` | Accent / Accent | Focused border colour. |
| `--color-danger-text` | Semantic / Danger Text | Error-modifier border colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI. Note: the select trigger's chevron is the `chevron-down` `Icon` painted at `--color-text-muted` (`.uxm-select-dropdown__trigger-chevron`), so it retints with the token layer.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Card background, border, 8px radius, 14px text. |
| Focus | `:focus` | Border colour transitions (0.15s) to `--color-accent`. Outline suppressed in favour of the border. |
| Placeholder | `::placeholder` (input + textarea) | `--color-text-muted` colour. |
| Error | `uxm-input-text--error` or `uxm-input-error` className | Border forced to `--color-danger-text` with `!important`. |
| Textarea resize | – | `resize: vertical`, `min-height: 100px`. |
| Select caret | – | Inline SVG chevron at 16px, 10px from the right edge; field reserves `padding-right: 32px`. |
| Select clear | A value is selected, the field isn't disabled, **and** it has a placeholder option (`<option value="" disabled>`) | A clear ✕ (`.uxm-select-dropdown__trigger-clear`, 22×22) appears inline before the chevron; clicking it resets to the placeholder. Mandatory selects (no placeholder) never show it — clearing to empty makes no sense there. |

## Accessibility

- All three components render native form controls — full keyboard support, browser-native validation, and screen-reader semantics are inherited.
- No label is provided by these atoms. Either wrap them in `<FormField label="…">`, supply `aria-label` / `aria-labelledby` directly, or use a native `<label htmlFor>` association.
- `Select` uses `appearance: none` to allow the custom chevron — the underlying `<select>` is unchanged, so the OS-native dropdown menu (with full keyboard navigation) still opens on click / `Space` / `Enter`.
- Focus indication is border-only (the `outline` is removed). Verify this meets WCAG 2.4.7 against your specific background; consider adding a `box-shadow` focus ring on critical surfaces.
- The error modifier paints colour only — no `aria-invalid` is set automatically. Add `aria-invalid="true"` and `aria-describedby={hintId}` on the control when surfacing validation errors.
- Select chevron colour is hard-coded — does not invert in dark mode. Verify contrast or override with a custom background-image rule if your dark theme needs adjustment.
