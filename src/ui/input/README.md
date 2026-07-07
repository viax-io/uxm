# Input

Three thin input atoms — `TextInput`, `Textarea`, `Select` — that share a single visual contract (background, border, radius, padding, focus ring). Each is a direct wrapper around its native element with one BEM-style class applied; all native attributes flow through.

These atoms intentionally do not own labels, hints, or error text — pair them with `FormField` for labelled rows or compose their `--error` modifier when you need to flag validation state. The shared CSS rule means a single token edit (`--color-border`, `--color-accent`, …) re-tints every input variant at once.

## Usage

```tsx
import { TextInput, Textarea, Select, FormField } from '@viax/uxm';

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
| _(any native input attribute)_ | – | – | Spread onto the root `<input>`. |

### `Textarea` — `TextareaProps`

Type alias for `TextareaHTMLAttributes<HTMLTextAreaElement>`. Every native textarea attribute is forwarded as-is.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | – | Merged with `uxm-textarea` via `cn`. |
| `rows` | `number` | browser default | Initial row count; height also gated by `min-height: 100px` and `resize: vertical`. |
| _(any native textarea attribute)_ | – | – | Spread onto the root `<textarea>`. |

### `Select` — `SelectProps`

Type alias for `SelectHTMLAttributes<HTMLSelectElement>`. Every native select attribute is forwarded as-is.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | `<option>` / `<optgroup>` elements. |
| `className` | `string` | – | Merged with `uxm-select-dropdown` via `cn`. |
| _(any native select attribute)_ | – | – | Spread onto the root `<select>`. |

The native dropdown caret is suppressed (`appearance: none`) and replaced with an inline SVG chevron painted at `#9CA3AF` — a hard-coded match for the `Text Muted` token.

**Clearing rule.** There is no `clearable` prop. A clear (✕) button appears automatically once a value is selected **iff the select declares a placeholder option** — `<option value="" disabled>…</option>`. That placeholder is what marks "no selection" as a valid state, so returning to it via ✕ is meaningful. A select without a placeholder is mandatory (a value is always chosen, like a native `<select>`), so no ✕ is rendered. In short: **want it clearable → give it a placeholder option.**

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

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI. Note: the select caret is a hard-coded `#9CA3AF` SVG and does not retint with the token layer.

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
