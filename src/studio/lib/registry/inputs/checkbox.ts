import type { ComponentDef } from '../../types';

export const checkboxDef: ComponentDef = {
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
    // text-strong, not text-muted: muted is 2.54:1 on card in light — under the 3:1 UI floor (Principle IV)
    { key: 'hoverUncheckedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'uncheckedColors', showWhen: { state: 'hover' } },
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
};
