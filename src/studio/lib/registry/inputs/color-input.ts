import type { ComponentDef } from '../../types';

export const colorInputDef: ComponentDef = {
  id: 'color-input',
  name: 'Color Input',
  category: 'Inputs',
  description: 'Color picker with a saturation/brightness area, hue and opacity sliders, a swatch, a screen eyedropper and a format select (HEX/RGB/RGBA/HSL). The value editor adapts to the format — one hex field, or R/G/B(/A) or H/S/L numeric fields — and re-derives on switch. Ships inline (ColorInput) and as a swatch-triggered popover (ColorInputPopover). `outputFormat` fixes the emitted format (default hex); Enter commits a field, Escape reverts it, and in the popover both also close the panel.',
  styleProperties: [
    // Default
    { key: 'backgroundColor', label: 'Field / Panel Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
    { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
    { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
    // Hover
    { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
    // Focus
    { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
    { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
    // Disabled
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
    // Error
    { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
    { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
    // Shared
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px' },
    { key: 'areaHeight', label: 'Area Height', control: 'slider', defaultValue: 160, min: 100, max: 240, step: 4, unit: 'px' },
    { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 10, min: 4, max: 24, step: 2, unit: 'px' },
    { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 8, min: 4, max: 20, step: 2, unit: 'px' },
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
  ],
  layoutVariants: [
    {
      key: 'variant',
      label: 'Variant',
      options: [
        { value: 'inline', label: 'Inline' },
        { value: 'popover', label: 'Popover' },
      ],
      defaultValue: 'inline',
    },
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
  ],
  events: [
    { name: 'onChange', description: 'Fires on every commit (drag, eyedropper, or field commit) with the color formatted per `outputFormat`.', payload: '(color: string) => void' },
    { name: 'onEnter', description: 'Fires when Enter commits a valid text-field draft.', payload: '(color: string) => void' },
    { name: 'onEsc', description: 'Fires when Escape reverts the text-field draft to the last committed value.', payload: '() => void' },
    { name: 'onOpenChange', description: 'Popover variant only — fires when the panel opens or closes.', payload: '(open: boolean) => void', showWhen: { variant: 'popover' } },
  ],
  api: {
    importPath: '@viax/uxm/ui',
    importNames: ['ColorInput', 'ColorInputPopover'],
    props: [
      { name: 'value', type: 'string', description: 'Current color (controlled). Any supported syntax: hex, rgb(a), hsl(a).' },
      { name: 'defaultValue', type: 'string', defaultValue: "'#000000'", description: 'Initial color for uncontrolled usage.' },
      { name: 'onChange', type: '(color: string) => void', description: 'Called with the color formatted per `outputFormat` on every commit.' },
      { name: 'formats', type: 'ColorFormat[]', defaultValue: "['hex','rgb','rgba','hsl']", description: 'Representations offered in the in-component format select (what is displayed / edited). A single entry hides the select.' },
      { name: 'outputFormat', type: "'hex' | 'rgb' | 'rgba' | 'hsl'", defaultValue: "'hex'", description: 'Format `onChange` / `onEnter` return — fixed by this prop, independent of the visible representation. hex + alpha < 1 → 8-digit #rrggbbaa.' },
      { name: 'onEnter', type: '(color: string) => void', description: 'Enter commits the field; in the popover it also closes the panel.' },
      { name: 'onEsc', type: '() => void', description: 'Escape reverts the field draft; in the popover it also closes the panel.' },
      { name: 'alpha', type: 'boolean', defaultValue: 'true', description: 'Show the opacity slider.' },
      { name: 'eyedropper', type: 'boolean', defaultValue: 'true', description: 'Show the screen eyedropper button (Chromium only; auto-hidden where the EyeDropper API is unavailable).' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disable all interaction.' },
      { name: 'error', type: 'string', description: 'Non-empty string renders the error state and message below the panel.' },
      { name: 'open', type: 'boolean', description: 'Popover open state (controlled). ColorInputPopover only.' },
      { name: 'defaultOpen', type: 'boolean', defaultValue: 'false', description: 'Initial open state for uncontrolled popover usage. ColorInputPopover only.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Popover open/close callback. ColorInputPopover only.' },
      { name: 'placement', type: 'PopoverPlacement', defaultValue: "'bottom-start'", description: 'Preferred popover placement. ColorInputPopover only.' },
      { name: 'triggerLabel', type: 'string', defaultValue: "'Choose color'", description: 'Accessible name for the trigger swatch. ColorInputPopover only.' },
    ],
  },
};
