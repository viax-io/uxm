# SearchDropdown

A combobox-style picker — a trigger button that opens a popover containing a search input and a filtered list of options.

`SearchDropdown` is intended for value pickers with more options than a native `<select>` can comfortably scan (icon glyphs, country codes, large enums). For short lists (≤12 options) the native `<Select>` atom is preferred. The popover handles keyboard navigation (Arrow / Enter / Escape), filters options against the search query case-insensitively, and closes on click-outside. Focus moves to the search input on open; the highlight index is clamped against the filtered list to avoid stale-index renders after the list shrinks.

## Usage

```tsx
import { SearchDropdown, type SearchDropdownOption } from '@viax.io/uxm';
import { useState } from 'react';

const options: SearchDropdownOption[] = [
  { value: 'us', label: 'United States', meta: '+1' },
  { value: 'gb', label: 'United Kingdom', meta: '+44' },
  { value: 'de', label: 'Germany', meta: '+49' },
];

function CountryPicker() {
  const [country, setCountry] = useState('us');
  return (
    <SearchDropdown
      value={country}
      onChange={setCountry}
      options={options}
      placeholder="Choose country"
      searchPlaceholder="Search countries…"
      aria-label="Country"
    />
  );
}
```

## Props

### `SearchDropdownProps`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | – | **Required.** Selected option value. |
| `onChange` | `(value: string) => void` | – | **Required.** Fires with the chosen option's value; the popover closes immediately after selection. |
| `options` | `SearchDropdownOption[]` | – | **Required.** Option list. |
| `placeholder` | `string` | `'Select…'` | Trigger placeholder when no value is selected. |
| `searchPlaceholder` | `string` | `'Search…'` | Placeholder for the search input inside the popover. |
| `disabled` | `boolean` | `false` | Trigger can't open and renders as inert. |
| `className` | `string` | – | Merged with `uxm-search-dropdown` via `cn`. |
| `style` | `CSSProperties` | – | Inline style on the wrapper. |
| `aria-label` | `string` | – | Forwarded to the trigger button. |
| `clearLabel` | `string` | `'Clear selection'` | Accessible name for the clear button. |
| `id` / `aria-describedby` | `string` | – | Forwarded to the `role="combobox"` trigger. `FormField` injects both (label association + hint), so the atom is hint-associable; describedby merges with the atom's own error-message id, consumer ids first. |

### `SearchDropdownOption`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `value` | `string` | yes | Identifier for the option; compared by `===` to the controlled `value`. |
| `label` | `string` | yes | Primary text shown in the option row and the trigger. |
| `meta` | `string` | no | Trailing secondary text (e.g. a country dialing code, category meta). Right-aligned in the option row. |
| `icon` | `ReactNode` | no | Leading visual — typically an `<Icon>` for icon-glyph pickers. |

## CSS variables

