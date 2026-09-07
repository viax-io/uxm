# EditableCell

An inline-editable cell: renders as plain text until clicked, then swaps in the matching editor in place. Five editor types (`text` / `number` / `date` / `select` / `multiselect`), two size presets (`small` / `medium`), async commit with inline warning/error surfacing. Designed primarily for `DataTable` columns, but works anywhere an edit-in-place semantic fits (PageHeader rename, StatCard label, detail side panels).

Three modes:

- **Display** (default) — the formatted value as a button-styled text run; hover reveals the affordance glyph (pencil for text/number/date, chevron for the pickers). Click / Enter / Space enters edit mode.
- **Editing** — a focused, select-all'd input replaces the display (date pairs it with a `Calendar` popover; the pickers open a `Listbox`/`MultiListbox` panel instead of a text input, and while the panel is open the trigger takes the same editing chrome — card surface, accent border, focus halo — so "being edited" reads identically across all five types). Enter commits, Esc cancels, blur commits.
- **Submitting** — the input is disabled while an async `onCommit` is pending.

Problems never change the row's height: they ride in a `Popover`-anchored compact `Banner` under the cell — **warning** (yellow) for recoverable input problems (`validate` failures, `required` violations, unparseable drafts), **error** (red) for a rejected `onCommit`. Either way the cell stays in edit mode for correction / retry.

## Usage

```tsx
import { EditableCell } from '@viax/uxm';

// Text — rename-in-place
<EditableCell value={name} onCommit={(next) => rename(String(next))} required />

// Number — commits a Number; an emptied draft commits '' (the uniform "cleared" value)
<EditableCell type="number" value={amount} onCommit={saveAmount}
  format={(v) => `$${Number(v).toLocaleString()}`} placeholder="Add amount" />

// Date — masked input + Calendar; commits an ISO `YYYY-MM-DD` string
<EditableCell type="date" dateFormat="dmy" value={closeDate} onCommit={saveDate} />

// Select / multiselect — pick-only editors driven by `options`
<EditableCell type="select" value={status} options={STATUS_OPTIONS} onCommit={saveStatus}
  format={(v) => <Tag type={toTagType(v)} size="small">{String(v)}</Tag>} />
<EditableCell type="multiselect" value={regions} options={REGION_OPTIONS} onCommit={saveRegions} />

// Side panel / detail view — step up to the input-family scale
<EditableCell size="medium" value={title} onCommit={saveTitle} />
```

