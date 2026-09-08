import type { ComponentDef } from '../../types';

export const dateInputDef: ComponentDef = {
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
};
