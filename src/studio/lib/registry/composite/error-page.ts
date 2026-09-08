import type { ComponentDef } from '../../types';

export const errorPageDef: ComponentDef = {
  id: 'error-page',
  name: 'Error Page',
  category: 'Composite',
  description: 'Centered error / not-found layout — code, title, message, and action buttons.',
  styleProperties: [
    { key: 'codeSize', label: 'Code Size', control: 'number', defaultValue: 88, min: 48, max: 160, step: 4, unit: 'px' },
    { key: 'codeColor', label: 'Code Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'colors' },
    { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 24, min: 16, max: 40, step: 1, unit: 'px' },
    { key: 'titleColor', label: 'Title Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
    { key: 'messageSize', label: 'Message Size', control: 'number', defaultValue: 14, min: 11, max: 20, step: 1, unit: 'px' },
    { key: 'messageColor', label: 'Message Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    { key: 'iconBg', label: 'Icon Tile Bg', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'colors' },
    { key: 'iconColor', label: 'Icon Tile Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
    { key: 'iconSize', label: 'Icon Tile Size', control: 'number', defaultValue: 56, min: 32, max: 96, step: 4, unit: 'px' },
    { key: 'messageMaxWidth', label: 'Message Max Width', control: 'number', defaultValue: 448, min: 240, max: 720, step: 8, unit: 'px' },
  ],
  layoutVariants: [
    {
      key: 'variant',
      label: 'Variant',
      options: [
        { value: '404', label: '404 — Not Found' },
        { value: '500', label: '500 — Server Error' },
        { value: 'empty', label: 'Empty / Generic' },
      ],
      defaultValue: '404',
    },
  ],
};
