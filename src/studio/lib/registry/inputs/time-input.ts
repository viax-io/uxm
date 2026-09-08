import type { ComponentDef } from '../../types';

export const timeInputDef: ComponentDef = {
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
    importPath: '@viax.io/uxm/ui',
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
};
