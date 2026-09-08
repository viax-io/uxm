import type { ComponentDef } from '../../types';

export const filterTabsDef: ComponentDef = {
  id: 'filter-tabs',
  name: 'Filter Tabs',
  category: 'Composite',
  description: 'Segmented tab strip used for status filters like All / Active / Draft. State knobs cover default / hover / focus / active / disabled across the individual filter chip — the track surface is shared.',
  styleProperties: [
    // ── Track surface (shared across all states)
    { key: 'trackBg', label: 'Track Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'track' },
    { key: 'trackBorder', label: 'Track Border', control: 'color', defaultValue: 'var(--color-border)', section: 'track' },
    { key: 'trackRadius', label: 'Track Radius', control: 'slider', defaultValue: 8, min: 0, max: 99, step: 1, unit: 'px', section: 'track' },
    { key: 'trackPadding', label: 'Track Padding', control: 'number', defaultValue: 2, min: 0, max: 8, step: 1, unit: 'px', section: 'track' },
    { key: 'gap', label: 'Tab Gap', control: 'number', defaultValue: 0, min: 0, max: 8, step: 1, unit: 'px', section: 'track' },
    // ── Per-state colors (filtered by State variant)
    { key: 'inactiveText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
    { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'states', showWhen: { state: 'hover' } },
    { key: 'hoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
    { key: 'focusText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
    { key: 'activeBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'states', showWhen: { state: 'active' } },
    { key: 'activeText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'active' } },
    { key: 'disabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
    // Focus ring + disabled opacity in their own sections — standalone
    // treatments (ring outline / dimming) rather than fg/bg colors.
    { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
    // ── Shared sizing (applies to every chip state)
    { key: 'tabRadius', label: 'Tab Radius', control: 'slider', defaultValue: 6, min: 0, max: 99, step: 1, unit: 'px' },
    { key: 'paddingX', label: 'Tab Padding X', control: 'number', defaultValue: 12, min: 6, max: 24, step: 2, unit: 'px' },
    { key: 'paddingY', label: 'Tab Padding Y', control: 'number', defaultValue: 6, min: 2, max: 14, step: 1, unit: 'px' },
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px' },
    { key: 'fontWeight', label: 'Inactive Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'] },
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
    { name: 'onChange', description: 'Fires when the user picks a different filter.', payload: '{ value: string }' },
  ],
};
