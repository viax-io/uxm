import { ICON_OPTIONS } from '@/ui';

import type { ComponentDef } from '../types';

export const iconsDefs: ComponentDef[] = [
  // ── Icons ──
  {
    id: 'icon',
    name: 'Icon',
    category: 'Icons',
    description: 'Decorative line icon. Pick a glyph from the modo icon set, then tune size / stroke / colour.',
    styleProperties: [
      { key: 'color', label: 'Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'size', label: 'Size', control: 'number', defaultValue: 20, min: 10, max: 48, step: 1, unit: 'px' },
      { key: 'strokeWidth', label: 'Stroke Width', control: 'slider', defaultValue: 1.5, min: 0.5, max: 3, step: 0.25, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'glyph',
        label: 'Glyph',
        options: ICON_OPTIONS,
        defaultValue: 'search',
      },
    ],
  },
  {
    id: 'icon-button',
    name: 'Icon Button',
    category: 'Buttons',
    description: 'Utility icon-only button used inside other components (close, edit, delete, kebab, etc.). Full state coverage parity with the rest of the button family.',
    styleProperties: [
      // State-scoped colors — Tag-style filter via showWhen.
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'default' } },
      { key: 'color', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
      { key: 'hoverBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'activeBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'active' } },
      { key: 'focusRingColor', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'focusColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'states', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
      // Shared style
      { key: 'size', label: 'Button Size', control: 'number', defaultValue: 32, min: 20, max: 48, step: 2, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 10, max: 28, step: 1, unit: 'px' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'strokeWidth', label: 'Stroke Width', control: 'slider', defaultValue: 1.75, min: 0.5, max: 3, step: 0.25, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'glyph',
        label: 'Glyph',
        options: ICON_OPTIONS,
        defaultValue: 'close',
      },
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'active', label: 'Pressed' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onClick', description: 'Fires on mouse click or Enter/Space activation while focused.', payload: 'MouseEvent<HTMLButtonElement>' },
      { name: 'onFocus', description: 'Fires when the button receives keyboard focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the button loses keyboard focus.', payload: 'FocusEvent' },
    ],
  },
];