All `--uxm-search-dropdown-*` knobs live on the wrapper and cascade to descendants. Trigger / popover / option / search-input groups are themable independently.

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-search-dropdown-trigger-bg` | `--color-card` | – | Trigger button background. |
| `--uxm-search-dropdown-trigger-border` | `--color-border` | – | Trigger border colour. |
| `--uxm-search-dropdown-trigger-focus-border` | `--color-accent` | – | Trigger border on `:focus-visible` and while open. |
| `--uxm-search-dropdown-trigger-radius` | – | `6px` | Trigger corner radius. |
| `--uxm-search-dropdown-trigger-padding-x` | – | `10px` | Trigger horizontal padding. |
| `--uxm-search-dropdown-trigger-padding-y` | – | `6px` | Trigger vertical padding. |
| `--uxm-search-dropdown-trigger-font-size` | – | `12px` | Trigger font size. |
| `--uxm-search-dropdown-popover-bg` | `--color-card` | – | Popover background. |
| `--uxm-search-dropdown-popover-border` | `--color-border` | – | Popover border. |
| `--uxm-search-dropdown-popover-radius` | – | `8px` | Popover corner radius. |
| `--uxm-search-dropdown-popover-shadow` | – | `0 6px 20px rgba(0,0,0,0.10)` | Popover drop shadow. |
| `--uxm-search-dropdown-popover-max-height` | – | `280px` | Popover max height; list scrolls past this. |
| `--uxm-search-dropdown-search-font-size` | – | `12px` | Search input font size. |
| `--uxm-search-dropdown-option-radius` | – | `4px` | Option row corner radius. |
| `--uxm-search-dropdown-option-padding-x` | – | `10px` | Option row horizontal padding. |
| `--uxm-search-dropdown-option-padding-y` | – | `6px` | Option row vertical padding. |
| `--uxm-search-dropdown-option-font-size` | – | `13px` | Option label font size. |
| `--uxm-search-dropdown-option-meta-size` | – | `10px` | Meta text font size. |
| `--uxm-search-dropdown-option-hover-bg` | `--color-surface-alt` | – | Highlighted option background (keyboard or mouse hover). |
| `--uxm-search-dropdown-option-active-bg` | `--color-accent-subtle` | – | Selected option background. |
| `--uxm-search-dropdown-option-active-color` | `--color-accent-bold` | – | Selected option text colour. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Trigger + popover background (fallbacks). |
| `--color-border` | Borders / Border | Trigger border, popover border, search divider. |
| `--color-text` | Text / Text | Trigger label, option label, search input value. |
| `--color-text-muted` | Text / Text Muted | Empty trigger placeholder, chevron, empty-state copy. |
| `--color-text-subtle` | Text / Text Subtle | Search icon, option meta. |
| `--color-accent` | Accent / Accent | Trigger focus / open border (fallback). |
| `--color-surface-alt` | Surfaces / Surface Alt | Highlighted option background (fallback). |
| `--color-accent-subtle` | Accent / Accent Subtle | Selected option background (fallback). |
| `--color-accent-bold` | Accent / Accent Bold | Selected option text (fallback). |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Closed | initial | Trigger shows selected label or placeholder; chevron points down. |
| Empty | no value selected | Trigger label uses `--color-text-muted` and the placeholder text. |
| Open | trigger click / re-click | Popover appears 4px below trigger; chevron rotates 180°; trigger border switches to accent. |
| Option highlighted | ArrowUp / ArrowDown / mouse hover | Background switches to `--uxm-search-dropdown-option-hover-bg`. |
| Option selected | value equals option value | Background `--accent-subtle`, text `--accent-bold`, font weight `600`. |
| Empty filter | search query matches no options | Renders `"No matches"` centred in the list area. |
| Disabled | `disabled` prop | Trigger can't open; native `disabled` attribute applied. |
| Click outside | mousedown outside trigger + popover | Popover closes; trigger does not regain focus. |
| Escape pressed | Escape in search input | Popover closes and focus returns to the trigger. |

## Accessibility

- Trigger carries `aria-haspopup="listbox"` and `aria-expanded` reflecting open state.
- Popover root carries `role="listbox"`; each option carries `role="option"` with `aria-selected`.
- Keyboard: ArrowUp / ArrowDown step the highlight, Enter selects, Escape closes and refocuses the trigger. Tab/Shift-Tab traverse the search input and options as part of the natural focus order.
- Option `onMouseDown` (with `preventDefault`) is used instead of `onClick` so the trigger doesn't re-steal focus and close the popover before the click fires — this means mouse-only selection works reliably, but users on assistive tech that synthesises clicks should rely on keyboard activation instead.
- The trigger label uses `text-overflow: ellipsis` when the selected option's label is wider than the trigger — pair with a descriptive `aria-label` so the full value is still announced.
- The atom does NOT trap focus inside the popover; tabbing forward from the last option exits to the next focusable element on the page (intentional — matches native combobox behaviour).
- No `aria-activedescendant` wiring between the search input and the highlighted option: screen-reader users currently won't hear the highlight change as they arrow through the list. Consider wrapping in a higher-level combobox primitive if strict APG conformance is required.
