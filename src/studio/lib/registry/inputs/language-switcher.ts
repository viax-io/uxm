import type { ComponentDef } from '../../types';

export const languageSwitcherDef: ComponentDef = {
  id: 'language-switcher',
  name: 'Language Switcher',
  category: 'Inputs',
  description:
    'The library-owned language control: globe + the current language\'s endonym, opening the shared Listbox panel. Data-free — the locale list, value and change handler all come from the consumer. Renders nothing at all when one locale is configured.',
  styleProperties: [
    // Defaults mirror the atom's own `--uxm-language-switcher-*` fallbacks,
    // so an untouched studio equals the shipped look. The PANEL is absent
    // here on purpose: it inherits the shared `--uxm-listbox-*` surface, so
    // its knobs live on the Listbox def and theming it there themes every
    // picker at once.
    { key: 'bg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'default' } },
    { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'default' } },
    { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'states', showWhen: { state: 'default' } },
    { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'states', showWhen: { state: 'hover' } },
    { key: 'hoverBorderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border-strong, var(--color-border))', section: 'states', showWhen: { state: 'hover' } },
    { key: 'openBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'states', showWhen: { state: 'open' } },
    { key: 'openBorderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'open' } },
    { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'focus' } },
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'states', showWhen: { state: 'disabled' } },
    // Shared style — always visible.
    { key: 'caretColor', label: 'Caret Color', control: 'color', defaultValue: 'var(--color-text-muted)' },
    { key: 'radius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px' },
    { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 10, min: 4, max: 32, step: 1, unit: 'px' },
    { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 7, min: 2, max: 20, step: 1, unit: 'px' },
    { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 20, step: 1, unit: 'px' },
    { key: 'gap', label: 'Gap', control: 'number', defaultValue: 6, min: 0, max: 16, step: 1, unit: 'px' },
  ],
  layoutVariants: [
    {
      key: 'variant',
      label: 'Variant',
      defaultValue: 'full',
      options: [
        { value: 'full', label: 'Full' },
        { value: 'compact', label: 'Compact' },
      ],
    },
    {
      key: 'state',
      label: 'State',
      defaultValue: 'default',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'hover', label: 'Hover' },
        { value: 'open', label: 'Open' },
        { value: 'focus', label: 'Focus' },
        { value: 'disabled', label: 'Disabled' },
      ],
    },
  ],
};
