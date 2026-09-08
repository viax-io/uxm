import type { ComponentDef } from '../../types';

export const sideFlexpaneDef: ComponentDef = {
  id: 'side-flexpane',
  name: 'Side Flexpane',
  category: 'Composite',
  description: 'Right-sliding edit panel with header, scrollable body, and footer actions.',
  styleProperties: [
    { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
    { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 0, min: 0, max: 20, step: 1, unit: 'px' },
    { key: 'width', label: 'Width', control: 'number', defaultValue: 380, min: 280, max: 520, step: 20, unit: 'px' },
    { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 24, min: 12, max: 40, step: 2, unit: 'px' },
    { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 16, min: 8, max: 32, step: 2, unit: 'px' },
    { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 16, min: 13, max: 22, step: 1, unit: 'px' },
    { key: 'labelColor', label: 'Label Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
  ],
  layoutVariants: [],
  events: [
    { name: 'onClose', description: 'Fires when the user dismisses the flexpane via the close affordance or backdrop click.', payload: 'void' },
    { name: 'onResize', description: 'Fires while the user drags the left-edge handle to resize. Final width on drag end.', payload: '{ width: number }' },
    { name: 'onBack', description: 'Fires when the user clicks the back-link bar (rendered only when `onBack` is set).', payload: 'void' },
    { name: 'onExpandedChange', description: 'Fires with the next expanded state when the maximize toggle is clicked (`expandable`).', payload: '{ expanded: boolean }' },
  ],
};
