import type { ComponentDef } from '../../types';

export const typeOverviewCardDef: ComponentDef = {
  id: 'type-overview-card',
  name: 'Type Overview Card',
  category: 'Composite',
  description: 'Dashboard summary tile — accent stripe, icon tile, label, count, hover affordance.',
  styleProperties: [
    { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
    { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 4, min: 0, max: 16, step: 1, unit: 'px' },
    { key: 'padding', label: 'Padding', control: 'number', defaultValue: 20, min: 12, max: 40, step: 2, unit: 'px' },
    { key: 'accentColor', label: 'Accent Stripe', control: 'color', defaultValue: 'var(--color-accent)', section: 'colors' },
    { key: 'accentWidth', label: 'Accent Width', control: 'number', defaultValue: 4, min: 2, max: 12, step: 1, unit: 'px' },
    { key: 'iconBg', label: 'Icon Tile Bg', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'colors' },
    { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
    { key: 'iconBoxSize', label: 'Icon Tile Size', control: 'number', defaultValue: 32, min: 24, max: 48, step: 2, unit: 'px' },
    { key: 'iconRadius', label: 'Icon Tile Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
    { key: 'labelSize', label: 'Label Size', control: 'number', defaultValue: 14, min: 11, max: 18, step: 1, unit: 'px' },
    { key: 'labelColor', label: 'Label Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'colors' },
    { key: 'valueSize', label: 'Value Size', control: 'number', defaultValue: 30, min: 20, max: 48, step: 2, unit: 'px' },
    { key: 'valueColor', label: 'Value Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
  ],
  layoutVariants: [],
};
