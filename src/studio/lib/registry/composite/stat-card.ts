import type { ComponentDef } from '../../types';

export const statCardDef: ComponentDef = {
  id: 'stat-card',
  name: 'Stat Card',
  category: 'Composite',
  description: 'Metric card with value, label, and trend indicator.',
  styleProperties: [
    { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
    { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 20, step: 1, unit: 'px' },
    { key: 'padding', label: 'Padding', control: 'number', defaultValue: 24, min: 12, max: 40, step: 4, unit: 'px' },
    { key: 'valueSize', label: 'Value Size', control: 'number', defaultValue: 28, min: 18, max: 48, step: 2, unit: 'px' },
    { key: 'labelSize', label: 'Label Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px' },
    { key: 'trendUpColor', label: 'Trend Up', control: 'color', defaultValue: 'var(--color-success-text)', section: 'colors' },
    { key: 'trendDownColor', label: 'Trend Down', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'colors' },
  ],
  layoutVariants: [],
};
