import type { ComponentDef } from '../../types';

export const breadcrumbDef: ComponentDef = {
  id: 'breadcrumb',
  name: 'Breadcrumb',
  category: 'Composite',
  description: 'Path navigation — clickable link crumbs leading to the current page, with configurable separators (chevron / slash / dot / dash). State knobs cover default / hover / focus / active / disabled. The `active` state is the current page styling — the trailing non-clickable crumb that marks where the user is. Clicking a link crumb truncates the path so that crumb becomes the new active.',
  styleProperties: [
    // ── Per-state link crumb colors. Filtered into a single "States"
    // section by the State variant. Links are transparent in every state
    // (the breadcrumb itself has no background) — just text colors plus
    // the standalone focus ring, disabled opacity, and the active-state
    // font weight (the current page is traditionally bolder).
    { key: 'inactiveText', label: 'Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
    { key: 'hoverText', label: 'Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
    { key: 'focusText', label: 'Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
    { key: 'activeText', label: 'Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'active' } },
    { key: 'activeFontWeight', label: 'Font Weight', control: 'select', defaultValue: '600', options: ['400', '500', '600', '700'], section: 'states', showWhen: { state: 'active' } },
    { key: 'disabledText', label: 'Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'states', showWhen: { state: 'disabled' } },
    { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
    // ── Separator (between crumbs)
    { key: 'separatorColor', label: 'Separator Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'separator' },
    { key: 'separatorSize', label: 'Separator Size', control: 'number', defaultValue: 13, min: 8, max: 20, step: 1, unit: 'px', section: 'separator' },
    // ── Shared sizing + underline (applies across every state)
    { key: 'linkWeight', label: 'Link Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600', '700'] },
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px' },
    { key: 'gap', label: 'Gap', control: 'number', defaultValue: 6, min: 2, max: 16, step: 1, unit: 'px' },
    { key: 'underlineOffset', label: 'Underline Offset', control: 'number', defaultValue: 3, min: 1, max: 8, step: 1, unit: 'px' },
    { key: 'underlineThickness', label: 'Underline Thickness', control: 'number', defaultValue: 1, min: 1, max: 3, step: 1, unit: 'px' },
  ],
  layoutVariants: [
    {
      key: 'state',
      label: 'State',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'hover', label: 'Hover' },
        { value: 'focus', label: 'Focus' },
        { value: 'active', label: 'Active' },
        { value: 'disabled', label: 'Disabled' },
      ],
      defaultValue: 'default',
    },
    {
      key: 'separator',
      label: 'Separator',
      options: [
        { value: 'chevron', label: 'Chevron' },
        { value: 'slash', label: 'Slash' },
        { value: 'dot', label: 'Dot' },
        { value: 'dash', label: 'Dash' },
      ],
      defaultValue: 'chevron',
    },
  ],
};
