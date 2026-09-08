import type { ComponentDef } from '../../types';

export const inputTextDef: ComponentDef = {
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
    importPath: '@viax.io/uxm/ui',
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
};
