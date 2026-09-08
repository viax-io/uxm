import type { ComponentDef } from '../../types';

export const codeEditorDef: ComponentDef = {
  id: 'code-editor',
  name: 'Code Editor',
  category: 'Inputs',
  description: 'Monospace code surface for developer tooling. Knobs also theme the read-only CodeBlock — the two are one surface on purpose.',
  styleProperties: [
    // Default
    { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'default' } },
    { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
    { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
    // Hover
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
    { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
    { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
    { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
    // Gutter — the line-number ruler. Its color/gap are the only chrome the
    // gutter owns; its font and vertical padding are shared with the code so
    // the two stay aligned, and are therefore NOT separately tunable.
    { key: 'gutterColor', label: 'Number Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'gutter' },
    { key: 'gutterBg', label: 'Gutter Background', control: 'color', defaultValue: 'transparent', section: 'gutter' },
    { key: 'gutterBorder', label: 'Gutter Divider', control: 'color', defaultValue: 'var(--color-border)', section: 'gutter' },
    { key: 'gutterGap', label: 'Gutter Gap', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px', section: 'gutter' },
    // Shared
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
    { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 14, min: 4, max: 24, step: 2, unit: 'px' },
    { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 12, min: 4, max: 20, step: 2, unit: 'px' },
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 12.5, min: 10, max: 18, step: 0.5, unit: 'px' },
    // Unitless on purpose — a line-height with a unit breaks the gutter's
    // alignment as soon as the font size changes.
    { key: 'lineHeight', label: 'Line Height', control: 'slider', defaultValue: 1.6, min: 1.2, max: 2.2, step: 0.1 },
    { key: 'minHeight', label: 'Min Height', control: 'number', defaultValue: 140, min: 80, max: 480, step: 20, unit: 'px' },
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
    { name: 'onChange', description: 'Fires on every edit, including Tab-indent and auto-indent.', payload: '{ value: string }' },
    { name: 'onKeyDown', description: 'Runs BEFORE the atom\'s own key handling — call preventDefault to claim a key (e.g. ⌘Enter to run).', payload: 'KeyboardEvent' },
    { name: 'onFocus', description: 'Fires when the editor receives focus.', payload: 'FocusEvent' },
    { name: 'onBlur', description: 'Fires when the editor loses focus.', payload: 'FocusEvent' },
  ],
};
