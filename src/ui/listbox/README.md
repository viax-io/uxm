# Listbox / MultiListbox

The generic dropdown engine. It owns **all** dropdown behaviour — popover positioning, search, keyboard navigation, ARIA — and is generic over `T`. Consumers supply data plus a `renderItem`; the dropdown has no domain knowledge of what is inside. Countries, icons, colours and currencies are all just `T`.

Two exports share one core:

- **`Listbox`** — single-select. `value: T | null`.
- **`MultiListbox`** — multi-select. `value: T[]`, with staging and required-selection support.

The panel layers its chrome on top of [`Popover`](../popover/README.md), which supplies the positioning shell. **The trigger's visual is entirely the consumer's** — `renderTrigger` returns whatever element they like, and the atom only wires behaviour onto it.

This is the engine behind `Select`, `PillSelect`, `SearchDropdown`, `PhoneInput`'s country picker, `CurrencyInput` and `EditableCell`.

## Usage

```tsx
import { Listbox } from '@viax/uxm/ui';

<Listbox
  items={countries}
  value={selected}
  onChange={setSelected}
  getKey={(c) => c.code}
  getLabel={(c) => c.name}
  aria-label="Country"
  renderTrigger={({ open, selected, triggerProps }) => (
    <button {...triggerProps} className="my-field">
      {selected?.name ?? 'Pick a country'}
      <Icon glyph={open ? 'chevron-up' : 'chevron-down'} />
    </button>
  )}
  renderItem={(c) => <span>{c.name}</span>}
/>
```

**Spread `triggerProps` and add nothing of your own for `onClick`, `aria-expanded` or `aria-haspopup`** — those are the listbox's wiring, and overriding them breaks the contract. The `ref` inside is a callback ref, so one spread wires the positioning anchor, the toggle and the ARIA state together.

Multi-select with a commit boundary:

```tsx
import { MultiListbox } from '@viax/uxm/ui';

<MultiListbox
  items={tags}
  value={picked}
  onChange={setPicked}
  getKey={(t) => t.id}
  getLabel={(t) => t.name}
  commitMode="close"          // one commit when the panel closes
  required
  onRequiredViolation={(msg) => setError(msg)}
  renderTrigger={({ triggerProps }) => <button {...triggerProps}>{picked.length} selected</button>}
  renderItem={(t) => t.name}
  footer={({ clear, selected }) =>
    selected.length > 0 ? <ButtonGhost onClick={clear}>Clear all</ButtonGhost> : null
  }
/>
```

## Props — shared

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `T[]` | – | **Required.** |
| `getKey` | `(item: T) => string` | – | **Required.** Stable unique key — React keys and active tracking. |
| `getLabel` | `(item: T) => string` | – | **Required.** Plain text — default filter and accessibility. |
| `renderTrigger` | `(state) => ReactNode` | – | **Required.** Receives `{ open, selected, triggerProps }`. |
| `renderItem` | `(item, state) => ReactNode` | – | **Required.** Receives `{ active, selected }`. |
| `searchable` | `boolean \| 'auto'` | `true` | `'auto'` shows the search only past `SEARCHABLE_AUTO_THRESHOLD` (**6**) items. |
| `searchPlaceholder` | `string` | `'Search…'` | |
| `searchAriaLabel` | `string` | placeholder | Accessible name for the search input — see Accessibility. |
| `filterItems` | `(items, query) => T[]` | substring on `getLabel` | Override the filter. |
| `groupBy` | `(item: T) => string` | – | Emit section headers. |
| `renderGroupHeader` | `(group: string) => ReactNode` | – | Override header rendering. |
| `emptyState` | `ReactNode` | – | Shown when the filter returns nothing. |
| `isItemDisabled` | `(item: T) => boolean` | – | Disabled rows are neither selectable nor arrow-navigable. |
| `placement` | `PopoverPlacement` | `'bottom-start'` | Forwarded to Popover. |
| `matchAnchorWidth` | `boolean` | `true` | Panel width follows the anchor. |
| `minPanelWidth` / `maxPanelWidth` | `number` | – | Bounds in px. |
| `portal` | `boolean` | `true` | |
| `anchorRef` | `RefObject<HTMLElement \| null>` | trigger | Anchor the panel against a **different** element than the click target — e.g. PhoneInput, where the trigger is a small country button but the panel should span the whole field. |
| `showCheckmark` | `boolean` | `true` | Right-edge ✓ on the selected row. Turn off when rows already carry trailing meta (dial codes, currency codes). |
| `panelClassName` / `panelStyle` | – | – | Applied to the panel root. |
| `className` / `style` | – | – | Wrapper — only meaningful if you visually wrap the trigger. |
| `disabled` | `boolean` | – | Blocks all interaction. |
| `onOpenChange` | `(open: boolean) => void` | – | |
| `aria-label` | `string` | – | Accessible name for the listbox. |

