import type { ComponentDef } from '../../types';

export const passwordInputDef: ComponentDef = {
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
};
