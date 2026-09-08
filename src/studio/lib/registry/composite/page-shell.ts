import type { ComponentDef } from '../../types';

export const pageShellDef: ComponentDef = {
  id: 'page-shell',
  name: 'Page Shell',
  category: 'Composite',
  description:
    'Top-level page layout — sidebar + (optional) top bar + content. Two variants drive the chrome: standard (full chrome, padded content) and canvas (no top bar, full-bleed content for diagrams/lifecycle).',
  styleProperties: [
    { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'colors' },
    { key: 'contentPadding', label: 'Content Padding', control: 'number', defaultValue: 32, min: 0, max: 64, step: 4, unit: 'px' },
  ],
  layoutVariants: [
    {
      key: 'variant',
      label: 'Variant',
      options: [
        { value: 'standard', label: 'Standard' },
        { value: 'canvas', label: 'Canvas' },
      ],
      defaultValue: 'standard',
    },
  ],
};
