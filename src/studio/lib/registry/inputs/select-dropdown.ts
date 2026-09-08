import type { ComponentDef } from '../../types';

export const selectDropdownDef: ComponentDef = {
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
};
