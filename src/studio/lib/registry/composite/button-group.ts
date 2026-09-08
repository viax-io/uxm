import type { ComponentDef } from '../../types';

export const buttonGroupDef: ComponentDef = {
  id: 'button-group',
  name: 'Button Group',
  category: 'Composite',
  description: 'Segmented button group with connected buttons. State knobs cover default / hover / focus / active / disabled across the individual button — the connecting border and outer frame are shared.',
  styleProperties: [
    // ── Frame (shared across all states — the connecting borders and
    // outer rounded frame define the group as a single unit)
    { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'frame' },
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 20, step: 1, unit: 'px', section: 'frame' },
    // ── Per-state colors (filtered by State variant). Unlike the other
    // segmented atoms, each button has its own non-transparent bg so
    // every state owns both bg and text.
    { key: 'inactiveBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'states', showWhen: { state: 'default' } },
    { key: 'inactiveText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
    { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'states', showWhen: { state: 'hover' } },
    { key: 'hoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
    { key: 'focusText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
    { key: 'activeBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'states', showWhen: { state: 'active' } },
    { key: 'activeText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'active' } },
    { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'states', showWhen: { state: 'disabled' } },
    { key: 'disabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
    // Focus ring + disabled opacity in their own sections.
    { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
    // ── Shared sizing (applies to every button state)
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px' },
    { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 16, min: 8, max: 32, step: 2, unit: 'px' },
    { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 8, min: 4, max: 16, step: 2, unit: 'px' },
  ],
  layoutVariants: [
    {
      key: 'state',
      label: 'State',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'hover', label: 'Hover' },
        { value: 'focus', label: 'Focus' },
        { value: 'active', label: 'Active' },
        { value: 'disabled', label: 'Disabled' },
      ],
      defaultValue: 'default',
    },
  ],
  events: [
    { name: 'onChange', description: 'Fires when the user picks a different option.', payload: '{ value: string }' },
  ],
};
