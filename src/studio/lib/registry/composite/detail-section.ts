import type { ComponentDef } from '../../types';

export const detailSectionDef: ComponentDef = {
  id: 'detail-section',
  name: 'Detail Section',
  category: 'Display',
  description: 'Card-like section with icon header, title/subtitle, and an accent rail.',
  styleProperties: [
    { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
    { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 4, min: 0, max: 20, step: 1, unit: 'px' },
    { key: 'padding', label: 'Padding', control: 'number', defaultValue: 20, min: 8, max: 40, step: 2, unit: 'px' },
    { key: 'iconBg', label: 'Icon Bg', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors' },
    { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 15, min: 12, max: 22, step: 1, unit: 'px' },
    { key: 'subtitleColor', label: 'Subtitle Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    { key: 'accentWidth', label: 'Accent Rail Width', control: 'slider', defaultValue: 3, min: 0, max: 8, step: 1, unit: 'px' },
    { key: 'accentColor', label: 'Accent Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'colors' },
  ],
  layoutVariants: [],
};
