import type { ComponentDef } from '../../types';

export const contentTooltipDef: ComponentDef = {
  id: 'content-tooltip',
  name: 'Content Tooltip',
  category: 'Composite',
  description: 'Rich tooltip with title, description, and action.',
  styleProperties: [
    { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
    { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 12, min: 0, max: 20, step: 1, unit: 'px' },
    { key: 'padding', label: 'Padding', control: 'number', defaultValue: 16, min: 8, max: 32, step: 4, unit: 'px' },
    { key: 'shadow', label: 'Shadow', control: 'toggle', defaultValue: true },
    { key: 'maxWidth', label: 'Max Width', control: 'number', defaultValue: 280, min: 180, max: 400, step: 20, unit: 'px' },
    { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 14, min: 11, max: 18, step: 1, unit: 'px' },
  ],
  layoutVariants: [],
};
