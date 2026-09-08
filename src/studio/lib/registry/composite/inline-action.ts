import type { ComponentDef } from '../../types';

export const inlineActionDef: ComponentDef = {
  id: 'inline-action',
  name: 'Inline Action',
  category: 'Buttons',
  description: 'Tertiary text-with-optional-icon button for dense UI — "Reset section," "Match in N other," "Edit." Muted by default; transitions to accent on hover. Smaller and less prominent than ButtonGhost; used inline in section headers and field rows.',
  styleProperties: [
    // Text-only button: only icon color (well, text color) changes per state.
    { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
    { key: 'hoverColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'hover' } },
    { key: 'activeColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'active' } },
    { key: 'focusRingColor', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'focus' } },
    { key: 'focusColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'focus' } },
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'states', showWhen: { state: 'disabled' } },
    { key: 'disabledColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
    // Shared style
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 10, min: 9, max: 14, step: 1, unit: 'px' },
    { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'] },
    { key: 'gap', label: 'Icon Gap', control: 'number', defaultValue: 4, min: 2, max: 8, step: 1, unit: 'px' },
    { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 10, min: 8, max: 16, step: 1, unit: 'px' },
  ],
  layoutVariants: [
    {
      key: 'state',
      label: 'State',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'hover', label: 'Hover' },
        { value: 'active', label: 'Pressed' },
        { value: 'focus', label: 'Focus' },
        { value: 'disabled', label: 'Disabled' },
      ],
      defaultValue: 'default',
    },
  ],
  events: [
    { name: 'onClick', description: 'Fires on mouse click or Enter/Space activation.', payload: 'MouseEvent<HTMLButtonElement>' },
  ],
};
