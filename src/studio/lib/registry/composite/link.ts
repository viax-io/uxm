import type { ComponentDef } from '../../types';

export const linkDef: ComponentDef = {
  id: 'link',
  name: 'Link',
  category: 'Display',
  description: "Generic inline text link — three underline modes plus an optional external indicator. State knobs cover default / hover / focus / disabled on the anchor. `:active` is intentionally omitted — for a plain anchor it's the transient mouse-down pseudo and overlaps with hover semantically.",
  styleProperties: [
    // ── Per-state colors. Filtered into a single "States" section by
    // the State variant. Link is transparent in every state — no bg
    // knobs, just text colors plus the standalone focus ring and
    // disabled opacity.
    { key: 'inactiveText', label: 'Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'default' } },
    { key: 'hoverText', label: 'Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'hover' } },
    { key: 'focusText', label: 'Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'focus' } },
    { key: 'disabledText', label: 'Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
    { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
    // ── Shared typography + underline knobs (apply across every state)
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
    { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'] },
    { key: 'underlineOffset', label: 'Underline Offset', control: 'number', defaultValue: 3, min: 1, max: 8, step: 1, unit: 'px' },
    { key: 'underlineThickness', label: 'Underline Thickness', control: 'number', defaultValue: 1, min: 1, max: 3, step: 1, unit: 'px' },
    { key: 'externalIconSize', label: 'External Icon Size', control: 'number', defaultValue: 12, min: 8, max: 18, step: 1, unit: 'px' },
    { key: 'externalIconGap', label: 'External Icon Gap', control: 'number', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px' },
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
      key: 'underline',
      label: 'Underline',
      options: [
        { value: 'none', label: 'None' },
        { value: 'hover', label: 'On Hover' },
        { value: 'always', label: 'Always' },
      ],
      defaultValue: 'hover',
    },
    {
      key: 'external',
      label: 'External',
      options: [
        { value: 'false', label: 'Internal' },
        { value: 'true', label: 'External' },
      ],
      defaultValue: 'false',
    },
  ],
  events: [
    { name: 'onClick', description: "Fires on click. The consumer's router or `href` handles the navigation.", payload: 'MouseEvent<HTMLAnchorElement>' },
  ],
};
