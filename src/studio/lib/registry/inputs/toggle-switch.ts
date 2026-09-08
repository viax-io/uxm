import type { ComponentDef } from '../../types';

export const toggleSwitchDef: ComponentDef = {
  id: 'toggle-switch',
  name: 'Toggle Switch',
  category: 'Inputs',
  description: 'On/off toggle switch. State knobs cover off × on across default / hover / focus, plus a shared disabled opacity.',
  styleProperties: [
    // Default — off
    { key: 'offTrack', label: 'Track', control: 'color', defaultValue: 'var(--color-border)', section: 'offColors', showWhen: { state: 'default' } },
    { key: 'offThumb', label: 'Thumb', control: 'color', defaultValue: 'var(--color-card)', section: 'offColors', showWhen: { state: 'default' } },
    // Default — on
    { key: 'onTrack', label: 'Track', control: 'color', defaultValue: 'var(--color-accent)', section: 'onColors', showWhen: { state: 'default' } },
    { key: 'onThumb', label: 'Thumb', control: 'color', defaultValue: 'var(--color-card)', section: 'onColors', showWhen: { state: 'default' } },
    // Hover — off
    // text-strong, not text-muted: muted is 2.54:1 on card in light — under the 3:1 UI floor (Principle IV)
    { key: 'hoverOffTrack', label: 'Track', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'offColors', showWhen: { state: 'hover' } },
    { key: 'hoverOffThumb', label: 'Thumb', control: 'color', defaultValue: 'var(--color-card)', section: 'offColors', showWhen: { state: 'hover' } },
    // Hover — on
    { key: 'hoverOnTrack', label: 'Track', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'onColors', showWhen: { state: 'hover' } },
    { key: 'hoverOnThumb', label: 'Thumb', control: 'color', defaultValue: 'var(--color-card)', section: 'onColors', showWhen: { state: 'hover' } },
    // Focus — single shared ring color (outline applies the same to
    // off and on; splitting it into two knobs was overkill).
    { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
    // Disabled — shared opacity
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
    // Shared — always visible
    { key: 'width', label: 'Width', control: 'number', defaultValue: 44, min: 32, max: 64, step: 4, unit: 'px' },
    { key: 'height', label: 'Height', control: 'number', defaultValue: 24, min: 18, max: 36, step: 2, unit: 'px' },
    // Error — the track + label stay neutral; the message below is the sole
    // signal (errorColor colors it, errorMessageSize sizes it).
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
    { name: 'onChange', description: 'Fires when the toggle flips on/off.', payload: '{ checked: boolean }' },
    { name: 'onFocus', description: 'Fires when the toggle receives focus.', payload: 'FocusEvent' },
    { name: 'onBlur', description: 'Fires when the toggle loses focus.', payload: 'FocusEvent' },
  ],
};
