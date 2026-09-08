import type { ComponentDef } from '../../types';

export const propertyGridDef: ComponentDef = {
  id: 'property-grid',
  name: 'Property Grid',
  category: 'Display',
  description: "Auto-fill grid wrapper that lays out PropertyField pairs. Layout-only — chip / field theming flows through the PropertyField atom's own registry.",
  styleProperties: [
    { key: 'rowGap', label: 'Row Gap', control: 'number', defaultValue: 16, min: 4, max: 32, step: 2, unit: 'px' },
    { key: 'columnGap', label: 'Column Gap', control: 'number', defaultValue: 32, min: 12, max: 64, step: 4, unit: 'px' },
  ],
  layoutVariants: [],
};
