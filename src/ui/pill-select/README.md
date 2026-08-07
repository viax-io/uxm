# PillSelect

A multi-select tag input. Selected values render as `<Chip mode="input">` (Chip infers input mode from `onRemove`), an `Add…` placeholder fills the empty state, and a chevron toggles a dropdown of remaining options.

This shell owns the field shape and state visuals (default / hover / focus / disabled). All chip theming flows through Chip's own registry — chips are first-class, not painted on top. When `disabled`, the field loses its tab stop (`aria-disabled="true"`) and forwards `disabled` to each chip so the × buttons also go inert.

## Usage

```tsx
import { PillSelect } from '@viax/uxm';
import { useState } from 'react';

const TAGS = ['Compliance', 'Engineering', 'Design', 'Ops'];

function TeamPicker() {
  const [picked, setPicked] = useState<string[]>(['Engineering']);
  return (
    <PillSelect
      options={TAGS}
      value={picked}
      onChange={setPicked}
      placeholder="Pick teams…"
    />
  );
}
```

## Props

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>` — any standard div attribute is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `string[]` | – | **Required.** Full list of selectable values; the menu shows options not yet selected. |
| `value` | `string[]` | – | Controlled selection. Pair with `onChange`. |
| `defaultValue` | `string[]` | `[]` | Initial selection for uncontrolled usage. |
| `placeholder` | `string` | `'Add…'` | Shown when no chips are selected. |
| `onChange` | `(next: string[]) => void` | – | Fires after add or remove with the next selection. |
| `chipsPosition` | `'inside' \| 'below'` | `'below'` | `'inside'` renders the chips in the field itself; `'below'` keeps a compact Select-shaped trigger with the chips underneath. |
| `disabled` | `boolean` | `false` | Disables interaction; field loses tab stop, chips become inert, menu cannot open. |
| `error` | `string` | – | Non-empty renders the error state (`__field--error`, `aria-invalid`, `FieldError` below). Takes precedence over the internal `required` message. |
| `required` | `boolean` | `false` | Requires at least one chip. Emptying the field is still **allowed** (live model) but surfaces `requiredMessage` immediately and sets `aria-required`. Enforced in the atom, not in `MultiListbox`, because chips are also removed via their own ×, which bypasses the dropdown. |
| `requiredMessage` | `string` | `'Select at least one option'` | Overrides the shared `DEFAULT_MULTI_REQUIRED_MESSAGE`. |
| `clearable` | `boolean` | `false` | Renders a trailing ✕ on the field that clears **all** chips at once, plus its "Clear all" twin in the dropdown footer. Chips always clear individually via their own × regardless. |
| `className` | `string` | – | Merged with `uxm-pill-select` on the root. |
| _(any other native div attribute)_ | – | – | Spread onto the root `<div>`. |
| `clearLabel` | `string` | `'Clear all selections'` | Accessible name for the clear-all button. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-pill-select-bg` | `--color-card` | – | Field background. |
| `--uxm-pill-select-border-color` | `--color-border` | – | Field border. |
| `--uxm-pill-select-radius` | – | `8px` | Field corner radius. |
| `--uxm-pill-select-padding-y` | – | `8px` | Vertical field padding. |
| `--uxm-pill-select-padding-x` | – | `10px` | Horizontal field padding. |
| `--uxm-pill-select-chip-gap` | – | `6px` | Gap between chips (row + column). |
| `--uxm-pill-select-hover-bg` | `--color-card` | – | Field hover background. |
| `--uxm-pill-select-hover-border` | `--color-accent` | – | Field hover border. |
| `--uxm-pill-select-focus-border` | `--color-accent` | – | Field focus border. |
| `--uxm-pill-select-focus-ring` | `--color-accent` | – | Focus outline ring. |
| `--uxm-pill-select-disabled-bg` | `--color-card` | – | Disabled background. |
| `--uxm-pill-select-disabled-border` | `--color-border` | – | Disabled border. |
| `--uxm-pill-select-disabled-opacity` | – | `1` | Disabled opacity (left at 1 by default — disabled signal comes from the chips). |
| `--uxm-pill-select-placeholder-color` | `--color-text-muted` | – | Placeholder text colour. |
| `--uxm-pill-select-clear-chevron-gap` | – | `2px` | Gap between the clear-all ✕ and the chevron (`clearable` only). |

The dropdown menu (`.uxm-pill-select__menu`) uses semantic surface tokens directly (`--color-card`, `--color-border`, `--color-surface-alt`, `--color-text`, `--shadow-lg`) without `--uxm-pill-select-*` overrides.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Field + menu background. |
| `--color-border` | Borders / Border | Field + menu border. |
| `--color-accent` | Accent / Accent | Hover / focus border + focus ring. |
| `--color-text` | Text / Text | Menu option text. |
| `--color-text-muted` | Text / Text Muted | Placeholder colour; chevron colour. |
| `--color-surface-alt` | Surfaces / Surface Alt | Menu option hover background. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default (empty) | No chips selected | Placeholder + chevron. |
| Filled | One or more chips | Chips wrap across rows with `chip-gap`; chevron pinned right. |
| Hover | `:hover` (non-disabled) or `--state-hover` | Field border shifts to accent. |
| Focus | `:focus-visible` or `--state-focus` | Accent border + 2px accent outline ring. |
| Disabled | `disabled={true}` / `--state-disabled` | `not-allowed`; tab-stop removed; chips inert; opacity controlled by `--uxm-pill-select-disabled-opacity`. |
| Open | Field clicked / `Enter` / `Space` | Menu of un-picked options appears 4px below; chevron rotates 180°. Menu only renders if `available.length > 0`. |
| Closed | `Escape`, outside select, blur | Menu hides; chevron rotates back. |

## Accessibility

- Field carries `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls={menuId}`, and (when disabled) `aria-disabled="true"`.
- Menu has `role="listbox"`; each option is a `<button role="option">` so it's tab-reachable and `Enter`-activates.
- Keyboard: `Enter` or `Space` toggles the menu when the field itself is focused; bubbled keys from chip × buttons are filtered (`e.target !== e.currentTarget`) so Enter on × removes the chip instead of toggling the menu. `Escape` closes the menu.
- Chip × buttons receive `disabled` when the field is disabled so they leave the tab order natively.
- `Space` on the focused field calls `preventDefault` to prevent page scroll.
- The component does not implement arrow-key roving inside the menu; for long option lists consider augmenting with a searchable variant.
- No visible label — supply `aria-label` / `aria-labelledby` via spread props or wrap in a `<label>`.
