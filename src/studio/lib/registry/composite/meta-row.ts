import type { ComponentDef } from '../../types';

export const metaRowDef: ComponentDef = {
  id: 'meta-row',
  name: 'Meta Row',
  category: 'Display',
  description: 'Dot-separated metadata strip — "v1.2 · 3 days ago · Sarah" — used in card footers and list rows.',
  styleProperties: [
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px' },
    { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    { key: 'gap', label: 'Item Gap', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px' },
    { key: 'dotSize', label: 'Dot Size', control: 'number', defaultValue: 4, min: 2, max: 10, step: 1, unit: 'px' },
    { key: 'dotColor', label: 'Dot Color', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-text) 20%, transparent)', section: 'colors' },
  ],
  layoutVariants: [],
};
