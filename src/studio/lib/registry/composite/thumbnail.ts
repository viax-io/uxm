import type { ComponentDef } from '../../types';

export const thumbnailDef: ComponentDef = {
  id: 'thumbnail',
  name: 'Thumbnail',
  category: 'Display',
  description: 'Bounded image frame for product photos, file previews, and entity logos. Falls back to a placeholder icon when no image is provided.',
  styleProperties: [
    { key: 'size', label: 'Size', control: 'number', defaultValue: 48, min: 24, max: 120, step: 4, unit: 'px' },
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 12, min: 0, max: 60, step: 1, unit: 'px', section: 'colors' },
    { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
    { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
    { key: 'borderWidth', label: 'Border Width', control: 'number', defaultValue: 2, min: 0, max: 4, step: 1, unit: 'px' },
    { key: 'placeholderColor', label: 'Placeholder Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'colors' },
  ],
  layoutVariants: [
    {
      key: 'fit',
      label: 'Fit',
      options: [
        { value: 'cover', label: 'Cover' },
        { value: 'contain', label: 'Contain' },
      ],
      defaultValue: 'cover',
    },
    {
      key: 'state',
      label: 'State',
      options: [
        { value: 'image', label: 'With Image' },
        { value: 'placeholder', label: 'Placeholder' },
      ],
      defaultValue: 'image',
    },
  ],
};
