import type { ComponentDef } from '../../types';

export const badgeDef: ComponentDef = {
  id: 'badge',
  name: 'Badge',
  category: 'Display',
  description: 'Notification indicator. Dot mode shows a colored circle with an optional label; count mode shows a small pill with a number that clamps to 99+.',
  styleProperties: [
    // Per-tone colors. `bg` paints the badge; `text` only matters in count
    // mode (dot has no children). Gated by the `tone` variant so the
    // properties panel only shows the active tone's knobs.
    // Count mode reuses Tag's tonal vocabulary (soft `${type}-bg` paired
    // with bold `${type}-text`) so adjacent Badge counts and Tags read
    // as the same status family. Dot mode uses a single solid hue knob
    // (`${type}DotColor`) so the indicator stays a strong color blob —
    // splitting per-mode lets each default to the right token without
    // forcing one shared bg compromise.
    { key: 'accentBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'colors', showWhen: { type: 'accent', mode: 'count' } },
    { key: 'accentText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors', showWhen: { type: 'accent', mode: 'count' } },
    { key: 'accentDotColor', label: 'Dot Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors', showWhen: { type: 'accent', mode: 'dot' } },
    { key: 'successBg', label: 'Background', control: 'color', defaultValue: 'var(--color-success-bg)', section: 'colors', showWhen: { type: 'success', mode: 'count' } },
    { key: 'successText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-success-text)', section: 'colors', showWhen: { type: 'success', mode: 'count' } },
    { key: 'successDotColor', label: 'Dot Color', control: 'color', defaultValue: 'var(--color-success-text)', section: 'colors', showWhen: { type: 'success', mode: 'dot' } },
    { key: 'warningBg', label: 'Background', control: 'color', defaultValue: 'var(--color-warning-bg)', section: 'colors', showWhen: { type: 'warning', mode: 'count' } },
    { key: 'warningText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-warning-text)', section: 'colors', showWhen: { type: 'warning', mode: 'count' } },
    { key: 'warningDotColor', label: 'Dot Color', control: 'color', defaultValue: 'var(--color-warning-text)', section: 'colors', showWhen: { type: 'warning', mode: 'dot' } },
    { key: 'dangerBg', label: 'Background', control: 'color', defaultValue: 'var(--color-danger-bg)', section: 'colors', showWhen: { type: 'danger', mode: 'count' } },
    { key: 'dangerText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'colors', showWhen: { type: 'danger', mode: 'count' } },
    { key: 'dangerDotColor', label: 'Dot Color', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'colors', showWhen: { type: 'danger', mode: 'dot' } },
    { key: 'infoBg', label: 'Background', control: 'color', defaultValue: 'var(--color-info-bg)', section: 'colors', showWhen: { type: 'info', mode: 'count' } },
    { key: 'infoText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-info-text)', section: 'colors', showWhen: { type: 'info', mode: 'count' } },
    { key: 'infoDotColor', label: 'Dot Color', control: 'color', defaultValue: 'var(--color-info-text)', section: 'colors', showWhen: { type: 'info', mode: 'dot' } },
    { key: 'neutralBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors', showWhen: { type: 'neutral', mode: 'count' } },
    { key: 'neutralText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'colors', showWhen: { type: 'neutral', mode: 'count' } },
    { key: 'neutralDotColor', label: 'Dot Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors', showWhen: { type: 'neutral', mode: 'dot' } },
    // Dot mode — circle (always 50% radius) plus optional label knobs.
    // The dot is the `__dot` inner span; tone paints it. When children
    // are provided, the root becomes a flex row containing dot + label.
    { key: 'dotSize', label: 'Dot Size', control: 'number', defaultValue: 8, min: 4, max: 16, step: 1, unit: 'px', showWhen: { mode: 'dot' } },
    { key: 'labelFontSize', label: 'Label Font Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px', showWhen: { mode: 'dot' } },
    { key: 'labelFontWeight', label: 'Label Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600', '700'], showWhen: { mode: 'dot' } },
    { key: 'labelColor', label: 'Label Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors', showWhen: { mode: 'dot' } },
    { key: 'labelGap', label: 'Label Gap', control: 'number', defaultValue: 8, min: 2, max: 16, step: 1, unit: 'px', showWhen: { mode: 'dot' } },
    // Count mode — pill with min-width so single digits stay round.
    { key: 'countPaddingX', label: 'Padding X', control: 'number', defaultValue: 6, min: 2, max: 16, step: 1, unit: 'px', showWhen: { mode: 'count' } },
    { key: 'countPaddingY', label: 'Padding Y', control: 'number', defaultValue: 1, min: 0, max: 8, step: 1, unit: 'px', showWhen: { mode: 'count' } },
    { key: 'countMinWidth', label: 'Min Width', control: 'number', defaultValue: 18, min: 12, max: 36, step: 1, unit: 'px', showWhen: { mode: 'count' } },
    { key: 'countFontSize', label: 'Font Size', control: 'number', defaultValue: 11, min: 9, max: 16, step: 1, unit: 'px', showWhen: { mode: 'count' } },
    { key: 'countFontWeight', label: 'Font Weight', control: 'select', defaultValue: '600', options: ['400', '500', '600', '700'], showWhen: { mode: 'count' } },
    { key: 'countBorderRadius', label: 'Border Radius', control: 'number', defaultValue: 999, min: 0, max: 999, step: 1, unit: 'px', showWhen: { mode: 'count' } },
  ],
  layoutVariants: [
    {
      key: 'mode',
      label: 'Mode',
      options: [
        { value: 'dot', label: 'Dot' },
        { value: 'count', label: 'Count' },
      ],
      defaultValue: 'count',
    },
    {
      key: 'type',
      label: 'Type',
      options: [
        { value: 'accent', label: 'Accent' },
        { value: 'success', label: 'Success' },
        { value: 'warning', label: 'Warning' },
        { value: 'danger', label: 'Danger' },
        { value: 'info', label: 'Info' },
        { value: 'neutral', label: 'Neutral' },
      ],
      defaultValue: 'danger',
    },
  ],
};
