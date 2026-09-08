import type { ComponentDef } from '../../types';

export const editableCellDef: ComponentDef = {
  id: 'editable-cell',
  name: 'Editable Cell',
  category: 'Inputs',
  description: 'Inline-editable cell. Text / number swap the display for an input (Enter or blur commits, Esc cancels); date pairs the input with a Calendar popover — type a date or pick a day, either commits an ISO date string; select is pick-only — clicking opens a Listbox dropdown and picking an option commits its value immediately (display can still be a custom Tag/Badge via `format`); multiselect is select\'s array sibling — a MultiListbox toggles options with the panel open, the value is a string[] of picked option values shown as joined labels. Problems surface in a popover Banner under the cell — warning (yellow) for sync validate failures, error (red) for a rejected async `onCommit` — so the table row never changes height. Designed for DataTable cells but works anywhere an inline-edit pattern fits (PageHeader rename, StatCard label, etc.) — 2 sizes: small (dense table scale, default) / medium (input-family scale for side panels and detail views), each with its own dimension knobs.',
  styleProperties: [
    // Layout — maxWidth and radius are shared across both sizes; the
    // padding/font trio is per-size (gated by the Size variant), one
    // symmetric knob set each, same pattern as Tag. Saves emit as
    // `--uxm-editable-cell-{size}-{kebab(key)}` (fallback path in toCSS),
    // which the matching size modifier re-points the private pipe vars at.
    // There is deliberately NO height knob: the cell's height derives from
    // Font Size × line-height + paddings (a `1lh` floor covers empty
    // cells), so no knob can silently stop mattering.
    { key: 'smallPaddingX', label: 'Padding X', control: 'number', defaultValue: 8, min: 2, max: 16, step: 1, unit: 'px', showWhen: { size: 'small' } },
    { key: 'smallPaddingY', label: 'Padding Y', control: 'number', defaultValue: 4, min: 0, max: 10, step: 1, unit: 'px', showWhen: { size: 'small' } },
    // Font Size and Max Width are SELECTS for both sizes, with the same
    // option list either way — only the default differs. Two reasons:
    //   1. Each has a value the CSS genuinely uses that no numeric stepper
    //      can express — `small`'s font default is the literal `inherit`
    //      (CSS `1em`, so a cell reads like the text around it) and
    //      `medium`'s cap default is `none` (fill the container, the
    //      input-family behaviour in a side panel).
    //   2. Flipping Size must not change the CONTROL for the same property.
    //      A stepper for one size and a dropdown for the other made the
    //      panel unpredictable — the property is the same property.
    { key: 'smallFontSize', label: 'Font Size', control: 'select', defaultValue: 'inherit', options: ['inherit', '11px', '12px', '13px', '14px', '15px', '16px', '18px'], showWhen: { size: 'small' } },
    { key: 'mediumPaddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 20, step: 1, unit: 'px', showWhen: { size: 'medium' } },
    { key: 'mediumPaddingY', label: 'Padding Y', control: 'number', defaultValue: 6, min: 0, max: 14, step: 1, unit: 'px', showWhen: { size: 'medium' } },
    { key: 'mediumFontSize', label: 'Font Size', control: 'select', defaultValue: '14px', options: ['inherit', '11px', '12px', '13px', '14px', '15px', '16px', '18px'], showWhen: { size: 'medium' } },
    // Per-size, like every other dimension: a table cell needs a cap so one
    // long value can't push its column, a side-panel field should just fill
    // the container. Same control + same options for both sizes (see the
    // Font Size note above) — only the default differs.
    { key: 'smallMaxWidth', label: 'Max Width', control: 'select', defaultValue: '320px', options: ['none', '120px', '160px', '240px', '320px', '400px', '480px', '560px', '640px'], showWhen: { size: 'small' } },
    { key: 'mediumMaxWidth', label: 'Max Width', control: 'select', defaultValue: 'none', options: ['none', '120px', '160px', '240px', '320px', '400px', '480px', '560px', '640px'], showWhen: { size: 'medium' } },
    { key: 'radius', label: 'Border Radius', control: 'slider', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px' },
    // Display chrome — one knob per peer state, matching the input
    // family's default / hover / focus / disabled convention. Each is
    // gated to its own state so the panel shows only what's relevant.
    // The value's own colour: pinned through the component layer (the cell no
    // longer inherits it — a muted column / dimmed row must not bleed in), so
    // it belongs in the panel next to its placeholder twin.
    { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'cellColors', showWhen: { state: 'default' } },
    { key: 'placeholderColor', label: 'Placeholder Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'cellColors', showWhen: { state: 'default' } },
    { key: 'hoverBg', label: 'Hover Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'cellColors', showWhen: { state: 'hover' } },
    // The hover affordance differs by type: text / number / date reveal a pencil,
    // the pickers (select / multiselect) reveal a chevron. Gate each so only the
    // relevant one shows under Hover.
    { key: 'pencilColor', label: 'Pencil Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'cellColors', showWhen: { state: 'hover', type: ['text', 'number', 'date'] } },
    { key: 'chevronColor', label: 'Chevron Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'cellColors', showWhen: { state: 'hover', type: ['select', 'multiselect'] } },
    { key: 'focusBorder', label: 'Focus Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'cellColors', showWhen: { state: 'focus' } },
    { key: 'focusRing', label: 'Focus Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'cellColors', showWhen: { state: 'focus' } },
    { key: 'disabledOpacity', label: 'Disabled Opacity', control: 'slider', defaultValue: 0.55, min: 0.2, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
    // Editing — the active input swapped in on click.
    { key: 'inputBg', label: 'Input Background', control: 'color', defaultValue: 'var(--color-card)', section: 'editingColors', showWhen: { state: ['editing', 'open'] } },
    { key: 'inputColor', label: 'Input Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'editingColors', showWhen: { state: ['editing', 'open'] } },
    { key: 'inputBorder', label: 'Input Border', control: 'color', defaultValue: 'var(--color-border)', section: 'editingColors', showWhen: { state: 'editing' } },
    { key: 'inputFocusBorder', label: 'Input Focus Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'editingColors', showWhen: { state: ['editing', 'open'] } },
    // ONE knob pair for every in-field ✕: the same
    // `--uxm-editable-cell-clear-*` vars theme the editing input's ✕
    // (text / number / date) and the picker trigger's ✕, which is why the
    // gate lists both surfaces' states — `editing` for the input,
    // `open` for a picker (its open panel IS its editing surface). The
    // pickers' dropdown-footer Clear is separate: that one lives on the
    // Listbox atom's surface, not a per-cell knob.
    { key: 'clearColor', label: 'Clear Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'editingColors', showWhen: { state: ['editing', 'open'] } },
    { key: 'clearHoverBg', label: 'Clear Hover Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'editingColors', showWhen: { state: ['editing', 'open'] } },
    // Problem severities — each tints the editing input's border; the
    // message itself rides in a popover Banner whose look comes from the
    // Banner atom's own warning / error tokens (not per-cell knobs), so
    // problems read identically everywhere in the product.
    { key: 'warningBorder', label: 'Input Border', control: 'color', defaultValue: 'var(--color-warning-text)', section: 'warningColors', showWhen: { state: 'warning' } },
    { key: 'errorBorder', label: 'Input Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorColors', showWhen: { state: 'error' } },
  ],
  layoutVariants: [
    {
      // Editor-only state switcher (ephemeral — variants never reach the
      // saved overrides). Peer states mirror the rest of the input family
      // (default / hover / focus / disabled / error); `editing` is
      // EditableCell-specific — the input swapped in on click — and
      // `warning` is the recoverable-validation severity (vs `error` =
      // failed save). The preview forces each state visually so its knobs
      // are tunable without interaction. `submitting` is intentionally
      // absent: it has no knobs of its own (it reuses the editing chrome
      // with a disabled input).
      key: 'state',
      label: 'State',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'hover', label: 'Hover' },
        { value: 'focus', label: 'Focus' },
        { value: 'disabled', label: 'Disabled' },
        // Editing is an input-only state — pickers (select/multiselect) have
        // no text-edit mode, so the knob is hidden for them (a stale
        // `editing` selection auto-repairs to Default on type switch).
        { value: 'editing', label: 'Editing', showWhen: { type: ['text', 'number', 'date'] } },
        // A picker's editing surface is its OPEN panel, so `open` is the
        // pickers' counterpart to `editing`: it forces the open chrome and
        // reveals the trigger ✕ so both are tunable without live clicking.
        { value: 'open', label: 'Open', showWhen: { type: ['select', 'multiselect'] } },
        { value: 'warning', label: 'Warning' },
        { value: 'error', label: 'Error' },
      ],
      defaultValue: 'default',
    },
    {
      key: 'type',
      label: 'Type',
      options: [
        { value: 'text', label: 'Text' },
        { value: 'number', label: 'Number' },
        { value: 'date', label: 'Date' },
        { value: 'select', label: 'Select' },
        { value: 'multiselect', label: 'Multi-select' },
      ],
      defaultValue: 'text',
    },
    {
      // Small = the dense DataTable scale (the original look, and the
      // default); medium = the input-family scale for standalone use in
      // side panels / detail views. Each size owns its own dimension knobs.
      key: 'size',
      label: 'Size',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
      ],
      defaultValue: 'small',
    },
    {
      // One format drives everything the user sees on a date cell —
      // the rendered value, the empty-cell hint, the input mask, and
      // parsing. Committed values stay ISO regardless.
      key: 'dateFormat',
      label: 'Date Format',
      options: [
        { value: 'ymd', label: 'YYYY-MM-DD' },
        { value: 'dmy', label: 'DD/MM/YYYY' },
        { value: 'mdy', label: 'MM/DD/YYYY' },
      ],
      defaultValue: 'ymd',
      showWhen: { type: 'date' },
    },
    {
      key: 'align',
      label: 'Align',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      defaultValue: 'left',
    },
  ],
  events: [
    { name: 'onCommit', description: 'Fires when the user confirms a change (Enter, or blur with no validation error; for multiselect, each toggle). Async — the atom shows a submitting state until the returned promise settles.', payload: '(next: string | number | string[]) => void | Promise<void>' },
  ],
  api: {
    importPath: '@viax.io/uxm/ui',
    importNames: 'EditableCell',
    props: [
      { name: 'value', type: 'string | number | string[]', required: true, description: 'Current committed value (a string[] of picked option values for multiselect). The atom keeps a draft internally during edit.' },
      { name: 'onCommit', type: '(next: string | number | string[]) => void | Promise<void>', required: true, description: "Called when the user commits a change. Async — reject the promise to surface a red error Banner in the cell's popover and keep the cell in edit mode for retry (multiselect reverts its optimistic toggle)." },
      { name: 'type', type: '"text" | "number" | "date" | "select" | "multiselect"', defaultValue: '"text"', description: 'Editor type. Number coerces to Number on commit; date pairs a masked input with a Calendar popover — typing and picking both commit a normalized ISO date string; select is pick-only — a Listbox dropdown whose chosen option\'s value commits immediately; multiselect toggles options in a MultiListbox and commits a string[].' },
      { name: 'dateFormat', type: '"mdy" | "dmy" | "ymd"', defaultValue: '"ymd"', description: 'Display / typing format for date cells (same options as DateInput): one format drives the rendered value, the empty-cell hint, the input mask, and parsing. Committed values stay ISO regardless — presentation, not storage.' },
      { name: 'options', type: '{ value: string; label: string }[]', description: 'Options for `type="select"` / `"multiselect"`. Picking one commits its `value` (or toggles it into the array); display shows the `label`(s) unless `format` overrides it.' },
      { name: 'searchable', type: 'boolean', description: 'Show a search box in the dropdown. Defaults to auto — shown only when there are more than 6 options.' },
      { name: 'clearable', type: 'boolean', defaultValue: 'true', description: 'Clear affordance, per type. select / multiselect: a "Clear" action in the dropdown footer that commits an empty value ("" / []). text / number / date: a ✕ inside the EDITING input (mirrors TextInput) that empties the draft and keeps focus — nothing commits until Enter/blur. `required` never hides the affordance, it guards the outcome: clearing a required cell surfaces the required warning (the value stays), clearing an optional one empties it to the placeholder. On by default (the input-family convention) — pass `false` to opt out.' },
      { name: 'align', type: '"left" | "right" | "center"', defaultValue: '"left"', description: "Text alignment for both display and edit modes — pass through from a DataTable column's `align`." },
      { name: 'size', type: '"small" | "medium"', defaultValue: '"small"', description: 'Size preset. `small` is the dense DataTable scale (font inherits until pinned); `medium` steps the cell up to the input-family scale (12/6px padding, 14px font) for standalone use in side panels / detail views. Height always derives from font-size + padding.' },
      { name: 'format', type: '(value: string | number | string[]) => ReactNode', description: 'Display-mode formatter (receives a string[] for multiselect — e.g. render chips). The raw value is still what gets edited.' },
      { name: 'validate', type: '(next: string | number | string[]) => string | null | undefined', description: "Synchronous validation. Return a message to block commit — it surfaces as a yellow warning Banner in the cell's popover (recoverable input problem, vs the red error Banner for a failed save)." },
      { name: 'disabled', type: 'boolean', description: 'Read-only — clicking does nothing, no edit affordance.' },
      { name: 'placeholder', type: 'string', description: 'Shown when value is empty / blank.' },
    ],
  },
};
