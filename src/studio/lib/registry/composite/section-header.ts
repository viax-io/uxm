import type { ComponentDef } from '../../types';

export const sectionHeaderDef: ComponentDef = {
  id: 'section-header',
  name: 'Section Header',
  category: 'Display',
  description: 'Small uppercase label for grouping fields in dense settings panels — the "VARIANT" / "COLORS" / "STYLE" labels above grouped form rows. Distinct from PageHeader (page-level) and DetailSection (bordered card).',
  styleProperties: [
    { key: 'titleColor', label: 'Title Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'colors' },
    { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px' },
    { key: 'titleWeight', label: 'Title Weight', control: 'select', defaultValue: '600', options: ['500', '600', '700'] },
    { key: 'subtitleColor', label: 'Subtitle Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    { key: 'subtitleSize', label: 'Subtitle Size', control: 'number', defaultValue: 10, min: 9, max: 14, step: 1, unit: 'px' },
    { key: 'gap', label: 'Title-Subtitle Gap', control: 'number', defaultValue: 2, min: 0, max: 12, step: 1, unit: 'px' },
    { key: 'marginBottom', label: 'Margin Bottom', control: 'number', defaultValue: 12, min: 0, max: 32, step: 2, unit: 'px' },
  ],
  layoutVariants: [],
};