Inside a `DataTable`, don't compose this by hand — mark the column `editable` and use the `editor*` column options (`editor`, `editorOptions`, `editorClearable`, `editorRequired`, `dateFormat`, `formatValue`, `validate`, `isEditable`); the table wires them through to `EditableCell`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number \| string[]` | – | **Required.** Current committed value (`string[]` for multiselect). The atom keeps its own draft while editing. |
| `onCommit` | `(next) => void \| Promise<void>` | – | **Required.** Fires on commit. Resolve → exit edit mode; reject → red error Banner, cell stays editing for retry. |
| `type` | `'text' \| 'number' \| 'date' \| 'select' \| 'multiselect'` | `'text'` | Editor type. `number` commits a `Number` (emptied → `''`); `date` commits ISO regardless of `dateFormat`; pickers commit an option `value` / `string[]`. |
| `size` | `'small' \| 'medium'` | `'small'` | Preset density. `small` = the dense DataTable scale (font inherits via `1em` until pinned, width capped at 320px); `medium` = the input-family scale (12/6px padding, 14px font, **no width cap** — fills its container) for standalone use in side panels / detail views. There is **no height knob** — height always derives from font-size + padding (a `1lh` floor keeps empty cells one line tall and clickable). |
| `dateFormat` | `'mdy' \| 'dmy' \| 'ymd'` | `'ymd'` | Date cells only — drives the rendered value, the empty-cell hint, the input mask, and parsing. Presentation only; storage stays ISO. |
| `options` | `{ value: string; label: string }[]` | – | Required for `select` / `multiselect`. Display shows the label(s) unless `format` overrides. |
| `searchable` | `boolean \| 'auto'` | `'auto'` | Pickers only — search box in the panel. `'auto'` reveals it past the shared Listbox threshold (6 options), matching the `Select` atom. |
| `clearable` | `boolean` | `true` | Clear affordance (see below). Pass `false` to opt out. |
| `required` | `boolean` | `false` | Empty commit is blocked with a warning, checked BEFORE `validate`. Uniform emptiness rule per type: `[]`, `NaN`, blank string. Never hides the clear affordance — it guards the outcome instead. |
| `requiredMessage` | `string` | per-type | Overrides the default message (`"Required"` / `"Select an option"` / `"Select at least one option"`). |
| `saveErrorMessage` | `string` | `'Failed to save'` | Shown at `error` severity when `onCommit` rejects **without** a message of its own. A rejection carrying an `Error.message` still wins — that text is the server's, not the atom's. |
| `invalidNumberMessage` | `string` | `'Enter a number'` | Shown at `warning` severity when a `type="number"` draft isn't a number. |
| `invalidDateMessage` | `string` | `invalidDateMessage(dateFormat)` | Shown at `warning` severity when a `type="date"` draft doesn't parse. The default names the expected mask (`` `Enter a valid date (YYYY-MM-DD)` ``) — a translation should keep the mask in it. |
| `invalidValueMessage` | `string` | `'Enter a valid value'` | Sample warning text for `forceMode="warning"`. Preview-only; production consumers never see it. |
| `validate` | `(next) => string \| null \| undefined` | – | Sync validation; a returned message blocks commit as a yellow warning. |
| `format` | `(value) => ReactNode` | – | Display-mode formatter (e.g. currency, a `Tag`). **Never called for an empty value** — a cleared cell renders its `placeholder` instead. |
| `align` | `'left' \| 'right' \| 'center'` | `'left'` | Applies to display AND edit modes — pass through from a DataTable column's `align`. |
| `placeholder` | `string` | – | Shown when the value is empty (date falls back to the format hint, e.g. `MM/DD/YYYY`). |
| `disabled` | `boolean` | – | Read-only: no edit affordance, clicks do nothing. |
| `className` / `style` / `aria-label` | – | – | Root passthroughs. |
| `forceMode` | `'editing' \| 'warning' \| 'error'` | – | **Preview-only.** Forces the editing branch (plus a sample message — `invalidValueMessage` / `saveErrorMessage` — at the given severity) so the UXM canvas can paint state knobs without stealing focus. Production consumers leave it unset. |
| `clearSelectionLabel` | `string` | `'Clear selection'` | Clear button — select / multiselect editors. |
| `clearDateLabel` | `string` | `'Clear date'` | Clear button — date editor. |
| `clearValueLabel` | `string` | `'Clear value'` | Clear button — text / number editors. |
| `openCalendarLabel` | `string` | `'Open calendar'` | Calendar trigger — date editor. |
| `calendarDialogLabel` | `string` | `'Choose date'` | Calendar popover dialog — date editor. |
| `addDateLabel` | `string` | `'Add date'` | Trigger name when the date editor is empty. |

Exports: `EditableCell`, `EditableCellProps`, `EditableCellType`, `EditableCellSize`, `EditableCellAlign`, `EditableCellValue`, `EditableCellOption`.

## Clearing

`clearable` (default `true`, the input-family convention) surfaces a per-type clear affordance:

