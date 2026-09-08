import type { ComponentDef } from '../../types';

export const pageHeaderDef: ComponentDef = {
  id: 'page-header',
  name: 'Page Header',
  category: 'Composite',
  description: 'Icon + title + meta text with trailing action buttons.',
  styleProperties: [
    { key: 'titleColor', label: 'Title Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
    { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 22, min: 16, max: 32, step: 1, unit: 'px' },
    { key: 'metaColor', label: 'Meta Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    { key: 'metaSize', label: 'Meta Size', control: 'number', defaultValue: 13, min: 11, max: 18, step: 1, unit: 'px' },
    { key: 'iconBg', label: 'Icon Bg', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'colors' },
    { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
    { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 40, min: 24, max: 64, step: 4, unit: 'px' },
    { key: 'gap', label: 'Gap', control: 'number', defaultValue: 16, min: 6, max: 32, step: 2, unit: 'px' },
    { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 0, min: 0, max: 40, step: 2, unit: 'px' },
    { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 0, min: 0, max: 32, step: 2, unit: 'px' },
  ],
  layoutVariants: [],
};
