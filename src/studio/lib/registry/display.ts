import type { ComponentDef } from '../types';

export const displayDefs: ComponentDef[] = [
  // ── Display ──
  {
    id: 'chip',
    name: 'Chip',
    category: 'Display',
    description: 'Interactive label — assist, filter, input, or suggestion mode via props. Material Design pattern.',
    styleProperties: [
      // Assist
      { key: 'assistDefaultBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors', showWhen: { mode: 'assist', state: 'default' } },
      { key: 'assistDefaultBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors', showWhen: { mode: 'assist', state: 'default' } },
      { key: 'assistDefaultText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors', showWhen: { mode: 'assist', state: 'default' } },
      { key: 'assistHoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors', showWhen: { mode: 'assist', state: 'hover' } },
      { key: 'assistHoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors', showWhen: { mode: 'assist', state: 'hover' } },
      { key: 'assistHoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors', showWhen: { mode: 'assist', state: 'hover' } },
      { key: 'assistSelectedBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors', showWhen: { mode: 'assist', state: 'selected' } },
      { key: 'assistSelectedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors', showWhen: { mode: 'assist', state: 'selected' } },
      { key: 'assistSelectedText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'colors', showWhen: { mode: 'assist', state: 'selected' } },
      { key: 'assistDisabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors', showWhen: { mode: 'assist', state: 'disabled' } },
      { key: 'assistDisabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors', showWhen: { mode: 'assist', state: 'disabled' } },
      { key: 'assistDisabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'colors', showWhen: { mode: 'assist', state: 'disabled' } },
      // Filter
      { key: 'filterDefaultBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors', showWhen: { mode: 'filter', state: 'default' } },
      { key: 'filterDefaultBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors', showWhen: { mode: 'filter', state: 'default' } },
      { key: 'filterDefaultText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors', showWhen: { mode: 'filter', state: 'default' } },
      { key: 'filterHoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors', showWhen: { mode: 'filter', state: 'hover' } },
      { key: 'filterHoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors', showWhen: { mode: 'filter', state: 'hover' } },
      { key: 'filterHoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors', showWhen: { mode: 'filter', state: 'hover' } },
      { key: 'filterSelectedBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors', showWhen: { mode: 'filter', state: 'selected' } },
      { key: 'filterSelectedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors', showWhen: { mode: 'filter', state: 'selected' } },
      { key: 'filterSelectedText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'colors', showWhen: { mode: 'filter', state: 'selected' } },
      { key: 'filterDisabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors', showWhen: { mode: 'filter', state: 'disabled' } },
      { key: 'filterDisabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors', showWhen: { mode: 'filter', state: 'disabled' } },
      { key: 'filterDisabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'colors', showWhen: { mode: 'filter', state: 'disabled' } },
      // Input
      { key: 'inputDefaultBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'colors', showWhen: { mode: 'input', state: 'default' } },
      { key: 'inputDefaultBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'colors', showWhen: { mode: 'input', state: 'default' } },
      { key: 'inputDefaultText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors', showWhen: { mode: 'input', state: 'default' } },
      { key: 'inputHoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors', showWhen: { mode: 'input', state: 'hover' } },
      { key: 'inputHoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors', showWhen: { mode: 'input', state: 'hover' } },
      { key: 'inputHoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors', showWhen: { mode: 'input', state: 'hover' } },
      { key: 'inputSelectedBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors', showWhen: { mode: 'input', state: 'selected' } },
      { key: 'inputSelectedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors', showWhen: { mode: 'input', state: 'selected' } },
      { key: 'inputSelectedText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'colors', showWhen: { mode: 'input', state: 'selected' } },
      { key: 'inputDisabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors', showWhen: { mode: 'input', state: 'disabled' } },
      { key: 'inputDisabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors', showWhen: { mode: 'input', state: 'disabled' } },
      { key: 'inputDisabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'colors', showWhen: { mode: 'input', state: 'disabled' } },
      // Suggestion
      { key: 'suggestionDefaultBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'colors', showWhen: { mode: 'suggestion', state: 'default' } },
      { key: 'suggestionDefaultBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-surface)', section: 'colors', showWhen: { mode: 'suggestion', state: 'default' } },
      { key: 'suggestionDefaultText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'colors', showWhen: { mode: 'suggestion', state: 'default' } },
      { key: 'suggestionHoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors', showWhen: { mode: 'suggestion', state: 'hover' } },
      { key: 'suggestionHoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors', showWhen: { mode: 'suggestion', state: 'hover' } },
      { key: 'suggestionHoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'colors', showWhen: { mode: 'suggestion', state: 'hover' } },
      { key: 'suggestionSelectedBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'colors', showWhen: { mode: 'suggestion', state: 'selected' } },
      { key: 'suggestionSelectedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'colors', showWhen: { mode: 'suggestion', state: 'selected' } },
      { key: 'suggestionSelectedText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors', showWhen: { mode: 'suggestion', state: 'selected' } },
      { key: 'suggestionDisabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'colors', showWhen: { mode: 'suggestion', state: 'disabled' } },
      { key: 'suggestionDisabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-surface)', section: 'colors', showWhen: { mode: 'suggestion', state: 'disabled' } },
      { key: 'suggestionDisabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'colors', showWhen: { mode: 'suggestion', state: 'disabled' } },
      // Per-mode layout
      { key: 'assistPaddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px', showWhen: { mode: 'assist' } },
      { key: 'assistPaddingY', label: 'Padding Y', control: 'number', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px', showWhen: { mode: 'assist' } },
      { key: 'assistBorderRadius', label: 'Border Radius', control: 'number', defaultValue: 999, min: 0, max: 999, step: 1, unit: 'px', showWhen: { mode: 'assist' } },
      { key: 'assistFontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 16, step: 1, unit: 'px', showWhen: { mode: 'assist' } },
      { key: 'assistFontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'], showWhen: { mode: 'assist' } },
      { key: 'assistGap', label: 'Gap', control: 'number', defaultValue: 8, min: 2, max: 16, step: 1, unit: 'px', showWhen: { mode: 'assist' } },
      { key: 'assistIconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 10, max: 24, step: 1, unit: 'px', showWhen: { mode: 'assist' } },
      { key: 'filterPaddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px', showWhen: { mode: 'filter' } },
      { key: 'filterPaddingY', label: 'Padding Y', control: 'number', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px', showWhen: { mode: 'filter' } },
      { key: 'filterBorderRadius', label: 'Border Radius', control: 'number', defaultValue: 999, min: 0, max: 999, step: 1, unit: 'px', showWhen: { mode: 'filter' } },
      { key: 'filterFontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 16, step: 1, unit: 'px', showWhen: { mode: 'filter' } },
      { key: 'filterFontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'], showWhen: { mode: 'filter' } },
      { key: 'filterGap', label: 'Gap', control: 'number', defaultValue: 8, min: 2, max: 16, step: 1, unit: 'px', showWhen: { mode: 'filter' } },
      { key: 'filterIconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 10, max: 24, step: 1, unit: 'px', showWhen: { mode: 'filter' } },
      { key: 'inputPaddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px', showWhen: { mode: 'input' } },
      { key: 'inputPaddingY', label: 'Padding Y', control: 'number', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px', showWhen: { mode: 'input' } },
      { key: 'inputBorderRadius', label: 'Border Radius', control: 'number', defaultValue: 999, min: 0, max: 999, step: 1, unit: 'px', showWhen: { mode: 'input' } },
      { key: 'inputFontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 16, step: 1, unit: 'px', showWhen: { mode: 'input' } },
      { key: 'inputFontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'], showWhen: { mode: 'input' } },
      { key: 'inputGap', label: 'Gap', control: 'number', defaultValue: 8, min: 2, max: 16, step: 1, unit: 'px', showWhen: { mode: 'input' } },
      { key: 'inputIconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 10, max: 24, step: 1, unit: 'px', showWhen: { mode: 'input' } },
      { key: 'suggestionPaddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px', showWhen: { mode: 'suggestion' } },
      { key: 'suggestionPaddingY', label: 'Padding Y', control: 'number', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px', showWhen: { mode: 'suggestion' } },
      { key: 'suggestionBorderRadius', label: 'Border Radius', control: 'number', defaultValue: 999, min: 0, max: 999, step: 1, unit: 'px', showWhen: { mode: 'suggestion' } },
      { key: 'suggestionFontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 16, step: 1, unit: 'px', showWhen: { mode: 'suggestion' } },
      { key: 'suggestionFontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'], showWhen: { mode: 'suggestion' } },
      { key: 'suggestionGap', label: 'Gap', control: 'number', defaultValue: 8, min: 2, max: 16, step: 1, unit: 'px', showWhen: { mode: 'suggestion' } },
      { key: 'suggestionIconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 10, max: 24, step: 1, unit: 'px', showWhen: { mode: 'suggestion' } },
      // Focus ring — one shared knob across every mode/state. The ring is
      // a universal a11y treatment applied to both the chip root and the
      // inner remove × button (input mode), so per-mode color knobs would
      // be busywork — one Ring Color drives them all. Gated on
      // `state: "focus"` so the knob appears alongside the other state-
      // specific colors when the user picks Focus in the state picker.
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
    ],
    layoutVariants: [
      {
        key: 'mode',
        label: 'Mode',
        options: [
          { value: 'assist', label: 'Assist' },
          { value: 'filter', label: 'Filter' },
          { value: 'input', label: 'Input' },
          { value: 'suggestion', label: 'Suggestion' },
        ],
        defaultValue: 'assist',
      },
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'selected', label: 'Selected', showWhen: { mode: 'filter' } },
          { value: 'disabled', label: 'Disabled' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onClick', description: 'Fires when the chip is activated. Filter mode also toggles selected state internally.', payload: 'MouseEvent' },
      // Demonstrates `showWhen` variant scoping — these only show in the
      // Events spec when the Mode variant is set to "input".
      { name: 'onRemove', description: 'Fires when the trailing × is clicked. Input mode only.', payload: 'void', showWhen: { mode: 'input' } },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'Chip',
      props: [
        { name: 'children', type: 'ReactNode', description: 'Chip label.' },
        { name: 'mode', type: '"assist" | "filter" | "input" | "suggestion"', defaultValue: '"assist"', description: 'Material Design chip mode. Drives both visuals and behavior — filter mode toggles selected on click; input mode shows a trailing × that fires onRemove.' },
        { name: 'selected', type: 'boolean', description: 'Visual selected state. Only meaningful in filter / suggestion modes (assist and input handle this internally).' },
        { name: 'onClick', type: '(e: MouseEvent) => void', description: 'Click handler.' },
        { name: 'onRemove', type: '() => void', description: 'Remove handler. Only rendered/fired in input mode.' },
        { name: 'leadingIcon', type: 'ReactNode', description: 'Icon slot before the label (e.g. `<Icon glyph="check" />`).' },
      ],
    },
  },
  {
    id: 'tag',
    name: 'Tag',
    category: 'Display',
    description: 'Read-only status label. 6 types (accent / success / warning / danger / info / neutral) × 2 sizes (small / medium). Padding, font size, gap, and icon size are tunable per size; border radius and font weight are shared. Use small for dense contexts like data-table rows.',
    styleProperties: [
      { key: 'accentBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'colors', showWhen: { type: 'accent' } },
      { key: 'accentBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'colors', showWhen: { type: 'accent' } },
      { key: 'accentText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors', showWhen: { type: 'accent' } },
      { key: 'successBg', label: 'Background', control: 'color', defaultValue: 'var(--color-success-bg)', section: 'colors', showWhen: { type: 'success' } },
      { key: 'successBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-success-border)', section: 'colors', showWhen: { type: 'success' } },
      { key: 'successText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-success-text)', section: 'colors', showWhen: { type: 'success' } },
      { key: 'warningBg', label: 'Background', control: 'color', defaultValue: 'var(--color-warning-bg)', section: 'colors', showWhen: { type: 'warning' } },
      { key: 'warningBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-warning-border)', section: 'colors', showWhen: { type: 'warning' } },
      { key: 'warningText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-warning-text)', section: 'colors', showWhen: { type: 'warning' } },
      { key: 'dangerBg', label: 'Background', control: 'color', defaultValue: 'var(--color-danger-bg)', section: 'colors', showWhen: { type: 'danger' } },
      { key: 'dangerBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-border)', section: 'colors', showWhen: { type: 'danger' } },
      { key: 'dangerText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'colors', showWhen: { type: 'danger' } },
      { key: 'infoBg', label: 'Background', control: 'color', defaultValue: 'var(--color-info-bg)', section: 'colors', showWhen: { type: 'info' } },
      { key: 'infoBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-info-border)', section: 'colors', showWhen: { type: 'info' } },
      { key: 'infoText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-info-text)', section: 'colors', showWhen: { type: 'info' } },
      { key: 'neutralBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors', showWhen: { type: 'neutral' } },
      { key: 'neutralBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors', showWhen: { type: 'neutral' } },
      { key: 'neutralText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors', showWhen: { type: 'neutral' } },
      // Per-size dimensions — each size owns its own padding/font/gap/icon
      // scale, gated by `showWhen: { size }`. Saves emit as
      // `--uxm-tag-{size}-{kebab(key)}` (fallback path), and the size
      // modifier rules in styles.css read their own namespaced vars.
      { key: 'smallPaddingX', label: 'Padding X', control: 'number', defaultValue: 8,  min: 4, max: 24, step: 1, unit: 'px', showWhen: { size: 'small' } },
      { key: 'smallPaddingY', label: 'Padding Y', control: 'number', defaultValue: 2,  min: 0, max: 12, step: 1, unit: 'px', showWhen: { size: 'small' } },
      { key: 'smallFontSize', label: 'Font Size', control: 'number', defaultValue: 11, min: 9,  max: 16, step: 1, unit: 'px', showWhen: { size: 'small' } },
      { key: 'smallGap',      label: 'Gap',       control: 'number', defaultValue: 6,  min: 2, max: 16, step: 1, unit: 'px', showWhen: { size: 'small' } },
      { key: 'smallIconSize', label: 'Icon Size', control: 'number', defaultValue: 12, min: 8,  max: 24, step: 1, unit: 'px', showWhen: { size: 'small' } },
      { key: 'mediumPaddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px', showWhen: { size: 'medium' } },
      { key: 'mediumPaddingY', label: 'Padding Y', control: 'number', defaultValue: 4,  min: 0, max: 12, step: 1, unit: 'px', showWhen: { size: 'medium' } },
      { key: 'mediumFontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px', showWhen: { size: 'medium' } },
      { key: 'mediumGap',      label: 'Gap',       control: 'number', defaultValue: 8,  min: 2, max: 16, step: 1, unit: 'px', showWhen: { size: 'medium' } },
      { key: 'mediumIconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 10, max: 24, step: 1, unit: 'px', showWhen: { size: 'medium' } },
      // Shared across both sizes.
      { key: 'borderRadius', label: 'Border Radius', control: 'number', defaultValue: 999, min: 0, max: 999, step: 1, unit: 'px' },
      { key: 'fontWeight',   label: 'Font Weight',   control: 'select', defaultValue: '500', options: ['400', '500', '600'] },
    ],
    layoutVariants: [
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
        defaultValue: 'accent',
      },
      {
        key: 'size',
        label: 'Size',
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
        ],
        defaultValue: 'medium',
      },
    ],
  },
  {
    id: 'card',
    name: 'Card',
    category: 'Display',
    description: 'Content card with border and optional shadow.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 4, min: 0, max: 24, step: 1, unit: 'px' },
      { key: 'padding', label: 'Padding', control: 'number', defaultValue: 24, min: 8, max: 48, step: 4, unit: 'px' },
      { key: 'shadow', label: 'Shadow', control: 'toggle', defaultValue: false },
    ],
    layoutVariants: [],
  },
  {
    id: 'avatar',
    name: 'Avatar',
    category: 'Display',
    description: 'User or entity avatar. Text mode shows initials; image mode renders a photo or logo, falling back to initials if the image fails to load.',
    styleProperties: [
      // Sections are organized so each is *either* all-shared or all-gated.
      // That way the panel's auto-detected section subtitle ("Shared across
      // all types" vs "Per Type · Text") is honest for every knob inside it,
      // rather than mixing shared knobs into a "Per Type" section by accident.
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-highlight-cool)', section: 'colors' },
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'size', label: 'Size', control: 'number', defaultValue: 40, min: 24, max: 80, step: 4, unit: 'px' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 99, min: 0, max: 99, step: 1, unit: 'px' },
      // Default 0 = no visible border. Consumers turn it on per-instance
      // for status rings, photo frames, or to separate from busy backgrounds.
      { key: 'borderWidth', label: 'Border Width', control: 'number', defaultValue: 0, min: 0, max: 4, step: 1, unit: 'px' },
      // Text-only knobs — only matter when initials are rendered. Grouped
      // into a dedicated `text` section so the entire section disappears in
      // image mode and its "Per Type · Text" subtitle isn't mixed with shared
      // knobs above. They still apply when image mode falls back to initials.
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'text', showWhen: { type: 'text' } },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 16, min: 10, max: 32, step: 1, unit: 'px', section: 'text', showWhen: { type: 'text' } },
      { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '600', options: ['400', '500', '600', '700'], section: 'text', showWhen: { type: 'text' } },
    ],
    layoutVariants: [
      {
        key: 'type',
        label: 'Type',
        options: [
          { value: 'text', label: 'Text' },
          { value: 'image', label: 'Image' },
        ],
        defaultValue: 'text',
      },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'Card',
      props: [
        { name: 'children', type: 'ReactNode', description: 'Card content — heading, body, actions, anything.' },
        { name: 'shadow', type: 'boolean', defaultValue: 'false', description: 'Adds a soft shadow underneath. Off by default — many cards live in dense lists where shadow stacks would feel busy.' },
        { name: 'className', type: 'string', description: "Extra classes appended after the atom's own `uxm-card`. Common use: layout helpers (`mb-4`, `flex flex-col gap-2`)." },
        { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'All other native div attributes pass through.' },
      ],
    },
  },
  {
    id: 'empty-state',
    name: 'Empty State',
    category: 'Display',
    description: 'Placeholder shown when content is empty.',
    styleProperties: [
      { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'titleColor', label: 'Title Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'descriptionColor', label: 'Description Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'padding', label: 'Padding', control: 'number', defaultValue: 48, min: 16, max: 80, step: 8, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 48, min: 24, max: 80, step: 4, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'disclosure',
    name: 'Disclosure',
    category: 'Display',
    description: 'Header-only collapsible row — icon + label + right chevron that rotates on open. No body slot; the consumer renders whatever content lives beneath this row based on the open state. State knobs cover default / hover / focus / disabled. `active` is intentionally omitted — disclosure has no selection concept; toggling drives the orthogonal `open` variant.',
    styleProperties: [
      // ── Per-state row colors. Filtered into the "States" section by
      // the State variant. Default / hover / focus / disabled each own
      // their colors; focus also has a standalone ring; disabled has
      // a standalone opacity.
      { key: 'inactiveBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'default' } },
      { key: 'inactiveText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'default' } },
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'focusText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'disabled' } },
      { key: 'disabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
      // Focus ring + disabled opacity in their own sections.
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // ── Shared sizing (applies to every state). `borderRadius` is
      // shared geometry — invisible in the default state (transparent
      // bg) and becomes visible whenever a bg paints (hover, disabled).
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 20, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 16, min: 8, max: 32, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Label Size', control: 'number', defaultValue: 14, min: 11, max: 18, step: 1, unit: 'px' },
      // ── Chevron (the rotating affordance, shared across every state)
      { key: 'chevronColor', label: 'Chevron Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'chevron' },
      { key: 'chevronSize', label: 'Chevron Size', control: 'number', defaultValue: 16, min: 12, max: 24, step: 1, unit: 'px', section: 'chevron' },
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
        ],
        defaultValue: 'default',
      },
      {
        // `open` is orthogonal to interaction state — drives the
        // chevron rotation and `aria-expanded` on the atom. Was the
        // `state` variant before this pass (with values
        // expanded / collapsed); renamed so `state` is free to mean
        // "interaction state" canonically.
        key: 'open',
        label: 'Open',
        options: [
          { value: 'expanded', label: 'Expanded' },
          { value: 'collapsed', label: 'Collapsed' },
        ],
        defaultValue: 'expanded',
      },
    ],
    events: [
      { name: 'onToggle', description: 'Fires when the user clicks the header to expand or collapse.', payload: '{ open: boolean }' },
    ],
  },

  // ── Configuration model ──
  // Two pieces specific to the Configuration template's three-pane editor:
  // a clickable segment row (left list) and a clickable component card row
  // (middle list). Distinct from the `Configuration` category's
  // `segment-row` / `component-row`, which model the segment-tree building
  // blocks rather than these three-pane list rows.
  {
    id: 'config-segment-item',
    name: 'Config Segment Item',
    category: 'Composite',
    description: "Left-pane row in a Configuration model's segment list — name + meta line, with active state.",
    styleProperties: [
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 8, min: 4, max: 16, step: 1, unit: 'px' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 6, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'nameSize', label: 'Name Size', control: 'number', defaultValue: 14, min: 11, max: 18, step: 1, unit: 'px' },
      { key: 'metaSize', label: 'Meta Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'config-component-row',
    name: 'Config Component Row',
    category: 'Composite',
    description: 'Middle-pane row representing one component (field) in a Configuration segment — icon, name, type label, optional trailing tag.',
    styleProperties: [
      { key: 'padding', label: 'Padding', control: 'number', defaultValue: 16, min: 8, max: 32, step: 2, unit: 'px' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 4, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'iconTileSize', label: 'Icon Tile Size', control: 'number', defaultValue: 28, min: 20, max: 40, step: 2, unit: 'px' },
      { key: 'iconTileRadius', label: 'Icon Tile Radius', control: 'slider', defaultValue: 6, min: 0, max: 12, step: 1, unit: 'px' },
      { key: 'nameSize', label: 'Name Size', control: 'number', defaultValue: 14, min: 11, max: 18, step: 1, unit: 'px' },
      { key: 'typeSize', label: 'Type Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px' },
    ],
    layoutVariants: [],
  },
];
