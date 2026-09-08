import type { ComponentDef } from '../../types';

export const numberInputDef: ComponentDef = {
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
};
