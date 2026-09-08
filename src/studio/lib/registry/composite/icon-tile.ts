import type { ComponentDef } from '../../types';

export const iconTileDef: ComponentDef = {
  id: 'icon-tile',
  name: 'Icon Tile',
  category: 'Display',
  description: 'Small rounded square wrapping an icon with a colored background — the accent chip in front of row cards / list items / type entries.',
  styleProperties: [
    { key: 'size', label: 'Tile Size', control: 'number', defaultValue: 28, min: 16, max: 56, step: 2, unit: 'px' },
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 6, min: 0, max: 16, step: 1, unit: 'px' },
    { key: 'iconBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors' },
    { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 14, min: 10, max: 28, step: 1, unit: 'px' },
  ],
  layoutVariants: [],
};
