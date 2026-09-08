import type { ComponentDef } from '../types';

export const appDefs: ComponentDef[] = [
  // ── App ──
  {
    id: 'brand-settings',
    name: 'Brand Settings',
    category: 'App',
    description: 'Configure the Modo logo, sidebar icon, and primary font.',
    styleProperties: [],
    layoutVariants: [],
    canvasBackground: false,
  },
  {
    id: 'app-sidebar',
    name: 'App Sidebar',
    category: 'App',
    description:
      'Left navigation: brand row, an optional header slot at the head of the rail, sectioned nav items, an optional footer slot, expand/collapse. Both slots survive collapse.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'expandedWidth', label: 'Expanded Width', control: 'number', defaultValue: 256, min: 200, max: 320, step: 4, unit: 'px' },
      { key: 'collapsedWidth', label: 'Collapsed Width', control: 'number', defaultValue: 64, min: 48, max: 96, step: 4, unit: 'px' },
      { key: 'headingColor', label: 'Section Heading', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'footerColor', label: 'Footer Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      // Both slots align to `__nav`'s 8px, so a control in either lines its text
      // up with the nav rows (8 + the child's own 12 = 20px, where a nav label
      // starts). The footer used to carry a 24px caption inset, which put a
      // control at 36px and cost it 32px of width — an address ellipsised for no
      // reason. The knobs stay so a caption can take the deeper inset back.
      //
      // Each sits in its OWN section rather than beside the width knobs. The
      // panel derives a section's subtitle from the union of `showWhen` keys
      // across every knob inside it, so a gated knob dropped in with the
      // ungated widths made the whole section read "Per Header Slot x Footer
      // Slot" — a claim that is false for Expanded/Collapsed Width. Same rule
      // the `avatar` entry states: a section is either all-shared or all-gated.
      // One key per section also keeps the subtitle to "Per Header Slot - On"
      // instead of an "A x B" that implies each knob depends on both.
      { key: 'leadPadding', label: 'Padding', control: 'number', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px', section: 'headerSlot', showWhen: { headerSlot: 'on' } },
      { key: 'footerPadding', label: 'Padding', control: 'number', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px', section: 'footerSlot', showWhen: { footerSlot: 'on' } },
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'expanded', label: 'Expanded' },
          { value: 'collapsed', label: 'Collapsed' },
        ],
        defaultValue: 'expanded',
      },
      {
        // The head slot is off in plenty of shells (a single-tenant app has no
        // switcher), so it is a picker rather than always-on content — and with
        // it off you can still see that the sidebar reserves nothing for it.
        key: 'headerSlot',
        label: 'Header Slot',
        options: [
          { value: 'on', label: 'On' },
          { value: 'off', label: 'Off' },
        ],
        defaultValue: 'on',
      },
      {
        // Both slots are optional, so both get a picker. One without the other
        // would imply the footer is structural — and with either off you can see
        // that the sidebar reserves no space for a slot it was not given.
        key: 'footerSlot',
        label: 'Footer Slot',
        options: [
          { value: 'on', label: 'On' },
          { value: 'off', label: 'Off' },
        ],
        defaultValue: 'on',
      },
      {
        // Auto-assign a distinct icon colour per item from a categorical
        // palette (cycling) for scannability, vs the monochromatic default.
        key: 'autoIconColors',
        label: 'Auto Icon Colors',
        options: [
          { value: 'off', label: 'Off' },
          { value: 'on', label: 'On' },
        ],
        defaultValue: 'off',
      },
    ],
  },
  {
    id: 'app-top-bar',
    name: 'App Top Bar',
    category: 'App',
    description: 'Top header: search, mobile menu trigger, primary action, theme toggle, avatar slot.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-surface-alt) 50%, transparent)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'height', label: 'Height', control: 'number', defaultValue: 64, min: 48, max: 96, step: 4, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 16, min: 8, max: 32, step: 2, unit: 'px' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'searchMaxWidth', label: 'Search Max Width', control: 'number', defaultValue: 320, min: 160, max: 480, step: 8, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'language-switcher',
    name: 'Language Switcher',
    category: 'App',
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
  },
];
