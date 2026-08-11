import type { ComponentDef } from '../types';

export const appDefs: ComponentDef[] = [
  // ── App ──
  {
    id: 'brand-settings',
    name: 'Brand Settings',
    category: 'App',
    description: 'Configure the Modo logo, sidebar icon, and primary font.',
    styleProperties: [],
    layoutVariants: [],
    canvasBackground: false,
  },
  {
    id: 'app-sidebar',
    name: 'App Sidebar',
    category: 'App',
    description: 'Left navigation: brand, sectioned nav items, optional footer, expand/collapse.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'expandedWidth', label: 'Expanded Width', control: 'number', defaultValue: 256, min: 200, max: 320, step: 4, unit: 'px' },
      { key: 'collapsedWidth', label: 'Collapsed Width', control: 'number', defaultValue: 64, min: 48, max: 96, step: 4, unit: 'px' },
      { key: 'headingColor', label: 'Section Heading', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'footerColor', label: 'Footer Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'expanded', label: 'Expanded' },
          { value: 'collapsed', label: 'Collapsed' },
        ],
        defaultValue: 'expanded',
      },
      {
        // Auto-assign a distinct icon colour per item from a categorical
        // palette (cycling) for scannability, vs the monochromatic default.
        key: 'autoIconColors',
        label: 'Auto Icon Colors',
        options: [
          { value: 'off', label: 'Off' },
          { value: 'on', label: 'On' },
        ],
        defaultValue: 'off',
      },
    ],
  },
  {
    id: 'app-top-bar',
    name: 'App Top Bar',
    category: 'App',
    description: 'Top header: search, mobile menu trigger, primary action, theme toggle, avatar slot.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-surface-alt) 50%, transparent)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'height', label: 'Height', control: 'number', defaultValue: 64, min: 48, max: 96, step: 4, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 16, min: 8, max: 32, step: 2, unit: 'px' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'searchMaxWidth', label: 'Search Max Width', control: 'number', defaultValue: 320, min: 160, max: 480, step: 8, unit: 'px' },
    ],
    layoutVariants: [],
  },
];
