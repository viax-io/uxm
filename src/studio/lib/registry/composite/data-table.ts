import type { ComponentDef } from '../../types';

export const dataTableDef: ComponentDef = {
  id: 'data-table',
  name: 'Data Table',
  category: 'Composite',
  description: 'Sortable data table with header, rows, and actions.',
  styleProperties: [
    { key: 'headerBg', label: 'Header Bg', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors' },
    { key: 'headerText', label: 'Header Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    { key: 'rowBg', label: 'Row Bg', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
    { key: 'rowHoverBg', label: 'Row Hover Bg', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors' },
    // Active row — the row whose detail is open beside the table. Only paints
    // when the consumer passes `activeRowId`.
    { key: 'rowActiveBg', label: 'Row Active Bg', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'colors' },
    { key: 'rowActiveRail', label: 'Row Active Rail', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
    { key: 'rowActiveHoverBg', label: 'Row Active Hover Bg', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'colors' },
    { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
    // Sortable-header colours. Only visible on a column with `sortKey`; a
    // table without sorting never paints these.
    { key: 'sortColor', label: 'Sort Header', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    { key: 'sortHoverColor', label: 'Sort Header Hover', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
    { key: 'sortActiveColor', label: 'Sort Header Active', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
    { key: 'sortFocusColor', label: 'Sort Header Focus', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
    { key: 'sortIconColor', label: 'Sort Glyph', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 11, max: 16, step: 1, unit: 'px' },
    { key: 'cellPaddingX', label: 'Cell Padding X', control: 'number', defaultValue: 12, min: 8, max: 24, step: 2, unit: 'px' },
    { key: 'cellPaddingY', label: 'Cell Padding Y', control: 'number', defaultValue: 12, min: 6, max: 20, step: 2, unit: 'px' },
  ],
  layoutVariants: [
    {
      key: 'density',
      label: 'Density',
      options: [
        { value: 'compact', label: 'Compact' },
        { value: 'default', label: 'Default' },
        { value: 'relaxed', label: 'Relaxed' },
      ],
      defaultValue: 'default',
    },
  ],
  events: [
    { name: 'onRowClick', description: 'Fires when the user clicks a row (not bubbled from clicks inside the row-actions cell).', payload: '{ row: T }' },
    { name: 'onCommit', description: 'Fires when an editable cell commits a new value — Enter or blur.', payload: '{ row: T, value: EditableCellValue }' },
  ],
};