- **text / number / date** — a ✕ inside the *editing* input (mirrors `TextInput`; date's ✕ sits inboard of the calendar toggle). It empties the **draft** only and keeps focus — nothing commits until Enter/blur, and Esc still restores the committed value. Works on `required` cells too: "wipe it and type the right value".
- **select** — a "Clear" action in the dropdown footer that commits `''` immediately.
- **multiselect** — a "Clear all" footer action that empties the *staged draft* and keeps the panel open ("clear all → pick one" never trips the required rule; the one commit happens on panel close).
- **pickers additionally clear from the field**: a ✕ on the trigger itself, inboard of the chevron, revealed **while the panel is open** and kept out of the tab order; it commits `''` / `[]` directly. The open panel is a picker's editing surface, so its ✕ lives there exactly as the text/number/date ✕ lives inside the editing input — hover keeps surfacing the chevron alone, so a table at rest never offers a one-click destroy.

`required` never hides a clear affordance — it guards the outcome: clearing a required cell surfaces the required warning (the value stays); clearing an optional one empties it back to the `placeholder`. text/number/date cells never show a ✕ in display mode — the pencil owns that gutter, and clearing them is an editing action (enter the cell, then ✕).

## CSS variables

All theming follows the two-layer model: `var(--uxm-editable-cell-*, var(--color-*))`.

### Per size (dimensions)

Each size owns a symmetric knob set; the base rules read private `--_uxm-editable-cell-*` pipe vars that the size modifiers (double-class, specificity `(0,2,0)`) re-point.

In the studio both sizes expose the same control for the same property (Font Size and Max Width are dropdowns for `small` and `medium` alike) — only the default differs, because each has a keyword value no numeric stepper can express: `small`'s font is `inherit` and `medium`'s cap is `none`.

| Variable | Default | Affects |
|----------|---------|---------|
| `--uxm-editable-cell-small-max-width` | `320px` | `small` width cap — a long value truncates instead of pushing its table column. |
| `--uxm-editable-cell-small-padding-x` | `8px` | `small` inline padding (also derives every gutter). |
| `--uxm-editable-cell-small-padding-y` | `4px` | `small` block padding. |
| `--uxm-editable-cell-small-font-size` | `1em` (inherit) | `small` font — inherits the surrounding text until pinned. |
| `--uxm-editable-cell-medium-max-width` | `none` | `medium` width cap — `none` by default, so the cell fills its container like any input-family field. Pin a px value to cap it. |
| `--uxm-editable-cell-medium-padding-x` | `12px` | `medium` inline padding. |
| `--uxm-editable-cell-medium-padding-y` | `6px` | `medium` block padding. |
| `--uxm-editable-cell-medium-font-size` | `14px` | `medium` font (pinned — standalone contexts have no table scale to inherit). |

> The pre-4.2 un-namespaced `--uxm-editable-cell-{min-height,padding-x,padding-y}` vars are gone; there is no min-height at all — height derives from font + padding.

### Shared

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-editable-cell-radius` | – | `4px` | Display cell + editing input radius. |
| `--uxm-editable-cell-color` | `--color-text` | – | The value's text colour. Pinned, not inherited: primary text is `--color-text` system-wide, so inheriting only let a muted column / dimmed row bleed in. |
| `--uxm-editable-cell-hover-bg` | `--color-surface-alt` | – | Display hover tint. |
| `--uxm-editable-cell-pencil-color` | `--color-text-muted` | – | Hover pencil / calendar glyph. |
| `--uxm-editable-cell-chevron-color` | `--color-text-muted` | – | Picker hover chevron. |
| `--uxm-editable-cell-focus-border` | `--color-accent` | – | Keyboard-focus border (display). |
| `--uxm-editable-cell-focus-ring` | `--color-accent` | – | 2px offset focus ring (display + editing input). |
| `--uxm-editable-cell-placeholder-color` | `--color-text-subtle` | – | Empty-cell placeholder (italic). |
| `--uxm-editable-cell-disabled-opacity` | – | `0.55` | Disabled dimming. |
| `--uxm-editable-cell-outdent` | – | `0` | **Composition knob, not a design knob.** A flag (`1` / `0`), not a length: set it to `1` and the cell pulls itself back by its own `--uxm-editable-cell-text-inset` so its TEXT — not its padded box — lands on the host's content grid, while the hover pill bleeds into the gutter. `FormField` sets it on its control wrapper, so it reaches a cell at **any depth** (a cell wrapped in a row with a translation count aligns like a bare one). The cell does the arithmetic because the inset is declared here and resolves nowhere above. Alignment is handled internally: `align-right` pulls on the trailing side, `align-center` not at all. A cell that is *not* on its column's leading edge opts out with `0`, and see the inheritance note on the row below. |
| `--uxm-editable-cell-editing-track-floor` | – | `max-content` | **Composition knob, not a design knob** (like `--uxm-editable-cell-text-inset`, it isn't in the studio registry). Minimum width of edit mode's internal grid track. The `max-content` default is the width-keeper ghosts' anti-jump behaviour and is right in an **auto-sized** container (a DataTable column). A host that lays the cell out at a **definite** width sets it to `0` so the cell fits instead of asserting its own width — `FormField` does this for its control column.  Both this knob and `--uxm-editable-cell-outdent` are read from **inherited** custom properties, so a host sets them once on a wrapper and they reach a cell at any depth — which also means they reach cells the host never meant to touch. A component that nests its own cells inside such a wrapper (a `DataTable` rendered inside a `FormField` control, say) must reset both on its own root to keep its behaviour; `DataTable` does this. |
| `--uxm-editable-cell-input-bg` | `--color-card` | – | Editing input background. |
| `--uxm-editable-cell-input-color` | `--color-text` | – | Editing input text. |
| `--uxm-editable-cell-input-border` | `--color-border` | – | Editing input idle border (matches TextInput). |
| `--uxm-editable-cell-input-focus-border` | `--color-accent` | – | Editing input focused border. |
| `--uxm-editable-cell-clear-color` | `--color-text-muted` | – | Resting ✕ in the editing gutter (text / number / date). |
| `--uxm-editable-cell-clear-hover-color` | `--color-text` | – | Hovered ✕ glyph. |
| `--uxm-editable-cell-clear-hover-bg` | `--color-surface-alt` | – | Hovered ✕ backplate. |
| `--uxm-editable-cell-date-icon-hover-color` | `--color-text` | – | Hovered calendar toggle (its resting color is `--uxm-editable-cell-pencil-color`). |
| `--uxm-editable-cell-warning-border` | `--color-warning-text` | – | Input border while a warning shows. |
| `--uxm-editable-cell-error-border` | `--color-danger-text` | – | Input border while an error shows. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Display | default | Transparent text run; hover tint + glyph fade-in. |
| Focus | keyboard | Accent border + 2px offset ring — the family focus language. |
| Editing | click / Enter / Space | TextInput-look input, auto-focused + select-all'd. Open pickers paint the same chrome on their trigger (`--open`, same `--uxm-editable-cell-input-*` vars). |
| Submitting | pending `onCommit` | Input disabled until the promise settles. |
| Warning | `validate` / `required` / bad draft | Yellow input border + compact Banner in a popover under the cell. |
| Error | rejected `onCommit` | Red input border + Banner; input refocused for retry. |
| Disabled | `disabled` | Dimmed, no affordance. |
| Size `small` / `medium` | `size` | Dense table scale / input-family scale. |
| Type × Align | `type`, `align` | Editor per type; alignment applies to both modes (right-aligned cells mirror the gutters). |

## Implementation notes

- **Width.** The cell is `width: 100%` + `box-sizing: border-box`, so it fills the column it sits in up to its per-size cap and its own padding/border stay inside that width — a 600px panel with 16px padding yields a 568px cell. Values that don't fit truncate with an ellipsis in display mode (the editing input scrolls internally instead); the ghosts below carry the same cap so editing can't widen the column past it.
- **Width-keeper ghosts.** Entering edit mode must not resize an auto-sized table column. The editing wrapper is an `inline-grid` stacking two invisible "ghost" spans (the display content and the live draft) under the input; the ghosts size the track, the input contributes zero intrinsic width and stretches to it. The ghosts mirror the display box's paddings *including* the gutters — a clearable date cell reserves both slots (calendar + ✕). **The track's floor is a published knob, because `max-content` is only right in an auto-sized container.** A `max-content` floor means "never narrower than the whole draft on one line", so in a container that is merely *narrower* than the draft — any fixed-width panel — the track, and the input stretched to it, overflowed the cell's own box. Capping to the container and preserving a `max-content` contribution are contradictory demands on one track, so the context picks: a host laying the cell out at a definite width sets `--uxm-editable-cell-editing-track-floor: 0` and the cell fills what it's given (`FormField` does this), while a DataTable leaves the default and keeps the anti-jump behaviour. The ghosts render either way. 
- **Gutters are reserved by modifiers**, not by icon presence (`--clearable`, `--type-date`), so the ✕ appearing/hiding with the draft never shifts text. The reservation is scoped to the state that reveals the control — `--clearable.--editing` for the text/number/date input, `--clearable.--open` for a picker's trigger — so a cell being *read* never pays for a control it can't reach. The trade on pickers is that a long label can re-ellipsize as the panel opens; opening already repaints the whole trigger, and the panel matches the anchor's width, so the full label sits right under the truncated one.
- **Date storage is ISO.** Committed date values are `YYYY-MM-DD` regardless of `dateFormat`; parsing accepts the mask first, ISO as fallback; re-picking the same day or blurring an unchanged date never fires `onCommit`.
- **Multiselect is a commit boundary.** It opts into `MultiListbox`'s staged mode (`commitMode="close"`): N toggles = one `onCommit` on panel close.

## Accessibility

- Display mode is a real `<button>` (or the picker's trigger button) — keyboard reachable, `aria-label` defaults to `"Edit {value}"` / `"Add date"` for empty date cells.
- The editing input carries `aria-invalid` and `aria-describedby` pointing at the Banner message while a problem shows.
- The date calendar popover is `role="dialog"` with an accessible name, deliberately non-modal: focus stays in the typed input (the calendar augments typing; its mousedown is swallowed so a pick never blur-commits a stale draft).
- The clear ✕ buttons have explicit `aria-label`s (`"Clear value"` / `"Clear date"`) and swallow mousedown to keep focus in the field.
- The two in-gutter buttons (✕ and the calendar toggle) are `tabIndex={-1}` — pointer affordances only, so Tab keeps advancing to the next cell. Leaving them focusable would strand focus: the blur Tab fires commits the cell and unmounts them mid-focus-shift. The keyboard has equivalent paths for both — select-all + Delete clears, and entering edit mode on a date cell already opens the calendar.
- Focus visuals match the family: accent border + 2px offset ring on both the display cell and the editing input.
