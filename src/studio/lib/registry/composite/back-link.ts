import type { ComponentDef } from '../../types';

export const backLinkDef: ComponentDef = {
  id: 'back-link',
  name: 'Back Link',
  category: 'Display',
  description: 'Inline text link with leading arrow for breadcrumb navigation.',
  styleProperties: [
    // Text-only navigation link — text color changes per state.
    { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
    { key: 'hoverColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
    { key: 'activeColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'active' } },
    { key: 'focusRingColor', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'focus' } },
    { key: 'focusColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'states', showWhen: { state: 'disabled' } },
    { key: 'disabledColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
    // Shared style
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px' },
    { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'] },
    { key: 'gap', label: 'Icon Gap', control: 'number', defaultValue: 6, min: 2, max: 16, step: 1, unit: 'px' },
  ],
  layoutVariants: [
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
    { name: 'onClick', description: "Fires on click. The consumer's router or `href` handles the navigation.", payload: 'MouseEvent<HTMLAnchorElement>' },
  ],
};
