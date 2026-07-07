import type { ComponentDef } from '../types';

export const formsDefs: ComponentDef[] = [
  // ── Forms ──
  {
    id: 'form-login',
    name: 'Login Form',
    category: 'Forms',
    description: "Email + password login form. Composes FormField + TextInput; input theming flows through the input atoms' registries, label theming through FormField's. Always renders top labels — pick labelPosition on FormField if you need to preview side labels.",
    styleProperties: [
      // Form card shape — what THIS atom actually owns. Input shape /
      // input theming lives on TextInput. Label theming lives on
      // FormField. The previous `inputRadius` knob is gone (duplicated
      // TextInput's own border-radius); border-color is now exclusively
      // the form card outline.
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 12, min: 0, max: 24, step: 1, unit: 'px' },
      { key: 'padding', label: 'Padding', control: 'number', defaultValue: 32, min: 16, max: 48, step: 4, unit: 'px' },
      { key: 'fieldGap', label: 'Field Gap', control: 'number', defaultValue: 20, min: 8, max: 40, step: 4, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'form-contact',
    name: 'Contact Form',
    category: 'Forms',
    description: "Name, email, and message contact form. Composes FormField + TextInput / Textarea; input theming flows through the input atoms' registries, label theming through FormField's. Always renders top labels — pick labelPosition on FormField if you need to preview side labels.",
    styleProperties: [
      // See form-login for the rationale on what survived the
      // atom-composition refactor.
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 12, min: 0, max: 24, step: 1, unit: 'px' },
      { key: 'padding', label: 'Padding', control: 'number', defaultValue: 32, min: 16, max: 48, step: 4, unit: 'px' },
      { key: 'fieldGap', label: 'Field Gap', control: 'number', defaultValue: 20, min: 8, max: 40, step: 4, unit: 'px' },
    ],
    layoutVariants: [],
  },
];
