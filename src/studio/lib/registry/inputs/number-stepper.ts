import type { ComponentDef } from '../../types';

export const numberStepperDef: ComponentDef = {
  id: 'number-stepper',
  name: 'Number Stepper',
  category: 'Inputs',
  description: 'Numeric input with explicit ± step buttons and an optional unit suffix. Suppresses the native browser spinner — the explicit buttons own the increment/decrement affordance and theming surface. State knobs cover default / hover / focus / disabled on the input sub-element (mirrors the input-text family pattern). Sister atoms: `Number Input` (plain typing-only, no buttons) and `Currency Input` (typing + locale formatting + currency picker).',
  styleProperties: [
    // ── Per-state input colors. Same shape as input-text: each state
    // owns its bg / border / text colors, plus standalone focus-ring
    // and disabled-opacity. Steppers and unit suffix stay shared
    // across states (separate sub-elements).
    // Default
    { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'fieldColors', showWhen: { state: 'default' } },
    { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
    { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'fieldColors', showWhen: { state: 'default' } },
    // Hover
    { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'fieldColors', showWhen: { state: 'hover' } },
    { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
    // Focus
    { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
    { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
    // Disabled
    { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
    { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
    { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
    // Error — out-of-range typed values, server-side rejection, or
    // custom business-rule failures (step buttons can't be the
    // sole error trigger because they enforce min/max themselves;
    // error mode is for the typing path + external validation).
    { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
    { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
    { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
    { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
    // ── Shared input geometry (applies to every state)
    { key: 'inputWidth', label: 'Input Width', control: 'number', defaultValue: 64, min: 32, max: 160, step: 4, unit: 'px' },
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 6, min: 0, max: 12, step: 1, unit: 'px' },
    { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 8, min: 2, max: 16, step: 1, unit: 'px' },
    { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 6, min: 2, max: 12, step: 1, unit: 'px' },
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 12, min: 10, max: 18, step: 1, unit: 'px' },
    { key: 'gap', label: 'Gap', control: 'number', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px' },
    // ± step buttons compose the `IconButton` atom — their size /
    // radius / hover state / focus ring come from IconButton's own
    // registry knobs, not from NumberStepper. Tune IconButton once
    // in the workbench and every consumer (including this stepper,
    // toolbar icon buttons, etc.) inherits the look automatically.
    // ── Unit suffix (shared)
    { key: 'unitColor', label: 'Unit Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'unit' },
    { key: 'unitSize', label: 'Unit Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px', section: 'unit' },
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
    { name: 'onChange', description: 'Fires when the value changes — typing, stepper click, or paste.', payload: '{ value: number }' },
    { name: 'onIncrement', description: 'Fires when the user clicks the up stepper.', payload: 'void' },
    { name: 'onDecrement', description: 'Fires when the user clicks the down stepper.', payload: 'void' },
    { name: 'onFocus', description: 'Fires when the input receives focus.', payload: 'FocusEvent' },
    { name: 'onBlur', description: 'Fires when the input loses focus.', payload: 'FocusEvent' },
  ],
};
