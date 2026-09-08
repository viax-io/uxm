import type { ComponentDef } from '../../types';

export const currencyInputDef: ComponentDef = {
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
    importPath: '@viax.io/uxm/ui',
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
};
