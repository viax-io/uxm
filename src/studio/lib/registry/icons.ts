import { ICON_OPTIONS } from '@/ui';

import type { ComponentDef } from '../types';

export const iconsDefs: ComponentDef[] = [
  // ── Icons ──
  {
    id: 'icon',
    name: 'Icon',
    category: 'Icons',
    description: 'Decorative line icon. Browse the full modo icon set as a searchable, labelled grid — each cell shows the glyph above the `id` you pass to `glyph=`. The size / stroke / colour knobs tune every icon at once.',
    // Gallery preview: fill the canvas width (flexible column count) and top-
    // align so the grid filters in place — nothing re-centres as the result
    // count changes.
    canvasFill: true,
    styleProperties: [
      { key: 'color', label: 'Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'size', label: 'Size', control: 'number', defaultValue: 20, min: 10, max: 48, step: 1, unit: 'px' },
      { key: 'strokeWidth', label: 'Stroke Width', control: 'slider', defaultValue: 1.5, min: 0.5, max: 3, step: 0.25, unit: 'px' },
    ],
    // No glyph picker: the preview renders the entire ICONS set as a grid, so
    // there's no single glyph to choose. (The icon-button entry below keeps its
    // glyph variant — it previews one button.)
    layoutVariants: [],
  },
  {
    id: 'icon-button',
    name: 'Icon Button',
    category: 'Buttons',
    description: 'Icon-only button. `ghost` (default) is the utility button used inside other components (close, edit, delete, kebab); `filled` is the standalone action (add, create) that replaces the deprecated Button — Icon atom. Full state coverage parity with the rest of the button family.',
    styleProperties: [
      // State-scoped colors — Tag-style filter via showWhen.
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { variant: 'ghost', state: 'default' } },
      { key: 'color', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { variant: 'ghost', state: 'default' } },
      { key: 'hoverBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'states', showWhen: { variant: 'ghost', state: 'hover' } },
      { key: 'hoverColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { variant: 'ghost', state: 'hover' } },
      { key: 'activeBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'states', showWhen: { variant: 'ghost', state: 'active' } },
      { key: 'activeColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { variant: 'ghost', state: 'active' } },
      { key: 'focusRingColor', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'focusColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'states', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
      // Shared style
      { key: 'size', label: 'Button Size', control: 'number', defaultValue: 32, min: 20, max: 48, step: 2, unit: 'px', showWhen: { variant: 'ghost' } },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 10, max: 28, step: 1, unit: 'px', showWhen: { variant: 'ghost' } },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px', showWhen: { variant: 'ghost' } },
      { key: 'strokeWidth', label: 'Stroke Width', control: 'slider', defaultValue: 1.75, min: 0.5, max: 3, step: 0.25, unit: 'px' },
      // `filled` variant — its own var set (`--uxm-icon-button-filled-*`), so a
      // saved ghost theme never leaks into the filled look. Defaults are the
      // deprecated ButtonIcon's, which this variant replaces.
      { key: 'filledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'states', showWhen: { variant: 'filled', state: 'default' } },
      { key: 'filledColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { variant: 'filled', state: 'default' } },
      { key: 'filledHoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'states', showWhen: { variant: 'filled', state: 'hover' } },
      { key: 'filledHoverColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { variant: 'filled', state: 'hover' } },
      { key: 'filledActiveBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { variant: 'filled', state: 'active' } },
      { key: 'filledActiveColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'states', showWhen: { variant: 'filled', state: 'active' } },
      { key: 'filledSize', label: 'Button Size', control: 'number', defaultValue: 40, min: 24, max: 64, step: 4, unit: 'px', showWhen: { variant: 'filled' } },
      { key: 'filledIconSize', label: 'Icon Size', control: 'number', defaultValue: 18, min: 10, max: 28, step: 1, unit: 'px', showWhen: { variant: 'filled' } },
      { key: 'filledRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px', showWhen: { variant: 'filled' } },
    ],
    layoutVariants: [
      {
        key: 'variant',
        label: 'Variant',
        options: [
          { value: 'ghost', label: 'Ghost' },
          { value: 'filled', label: 'Filled' },
        ],
        defaultValue: 'ghost',
      },
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
