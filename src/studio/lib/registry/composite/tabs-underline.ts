import type { ComponentDef } from '../../types';

export const tabsUnderlineDef: ComponentDef = {
  id: 'tabs-underline',
  name: 'Tabs — Underline',
  category: 'Composite',
  description: 'Page-nav tab strip — text labels with an animated underline bar under the active tab. State knobs cover default / hover / focus / active / disabled across the individual tab item — the track bottom rule and bar shape are shared.',
  styleProperties: [
    // ── Track surface (shared — just the bottom rule + tab spacing)
    { key: 'trackBorderColor', label: 'Track Border', control: 'color', defaultValue: 'var(--color-border)', section: 'track' },
    { key: 'trackBorderWidth', label: 'Track Border Width', control: 'number', defaultValue: 1, min: 0, max: 6, step: 1, unit: 'px', section: 'track' },
    { key: 'gap', label: 'Tab Gap', control: 'number', defaultValue: 4, min: 0, max: 16, step: 1, unit: 'px', section: 'track' },
    // ── Per-state tab colors. Mirrors the tabs atom shape: each state
    // owns its own text color, filtered into a single "States" section
    // by the State variant. Active also owns the underline bar color —
    // the bar is the active-state's defining visual.
    { key: 'inactiveText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
    { key: 'hoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
    { key: 'focusText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
    { key: 'activeText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'active' } },
    { key: 'barColor', label: 'Bar Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'active' } },
    { key: 'disabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
    // Focus ring + disabled opacity in their own sections — standalone
    // treatments (ring outline / dimming) rather than fg/bg colors.
    { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
    // ── Bar shape (structural — always defines what the bar looks like
    // when an active tab is rendered, so shared across states)
    { key: 'barHeight', label: 'Bar Height', control: 'number', defaultValue: 2, min: 1, max: 6, step: 1, unit: 'px' },
    { key: 'barRadius', label: 'Bar Radius', control: 'slider', defaultValue: 2, min: 0, max: 4, step: 1, unit: 'px' },
    // ── Shared sizing (applies to every tab state)
    { key: 'paddingX', label: 'Tab Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
    { key: 'paddingY', label: 'Tab Padding Y', control: 'number', defaultValue: 8, min: 4, max: 16, step: 1, unit: 'px' },
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 11, max: 16, step: 1, unit: 'px' },
    { key: 'fontWeight', label: 'Inactive Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'] },
    { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
    { key: 'iconGap', label: 'Icon Gap', control: 'number', defaultValue: 6, min: 2, max: 12, step: 1, unit: 'px' },
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
    { name: 'onChange', description: 'Fires when the user picks a different tab.', payload: '{ value: string }' },
  ],
};
