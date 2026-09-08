import type { ComponentDef } from '../../types';

export const sliderDef: ComponentDef = {
  id: 'slider',
  name: 'Slider',
  category: 'Inputs',
  description: 'Native range slider with themable track and thumb. Two modes: `single` is a one-thumb value picker; `range` is a dual-thumb start/end selector. Both modes share the same theming surface. State knobs cover default / hover / focus / disabled — only the thumb changes across interaction states; track + accent stay constant.',
  styleProperties: [
    // Default — track + thumb both visible since slider always has both
    { key: 'trackColor', label: 'Track', control: 'color', defaultValue: 'var(--color-border)', section: 'states', showWhen: { state: 'default' } },
    { key: 'accentColor', label: 'Accent (Filled)', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'default' } },
    { key: 'thumbColor', label: 'Thumb', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'default' } },
    // Hover — thumb tint when hovered or actively being dragged (one
    // knob covers both since the visual difference is rarely worth
    // exposing as two; the underlying CSS still applies `:active`).
    { key: 'hoverThumbColor', label: 'Thumb', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'hover' } },
    // Focus — single shared ring around the thumb / track
    { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
    // Disabled — shared opacity
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
    // Shared style — always visible
    { key: 'trackHeight', label: 'Track Height', control: 'number', defaultValue: 6, min: 2, max: 16, step: 1, unit: 'px' },
    { key: 'trackRadius', label: 'Track Radius', control: 'slider', defaultValue: 999, min: 0, max: 999, step: 1, unit: 'px' },
    { key: 'thumbSize', label: 'Thumb Size', control: 'number', defaultValue: 14, min: 8, max: 24, step: 1, unit: 'px' },
    // Range-mode-only — value labels and show toggles. Grouped into
    // their own section so the panel's auto-derived "Per Mode · Range"
    // scope label applies only to these knobs and doesn't bleed into
    // the truly-shared STYLE section above (Track Height / Radius /
    // Thumb Size, which apply uniformly to both modes).
    { key: 'valueColor', label: 'Value Label Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'rangeOptions', showWhen: { mode: 'range' } },
    { key: 'valueSize', label: 'Value Label Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px', section: 'rangeOptions', showWhen: { mode: 'range' } },
    { key: 'showStart', label: 'Show Start', control: 'toggle', defaultValue: false, section: 'rangeOptions', showWhen: { mode: 'range' } },
    { key: 'showEnd', label: 'Show End', control: 'toggle', defaultValue: false, section: 'rangeOptions', showWhen: { mode: 'range' } },
    { key: 'showRange', label: 'Show Range', control: 'toggle', defaultValue: false, section: 'rangeOptions', showWhen: { mode: 'range' } },
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
      key: 'mode',
      label: 'Mode',
      options: [
        { value: 'single', label: 'Single' },
        { value: 'range', label: 'Range' },
      ],
      defaultValue: 'single',
    },
  ],
  events: [
    { name: 'onChange', description: 'Fires continuously while the user drags the thumb. High-frequency — debounce before persisting.', payload: '{ value: number }', showWhen: { mode: 'single' } },
    { name: 'onChange', description: 'Fires continuously while the user drags either thumb. Payload is the full [start, end] range.', payload: '{ value: [number, number] }', showWhen: { mode: 'range' } },
  ],
  api: {
    importPath: '@viax/uxm/ui',
    importNames: ['Slider', 'RangeSlider'],
    props: [
      { name: 'value', type: 'number  // (Slider) | [number, number]  // (RangeSlider)', description: 'Current value. Tuple for RangeSlider.' },
      { name: 'onChange', type: '(value: number) => void  // or ([start, end]) => void', description: 'Change handler. Already unwrapped from DOM event — receives the parsed number(s).' },
      { name: 'min', type: 'number', defaultValue: '0', description: 'Lower bound.' },
      { name: 'max', type: 'number', defaultValue: '100', description: 'Upper bound.' },
      { name: 'step', type: 'number', defaultValue: '1', description: 'Increment per arrow/drag tick.' },
    ],
  },
};