## Props — `Listbox`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `T \| null` | – | **Required.** |
| `onChange` | `(item: T \| null) => void` | – | **Required.** |
| `closeOnSelect` | `boolean` | `true` | |

**The atom never calls `onChange(null)` itself** — picking an already-selected row is a visual no-op. Clearing is consumer-driven, so each trigger decides whether to expose a ✕.

## Props — `MultiListbox`

Defaults are tuned for a standard checklist: every row shows a checkbox, selected items stay visible, and the panel stays open across picks.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `T[]` | – | **Required.** |
| `onChange` | `(items: T[]) => void` | – | **Required.** |
| `excludeSelected` | `boolean` | `false` | Hide already-picked items from the list. |
| `closeOnSelect` | `boolean` | `false` | |
| `showCheckbox` | `boolean` | `true` | Leading checkbox marker. |
| `commitMode` | `'change' \| 'close'` | `'change'` | When `onChange` fires — see below. |
| `required` | `boolean` | – | An empty set is invalid. |
| `requiredMessage` | `string` | `'Select at least one option'` | Exported as `DEFAULT_MULTI_REQUIRED_MESSAGE`. |
| `onRequiredViolation` | `(message: string) => void` | – | The consumer renders the message its own way. |
| `footer` | `ReactNode \| (api) => ReactNode` | – | Function form receives `{ close, clear, selected }`. |

For the "items disappear when picked" pattern (PillSelect, where chips outside the panel already show the selection), pass `showCheckbox={false}` with `excludeSelected`.

### `commitMode`

- **`'change'`** (default, live) — every toggle fires `onChange`. What chip pickers and a live "N selected" count need. `required` is checked per toggle; an empty set is **still committed** so the user is not trapped, and the violation is reported alongside.
- **`'close'`** (staged) — toggles accumulate in an internal draft and `onChange` fires **once** when the panel closes. This is what makes "clear all → pick one" work on a required cell: the transient empty set never commits. `required` is checked on close; empty is **not** committed and the violation is reported.

The draft is fully internal — consumers keep passing the committed `value`.

## Keyboard

| Key | Where | Action |
|-----|-------|--------|
| `Enter` / `Space` | trigger | Toggle the panel. |
| `ArrowDown` | trigger | Open the panel. |
| `ArrowDown` / `ArrowUp` | panel | Move the active row, **wrapping** at both ends. Skips disabled rows. |
| `Home` / `End` | panel | First / last selectable row. |
| `Enter` | panel | Select the active row. |
| `Escape` | anywhere | Close — handled globally by `Popover`. |

