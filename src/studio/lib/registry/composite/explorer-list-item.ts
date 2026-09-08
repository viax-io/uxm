import type { ComponentDef } from '../../types';

export const explorerListItemDef: ComponentDef = {
  id: 'explorer-list-item',
  name: 'Explorer List Item',
  category: 'Composite',
  description: "Component-explorer / file-tree row. State knobs cover default / hover / focus / active / disabled — the active state is the selected entry and shows a left rail (an accent bar) instead of a filled tile, distinguishing it from SidebarNavItem's icon-tile style.",
  styleProperties: [
    // ── Per-state row colors. Filtered into a single "States" section
    // by the State variant. Each state owns bg + text where relevant;
    // focus is the exception (text knob + standalone ring).
    { key: 'inactiveBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'default' } },
    { key: 'inactiveText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'states', showWhen: { state: 'default' } },
    { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-surface) 60%, transparent)', section: 'states', showWhen: { state: 'hover' } },
    { key: 'hoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
    { key: 'focusText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
    { key: 'activeBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'states', showWhen: { state: 'active' } },
    { key: 'activeText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'active' } },
    { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'disabled' } },
    { key: 'disabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
    // Focus ring + disabled opacity in their own sections.
    { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
    // Rail — the visual treatment of the active state. Scoped to the
    // active state so the knobs sit next to activeBg / activeText.
    { key: 'railColor', label: 'Rail Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'rail', showWhen: { state: 'active' } },
    { key: 'railWidth', label: 'Rail Width', control: 'number', defaultValue: 2, min: 1, max: 6, step: 1, unit: 'px', section: 'rail', showWhen: { state: 'active' } },
    { key: 'railHeight', label: 'Rail Height', control: 'number', defaultValue: 16, min: 8, max: 24, step: 2, unit: 'px', section: 'rail', showWhen: { state: 'active' } },
    { key: 'railRadius', label: 'Rail Radius', control: 'slider', defaultValue: 999, min: 0, max: 999, step: 1, unit: 'px', section: 'rail', showWhen: { state: 'active' } },
    // Trailing slot — shared across every state (always visible).
    { key: 'trailingColor', label: 'Trailing Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'trailing' },
    { key: 'trailingSize', label: 'Trailing Size', control: 'number', defaultValue: 10, min: 8, max: 14, step: 1, unit: 'px', section: 'trailing' },
    // ── Shared sizing (applies to every state)
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
    { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
    { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 8, min: 4, max: 16, step: 1, unit: 'px' },
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 11, max: 16, step: 1, unit: 'px' },
    { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'] },
    { key: 'gap', label: 'Gap', control: 'number', defaultValue: 8, min: 2, max: 16, step: 1, unit: 'px' },
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
    { name: 'onClick', description: 'Fires when the user clicks the row (selection or navigation).', payload: 'MouseEvent' },
  ],
};
