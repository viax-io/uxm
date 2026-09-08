import type { ComponentDef } from '../../types';

export const phoneInputDef: ComponentDef = {
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
    importPath: '@viax.io/uxm/ui',
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
};
