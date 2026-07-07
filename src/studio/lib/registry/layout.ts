import type { ComponentDef } from '../types';

export const layoutDefs: ComponentDef[] = [
  // ── Layout ──
  // Boring building blocks for page composition. No colour, no chrome —
  // these encode "items, related, with a consistent rhythm" so page
  // authors and AI page-generation pipelines don't pick gap values
  // ad-hoc. The editor knobs theme the gap rhythm globally.
  {
    id: 'responsive-grid',
    name: 'Responsive Grid',
    category: 'Layout',
    description: "Auto-fit grid that wraps children based on a minimum column width. Adapts to its container's width without media queries — same instance lays out as 4-up in a wide pane and 1-up in a narrow drawer.",
    styleProperties: [
      { key: 'min', label: 'Min Column Width', control: 'text', defaultValue: '200px' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 16, min: 0, max: 48, step: 2, unit: 'px' },
    ],
    layoutVariants: [],
    canvasBackground: false,
  },
  {
    id: 'stack',
    name: 'Stack',
    category: 'Layout',
    description: 'Vertical flex column with a consistent gap. The boring building block that replaces ad-hoc div soup in page layouts.',
    styleProperties: [
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 16, min: 0, max: 48, step: 2, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'align',
        label: 'Align',
        options: [
          { value: 'stretch', label: 'Stretch' },
          { value: 'start', label: 'Start' },
          { value: 'center', label: 'Center' },
          { value: 'end', label: 'End' },
        ],
        defaultValue: 'stretch',
      },
    ],
    canvasBackground: false,
  },
  {
    id: 'cluster',
    name: 'Cluster',
    category: 'Layout',
    description: "Horizontal row that wraps when there's not enough room — tag lists, filter chips, button rows. Wrap-friendly by design.",
    styleProperties: [
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 12, min: 0, max: 32, step: 2, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'align',
        label: 'Align',
        options: [
          { value: 'center', label: 'Center' },
          { value: 'start', label: 'Start' },
          { value: 'end', label: 'End' },
          { value: 'baseline', label: 'Baseline' },
        ],
        defaultValue: 'center',
      },
      {
        key: 'justify',
        label: 'Justify',
        options: [
          { value: 'start', label: 'Start' },
          { value: 'center', label: 'Center' },
          { value: 'end', label: 'End' },
          { value: 'between', label: 'Space Between' },
        ],
        defaultValue: 'start',
      },
    ],
    canvasBackground: false,
  },
];
