import type { ComponentDef } from '../../types';

export const sidebarNavItemDef: ComponentDef = {
  id: 'sidebar-nav-item',
  name: 'Sidebar Nav Item',
  category: 'Composite',
  description: 'Icon + label row used in the left navigation. State knobs cover default / hover / focus / active / disabled across the row — the active state is the currently-selected nav item (renders with `aria-current="page"`). Icon tile and sizing are shared across every state.',
  styleProperties: [
    // ── Per-state row colors. Filtered into a single "States" section
    // by the State variant. Each state owns both bg and text knobs
    // (the row is opaque enough that bg matters). Focus is the
    // exception — text knob plus the standalone ring.
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
    // ── Shared sizing (applies to every state)
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
    { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
    { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 16, step: 1, unit: 'px' },
    { key: 'gap', label: 'Icon Gap', control: 'number', defaultValue: 10, min: 4, max: 20, step: 1, unit: 'px' },
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 11, max: 18, step: 1, unit: 'px' },
    { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600', '700'] },
    // ── Icon tile (sub-element, shared across every state)
    { key: 'iconBg', label: 'Icon Tile Bg', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'icon' },
    { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'icon' },
    { key: 'iconBoxSize', label: 'Icon Tile Size', control: 'number', defaultValue: 24, min: 16, max: 36, step: 2, unit: 'px', section: 'icon' },
    { key: 'iconRadius', label: 'Icon Tile Radius', control: 'slider', defaultValue: 6, min: 0, max: 12, step: 1, unit: 'px', section: 'icon' },
    { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 14, min: 10, max: 24, step: 1, unit: 'px', section: 'icon' },
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
    {
      // Persistent badge slot demo — the preview renders a sample marker
      // (a checkmark or a count pill) in the always-visible `badge` slot so
      // its look can be verified next to the hover-reveal trailing slot.
      key: 'badge',
      label: 'Badge',
      options: [
        { value: 'off', label: 'Off' },
        { value: 'check', label: 'Checkmark' },
        { value: 'count', label: 'Count' },
      ],
      defaultValue: 'off',
    },
  ],
  events: [
    { name: 'onClick', description: 'Fires when the user clicks the nav item (or activates it via Enter).', payload: 'MouseEvent' },
  ],
};
