import type { ComponentDef } from '../../types';

export const formMultirowDef: ComponentDef = {
  id: 'form-multirow',
  name: 'Multi-Row Form',
  category: 'Composite',
  description: "Multi-section form with two-column rows. Composes FormField + TextInput / Select / Textarea; input theming flows through the input atoms' registries, label theming through FormField's. Always renders top labels — side labels + multi-section is a cramped combination and adds no signal worth exposing.",
  styleProperties: [
    // Form card shape + section/field spacing only. `inputRadius` is
    // gone (TextInput owns its own border-radius); `borderColor` is
    // now exclusively the form card outline.
    { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
    { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 12, min: 0, max: 24, step: 1, unit: 'px' },
    { key: 'padding', label: 'Padding', control: 'number', defaultValue: 32, min: 16, max: 48, step: 4, unit: 'px' },
    { key: 'fieldGap', label: 'Field Gap', control: 'number', defaultValue: 20, min: 8, max: 40, step: 4, unit: 'px' },
    { key: 'sectionGap', label: 'Section Gap', control: 'number', defaultValue: 32, min: 16, max: 48, step: 4, unit: 'px' },
  ],
  layoutVariants: [
    {
      key: 'columns',
      label: 'Columns',
      options: [
        { value: '1', label: 'Single' },
        { value: '2', label: 'Two Column' },
      ],
      defaultValue: '2',
    },
  ],
};
