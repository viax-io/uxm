import type { ComponentDef } from '../../types';

export const propertyFieldDef: ComponentDef = {
  id: 'property-field',
  name: 'Property Field',
  category: 'Display',
  description: 'Single label + monospace value pair used for metadata readouts. The grid layout that arranges multiple PropertyFields is a separate atom (`property-grid`).',
  styleProperties: [
    { key: 'labelColor', label: 'Label Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    { key: 'labelSize', label: 'Label Size', control: 'number', defaultValue: 10, min: 9, max: 14, step: 1, unit: 'px' },
    { key: 'valueColor', label: 'Value Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
    { key: 'valueSize', label: 'Value Size', control: 'number', defaultValue: 13, min: 11, max: 18, step: 1, unit: 'px' },
    { key: 'gap', label: 'Label/Value Gap', control: 'number', defaultValue: 4, min: 2, max: 12, step: 1, unit: 'px' },
  ],
  layoutVariants: [
    // Label case + value font as guided presets. The preview maps each to the
    // `--uxm-property-field-label-transform` / `-label-tracking` / `-value-font`
    // vars: uppercase carries 0.06em tracking (the "eyebrow" look), sentence
    // drops both to none/normal; monospace is the data look, proportional is
    // the body typeface (for prose grids). Defaults reproduce today.
    {
      key: 'labelCase',
      label: 'Label Case',
      options: [
        { value: 'uppercase', label: 'Uppercase' },
        { value: 'sentence', label: 'Sentence' },
      ],
      defaultValue: 'uppercase',
    },
    {
      key: 'valueFont',
      label: 'Value Font',
      options: [
        { value: 'monospace', label: 'Monospace' },
        { value: 'proportional', label: 'Proportional' },
      ],
      defaultValue: 'monospace',
    },
  ],
};
