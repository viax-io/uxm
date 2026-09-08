import type { ComponentDef } from '../../types';

export const explorerSectionDef: ComponentDef = {
  id: 'explorer-section',
  name: 'Explorer Section',
  category: 'Composite',
  description: 'Disclosure-style section header for grouping rows in a navigation list. Chevron rotates with the open state; indicator slot is for category color dots etc. State knobs cover default / hover / focus / disabled. `active` is intentionally omitted — section headers have no selection concept; toggling drives the orthogonal `open` variant.',
  styleProperties: [
    // ── Per-state row colors. Filtered into the "States" section by
    // the State variant. The header is always a button, so all state
    // rules fire on the root selector. Disabled is a visual treatment
    // (dimmed, muted), not strictly an interaction state.
    { key: 'inactiveBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'default' } },
    { key: 'inactiveText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
    { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-surface) 40%, transparent)', section: 'states', showWhen: { state: 'hover' } },
    { key: 'hoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'states', showWhen: { state: 'hover' } },
    { key: 'focusText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'states', showWhen: { state: 'focus' } },
    { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'disabled' } },
    { key: 'disabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'states', showWhen: { state: 'disabled' } },
    // Focus ring + disabled opacity in their own sections.
    { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
    // ── Shared sizing (applies to every state)
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 6, min: 0, max: 12, step: 1, unit: 'px' },
    { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 8, min: 0, max: 24, step: 2, unit: 'px' },
    { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px' },
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px' },
    { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '600', options: ['500', '600', '700'] },
    { key: 'gap', label: 'Gap', control: 'number', defaultValue: 8, min: 2, max: 16, step: 1, unit: 'px' },
    // ── Chevron sub-element (shared across every state)
    { key: 'chevronColor', label: 'Chevron Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'chevron' },
    { key: 'chevronSize', label: 'Chevron Size', control: 'number', defaultValue: 12, min: 8, max: 18, step: 1, unit: 'px', section: 'chevron' },
    // ── Trailing sub-element (shared)
    { key: 'trailingColor', label: 'Trailing Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'trailing' },
    { key: 'trailingSize', label: 'Trailing Size', control: 'number', defaultValue: 10, min: 8, max: 14, step: 1, unit: 'px', section: 'trailing' },
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
      ],
      defaultValue: 'default',
    },
    {
      // `open` is orthogonal to interaction state — drives the
      // chevron rotation and `aria-expanded` on the atom.
      key: 'open',
      label: 'Open',
      options: [
        { value: 'true', label: 'Expanded' },
        { value: 'false', label: 'Collapsed' },
      ],
      defaultValue: 'true',
    },
  ],
  events: [
    { name: 'onToggle', description: 'Fires when the user clicks the section header to expand or collapse children.', payload: '{ open: boolean }' },
  ],
};
