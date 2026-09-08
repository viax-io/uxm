import type { ComponentDef } from '../../types';

export const dividerDef: ComponentDef = {
  id: 'divider',
  name: 'Divider',
  category: 'Display',
  description: 'Horizontal rule, optionally with a centred label.',
  styleProperties: [
    { key: 'color', label: 'Line Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
    { key: 'thickness', label: 'Thickness', control: 'slider', defaultValue: 1, min: 1, max: 4, step: 1, unit: 'px' },
    { key: 'showLabel', label: 'Show Label', control: 'toggle', defaultValue: false },
    { key: 'labelColor', label: 'Label Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    { key: 'labelSize', label: 'Label Size', control: 'number', defaultValue: 10, min: 9, max: 14, step: 1, unit: 'px' },
    { key: 'gap', label: 'Label Gap', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
  ],
  layoutVariants: [],
};
