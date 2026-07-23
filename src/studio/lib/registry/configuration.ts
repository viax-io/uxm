import type { ComponentDef } from '../types';

// ── Configuration ──
// The building blocks of a Configuration model's segment tree, mirroring the
// v1 config-builder set: SegmentRow (header) + SegmentCard (container that
// wraps a nested segment) + ComponentRow (leaf field) + OptionList (options
// under a Predefined-Options component). Compose a tree as SegmentCard(header:
// SegmentRow) › ComponentRow(s) + OptionList, with nested SegmentCards inside.
export const configurationDefs: ComponentDef[] = [
  {
    id: 'segment-row',
    name: 'Segment Row',
    category: 'Configuration',
    description:
      'Header row of a configuration segment — drag handle, expand chevron, accent line, name, count badge. Used at every depth; indent is owned by the wrapping SegmentCard.',
    styleProperties: [
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 16, min: 0, max: 32, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 20, min: 4, max: 32, step: 2, unit: 'px' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 8, min: 0, max: 24, step: 2, unit: 'px' },
      { key: 'dragColor', label: 'Drag Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'colors' },
      { key: 'dragHoverColor', label: 'Drag Hover', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'chevronColor', label: 'Chevron Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'chevronSize', label: 'Chevron Size', control: 'number', defaultValue: 16, min: 10, max: 24, step: 1, unit: 'px' },
      { key: 'accentColor', label: 'Accent Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
      { key: 'accentWidth', label: 'Accent Width', control: 'number', defaultValue: 4, min: 1, max: 8, step: 1, unit: 'px' },
      { key: 'accentRadius', label: 'Accent Radius', control: 'slider', defaultValue: 2, min: 0, max: 8, step: 1, unit: 'px' },
      { key: 'titleColor', label: 'Title Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 16, min: 12, max: 22, step: 1, unit: 'px' },
      { key: 'titleWeight', label: 'Title Weight', control: 'number', defaultValue: 600, min: 400, max: 800, step: 100 },
      { key: 'countBg', label: 'Count Bg', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors' },
      { key: 'countColor', label: 'Count Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'countSize', label: 'Count Size', control: 'number', defaultValue: 12, min: 9, max: 16, step: 1, unit: 'px' },
      { key: 'countPaddingX', label: 'Count Padding X', control: 'number', defaultValue: 10, min: 4, max: 16, step: 1, unit: 'px' },
      { key: 'countPaddingY', label: 'Count Padding Y', control: 'number', defaultValue: 2, min: 0, max: 8, step: 1, unit: 'px' },
      { key: 'countRadius', label: 'Count Radius', control: 'slider', defaultValue: 999, min: 0, max: 999, step: 1, unit: 'px' },
      { key: 'rowHoverBg', label: 'Row Hover Bg', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-text) 4%, transparent)', section: 'colors' },
      { key: 'rowHoverRadius', label: 'Row Hover Radius', control: 'slider', defaultValue: 12, min: 0, max: 16, step: 1, unit: 'px' },
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
    ],
  },
  {
    id: 'segment-card',
    name: 'Segment Card',
    category: 'Configuration',
    description:
      'Bordered card wrapping a nested segment (depth ≥ 1): a SegmentRow header, a divider, and an inset body of child rows. Top-level segments render without this wrapper. The container that replaces the monolithic Segment Tree Row.',
    styleProperties: [
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderWidth', label: 'Border Width', control: 'number', defaultValue: 1, min: 0, max: 4, step: 1, unit: 'px' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 12, min: 0, max: 20, step: 1, unit: 'px' },
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 0, min: 0, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 0, min: 0, max: 24, step: 2, unit: 'px' },
      { key: 'childrenInsetX', label: 'Children Inset X', control: 'number', defaultValue: 16, min: 0, max: 32, step: 2, unit: 'px' },
      { key: 'childrenInsetY', label: 'Children Inset Y', control: 'number', defaultValue: 16, min: 0, max: 24, step: 2, unit: 'px' },
      { key: 'childrenGap', label: 'Children Gap', control: 'number', defaultValue: 4, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'dividerColor', label: 'Divider Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'dividerWidth', label: 'Divider Width', control: 'number', defaultValue: 1, min: 0, max: 4, step: 1, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'component-row',
    name: 'Component Row',
    category: 'Configuration',
    description:
      'A configuration component (field) row — drag, optional leading chevron (Predefined Options), type-icon badge, name, type label. Badge tint is per-type at runtime, not editor-controlled.',
    styleProperties: [
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 0, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 16, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 16, min: 0, max: 24, step: 1, unit: 'px' },
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'dragColor', label: 'Drag Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'colors' },
      { key: 'dragHoverColor', label: 'Drag Hover', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'iconBadgeSize', label: 'Icon Badge Size', control: 'number', defaultValue: 30, min: 24, max: 56, step: 2, unit: 'px' },
      { key: 'iconBadgeRadius', label: 'Icon Badge Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'iconBadgePadding', label: 'Icon Badge Padding', control: 'number', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'nameColor', label: 'Name Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'nameSize', label: 'Name Size', control: 'number', defaultValue: 15, min: 12, max: 20, step: 1, unit: 'px' },
      { key: 'nameWeight', label: 'Name Weight', control: 'number', defaultValue: 500, min: 400, max: 800, step: 100 },
      { key: 'typeLabelColor', label: 'Type Label Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'typeLabelSize', label: 'Type Label Size', control: 'number', defaultValue: 12, min: 9, max: 16, step: 1, unit: 'px' },
      { key: 'typeLabelWeight', label: 'Type Label Weight', control: 'number', defaultValue: 400, min: 400, max: 800, step: 100 },
      { key: 'chevronColor', label: 'Chevron Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'chevronSize', label: 'Chevron Size', control: 'number', defaultValue: 16, min: 10, max: 20, step: 1, unit: 'px' },
      { key: 'rowHoverBg', label: 'Row Hover Bg', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-text) 4%, transparent)', section: 'colors' },
      { key: 'rowHoverRadius', label: 'Row Hover Radius', control: 'slider', defaultValue: 12, min: 0, max: 16, step: 1, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'option-list',
    name: 'Option List',
    category: 'Configuration',
    description:
      'List of options nested under a "Predefined Options" component. Owns both the container and the per-row styling (paddings, drag handle, bullet, name). Bullet colour inherits from the parent component icon tint at runtime.',
    styleProperties: [
      // ── Container ──
      { key: 'indent', label: 'Indent', control: 'number', defaultValue: 38, min: 0, max: 160, step: 2, unit: 'px' },
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderWidth', label: 'Border Width', control: 'number', defaultValue: 1, min: 0, max: 4, step: 1, unit: 'px' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 8, min: 0, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 4, min: 0, max: 24, step: 2, unit: 'px' },
      { key: 'gap', label: 'Row Gap', control: 'number', defaultValue: 4, min: 0, max: 16, step: 1, unit: 'px' },
      // ── Row ──
      { key: 'rowPaddingX', label: 'Row Padding X', control: 'number', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px' },
      { key: 'rowPaddingY', label: 'Row Padding Y', control: 'number', defaultValue: 12, min: 4, max: 20, step: 1, unit: 'px' },
      { key: 'dragColor', label: 'Drag Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'colors' },
      { key: 'dragHoverColor', label: 'Drag Hover', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'bulletSize', label: 'Bullet Size', control: 'number', defaultValue: 6, min: 4, max: 12, step: 1, unit: 'px' },
      { key: 'bulletGap', label: 'Bullet→Name Gap', control: 'number', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'nameColor', label: 'Name Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'nameSize', label: 'Name Size', control: 'number', defaultValue: 14, min: 11, max: 18, step: 1, unit: 'px' },
      { key: 'nameWeight', label: 'Name Weight', control: 'number', defaultValue: 400, min: 400, max: 800, step: 100 },
      { key: 'rowHoverBg', label: 'Row Hover Bg', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-text) 4%, transparent)', section: 'colors' },
      { key: 'rowHoverRadius', label: 'Row Hover Radius', control: 'slider', defaultValue: 12, min: 0, max: 16, step: 1, unit: 'px' },
    ],
    layoutVariants: [],
  },
];
