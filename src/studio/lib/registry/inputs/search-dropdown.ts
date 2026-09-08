import type { ComponentDef } from '../../types';

export const searchDropdownDef: ComponentDef = {
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
};
