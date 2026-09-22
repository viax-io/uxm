import type { ComponentDef } from '../../types';

export const radioGroupDef: ComponentDef = {
  id: 'radio-group',
  name: 'Radio Group',
  category: 'Inputs',
  description: 'Radio button group with multiple options. State knobs cover unselected × selected across default / hover, plus shared focus ring and disabled opacity.',
  styleProperties: [
    // Default — unselected
    { key: 'unselectedBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'unselectedColors', showWhen: { state: 'default' } },
    { key: 'unselectedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'unselectedColors', showWhen: { state: 'default' } },
    // Default — selected
    { key: 'selectedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'selectedColors', showWhen: { state: 'default' } },
    { key: 'dotColor', label: 'Dot', control: 'color', defaultValue: 'var(--color-accent)', section: 'selectedColors', showWhen: { state: 'default' } },
    // Hover — unselected
    { key: 'hoverUnselectedBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'unselectedColors', showWhen: { state: 'hover' } },
    // text-strong, not text-muted: muted is 2.54:1 on card in light — under the 3:1 UI floor (Principle IV)
    { key: 'hoverUnselectedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'unselectedColors', showWhen: { state: 'hover' } },
    // Hover — selected
    { key: 'hoverSelectedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'selectedColors', showWhen: { state: 'hover' } },
    { key: 'hoverDotColor', label: 'Dot', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'selectedColors', showWhen: { state: 'hover' } },
    // Focus — single shared ring color
    { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
    // Disabled — shared opacity
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
    // Shared — always visible
    { key: 'size', label: 'Size', control: 'number', defaultValue: 20, min: 14, max: 32, step: 2, unit: 'px' },
    { key: 'gap', label: 'Item Gap', control: 'number', defaultValue: 16, min: 4, max: 32, step: 4, unit: 'px' },
    // Error — the circles + option labels stay neutral; the group message
    // below is the sole signal (errorColor colors it, errorMessageSize sizes it).
    { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
    { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
    // Card presentation — geometry only. The frame, hover and focus colours
    // come from the shared `--uxm-radio-group-*` vars the row already uses, so
    // a theme cannot drift between the two presentations.
    { key: 'cardPadding', label: 'Padding', control: 'number', defaultValue: 12, min: 4, max: 32, step: 2, unit: 'px', section: 'card', showWhen: { variant: 'card' } },
    { key: 'cardRadius', label: 'Radius', control: 'slider', defaultValue: 8, min: 0, max: 20, step: 1, unit: 'px', section: 'card', showWhen: { variant: 'card' } },
    { key: 'cardGap', label: 'Content Gap', control: 'number', defaultValue: 4, min: 0, max: 16, step: 1, unit: 'px', section: 'card', showWhen: { variant: 'card' } },
    { key: 'cardBorderWidth', label: 'Border Width', control: 'number', defaultValue: 1, min: 1, max: 4, step: 1, unit: 'px', section: 'card', showWhen: { variant: 'card' } },
    { key: 'cardBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'card', showWhen: { variant: 'card' } },
  ],
  layoutVariants: [
    {
      key: 'state',
      label: 'State',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'hover', label: 'Hover' },
        { value: 'focus', label: 'Focus' },
        { value: 'disabled', label: 'Disabled' },
        { value: 'error', label: 'Error' },
      ],
      defaultValue: 'default',
    },
    {
      // Presentation, not state: `card` swaps the option from a
      // `[circle] label` row to a selectable tile. Every colour it paints
      // resolves through the same `--uxm-radio-group-*` vars the row uses, so
      // the States picker above keeps meaning what it means in both.
      key: 'variant',
      label: 'Presentation',
      options: [
        { value: 'default', label: 'Row' },
        { value: 'card', label: 'Card' },
      ],
      defaultValue: 'default',
    },
    {
      key: 'indicator',
      label: 'Indicator',
      options: [
        { value: 'hidden', label: 'Frame only' },
        { value: 'corner', label: 'Corner dot' },
      ],
      defaultValue: 'hidden',
      // Meaningless on a row, where the circle IS the control.
      showWhen: { variant: 'card' },
    },
    {
      key: 'direction',
      label: 'Direction',
      options: [
        { value: 'vertical', label: 'Vertical' },
        { value: 'horizontal', label: 'Horizontal' },
      ],
      defaultValue: 'vertical',
    },
  ],
  events: [
    { name: 'onChange', description: 'Fires when the user picks a different radio option.', payload: '{ value: string }' },
  ],
};
