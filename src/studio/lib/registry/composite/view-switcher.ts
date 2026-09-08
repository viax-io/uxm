import type { ComponentDef } from '../../types';

export const viewSwitcherDef: ComponentDef = {
  id: 'view-switcher',
  name: 'View Switcher',
  category: 'Composite',
  description: 'Compact icon-only segmented control for toggling grid / list view. State knobs cover default / hover / focus / active / disabled across the individual icon button — the track surface is shared.',
  styleProperties: [
    // ── Track surface (shared across all states)
    { key: 'trackBg', label: 'Track Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'track' },
    { key: 'trackBorder', label: 'Track Border', control: 'color', defaultValue: 'var(--color-border)', section: 'track' },
    { key: 'trackRadius', label: 'Track Radius', control: 'slider', defaultValue: 8, min: 0, max: 99, step: 1, unit: 'px', section: 'track' },
    { key: 'trackPadding', label: 'Track Padding', control: 'number', defaultValue: 2, min: 0, max: 8, step: 1, unit: 'px', section: 'track' },
    { key: 'gap', label: 'Button Gap', control: 'number', defaultValue: 0, min: 0, max: 8, step: 1, unit: 'px', section: 'track' },
    // ── Per-state colors (filtered by State variant). Icon-only atom,
    // so the foreground knob is the icon color (CSS `color` driving
    // `currentColor` in the icon SVG).
    { key: 'inactiveIcon', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
    { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'states', showWhen: { state: 'hover' } },
    { key: 'hoverIcon', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
    { key: 'focusIcon', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
    { key: 'activeBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'states', showWhen: { state: 'active' } },
    { key: 'activeIcon', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'active' } },
    { key: 'disabledIcon', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
    // Focus ring + disabled opacity in their own sections.
    { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
    // ── Shared sizing (applies to every button state)
    { key: 'buttonSize', label: 'Button Size', control: 'number', defaultValue: 28, min: 20, max: 44, step: 2, unit: 'px' },
    { key: 'buttonRadius', label: 'Button Radius', control: 'slider', defaultValue: 6, min: 0, max: 99, step: 1, unit: 'px' },
    { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 12, max: 24, step: 1, unit: 'px' },
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
    { name: 'onChange', description: 'Fires when the user picks a different view.', payload: '{ value: string }' },
  ],
};