Panel keys are bound to the search input when searchable, and to the panel itself otherwise; the handler is the same either way. **There is no type-ahead** on the list — `getLabel` feeds the search filter, not a first-letter jump.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-listbox-panel-max-height` | – | `320px` | Panel height ceiling; the list scrolls inside. |
| `--uxm-listbox-panel-bg` | `--color-card` | – | Panel surface. |
| `--uxm-listbox-panel-border` | `--color-border` | – | Panel border. |
| `--uxm-listbox-panel-radius` | – | `8px` | Panel radius. |
| `--uxm-listbox-shadow-offset-y` | – | `6px` | Shadow Y offset. |
| `--uxm-listbox-shadow-blur` | – | `20px` | Shadow blur. |
| `--uxm-listbox-shadow-color` | – | `rgba(0, 0, 0, 0.10)` | Shadow colour. |
| `--uxm-listbox-search-border` | `--color-border` | – | Rule under the search row. |
| `--uxm-listbox-search-icon-color` | `--color-text-subtle` | – | Search glyph. |
| `--uxm-listbox-search-font-size` | – | `12px` | Search text size. |
| `--uxm-listbox-search-color` | `--color-text` | – | Search text colour. |
| `--uxm-listbox-search-placeholder-color` | `--color-text-subtle` | – | Search placeholder. |
| `--uxm-listbox-empty-color` | `--color-text-muted` | – | Empty-state text. |
| `--uxm-listbox-group-header-font-size` | – | `10px` | Group header size. |
| `--uxm-listbox-group-header-color` | `--color-text-subtle` | – | Group header colour. |
| `--uxm-listbox-option-padding-y` | – | `6px` | Row vertical padding. |
| `--uxm-listbox-option-padding-x` | – | `10px` | Row horizontal padding. |
| `--uxm-listbox-option-font-size` | – | `13px` | Row text size. |
| `--uxm-listbox-option-color` | `--color-text` | – | Row text. |
| `--uxm-listbox-option-default-bg` | – | `transparent` | Row background at rest. |
| `--uxm-listbox-option-radius` | – | `4px` | Row radius. |
| `--uxm-listbox-option-disabled-opacity` | – | `0.4` | Disabled row opacity. |
| `--uxm-listbox-option-selected-bg` | `--color-accent-subtle` | – | Selected row background. |
| `--uxm-listbox-option-selected-color` | `--color-accent-bold` | – | Selected row text — **and the ✓ colour**, which inherits it. |
| `--uxm-listbox-option-active-bg` | `--color-surface-alt` | – | Active / hover row background. |
| `--uxm-listbox-option-active-color` | `--color-text` | – | Active / hover row text. |
| `--uxm-listbox-footer-border` | `--color-border` | – | Rule above the footer. |
| `--uxm-listbox-footer-clear-gap` | – | `6px` | Shared "Clear" action gap. |
| `--uxm-listbox-footer-clear-padding` | – | `6px 8px` | Shared "Clear" action padding. |
| `--uxm-listbox-footer-clear-font-size` | – | `13px` | Shared "Clear" action size. |
| `--uxm-listbox-footer-clear-radius` | – | `6px` | Shared "Clear" action radius. |

Two deliberate non-knobs:

- **The ✓ has no colour variable.** It inherits the row's `color`, which on a selected row resolves to `--uxm-listbox-option-selected-color` — designers tune the checkmark by tuning Selected → Text.
- **The multi-select checkbox marker reads `--uxm-checkbox-*`**, the same variables the `Checkbox` atom writes (`--uxm-checkbox-size`, `-border-radius`, `-checked-bg`, `-checked-border`, `-unchecked-bg`, `-unchecked-border`, `-check-glyph-color`). Tune the look once in the Checkbox registry and it carries here. It is a visual marker, **not a real `<input>`**, so it can live inside the row `<button>` without invalid nesting.

Active and selected are mutually exclusive in CSS: the active/hover rule explicitly excludes `--selected`, so opening the panel (which sets the active index to the selected row) cannot let the equal-specificity, later-source-order active rule shadow the selected colour.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Panel surface. |
| `--color-surface-alt` | Surfaces / Surface Alt | Active / hover row. |
| `--color-border` | Borders / Border | Panel border, search rule, footer rule. |
| `--color-text` | Text / Text | Row and search text. |
| `--color-text-muted` | Text / Text Muted | Empty state. |
| `--color-text-subtle` | Text / Text Subtle | Search icon, placeholder, group headers. |
| `--color-accent-subtle` | Accent / Accent Subtle | Selected row background. |
| `--color-accent-bold` | Accent / Accent Bold | Selected row text and ✓. |
| `--color-accent` | Accent / Accent | Checked checkbox marker (via `--uxm-checkbox-*`). |
| `--color-text-inverse` | Text / Text Inverse | Checkbox glyph (via `--uxm-checkbox-*`). |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Closed | – | Only the consumer's trigger. |
| Open | click / Enter / Space / ArrowDown | Panel with optional search, list, optional footer. |
| Searchable | `searchable` | Search row with leading icon above the list. |
| Grouped | `groupBy` | Uppercase section headers between rows. |
| Row selected | in `value` | Accent-subtle background, accent-bold text, semibold; ✓ at the right edge (single-select, `showCheckmark`). |
| Row active | arrow keys or hover | Surface-alt background — **never on the selected row**. |
| Row disabled | `isItemDisabled` | 0.4 opacity, `not-allowed`, unreachable by arrows. |
| Empty | filter matches nothing | `emptyState` in place of the list. |
| Multi checkbox | `MultiListbox`, `showCheckbox` | Leading 18px indicator column on every row. |

## Accessibility

- The panel is `role="listbox"` with rows as `role="option"` carrying `aria-selected` and `aria-disabled`. Group headers are `role="presentation"` so they are not announced as options.
- The trigger receives `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls` (only while open) through `triggerProps`. **Do not override these** — the wiring is what makes the pattern announce correctly.
- Focus stays on the **search input** (or the panel) while `aria-activedescendant` points at the arrow-highlighted option — the standard combobox pattern, so arrow keys move the highlight without moving DOM focus. The search input also carries `aria-autocomplete="list"`.
- **Pass `searchAriaLabel` for a domain-specific picker.** A placeholder is not a reliable accessible name: it disappears once the field has a value, and AT support for placeholder-as-name is inconsistent. `searchAriaLabel` falls back to the placeholder, but "Search countries" beats "Search…".
- **Pass `aria-label`** so the listbox itself has a name.
- Selection indicators are `aria-hidden="true"` — both the ✓ and the checkbox marker. `aria-selected` on the row already conveys state, so announcing the glyph would double it.
- Arrow navigation wraps at both ends and skips disabled rows, so keyboard users never land on an unselectable row.
- `Escape` closes via Popover; focus returns to whatever was focused when the panel opened.
- The row is a `<button>`, so it is operable by Enter and Space natively even outside the managed active-descendant flow.
