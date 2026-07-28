import type { ComponentDef } from '../types';

export const inputsDefs: ComponentDef[] = [
  // ── Inputs ──
  {
    id: 'input-text',
    name: 'Text Input',
    category: 'Inputs',
    description: 'Standard text input field with label. State knobs cover default / hover / focus / disabled / error — error replaces the previous standalone `Input with Error` atom (one tone surface, one shape surface).',
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Label + Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      // Label theming AND label position live on FormField. This atom
      // is just the input element — no label rendered, no labelPosition
      // variant. Wrap with `<FormField>` when you want a label.
      // Previously had `labelColor` knob + shared `labelPositionVariant`
      // here; both only affected the workbench preview's hand-rolled
      // label and have been removed as part of the consolidation pass.
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires after the user commits a change (blur or Enter).', payload: '{ value: string }' },
      { name: 'onInput', description: 'Fires on every keystroke. High-frequency — use for live validation, not for save.', payload: '{ value: string }' },
      { name: 'onFocus', description: 'Fires when the field receives focus (click or Tab).', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the field loses focus.', payload: 'FocusEvent' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'TextInput',
      props: [
        { name: 'value', type: 'string', description: 'Current value (controlled).' },
        { name: 'onChange', type: '(e: ChangeEvent<HTMLInputElement>) => void', description: 'Change handler. Read `e.target.value`.' },
        { name: 'placeholder', type: 'string', description: 'Placeholder shown when empty.' },
        { name: 'type', type: '"text" | "email" | "tel" | "url" | "password" | "search"', defaultValue: '"text"', description: 'Native input type — affects keyboard and validation hints on mobile.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input.' },
        { name: 'clearable', type: 'boolean', defaultValue: 'true', description: 'Show a clear (✕) button at the trailing edge when the field has content. On by default; the ✕ self-clears and fires `onChange` with "", so no wiring is needed for controlled fields. Pass `false` to opt out.' },
        { name: 'onClear', type: '() => void', description: 'Optional override for the clear action. By default the field clears itself (and notifies via `onChange`); pass `onClear` only for custom reset logic beyond emptying the value.' },
        { name: '...rest', type: 'InputHTMLAttributes<HTMLInputElement>', description: 'All other native input attributes (aria-label, name, autoComplete, etc.) pass through.' },
      ],
    },
  },
  {
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
      // cells), so no knob can silently stop mattering. Small's Font Size
      // default mirrors DataTable's 13px cell font; in CSS the fallback is
      // `1em` (inherit), so an untouched knob keeps the cell reading like
      // the surrounding text.
      { key: 'smallPaddingX', label: 'Padding X', control: 'number', defaultValue: 8, min: 2, max: 16, step: 1, unit: 'px', showWhen: { size: 'small' } },
      { key: 'smallPaddingY', label: 'Padding Y', control: 'number', defaultValue: 4, min: 0, max: 10, step: 1, unit: 'px', showWhen: { size: 'small' } },
      { key: 'smallFontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 16, step: 1, unit: 'px', showWhen: { size: 'small' } },
      { key: 'mediumPaddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 20, step: 1, unit: 'px', showWhen: { size: 'medium' } },
      { key: 'mediumPaddingY', label: 'Padding Y', control: 'number', defaultValue: 6, min: 0, max: 14, step: 1, unit: 'px', showWhen: { size: 'medium' } },
      { key: 'mediumFontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 11, max: 18, step: 1, unit: 'px', showWhen: { size: 'medium' } },
      { key: 'maxWidth', label: 'Max Width', control: 'number', defaultValue: 320, min: 120, max: 640, step: 10, unit: 'px' },
      { key: 'radius', label: 'Border Radius', control: 'slider', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px' },
      // Display chrome — one knob per peer state, matching the input
      // family's default / hover / focus / disabled convention. Each is
      // gated to its own state so the panel shows only what's relevant.
      { key: 'placeholderColor', label: 'Placeholder Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'cellColors', showWhen: { state: 'default' } },
      { key: 'hoverBg', label: 'Hover Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'cellColors', showWhen: { state: 'hover' } },
      // The hover affordance differs by type: text / number / date reveal a pencil,
      // the pickers (select / multiselect) reveal a chevron. Gate each so only the
      // relevant one shows under Hover.
      { key: 'pencilColor', label: 'Pencil Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'cellColors', showWhen: { state: 'hover', type: '!select|multiselect' } },
      { key: 'chevronColor', label: 'Chevron Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'cellColors', showWhen: { state: 'hover', type: 'select|multiselect' } },
      { key: 'focusBorder', label: 'Focus Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'cellColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Focus Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'cellColors', showWhen: { state: 'focus' } },
      { key: 'disabledOpacity', label: 'Disabled Opacity', control: 'slider', defaultValue: 0.55, min: 0.2, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Editing — the active input swapped in on click.
      { key: 'inputBg', label: 'Input Background', control: 'color', defaultValue: 'var(--color-card)', section: 'editingColors', showWhen: { state: 'editing' } },
      { key: 'inputColor', label: 'Input Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'editingColors', showWhen: { state: 'editing' } },
      { key: 'inputBorder', label: 'Input Border', control: 'color', defaultValue: 'var(--color-border)', section: 'editingColors', showWhen: { state: 'editing' } },
      { key: 'inputFocusBorder', label: 'Input Focus Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'editingColors', showWhen: { state: 'editing' } },
      // The ✕ in the editing input's trailing gutter (text / number / date —
      // the pickers clear from their dropdown footer instead, which is the
      // Listbox atom's surface, not a per-cell knob). Editing-only, so it
      // shares the gate with the input knobs above.
      { key: 'clearColor', label: 'Clear Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'editingColors', showWhen: { state: 'editing', type: '!select|multiselect' } },
      { key: 'clearHoverBg', label: 'Clear Hover Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'editingColors', showWhen: { state: 'editing', type: '!select|multiselect' } },
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
      importPath: '@viax/uxm/ui',
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
  },
  {
    id: 'input-with-icon',
    name: 'Input with Icon',
    category: 'Inputs',
    description: 'Text input with a leading icon — search-style field. State knobs cover default / hover / focus / disabled / error.',
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'iconColor', label: 'Icon', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 99, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 12, max: 24, step: 1, unit: 'px' },
      { key: 'iconOffset', label: 'Icon Offset', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires after the user commits a change (blur or Enter).', payload: '{ value: string }' },
      { name: 'onInput', description: 'Fires on every keystroke. High-frequency — use for live validation, not save.', payload: '{ value: string }' },
      { name: 'onClear', description: 'Fires when the user clicks the trailing clear (×) affordance.', payload: 'void' },
      { name: 'onFocus', description: 'Fires when the field receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the field loses focus.', payload: 'FocusEvent' },
    ],
  },
  {
    id: 'password-input',
    name: 'Password Input',
    category: 'Inputs',
    description: "Password entry field with a trailing show/hide eye toggle. State knobs cover default / hover / focus / disabled / error; the trailing toggle has its own hover knob since it's an interactive button. The toggle can be disabled per-instance with the `toggle` variant for stricter UX.",
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'iconColor', label: 'Toggle Icon', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 99, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      { key: 'iconSize', label: 'Toggle Size', control: 'number', defaultValue: 16, min: 12, max: 24, step: 1, unit: 'px' },
      { key: 'iconOffset', label: 'Toggle Offset', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px' },
      { key: 'iconHoverColor', label: 'Toggle Hover', control: 'color', defaultValue: 'var(--color-text)' },
    ],
    layoutVariants: [
      // No `toggle` variant. The show/hide eye is a consumer-code decision
      // (the `toggle` prop on PasswordInput), not a design-system decision —
      // turning it off doesn't introduce a new theming surface, the trailing
      // button simply isn't rendered. Same pattern as InputWithIcon's
      // `clearable` prop: exposed on the component, not promoted to a UXM
      // variant. Designers theme the canonical shape (toggle on) and call
      // sites override at the prop layer when policy demands a strict field.
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires on every keystroke. `e.target.value` is the password text.', payload: 'ChangeEvent<HTMLInputElement>' },
      { name: 'onToggleVisible', description: 'Fires when the user clicks the show/hide eye toggle.', payload: '{ visible: boolean }' },
      { name: 'onFocus', description: 'Fires when the field receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the field loses focus.', payload: 'FocusEvent' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'PasswordInput',
      props: [
        { name: 'value', type: 'string', description: 'Current value (controlled).' },
        { name: 'onChange', type: '(e: ChangeEvent<HTMLInputElement>) => void', description: 'Change handler — `e.target.value` is the password.' },
        { name: 'toggle', type: 'boolean', defaultValue: 'true', description: 'Render the trailing show/hide eye toggle. Pass `false` to suppress.' },
        { name: 'visible', type: 'boolean', description: 'Visibility (controlled). Pair with `onToggleVisible` to drive the toggle externally.' },
        { name: 'defaultVisible', type: 'boolean', defaultValue: 'false', description: 'Initial visibility for uncontrolled toggle usage.' },
        { name: 'onToggleVisible', type: '(visible: boolean) => void', description: 'Fires when the user clicks the eye toggle.' },
        { name: 'autoComplete', type: 'string', defaultValue: '"current-password"', description: 'Browser autofill hint — `current-password` for sign-in, `new-password` for sign-up.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input and the toggle.' },
        { name: '...rest', type: 'InputHTMLAttributes<HTMLInputElement>', description: 'All other native input attributes (placeholder, name, aria-label, etc.) pass through.' },
      ],
    },
  },
  {
    id: 'color-input',
    name: 'Color Input',
    category: 'Inputs',
    description: 'Color picker with a saturation/brightness area, hue and opacity sliders, a swatch, a screen eyedropper and a format select (HEX/RGB/RGBA/HSL). The value editor adapts to the format — one hex field, or R/G/B(/A) or H/S/L numeric fields — and re-derives on switch. Ships inline (ColorInput) and as a swatch-triggered popover (ColorInputPopover). `outputFormat` fixes the emitted format (default hex); Enter commits a field, Escape reverts it, and in the popover both also close the panel.',
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Field / Panel Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      // Shared
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px' },
      { key: 'areaHeight', label: 'Area Height', control: 'slider', defaultValue: 160, min: 100, max: 240, step: 4, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 10, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 8, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'variant',
        label: 'Variant',
        options: [
          { value: 'inline', label: 'Inline' },
          { value: 'popover', label: 'Popover' },
        ],
        defaultValue: 'inline',
      },
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires on every commit (drag, eyedropper, or field commit) with the color formatted per `outputFormat`.', payload: '(color: string) => void' },
      { name: 'onEnter', description: 'Fires when Enter commits a valid text-field draft.', payload: '(color: string) => void' },
      { name: 'onEsc', description: 'Fires when Escape reverts the text-field draft to the last committed value.', payload: '() => void' },
      { name: 'onOpenChange', description: 'Popover variant only — fires when the panel opens or closes.', payload: '(open: boolean) => void', showWhen: { variant: 'popover' } },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: ['ColorInput', 'ColorInputPopover'],
      props: [
        { name: 'value', type: 'string', description: 'Current color (controlled). Any supported syntax: hex, rgb(a), hsl(a).' },
        { name: 'defaultValue', type: 'string', defaultValue: "'#000000'", description: 'Initial color for uncontrolled usage.' },
        { name: 'onChange', type: '(color: string) => void', description: 'Called with the color formatted per `outputFormat` on every commit.' },
        { name: 'formats', type: 'ColorFormat[]', defaultValue: "['hex','rgb','rgba','hsl']", description: 'Representations offered in the in-component format select (what is displayed / edited). A single entry hides the select.' },
        { name: 'outputFormat', type: "'hex' | 'rgb' | 'rgba' | 'hsl'", defaultValue: "'hex'", description: 'Format `onChange` / `onEnter` return — fixed by this prop, independent of the visible representation. hex + alpha < 1 → 8-digit #rrggbbaa.' },
        { name: 'onEnter', type: '(color: string) => void', description: 'Enter commits the field; in the popover it also closes the panel.' },
        { name: 'onEsc', type: '() => void', description: 'Escape reverts the field draft; in the popover it also closes the panel.' },
        { name: 'alpha', type: 'boolean', defaultValue: 'true', description: 'Show the opacity slider.' },
        { name: 'eyedropper', type: 'boolean', defaultValue: 'true', description: 'Show the screen eyedropper button (Chromium only; auto-hidden where the EyeDropper API is unavailable).' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disable all interaction.' },
        { name: 'error', type: 'string', description: 'Non-empty string renders the error state and message below the panel.' },
        { name: 'open', type: 'boolean', description: 'Popover open state (controlled). ColorInputPopover only.' },
        { name: 'defaultOpen', type: 'boolean', defaultValue: 'false', description: 'Initial open state for uncontrolled popover usage. ColorInputPopover only.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Popover open/close callback. ColorInputPopover only.' },
        { name: 'placement', type: 'PopoverPlacement', defaultValue: "'bottom-start'", description: 'Preferred popover placement. ColorInputPopover only.' },
        { name: 'triggerLabel', type: 'string', defaultValue: "'Choose color'", description: 'Accessible name for the trigger swatch. ColorInputPopover only.' },
      ],
    },
  },
  {
    id: 'date-input',
    name: 'Date Input',
    category: 'Inputs',
    description: "Date entry field with a trailing calendar icon and format-mask placeholder. State knobs cover default / hover / focus / disabled / error; the trailing calendar icon has its own hover knob since it's an interactive button.",
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'iconColor', label: 'Icon', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 99, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 12, max: 24, step: 1, unit: 'px' },
      { key: 'iconOffset', label: 'Icon Offset', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px' },
      { key: 'iconHoverColor', label: 'Icon Hover', control: 'color', defaultValue: 'var(--color-text)' },
    ],
    layoutVariants: [
      {
        key: 'mode',
        label: 'Mode',
        options: [
          { value: 'single', label: 'Single Date' },
          { value: 'range', label: 'Range' },
        ],
        defaultValue: 'single',
      },
      {
        key: 'format',
        label: 'Format',
        options: [
          { value: 'mdy', label: 'MM/DD/YYYY' },
          { value: 'dmy', label: 'DD/MM/YYYY' },
          { value: 'ymd', label: 'YYYY-MM-DD' },
        ],
        defaultValue: 'mdy',
      },
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires when the picker selects a date or the user commits a manual edit.', payload: '{ value: Date | null }' },
      { name: 'onOpen', description: 'Fires when the calendar popover opens.', payload: 'void' },
      { name: 'onClose', description: 'Fires when the calendar popover closes (selection or outside click).', payload: 'void' },
      { name: 'onFocus', description: 'Fires when the field receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the field loses focus.', payload: 'FocusEvent' },
    ],
  },
  {
    id: 'time-input',
    name: 'Time Input',
    category: 'Inputs',
    description: 'Time entry field with a trailing clock icon and an HH:MM mask. The `12h` format adds an AM/PM selector at the trailing edge. State knobs cover default / hover / focus / disabled / error.',
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'iconColor', label: 'Icon', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 99, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 12, max: 24, step: 1, unit: 'px' },
      { key: 'iconOffset', label: 'Icon Offset', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px' },
      { key: 'iconHoverColor', label: 'Icon Hover', control: 'color', defaultValue: 'var(--color-text)' },
      // 12h-mode-only — the AM/PM suffix is a quiet inline label (no chip
      // background), so only the text color is themable. Gated by `showWhen`
      // so the knob only surfaces in 12h mode, matching DateInput's
      // range-mode-only knobs precedent.
      { key: 'meridiemColor', label: 'AM/PM Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'meridiem', showWhen: { format: '12h' } },
      // Popover knobs — the column-scroll picker that opens when the
      // clock icon is clicked. Grouped into their own section so the
      // panel reads as "the floating surface" distinct from the field.
      { key: 'popoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'popover' },
      { key: 'popoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'popover' },
      { key: 'popoverRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px', section: 'popover' },
      { key: 'popoverHeadBg', label: 'Column Heading', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'popover' },
      // Row hover + selected defaults align with the Listbox option
      // tokens (`--uxm-listbox-option-{active,selected}-{bg,color}`) so a
      // selected time visually matches a selected listbox option out of
      // the box. TimeInput keeps its own knobs (the columns aren't a
      // Listbox), but the defaults stay in lockstep — designers can tune
      // them independently if they want a different time-picker palette.
      { key: 'popoverRowHoverBg', label: 'Row Hover', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'popover' },
      { key: 'popoverRowSelectedBg', label: 'Selected Row', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'popover' },
      { key: 'popoverRowSelectedColor', label: 'Selected Text', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'popover' },
    ],
    layoutVariants: [
      {
        key: 'format',
        label: 'Format',
        options: [
          { value: '24h', label: '24-hour (HH:MM)' },
          { value: '12h', label: '12-hour (HH:MM AM/PM)' },
        ],
        defaultValue: '24h',
      },
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires on every keystroke, meridiem flip, or popover column pick. Payload is the masked, joined value (`HH:MM` for 24h, `HH:MM AM/PM` for 12h).', payload: '{ value: string }' },
      { name: 'onOpen', description: 'Fires when the time-picker popover opens.', payload: 'void' },
      { name: 'onClose', description: 'Fires when the time-picker popover closes (selection or outside click).', payload: 'void' },
      { name: 'onFocus', description: 'Fires when the field receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the field loses focus.', payload: 'FocusEvent' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'TimeInput',
      props: [
        { name: 'value', type: 'string', description: 'Current value (controlled). 24h: `"HH:MM"`. 12h: `"HH:MM AM"` or `"HH:MM PM"`.' },
        { name: 'onChange', type: '(value: string) => void', description: 'Called with the masked, joined value after each edit.' },
        { name: 'format', type: '"24h" | "12h"', defaultValue: '"24h"', description: 'Clock convention. `12h` adds an AM/PM selector and a third popover column.' },
        { name: 'clock', type: 'boolean', defaultValue: 'true', description: 'Render the trailing clock icon. Pass `false` for an icon-less field.' },
        { name: 'picker', type: 'boolean', defaultValue: 'true', description: 'Mount the click-list popover (hour / minute / AM-PM). Pass `false` for a typing-only field — the clock icon stays decorative.' },
        { name: 'minuteStep', type: 'number', defaultValue: '1', description: "Increment shown in the minute column of the popover. Off-step values typed into the field are still included (sorted), so a typed `09:03` under `minuteStep={5}` doesn't vanish." },
        { name: 'clearable', type: 'boolean', defaultValue: 'true', description: 'Show a trailing clear (✕) button when the field has a value. The ✕ sits inboard of the clock icon (and the AM/PM badge in 12h) and resets the value.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input, the AM/PM selector, and the picker trigger.' },
        { name: '...rest', type: 'InputHTMLAttributes<HTMLInputElement>', description: 'All other native input attributes (placeholder, name, aria-label, etc.) pass through.' },
      ],
    },
  },
  {
    id: 'phone-input',
    name: 'Phone Input',
    category: 'Inputs',
    description: 'International phone field: leading country picker (flag + dial code) with a searchable popover, followed by a national number input with per-country digit masking. Value is an object `{ country, number }` — `country` is the ISO-3166 alpha-2 code, `number` is raw digits. The component handles display formatting and consumers get clean digits back.',
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'countryHoverBg', label: 'Country Hover', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared geometry — same across all states
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 99, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      // Shared trim — picker chrome that stays constant across states.
      // Country divider + caret don't morph between hover / focus /
      // disabled in any meaningful way (the field bg + border do all
      // the state work). Keeping them out of the per-state section
      // prevents the misleading "tune these per state" affordance.
      { key: 'dividerColor', label: 'Country Divider', control: 'color', defaultValue: 'var(--color-border)' },
      { key: 'caretColor', label: 'Caret', control: 'color', defaultValue: 'var(--color-text-muted)' },
      // No popover knobs here: the country picker is the shared Listbox panel,
      // themed once via the `listbox` registry entry (`.uxm-listbox__panel`).
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires on every keystroke and on country pick. Payload is the next `{ country, number }` object.', payload: '{ country: string, number: string }' },
      { name: 'onOpen', description: 'Fires when the country popover opens.', payload: 'void' },
      { name: 'onClose', description: 'Fires when the country popover closes (selection or outside click).', payload: 'void' },
      { name: 'onFocus', description: 'Fires when either the country button or national-number input receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when focus leaves the field.', payload: 'FocusEvent' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'PhoneInput',
      props: [
        { name: 'value', type: '{ country: string, number: string }', description: 'Controlled value. `country` is an ISO-3166 alpha-2 code; `number` is raw digits.' },
        { name: 'onChange', type: '(value: PhoneValue) => void', description: 'Called with the next value after each keystroke or country pick.' },
        { name: 'defaultValue', type: 'PhoneValue', defaultValue: '{ country: "US", number: "" }', description: 'Initial value for uncontrolled usage.' },
        { name: 'countries', type: 'PhoneCountry[]', defaultValue: 'CURATED_COUNTRIES', description: 'Country list shown in the picker. Default is ~30 curated countries; pass a custom list to extend or restrict coverage.' },
        { name: 'clearable', type: 'boolean', defaultValue: 'true', description: 'Show a trailing clear (✕) button when the number has digits. Clearing wipes the number and keeps the selected country.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the field and country picker.' },
        { name: '...rest', type: 'InputHTMLAttributes<HTMLInputElement>', description: 'All other native input attributes (placeholder, name, aria-label, etc.) pass through to the national-number input.' },
      ],
    },
  },
  {
    id: 'slider',
    name: 'Slider',
    category: 'Inputs',
    description: 'Native range slider with themable track and thumb. Two modes: `single` is a one-thumb value picker; `range` is a dual-thumb start/end selector. Both modes share the same theming surface. State knobs cover default / hover / focus / disabled — only the thumb changes across interaction states; track + accent stay constant.',
    styleProperties: [
      // Default — track + thumb both visible since slider always has both
      { key: 'trackColor', label: 'Track', control: 'color', defaultValue: 'var(--color-border)', section: 'states', showWhen: { state: 'default' } },
      { key: 'accentColor', label: 'Accent (Filled)', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'default' } },
      { key: 'thumbColor', label: 'Thumb', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'default' } },
      // Hover — thumb tint when hovered or actively being dragged (one
      // knob covers both since the visual difference is rarely worth
      // exposing as two; the underlying CSS still applies `:active`).
      { key: 'hoverThumbColor', label: 'Thumb', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'hover' } },
      // Focus — single shared ring around the thumb / track
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled — shared opacity
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Shared style — always visible
      { key: 'trackHeight', label: 'Track Height', control: 'number', defaultValue: 6, min: 2, max: 16, step: 1, unit: 'px' },
      { key: 'trackRadius', label: 'Track Radius', control: 'slider', defaultValue: 999, min: 0, max: 999, step: 1, unit: 'px' },
      { key: 'thumbSize', label: 'Thumb Size', control: 'number', defaultValue: 14, min: 8, max: 24, step: 1, unit: 'px' },
      // Range-mode-only — value labels and show toggles. Grouped into
      // their own section so the panel's auto-derived "Per Mode · Range"
      // scope label applies only to these knobs and doesn't bleed into
      // the truly-shared STYLE section above (Track Height / Radius /
      // Thumb Size, which apply uniformly to both modes).
      { key: 'valueColor', label: 'Value Label Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'rangeOptions', showWhen: { mode: 'range' } },
      { key: 'valueSize', label: 'Value Label Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px', section: 'rangeOptions', showWhen: { mode: 'range' } },
      { key: 'showStart', label: 'Show Start', control: 'toggle', defaultValue: false, section: 'rangeOptions', showWhen: { mode: 'range' } },
      { key: 'showEnd', label: 'Show End', control: 'toggle', defaultValue: false, section: 'rangeOptions', showWhen: { mode: 'range' } },
      { key: 'showRange', label: 'Show Range', control: 'toggle', defaultValue: false, section: 'rangeOptions', showWhen: { mode: 'range' } },
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
        ],
        defaultValue: 'default',
      },
      {
        key: 'mode',
        label: 'Mode',
        options: [
          { value: 'single', label: 'Single' },
          { value: 'range', label: 'Range' },
        ],
        defaultValue: 'single',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires continuously while the user drags the thumb. High-frequency — debounce before persisting.', payload: '{ value: number }', showWhen: { mode: 'single' } },
      { name: 'onChange', description: 'Fires continuously while the user drags either thumb. Payload is the full [start, end] range.', payload: '{ value: [number, number] }', showWhen: { mode: 'range' } },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: ['Slider', 'RangeSlider'],
      props: [
        { name: 'value', type: 'number  // (Slider) | [number, number]  // (RangeSlider)', description: 'Current value. Tuple for RangeSlider.' },
        { name: 'onChange', type: '(value: number) => void  // or ([start, end]) => void', description: 'Change handler. Already unwrapped from DOM event — receives the parsed number(s).' },
        { name: 'min', type: 'number', defaultValue: '0', description: 'Lower bound.' },
        { name: 'max', type: 'number', defaultValue: '100', description: 'Upper bound.' },
        { name: 'step', type: 'number', defaultValue: '1', description: 'Increment per arrow/drag tick.' },
      ],
    },
  },
  {
    id: 'number-stepper',
    name: 'Number Stepper',
    category: 'Inputs',
    description: 'Numeric input with explicit ± step buttons and an optional unit suffix. Suppresses the native browser spinner — the explicit buttons own the increment/decrement affordance and theming surface. State knobs cover default / hover / focus / disabled on the input sub-element (mirrors the input-text family pattern). Sister atoms: `Number Input` (plain typing-only, no buttons) and `Currency Input` (typing + locale formatting + currency picker).',
    styleProperties: [
      // ── Per-state input colors. Same shape as input-text: each state
      // owns its bg / border / text colors, plus standalone focus-ring
      // and disabled-opacity. Steppers and unit suffix stay shared
      // across states (separate sub-elements).
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error — out-of-range typed values, server-side rejection, or
      // custom business-rule failures (step buttons can't be the
      // sole error trigger because they enforce min/max themselves;
      // error mode is for the typing path + external validation).
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // ── Shared input geometry (applies to every state)
      { key: 'inputWidth', label: 'Input Width', control: 'number', defaultValue: 64, min: 32, max: 160, step: 4, unit: 'px' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 6, min: 0, max: 12, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 8, min: 2, max: 16, step: 1, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 6, min: 2, max: 12, step: 1, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 12, min: 10, max: 18, step: 1, unit: 'px' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px' },
      // ± step buttons compose the `IconButton` atom — their size /
      // radius / hover state / focus ring come from IconButton's own
      // registry knobs, not from NumberStepper. Tune IconButton once
      // in the workbench and every consumer (including this stepper,
      // toolbar icon buttons, etc.) inherits the look automatically.
      // ── Unit suffix (shared)
      { key: 'unitColor', label: 'Unit Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'unit' },
      { key: 'unitSize', label: 'Unit Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px', section: 'unit' },
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires when the value changes — typing, stepper click, or paste.', payload: '{ value: number }' },
      { name: 'onIncrement', description: 'Fires when the user clicks the up stepper.', payload: 'void' },
      { name: 'onDecrement', description: 'Fires when the user clicks the down stepper.', payload: 'void' },
      { name: 'onFocus', description: 'Fires when the input receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the input loses focus.', payload: 'FocusEvent' },
    ],
  },
  {
    id: 'number-input',
    name: 'Number Input',
    category: 'Inputs',
    description: 'Plain typing-only numeric field — no increment/decrement buttons (use `Number Field` for that, soon to be renamed `Stepper`). Masks non-digits in real time; optional sign and decimal support; min/max clamping on blur. For monetary values use `Currency Input`. State knobs cover default / hover / focus / disabled / error on the input itself (the root IS the visible surface, same shape as `Text Input`).',
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Label + Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      // Number-specific: digits read more naturally right-aligned in
      // tables and forms with mixed-width numbers, but the default
      // mirrors text-input's left alignment so it drops in next to
      // other fields without surprise.
      { key: 'textAlign', label: 'Text Align', control: 'select', options: ['left', 'right'], defaultValue: 'left' },
    ],
    layoutVariants: [
      // No label-position variant — NumberInput is intentionally bare
      // (just the field). Labels, hints, and error messages are the
      // FormField atom's concern; consumers compose them together
      // when they need a labeled control.
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires on every keystroke. Payload is the masked, digit-only string.', payload: '{ value: string }' },
      { name: 'onBlur', description: 'Fires when the field loses focus. Triggers min/max clamping if bounds are set.', payload: 'FocusEvent' },
      { name: 'onFocus', description: 'Fires when the field receives focus.', payload: 'FocusEvent' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'NumberInput',
      props: [
        { name: 'value', type: 'string', description: 'Current value as a digit string (controlled).' },
        { name: 'onChange', type: '(value: string) => void', description: 'Called with the masked, digit-only string on every keystroke.' },
        { name: 'defaultValue', type: 'string', description: 'Initial value for uncontrolled usage.' },
        { name: 'min', type: 'number', description: 'Lower bound. Clamping fires on blur, not per-keystroke.' },
        { name: 'max', type: 'number', description: 'Upper bound. Same blur-clamp behavior.' },
        { name: 'allowNegative', type: 'boolean', defaultValue: 'false', description: 'Allow a leading `-` sign.' },
        { name: 'allowDecimal', type: 'boolean', defaultValue: 'false', description: 'Allow a single `.` decimal separator.' },
        { name: 'decimals', type: 'number', defaultValue: '2', description: 'Max decimal places when `allowDecimal` is true. Excess digits are dropped during masking.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input.' },
        { name: '...rest', type: 'InputHTMLAttributes<HTMLInputElement>', description: 'All other native input attributes (placeholder, name, aria-label, etc.) pass through.' },
      ],
    },
  },
  {
    id: 'currency-input',
    name: 'Currency Input',
    category: 'Inputs',
    description: "Monetary input with a leading interactive currency picker (searchable popover, ~20 curated currencies by default). End users pick the currency at runtime — there's no design-time currency variant. Value is an object `{ currency, amount }`; amount is the raw digit string (consumers get clean data, the component owns display formatting). Standard finance UX: focus reveals raw digits, blur renders locale-formatted with thousands separators.",
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'pickerHoverBg', label: 'Picker Hover', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared geometry — same across all states
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      // Shared trim — picker chrome that stays constant across states.
      // Symbol / caret / divider don't morph between hover / focus /
      // disabled in any meaningful way (the field bg + border do all
      // the state work). Keeping them out of the per-state section
      // prevents the misleading "tune these per state" affordance.
      { key: 'dividerColor', label: 'Picker Divider', control: 'color', defaultValue: 'var(--color-border)' },
      { key: 'symbolColor', label: 'Symbol', control: 'color', defaultValue: 'var(--color-text)' },
      { key: 'caretColor', label: 'Caret', control: 'color', defaultValue: 'var(--color-text-muted)' },
      // No popover knobs here: the currency picker is the shared Listbox panel,
      // themed once via the `listbox` registry entry (`.uxm-listbox__panel`).
    ],
    layoutVariants: [
      // No `currency` variant — that's an end-user runtime choice
      // handled by the picker. The picker always sits on the left
      // (the prefix `$1,234.56` read), so there's no position knob.
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires on every keystroke or currency pick. Payload is the next `{ currency, amount }` object.', payload: '{ currency: string, amount: string }' },
      { name: 'onOpen', description: 'Fires when the currency popover opens.', payload: 'void' },
      { name: 'onClose', description: 'Fires when the currency popover closes (selection or outside click).', payload: 'void' },
      { name: 'onFocus', description: 'Fires when the amount input receives focus. Display flips from formatted to raw digits.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the amount input loses focus. Triggers min/max clamping AND switches display back to locale-formatted.', payload: 'FocusEvent' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'CurrencyInput',
      props: [
        { name: 'value', type: '{ currency: string, amount: string }', description: 'Controlled value. `currency` is an ISO 4217 code; `amount` is the raw digit string.' },
        { name: 'onChange', type: '(value: CurrencyValue) => void', description: 'Called with the next value after each keystroke or currency pick.' },
        { name: 'defaultValue', type: 'CurrencyValue', defaultValue: '{ currency: "USD", amount: "" }', description: 'Initial value for uncontrolled usage.' },
        { name: 'currencies', type: 'Currency[]', defaultValue: 'CURATED_CURRENCIES', description: 'List shown in the picker. Default is ~20 curated currencies. Pass a single-entry array to effectively lock currency selection.' },
        { name: 'locale', type: 'string', defaultValue: '"en-US"', description: 'BCP-47 locale tag. Drives thousands separator style on blur display.' },
        { name: 'allowNegative', type: 'boolean', defaultValue: 'false', description: 'Allow a leading `-` sign for refunds / credits.' },
        { name: 'clearable', type: 'boolean', defaultValue: 'true', description: 'Show a trailing clear (✕) button when the amount has a value. Clearing wipes the amount and keeps the selected currency.' },
        { name: 'min', type: 'number', description: 'Lower bound on the amount. Clamped on blur.' },
        { name: 'max', type: 'number', description: 'Upper bound on the amount. Clamped on blur.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input and the currency picker.' },
      ],
    },
  },
  {
    id: 'textarea',
    name: 'Textarea',
    category: 'Inputs',
    description: 'Multi-line text area. State knobs cover default / hover / focus / disabled / error.',
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Label + Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      { key: 'minHeight', label: 'Min Height', control: 'number', defaultValue: 100, min: 60, max: 300, step: 10, unit: 'px' },
      // Label theming + position live on FormField. See input-text for
      // the same consolidation rationale.
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires after the user commits a change (blur or Enter).', payload: '{ value: string }' },
      { name: 'onInput', description: 'Fires on every keystroke.', payload: '{ value: string }' },
      { name: 'onFocus', description: 'Fires when the textarea receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the textarea loses focus.', payload: 'FocusEvent' },
    ],
  },
  {
    id: 'file-upload',
    name: 'File Upload',
    category: 'Inputs',
    description: 'File-upload atom. Click anywhere on the drop area opens the system file picker; dragging files in fires the drag-over state and drop sends them to `onFiles`. Two state spaces: (1) drop-area state covers default / hover / drag-over / focus / disabled / error (page-level errors only), and (2) per-file lifecycle status — `queued | uploading | done | error` — lives on each `FileUploadFileMeta.status` and paints each row independently. The drop area never shows an aggregate progress bar; each row has its own. Visual-only atom: no built-in upload; `onFiles` returns native `File[]` for the caller to drive. v2 backlog: image rows render a `Thumbnail` preview keyed off MIME instead of the generic document glyph.',
    styleProperties: [
      // ── Per-state drop-area surface colors ──
      // Note: `dropAreaColors` (not the generic `fieldColors` used by
      // input-text / textarea / etc.) — the dropzone is a drop area, not
      // a text field. Same shape as fieldColors otherwise: bg / border /
      // text per state, gated by `showWhen: { state }`.
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'dropAreaColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'dropAreaColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'dropAreaColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'dropAreaColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'dropAreaColors', showWhen: { state: 'hover' } },
      // Drag-over — overlay style: only the surface bg / border / icon tint change.
      { key: 'dragBg', label: 'Background', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-accent) 8%, var(--color-card))', section: 'dragState', showWhen: { state: 'drag-over' } },
      { key: 'dragBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'dragState', showWhen: { state: 'drag-over' } },
      { key: 'dragAccent', label: 'Icon Tint', control: 'color', defaultValue: 'var(--color-accent)', section: 'dragState', showWhen: { state: 'drag-over' } },
      // Focus — paints via :focus-within on the label (the hidden input owns focus).
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'dropAreaColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Error — surface tint + dedicated message slot below the drop area.
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'dropAreaColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'dropAreaColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Message Color', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'dropAreaColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'dropAreaColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'dropAreaColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // ── Shared geometry (always visible) ──
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 12, min: 0, max: 24, step: 1, unit: 'px' },
      { key: 'borderStyle', label: 'Border Style', control: 'select', defaultValue: 'dashed', options: ['dashed', 'solid', 'dotted'] },
      { key: 'borderWidth', label: 'Border Width', control: 'slider', defaultValue: 1.5, min: 1, max: 4, step: 0.5, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 24, min: 8, max: 48, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 24, min: 8, max: 64, step: 2, unit: 'px' },
      { key: 'minHeight', label: 'Min Height', control: 'number', defaultValue: 160, min: 80, max: 320, step: 10, unit: 'px' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px' },
      // ── Icon sub-element ──
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 40, min: 20, max: 72, step: 2, unit: 'px', section: 'icon' },
      { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'icon' },
      // ── Text sub-elements ──
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 15, min: 12, max: 22, step: 1, unit: 'px', section: 'text' },
      { key: 'helpSize', label: 'Help Size', control: 'number', defaultValue: 13, min: 10, max: 16, step: 1, unit: 'px', section: 'text' },
      { key: 'helpColor', label: 'Help Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'text' },
      { key: 'allowedTypesSize', label: 'Allowed-types Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px', section: 'text' },
      { key: 'allowedTypesColor', label: 'Allowed-types Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'text' },
      // ── File-list row knobs (only consumed when `withList: on`) ──
      { key: 'rowBg', label: 'Row Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'fileList' },
      { key: 'rowBorder', label: 'Row Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fileList' },
      { key: 'rowRadius', label: 'Row Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px', section: 'fileList' },
      { key: 'rowGap', label: 'Row Gap', control: 'number', defaultValue: 6, min: 0, max: 16, step: 1, unit: 'px', section: 'fileList' },
      { key: 'rowPaddingX', label: 'Row Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px', section: 'fileList' },
      { key: 'rowPaddingY', label: 'Row Padding Y', control: 'number', defaultValue: 8, min: 2, max: 20, step: 1, unit: 'px', section: 'fileList' },
      { key: 'rowNameColor', label: 'Filename', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'fileList' },
      { key: 'rowMetaColor', label: 'Meta Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fileList' },
      { key: 'rowIconColor', label: 'File Icon', control: 'color', defaultValue: 'var(--color-accent)', section: 'fileList' },
      { key: 'removeIconColor', label: 'Remove Icon', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fileList' },
      // ── File List · Progress ──
      // Per-row progress strip (applied during status="uploading"). It's a
      // single thin colored bar painted directly on the row's bottom edge —
      // no separate track element, so no `progressTrack` knob (the row's
      // own background IS the implicit track at 2px height).
      { key: 'progressFill', label: 'Progress Fill', control: 'color', defaultValue: 'var(--color-accent)', section: 'fileListProgress' },
      { key: 'progressHeight', label: 'Progress Height', control: 'number', defaultValue: 2, min: 1, max: 6, step: 1, unit: 'px', section: 'fileListProgress' },
      // ── File List · Status ──
      // Per-status visual overrides — "what changes when a row succeeds or
      // fails." Grouped together because they're all conditional styling
      // on the same base row, not standalone properties of any one state.
      { key: 'rowDoneBg', label: 'Done Background', control: 'color', defaultValue: 'var(--color-success-bg)', section: 'fileListStatus' },
      { key: 'rowDoneBorderColor', label: 'Done Border', control: 'color', defaultValue: 'var(--color-success-border)', section: 'fileListStatus' },
      { key: 'rowDoneIconColor', label: 'Done Icon', control: 'color', defaultValue: 'var(--color-success-text)', section: 'fileListStatus' },
      { key: 'rowErrorBg', label: 'Error Background', control: 'color', defaultValue: 'var(--color-danger-bg)', section: 'fileListStatus' },
      { key: 'rowErrorBorderColor', label: 'Error Border', control: 'color', defaultValue: 'var(--color-danger-border)', section: 'fileListStatus' },
      { key: 'rowErrorIconColor', label: 'Error Icon', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fileListStatus' },
      { key: 'rowErrorMetaColor', label: 'Error Text', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fileListStatus' },
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'drag-over', label: 'Drag Over' },
          { value: 'focus', label: 'Focus' },
          { value: 'uploading', label: 'Uploading' },
          { value: 'error', label: 'Error' },
          { value: 'disabled', label: 'Disabled' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onFiles', description: 'Fires when the user picks files (via picker or drop). Receives a native `File[]`.', payload: 'File[]' },
      { name: 'onRemove', description: "Fires when a row's remove button is clicked (only when `showFileList` is on).", payload: '{ id: string }' },
      { name: 'onDragEnter', description: 'Fires when a drag enters the drop area.', payload: 'DragEvent' },
      { name: 'onDragLeave', description: 'Fires when a drag leaves the drop area.', payload: 'DragEvent' },
      { name: 'onError', description: 'Fires when the caller rejects a drop (e.g. wrong MIME). The atom never fires this on its own — drive it from your validation in `onFiles`.', payload: '{ reason: string }' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'FileUpload',
      props: [
        { name: 'onFiles', type: '(files: File[]) => void', description: 'Receives picked or dropped files.' },
        { name: 'onRemove', type: '(id: string) => void', description: "Called when a row's remove button is clicked. Only meaningful with `showFileList`." },
        { name: 'multiple', type: 'boolean', defaultValue: 'true', description: 'Allow selecting more than one file at a time. Maps to `<input multiple>`.' },
        { name: 'accept', type: 'string', description: 'Standard `<input accept>` filter, e.g. `"image/*"` or `".pdf,.docx"`. Runtime prop — not a workbench knob.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables click + drop interactions.' },
        { name: 'titleText', type: 'string', defaultValue: '"Upload a file"', description: 'Heading inside the drop area.' },
        { name: 'helpText', type: 'string', description: 'Hint line under the title. Defaults to a `multiple`-aware string if omitted.' },
        { name: 'allowedTypesText', type: 'string', description: 'Optional constraint line below the help text — e.g. "PDF, DOCX · up to 10 MB". Caller-controlled copy: the atom never invents it and never enforces it. Keep it in sync with the `accept` filter and your `onFiles` validation. If omitted, no slot renders.' },
        { name: 'error', type: 'string', description: 'Page-level error message (e.g. "Connection lost"). Paints the drop area in the `error` state and renders the message below it. Named `error` to match the rest of the input family. Distinct from per-file errors — set `status: "error"` + `errorMessage` on a `FileUploadFileMeta` for single-file failures.' },
        { name: 'errorMessage', type: 'string', description: 'Deprecated alias for `error` (back-compat); `error` wins when both are set.' },
        { name: 'files', type: 'FileUploadFileMeta[]', description: "Files to display in the inline list under the drop area. Each row: `{ id, name, size, status?, progress?, errorMessage? }`. `status` is `queued | uploading | done | error` and drives row rendering independently. List is always rendered when `files.length > 0` — to keep the list elsewhere on the page, just don't pass `files` to the atom." },
        { name: 'state', type: '"default" | "drag-over" | "uploading" | "error"', description: 'Drop-area visual state. Caller-controlled — the atom never auto-derives this from per-file statuses. Set `"uploading"` for batch lockouts / pre-file validation / indeterminate uploads; the help text swaps to "Uploading…" and `aria-busy` is applied. Per-file states (queued/uploading/done/error) live on each `FileUploadFileMeta.status` and are orthogonal to this.' },
        { name: 'iconGlyph', type: 'string', defaultValue: '"cloud-arrow-up"', description: 'Override the drop-area icon glyph.' },
      ],
    },
  },
  {
    id: 'select-dropdown',
    name: 'Select Dropdown',
    category: 'Inputs',
    description: 'Dropdown selection field — internally a Listbox-backed picker. This entry themes the trigger (default / hover / focus / disabled / error); the trigger is identical whether or not the panel searches, so searchability isn\'t a knob here — it\'s the `searchable` prop (default auto: the panel grows a search box once the option list is long enough), and the search box itself is previewed + themed in the Listbox entry. Clearability isn\'t a knob either: a clear (✕) button appears automatically once a value is picked IF the select has a placeholder option (`<option value="" disabled>`), which marks "empty" as a valid state. Mandatory selects (no placeholder — a value is always chosen) never show it. For a search-first combobox with its own trigger chrome (icon glyphs, dial codes), use the SearchDropdown atom instead.',
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Label + Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      // Label theming + position live on FormField. See input-text for
      // the same consolidation rationale.
      // The search input's placeholder is NOT a workbench knob: its TEXT
      // is per-instance content the consumer passes at the call site (the
      // searchable Select renders the shared Listbox panel), and its only
      // themeable aspect — the placeholder COLOR — lives once on the
      // `listbox` entry (`searchPlaceholderColor`). A text knob here would
      // also serialize to a dead `--uxm-…-search-placeholder` CSS var that
      // paints nothing.
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'default',
      },
      // Behavioral variants — they change WHAT gets shown, not how the
      // trigger looks. Style knobs (colors, padding, font) apply across
      // all of these. (Searchability is deliberately NOT here: the trigger
      // is identical with/without search, and the search box is previewed
      // in the Listbox entry — see this component's description.)
      {
        key: 'multiSelect',
        label: 'Mode',
        options: [
          { value: 'single', label: 'Single' },
          { value: 'multi', label: 'Multi' },
        ],
        defaultValue: 'single',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires when the user picks a different option.', payload: '{ value: string }' },
      { name: 'onFocus', description: 'Fires when the select receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the select loses focus.', payload: 'FocusEvent' },
    ],
  },
  {
    id: 'search-dropdown',
    name: 'Search Dropdown',
    category: 'Inputs',
    description: 'Combobox: trigger button opens a popover with a search input + filtered list. Use for long option lists (icon glyphs, country codes, large enums); native Select covers short ones. Keyboard-navigable (ArrowUp/Down, Enter, Escape) and click-outside-aware. Trigger state coverage matches the rest of the input family — default / hover / focus / disabled / error.',
    styleProperties: [
      // Default — trigger
      { key: 'triggerBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'triggerColors', showWhen: { state: 'default' } },
      { key: 'triggerBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'triggerColors', showWhen: { state: 'default' } },
      { key: 'triggerColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'triggerColors', showWhen: { state: 'default' } },
      // Hover — trigger
      { key: 'triggerHoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'triggerColors', showWhen: { state: 'hover' } },
      { key: 'triggerHoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'triggerColors', showWhen: { state: 'hover' } },
      // Focus — trigger
      { key: 'triggerFocusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'triggerColors', showWhen: { state: 'focus' } },
      { key: 'triggerFocusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled — trigger
      { key: 'triggerDisabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'triggerColors', showWhen: { state: 'disabled' } },
      { key: 'triggerDisabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'triggerColors', showWhen: { state: 'disabled' } },
      { key: 'triggerDisabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'triggerColors', showWhen: { state: 'disabled' } },
      { key: 'triggerDisabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error — trigger
      { key: 'triggerErrorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'triggerColors', showWhen: { state: 'error' } },
      { key: 'triggerErrorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'triggerColors', showWhen: { state: 'error' } },
      { key: 'triggerErrorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'triggerErrorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared — trigger
      { key: 'triggerRadius', label: 'Trigger Radius', control: 'slider', defaultValue: 6, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'triggerPaddingX', label: 'Trigger Padding X', control: 'number', defaultValue: 12, min: 4, max: 20, step: 1, unit: 'px' },
      { key: 'triggerPaddingY', label: 'Trigger Padding Y', control: 'number', defaultValue: 10, min: 2, max: 14, step: 1, unit: 'px' },
      { key: 'triggerFontSize', label: 'Trigger Font Size', control: 'number', defaultValue: 14, min: 10, max: 18, step: 1, unit: 'px' },
      // SearchDropdown's popover is owned by the shared Listbox atom —
      // see the `listbox` registry entry for panel chrome (bg, border,
      // radius, shadow), option row states (hover, selected, disabled),
      // search input, group headers, empty + footer slots. Tune Listbox
      // once and every dropdown in the app reflects it.
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires when the user picks an option from the dropdown (click or Enter).', payload: '{ value: string }' },
      { name: 'onSearch', description: 'Fires as the user types in the search box. Use to debounce server-side filtering.', payload: '{ query: string }' },
      { name: 'onOpen', description: 'Fires when the popover opens (trigger click or keyboard activation).', payload: 'void' },
      { name: 'onClose', description: 'Fires when the popover closes (selection, Escape, or outside click).', payload: 'void' },
    ],
  },
  {
    id: 'listbox',
    name: 'Listbox (Dropdown Panel)',
    category: 'Inputs',
    description: "Shared dropdown panel used by every select / picker in the app (SearchDropdown, PhoneInput country, CurrencyInput, PillSelect, native Select replacement, ColorPicker). The atom is generic over item shape — consumers pass items + a renderItem and own the trigger entirely. This entry themes the PANEL only: chrome, search input, option rows + states, group headers, empty state, footer. Trigger / field theming lives on each consuming component's own registry entry.",
    styleProperties: [
      // Panel chrome — the floating card.
      { key: 'panelBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'panel' },
      { key: 'panelBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'panel' },
      { key: 'panelRadius', label: 'Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px', section: 'panel' },
      // Drop shadow — decomposed into Color / Blur / Offset Y (colour picker
      // + sliders) instead of a raw box-shadow text field. Same pattern as
      // the Calendar / Menu atoms; the box-shadow is composed from these
      // three vars in listbox.scss.
      { key: 'shadowColor', label: 'Color', control: 'color', defaultValue: 'rgba(0, 0, 0, 0.10)', section: 'shadow' },
      { key: 'shadowBlur', label: 'Blur', control: 'slider', defaultValue: 20, min: 0, max: 48, step: 1, unit: 'px', section: 'shadow' },
      { key: 'shadowOffsetY', label: 'Offset Y', control: 'slider', defaultValue: 6, min: 0, max: 24, step: 1, unit: 'px', section: 'shadow' },
      { key: 'panelMaxHeight', label: 'Max Height', control: 'number', defaultValue: 320, min: 120, max: 600, step: 20, unit: 'px', section: 'panel' },

      // Search input — only meaningful when the consumer enables search.
      { key: 'searchBorder', label: 'Divider', control: 'color', defaultValue: 'var(--color-border)', section: 'search', showWhen: { withSearch: 'yes' } },
      { key: 'searchIconColor', label: 'Icon', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'search', showWhen: { withSearch: 'yes' } },
      { key: 'searchColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'search', showWhen: { withSearch: 'yes' } },
      { key: 'searchPlaceholderColor', label: 'Placeholder', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'search', showWhen: { withSearch: 'yes' } },
      { key: 'searchFontSize', label: 'Font Size', control: 'number', defaultValue: 12, min: 10, max: 18, step: 1, unit: 'px', section: 'search', showWhen: { withSearch: 'yes' } },

      // Option row — sizing knobs apply across all states. The shared
      // (always-visible) section keeps padding / font / radius next to
      // the state-specific colours so they're easy to find.
      { key: 'optionPaddingX', label: 'Padding X', control: 'number', defaultValue: 10, min: 4, max: 20, step: 1, unit: 'px', section: 'option' },
      { key: 'optionPaddingY', label: 'Padding Y', control: 'number', defaultValue: 6, min: 2, max: 14, step: 1, unit: 'px', section: 'option' },
      { key: 'optionFontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px', section: 'option' },
      { key: 'optionRadius', label: 'Radius', control: 'slider', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px', section: 'option' },

      // Per-state colour knobs — scoped by `state` variant so only the
      // knobs relevant to the currently-displayed showcase state are
      // visible. Matches the search-dropdown / select-dropdown / input-text
      // convention. State labels in showWhen match the variant `value`
      // strings ("default" / "active" / "selected" / "selected-active" /
      // "disabled"). Default state has no row background of its own — the
      // panel bg shows through — so only the text colour is exposed there.
      // Default state — bg + text. Bg defaults to transparent so the
      // panel chrome shows through (the common case); tune it if you
      // want every row to have its own surface (e.g. striped rows).
      { key: 'optionDefaultBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'optionState', showWhen: { state: 'default' } },
      { key: 'optionColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'optionState', showWhen: { state: 'default' } },

      // "Hover" state covers both mouse hover and keyboard arrow-key
      // highlight — they paint the same modifier class (`--active`)
      // because the atom keeps them visually equivalent. Registry key
      // names stay `optionActive*` to match the CSS class + var
      // namespace; the workbench label is "Hover" because that's the
      // term designers use.
      { key: 'optionActiveBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'optionState', showWhen: { state: 'hover' } },
      { key: 'optionActiveColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'optionState', showWhen: { state: 'hover' } },

      { key: 'optionSelectedBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'optionState', showWhen: { state: 'selected' } },
      { key: 'optionSelectedColor', label: 'Text', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'optionState', showWhen: { state: 'selected' } },

      { key: 'optionDisabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'optionState', showWhen: { state: 'disabled' } },

      // Group headers — only meaningful when the consumer groups items.
      { key: 'groupHeaderFontSize', label: 'Font Size', control: 'number', defaultValue: 10, min: 9, max: 14, step: 1, unit: 'px', section: 'groupHeader', showWhen: { withGroups: 'yes' } },
      { key: 'groupHeaderColor', label: 'Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'groupHeader', showWhen: { withGroups: 'yes' } },

      // Empty-state line (e.g. "No matches").
      { key: 'emptyColor', label: 'Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'empty' },

      // Footer divider — only shown when a consumer passes a footer slot
      // (ColorPicker's custom-hex panel).
      { key: 'footerBorder', label: 'Divider', control: 'color', defaultValue: 'var(--color-border)', section: 'footer', showWhen: { withFooter: 'yes' } },

      // No "Selection Indicator" knobs — the atom decides the pattern
      // (single-select → right-edge ✓ on selected, multi-select → left
      // checkboxes on every row). The right-edge ✓ inherits the row's
      // `--selected` text colour (tune via Selected → Text). The
      // checkbox marker reads `--uxm-checkbox-*` (tune via the Checkbox
      // atom). No new tuning surface here.
    ],
    layoutVariants: [
      {
        // Which state's classes to apply to the static showcase row at
        // the top of the preview. The interactive instance below is
        // always live — hover / keyboard / selection exercise the real
        // CSS rules independently. This picker is purely for VISUAL
        // confirmation of the per-state knobs (active bg, selected
        // bg/color, disabled opacity) — without it you'd have to hover
        // / click the interactive instance to verify each state.
        key: 'state',
        label: 'Row State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'selected', label: 'Selected' },
          { value: 'disabled', label: 'Disabled' },
        ],
        defaultValue: 'default',
      },
      {
        key: 'withSearch',
        label: 'Search Input',
        options: [
          { value: 'yes', label: 'On' },
          { value: 'no', label: 'Off' },
        ],
        defaultValue: 'yes',
      },
      {
        key: 'withGroups',
        label: 'Group Headers',
        options: [
          { value: 'no', label: 'Off' },
          { value: 'yes', label: 'On' },
        ],
        defaultValue: 'no',
      },
      {
        key: 'withFooter',
        label: 'Footer Slot',
        options: [
          { value: 'no', label: 'Off' },
          { value: 'yes', label: 'On' },
        ],
        defaultValue: 'no',
      },
      {
        // Which atom the interactive preview mounts. The indicator
        // pattern is decided by the atom, not by the workbench:
        //   - `Listbox` (single)   → right-edge ✓ on the selected row
        //   - `MultiListbox` (multi) → left-edge checkbox on every row
        // The static showcase above respects this too — single mode
        // shows the right-✓ when `state=selected`; multi mode shows
        // checkboxes on the row regardless of state.
        key: 'mode',
        label: 'Selection',
        options: [
          { value: 'single', label: 'Single' },
          { value: 'multi', label: 'Multi' },
        ],
        defaultValue: 'single',
      },
      // Multi-only — the Checkboxes variant shows the with/without
      // indicator design choice for multi-select panels. `excludeSelected`
      // (hide picked items from the list) is intentionally NOT exposed
      // — it's a consumer-level decision baked into atoms like
      // PillSelect, not a panel-design choice designers should tune.
      // `showWhen: { mode: "multi" }` keeps it out of single mode.
      {
        key: 'showCheckbox',
        label: 'Checkboxes',
        options: [
          { value: 'on', label: 'On' },
          { value: 'off', label: 'Off' },
        ],
        defaultValue: 'on',
        showWhen: { mode: 'multi' },
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires when the user picks an option (click or Enter). Multi-select toggles items in/out of the array.', payload: 'T (single) | T[] (multi)' },
      { name: 'onOpenChange', description: 'Fires when the panel opens or closes.', payload: 'boolean' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: ['Listbox', 'MultiListbox'],
      props: [
        { name: 'items', type: 'T[]', required: true, description: "Source data — the listbox is generic over T and has no knowledge of what's inside." },
        { name: 'getKey', type: '(item: T) => string', required: true, description: 'Stable React key per item.' },
        { name: 'getLabel', type: '(item: T) => string', required: true, description: 'Plain text used for default substring filter and a11y.' },
        { name: 'value', type: 'T | null  // Listbox\nT[]         // MultiListbox', required: true, description: 'Current selection.' },
        { name: 'onChange', type: '(item: T | null) => void  // Listbox — null when consumer clears\n(items: T[]) => void        // MultiListbox — empty array when cleared', required: true, description: 'Selection callback. Listbox passes null when the consumer wires up a clear affordance (e.g. ✕ in their renderTrigger). MultiListbox passes an empty array when all selections are cleared.' },
        { name: 'renderTrigger', type: '(state: { open, selected, triggerProps }) => ReactNode', required: true, description: "Render the consumer's trigger. Spread `triggerProps` on a button — that wires ref + click + ARIA in one go." },
        { name: 'renderItem', type: '(item: T, state: { active, selected }) => ReactNode', required: true, description: 'Render each row body — the atom owns layout + states; consumer owns visuals (icon, flag, swatch, etc.).' },
        { name: 'searchable', type: 'boolean | "auto"', defaultValue: 'true', description: 'Show a search input above the list. `"auto"` reveals it only once the option count exceeds the shared threshold (6) — the one place that rule lives, so every Listbox-backed picker shares it.' },
        { name: 'filterItems', type: '(items: T[], query: string) => T[]', description: 'Override the default case-insensitive substring filter on `getLabel`.' },
        { name: 'groupBy', type: '(item: T) => string', description: 'Group items under section headers in declared order.' },
        { name: 'footer', type: 'ReactNode', description: "Slot below the list (e.g. ColorPicker's custom hex panel)." },
        { name: 'isItemDisabled', type: '(item: T) => boolean', description: 'Mark individual items inert (not selectable, skipped by keyboard nav).' },
        { name: 'placement', type: '"bottom-start" | "bottom-end" | "top-start" | "top-end"', defaultValue: '"bottom-start"', description: 'Preferred placement; flips on overflow.' },
        { name: 'matchAnchorWidth', type: 'boolean', defaultValue: 'true', description: "Match the positioning anchor's width (the trigger by default, or `anchorRef` if provided)." },
        { name: 'anchorRef', type: 'RefObject<HTMLElement | null>', description: "Override what the popover positions / sizes against. Defaults to the trigger element. Use when the trigger is a small affordance inside a larger field (e.g. PhoneInput's country button inside the phone field)." },
        { name: 'showCheckmark', type: 'boolean', defaultValue: 'true', description: 'Listbox only — show the right-edge ✓ on the selected row. Set to `false` when row content already has trailing meta (dial codes, currency codes) that would compete for the right edge.' },
        { name: 'portal', type: 'boolean', defaultValue: 'true', description: 'Mount the panel into document.body — escapes clipping parents.' },
        { name: 'excludeSelected', type: 'boolean', defaultValue: 'true', description: 'MultiListbox only — hide items already in `value` from the panel.' },
      ],
    },
  },
  {
    id: 'menu',
    name: 'Menu (Action Menu)',
    category: 'Inputs',
    description:
      "Action / dropdown menu — a list of commands invoked from a consumer-owned trigger (a ⋮ IconButton, a Button, anything). Built on the same headless Popover as Listbox (positioning, portal, outside-click, Escape) but with menu semantics (role=menu / menuitem / separator) and NO selected-value state: pick a row → run its action → dismiss. Reach for Listbox/Select when you need to HOLD a chosen value; reach for Menu for row ⋮ actions, overflow menus, and command lists. Supports leading icons, trailing hints (e.g. shortcuts), separators, disabled rows, and destructive (danger) items. This entry themes the PANEL + rows; the trigger is owned entirely by the consumer's renderTrigger.",
    styleProperties: [
      // Panel chrome — the floating card.
      { key: 'panelBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'panel' },
      { key: 'panelBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'panel' },
      { key: 'panelRadius', label: 'Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px', section: 'panel' },
      { key: 'panelMaxHeight', label: 'Max Height', control: 'number', defaultValue: 360, min: 120, max: 600, step: 20, unit: 'px', section: 'panel' },

      // Drop shadow — decomposed into Color / Blur / Offset Y instead of a
      // raw `box-shadow` text field, so designers tune it with a colour
      // picker + sliders. Same pattern as the Calendar atom; the box-shadow
      // is composed from these three vars in styles.css. Defaults match the
      // floating-panel elevation (0 6px 20px rgba(0,0,0,0.10)).
      { key: 'shadowColor', label: 'Color', control: 'color', defaultValue: 'rgba(0, 0, 0, 0.10)', section: 'shadow' },
      { key: 'shadowBlur', label: 'Blur', control: 'slider', defaultValue: 20, min: 0, max: 48, step: 1, unit: 'px', section: 'shadow' },
      { key: 'shadowOffsetY', label: 'Offset Y', control: 'slider', defaultValue: 6, min: 0, max: 24, step: 1, unit: 'px', section: 'shadow' },

      // Item row — sizing knobs apply across all states.
      { key: 'itemPaddingX', label: 'Padding X', control: 'number', defaultValue: 10, min: 4, max: 20, step: 1, unit: 'px', section: 'item' },
      { key: 'itemPaddingY', label: 'Padding Y', control: 'number', defaultValue: 7, min: 2, max: 14, step: 1, unit: 'px', section: 'item' },
      { key: 'itemFontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px', section: 'item' },
      { key: 'itemRadius', label: 'Radius', control: 'slider', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px', section: 'item' },

      // Per-state colours — scoped by the `state` showcase variant so only
      // the knobs relevant to the displayed row state are visible. Mirrors
      // the listbox / select-dropdown convention. "Hover" covers both
      // mouse hover and keyboard arrow-key highlight (same `--active`
      // class). Default row has no surface of its own (panel bg shows
      // through), so only text colour is exposed there.
      { key: 'itemColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'itemState', showWhen: { state: 'default' } },

      { key: 'itemActiveBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'itemState', showWhen: { state: 'hover' } },
      { key: 'itemActiveColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'itemState', showWhen: { state: 'hover' } },

      { key: 'itemDisabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'itemState', showWhen: { state: 'disabled' } },

      // Destructive rows (Delete etc.) — danger text at rest, danger-tinted
      // surface when highlighted.
      { key: 'itemDangerColor', label: 'Text', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'itemState', showWhen: { state: 'danger' } },
      { key: 'itemDangerActiveBg', label: 'Hover Background', control: 'color', defaultValue: 'var(--color-danger-bg)', section: 'itemState', showWhen: { state: 'danger' } },

      // Leading icon colour at rest (tracks the row text colour when
      // active / danger — no separate knobs for those states).
      { key: 'itemIconColor', label: 'Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'icon', showWhen: { withIcons: 'yes' } },

      // Separator divider colour.
      { key: 'separatorColor', label: 'Color', control: 'color', defaultValue: 'var(--color-border)', section: 'separator', showWhen: { withSeparator: 'yes' } },
    ],
    layoutVariants: [
      {
        // Which state the static showcase rows paint. The interactive
        // instance (a real ⋮ trigger) below is always live — hover /
        // keyboard exercise the real CSS independently. This picker is
        // purely to VISUALLY confirm each per-state knob without having
        // to hover the live menu.
        key: 'state',
        label: 'Row State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'danger', label: 'Danger' },
        ],
        defaultValue: 'default',
      },
      {
        key: 'withIcons',
        label: 'Leading Icons',
        options: [
          { value: 'yes', label: 'On' },
          { value: 'no', label: 'Off' },
        ],
        defaultValue: 'yes',
      },
      {
        key: 'withSeparator',
        label: 'Separator',
        options: [
          { value: 'yes', label: 'On' },
          { value: 'no', label: 'Off' },
        ],
        defaultValue: 'yes',
      },
    ],
    events: [
      { name: 'onSelect', description: "Fires when an item is invoked (click / Enter / Space). The menu closes afterward. Per-item — wired via each item's `onSelect`.", payload: 'void' },
      { name: 'onOpenChange', description: 'Fires when the menu opens or closes.', payload: 'boolean' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'Menu',
      props: [
        { name: 'items', type: 'MenuEntry[]', required: true, description: 'Menu entries — actionable items ({ key, label, icon?, hint?, onSelect?, disabled?, danger? }) and separators ({ separator: true }), in display order.' },
        { name: 'renderTrigger', type: '(api: { open, triggerProps }) => ReactNode', required: true, description: 'Render the trigger. Spread `triggerProps` on your interactive element (an IconButton ⋮, a Button) — wires ref + click + ARIA in one go.' },
        { name: 'placement', type: '"bottom-start" | "bottom-end" | "top-start" | "top-end"', defaultValue: '"bottom-end"', description: 'Preferred placement; flips on overflow. Defaults to bottom-end since menus usually align to a trailing ⋮.' },
        { name: 'open', type: 'boolean', description: 'Controlled open state. Pair with onOpenChange. Omit for uncontrolled.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called whenever the menu wants to open/close.' },
        { name: 'minWidth', type: 'number', defaultValue: '160', description: 'Minimum panel width in px.' },
        { name: 'maxWidth', type: 'number', defaultValue: '280', description: 'Maximum panel width in px — long labels truncate beyond it.' },
      ],
    },
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    category: 'Inputs',
    description: 'Checkbox input with label. State knobs cover unchecked × checked across default / hover / focus, plus a shared disabled opacity.',
    styleProperties: [
      // Default — unchecked
      { key: 'uncheckedBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'uncheckedColors', showWhen: { state: 'default' } },
      { key: 'uncheckedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'uncheckedColors', showWhen: { state: 'default' } },
      // Default — checked
      { key: 'checkedBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent)', section: 'checkedColors', showWhen: { state: 'default' } },
      { key: 'checkedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'checkedColors', showWhen: { state: 'default' } },
      { key: 'checkGlyphColor', label: 'Check Glyph', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'checkedColors', showWhen: { state: 'default' } },
      // Hover — unchecked
      { key: 'hoverUncheckedBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'uncheckedColors', showWhen: { state: 'hover' } },
      { key: 'hoverUncheckedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'uncheckedColors', showWhen: { state: 'hover' } },
      // Hover — checked
      { key: 'hoverCheckedBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'checkedColors', showWhen: { state: 'hover' } },
      { key: 'hoverCheckedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'checkedColors', showWhen: { state: 'hover' } },
      { key: 'hoverCheckGlyphColor', label: 'Check Glyph', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'checkedColors', showWhen: { state: 'hover' } },
      // Focus — single shared ring color (outline applies the same to
      // checked and unchecked; splitting it into two knobs was overkill).
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled — single shared opacity (no per-mode colors)
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Shared — always visible
      { key: 'size', label: 'Size', control: 'number', defaultValue: 20, min: 14, max: 32, step: 2, unit: 'px' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px' },
      { key: 'gap', label: 'Label Gap', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      // Error — the box + label stay neutral; the message below is the sole
      // signal (errorColor colors it, errorMessageSize sizes it). Shared keys
      // with the input family so the editor's "Match in N" sync applies.
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires when the user toggles the checked state via click or Space.', payload: '{ checked: boolean }' },
      { name: 'onFocus', description: 'Fires when the checkbox receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the checkbox loses focus.', payload: 'FocusEvent' },
    ],
  },
  {
    id: 'toggle-switch',
    name: 'Toggle Switch',
    category: 'Inputs',
    description: 'On/off toggle switch. State knobs cover off × on across default / hover / focus, plus a shared disabled opacity.',
    styleProperties: [
      // Default — off
      { key: 'offTrack', label: 'Track', control: 'color', defaultValue: 'var(--color-border)', section: 'offColors', showWhen: { state: 'default' } },
      { key: 'offThumb', label: 'Thumb', control: 'color', defaultValue: 'var(--color-card)', section: 'offColors', showWhen: { state: 'default' } },
      // Default — on
      { key: 'onTrack', label: 'Track', control: 'color', defaultValue: 'var(--color-accent)', section: 'onColors', showWhen: { state: 'default' } },
      { key: 'onThumb', label: 'Thumb', control: 'color', defaultValue: 'var(--color-card)', section: 'onColors', showWhen: { state: 'default' } },
      // Hover — off
      { key: 'hoverOffTrack', label: 'Track', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'offColors', showWhen: { state: 'hover' } },
      { key: 'hoverOffThumb', label: 'Thumb', control: 'color', defaultValue: 'var(--color-card)', section: 'offColors', showWhen: { state: 'hover' } },
      // Hover — on
      { key: 'hoverOnTrack', label: 'Track', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'onColors', showWhen: { state: 'hover' } },
      { key: 'hoverOnThumb', label: 'Thumb', control: 'color', defaultValue: 'var(--color-card)', section: 'onColors', showWhen: { state: 'hover' } },
      // Focus — single shared ring color (outline applies the same to
      // off and on; splitting it into two knobs was overkill).
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled — shared opacity
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Shared — always visible
      { key: 'width', label: 'Width', control: 'number', defaultValue: 44, min: 32, max: 64, step: 4, unit: 'px' },
      { key: 'height', label: 'Height', control: 'number', defaultValue: 24, min: 18, max: 36, step: 2, unit: 'px' },
      // Error — the track + label stay neutral; the message below is the sole
      // signal (errorColor colors it, errorMessageSize sizes it).
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires when the toggle flips on/off.', payload: '{ checked: boolean }' },
      { name: 'onFocus', description: 'Fires when the toggle receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the toggle loses focus.', payload: 'FocusEvent' },
    ],
  },
  {
    id: 'radio-group',
    name: 'Radio Group',
    category: 'Inputs',
    description: 'Radio button group with multiple options. State knobs cover unselected × selected across default / hover, plus shared focus ring and disabled opacity.',
    styleProperties: [
      // Default — unselected
      { key: 'unselectedBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'unselectedColors', showWhen: { state: 'default' } },
      { key: 'unselectedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'unselectedColors', showWhen: { state: 'default' } },
      // Default — selected
      { key: 'selectedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'selectedColors', showWhen: { state: 'default' } },
      { key: 'dotColor', label: 'Dot', control: 'color', defaultValue: 'var(--color-accent)', section: 'selectedColors', showWhen: { state: 'default' } },
      // Hover — unselected
      { key: 'hoverUnselectedBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'unselectedColors', showWhen: { state: 'hover' } },
      { key: 'hoverUnselectedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'unselectedColors', showWhen: { state: 'hover' } },
      // Hover — selected
      { key: 'hoverSelectedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'selectedColors', showWhen: { state: 'hover' } },
      { key: 'hoverDotColor', label: 'Dot', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'selectedColors', showWhen: { state: 'hover' } },
      // Focus — single shared ring color
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled — shared opacity
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Shared — always visible
      { key: 'size', label: 'Size', control: 'number', defaultValue: 20, min: 14, max: 32, step: 2, unit: 'px' },
      { key: 'gap', label: 'Item Gap', control: 'number', defaultValue: 16, min: 4, max: 32, step: 4, unit: 'px' },
      // Error — the circles + option labels stay neutral; the group message
      // below is the sole signal (errorColor colors it, errorMessageSize sizes it).
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'default',
      },
      {
        key: 'direction',
        label: 'Direction',
        options: [
          { value: 'vertical', label: 'Vertical' },
          { value: 'horizontal', label: 'Horizontal' },
        ],
        defaultValue: 'vertical',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires when the user picks a different radio option.', payload: '{ value: string }' },
    ],
  },
];
