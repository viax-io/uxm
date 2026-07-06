import { ICON_OPTIONS } from '@/ui';

import type { Category, ComponentDef } from './types';

export const categories: Category[] = ['App', 'Buttons', 'Inputs', 'Display', 'Feedback', 'Forms', 'Composite', 'Layout', 'Diagram', 'Icons'];

export const categoryColors: Record<Category, string> = {
  App: 'var(--color-text)',
  Buttons: 'var(--color-accent)',
  Inputs: 'var(--color-accent-light)',
  Display: 'var(--color-highlight-warm)',
  Feedback: 'var(--color-highlight-cool)',
  Forms: 'var(--color-accent-bold)',
  Composite: 'var(--color-category-composite)',
  Layout: 'var(--color-text-subtle)',
  Diagram: 'var(--color-category-diagram)',
  Icons: 'var(--color-text-muted)',
};

export const registry: ComponentDef[] = [
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
    description: 'Left navigation: brand, sectioned nav items, optional footer, expand/collapse.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'expandedWidth', label: 'Expanded Width', control: 'number', defaultValue: 256, min: 200, max: 320, step: 4, unit: 'px' },
      { key: 'collapsedWidth', label: 'Collapsed Width', control: 'number', defaultValue: 64, min: 48, max: 96, step: 4, unit: 'px' },
      { key: 'headingColor', label: 'Section Heading', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'footerColor', label: 'Footer Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
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

  // ── Buttons ──
  {
    id: 'button-primary',
    name: 'Button — Primary',
    category: 'Buttons',
    description: 'Primary call-to-action button with solid background.',
    styleProperties: [
      // State-scoped colors — Tag-style filter via showWhen. Designers tune
      // background + text per state. Defaults walk the accent scale:
      // bold → accent (brighter) → bold (darker on press).
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'states', showWhen: { state: 'default' } },
      { key: 'hoverBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'activeBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'states', showWhen: { state: 'active' } },
      { key: 'focusRingColor', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'focusColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'states', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'states', showWhen: { state: 'disabled' } },
      // Shared style — always visible.
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 20, min: 4, max: 48, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 2, max: 24, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 24, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '600', options: ['400', '500', '600', '700'] },
      { key: 'gap', label: 'Icon Gap', control: 'number', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
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
      { name: 'onClick', description: 'Fires on mouse click or Enter/Space activation while focused.', payload: 'MouseEvent<HTMLButtonElement>' },
      { name: 'onFocus', description: 'Fires when the button receives keyboard focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the button loses keyboard focus.', payload: 'FocusEvent' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'ButtonPrimary',
      props: [
        { name: 'children', type: 'ReactNode', description: 'Button label — text, icon, or both.' },
        { name: 'onClick', type: '(e: MouseEvent<HTMLButtonElement>) => void', description: 'Click handler.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the button and prevents interaction.' },
        { name: 'type', type: '"button" | "submit" | "reset"', defaultValue: '"button"', description: "Native button type. Defaults to 'button' to avoid accidental form submits." },
        { name: 'className', type: 'string', description: "Extra classes appended after the atom's own `uxm-button-primary`." },
        { name: '...rest', type: 'ButtonHTMLAttributes<HTMLButtonElement>', description: 'All other native button attributes (aria-label, tabIndex, etc.) pass through to the underlying <button>.' },
      ],
    },
  },
  {
    id: 'button-secondary',
    name: 'Button — Secondary',
    category: 'Buttons',
    description: 'Secondary button with border outline.',
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'states', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverBorderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'hover' } },
      // Pressed
      { key: 'activeBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeBorderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'active' } },
      // Focus
      { key: 'focusRingColor', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'focusColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'states', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'disabled' } },
      // Shared style
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 20, min: 4, max: 48, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 2, max: 24, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 24, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '600', options: ['400', '500', '600', '700'] },
      { key: 'gap', label: 'Icon Gap', control: 'number', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
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
      { name: 'onClick', description: 'Fires on mouse click or Enter/Space activation while focused.', payload: 'MouseEvent<HTMLButtonElement>' },
      { name: 'onFocus', description: 'Fires when the button receives keyboard focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the button loses keyboard focus.', payload: 'FocusEvent' },
    ],
  },
  {
    id: 'button-tertiary',
    name: 'Button — Tertiary',
    category: 'Buttons',
    description: 'Neutral outlined button for Cancel-style and supporting actions.',
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'states', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverBorderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'states', showWhen: { state: 'hover' } },
      // Pressed
      { key: 'activeBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeBorderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'active' } },
      // Focus
      { key: 'focusRingColor', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'focusColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'states', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
      // Shared style
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 20, min: 4, max: 48, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 2, max: 24, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 24, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '600', options: ['400', '500', '600', '700'] },
      { key: 'gap', label: 'Icon Gap', control: 'number', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
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
      { name: 'onClick', description: 'Fires on mouse click or Enter/Space activation while focused.', payload: 'MouseEvent<HTMLButtonElement>' },
      { name: 'onFocus', description: 'Fires when the button receives keyboard focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the button loses keyboard focus.', payload: 'FocusEvent' },
    ],
  },
  {
    id: 'button-ghost',
    name: 'Button — Ghost',
    category: 'Buttons',
    description: 'Transparent button with text-only styling.',
    styleProperties: [
      // Default — no bg fill, text only.
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'default' } },
      // Hover — get a subtle surface fill to telegraph interactivity.
      { key: 'hoverBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'hover' } },
      // Pressed
      { key: 'activeBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'active' } },
      // Focus
      { key: 'focusRingColor', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'focusColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'states', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'disabled' } },
      // Shared style
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 20, min: 4, max: 48, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 2, max: 24, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 24, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600', '700'] },
      { key: 'gap', label: 'Icon Gap', control: 'number', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
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
      { name: 'onClick', description: 'Fires on mouse click or Enter/Space activation while focused.', payload: 'MouseEvent<HTMLButtonElement>' },
      { name: 'onFocus', description: 'Fires when the button receives keyboard focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the button loses keyboard focus.', payload: 'FocusEvent' },
    ],
  },
  {
    id: 'button-danger',
    name: 'Button — Destructive',
    category: 'Buttons',
    description: 'Destructive (danger) action button for irreversible operations — Delete, Remove, Discard. Outlined/subtle by default (danger-tinted surface + danger text + danger border); pressing deepens to a solid danger fill so the commit-to-destroy moment reads clearly. Reuses the semantic danger token trio — no new palette tokens. Reserve for genuinely destructive actions; everything else uses the primary/secondary/tertiary family.',
    styleProperties: [
      // Default — danger-tinted surface, danger text + border.
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-danger-bg)', section: 'states', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'states', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-danger-border)', section: 'states', showWhen: { state: 'default' } },
      // Hover — deepen the tint toward the danger text colour.
      { key: 'hoverBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-danger-border)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverBorderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'states', showWhen: { state: 'hover' } },
      // Pressed — solid danger fill, inverse text.
      { key: 'activeBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeBorderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'states', showWhen: { state: 'active' } },
      // Focus
      { key: 'focusRingColor', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'focusColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'states', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'states', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'states', showWhen: { state: 'disabled' } },
      // Shared style
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 20, min: 4, max: 48, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 2, max: 24, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 24, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '600', options: ['400', '500', '600', '700'] },
      { key: 'gap', label: 'Icon Gap', control: 'number', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
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
      { name: 'onClick', description: 'Fires on mouse click or Enter/Space activation while focused.', payload: 'MouseEvent<HTMLButtonElement>' },
      { name: 'onFocus', description: 'Fires when the button receives keyboard focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the button loses keyboard focus.', payload: 'FocusEvent' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'ButtonDanger',
      props: [
        { name: 'children', type: 'ReactNode', description: 'Button label — text, icon, or both. Prefer an explicit verb ("Delete", "Remove").' },
        { name: 'onClick', type: '(e: MouseEvent<HTMLButtonElement>) => void', description: 'Click handler. For irreversible actions, confirm before committing.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the button and prevents interaction.' },
        { name: 'type', type: '"button" | "submit" | "reset"', defaultValue: '"button"', description: "Native button type. Defaults to 'button' to avoid accidental form submits." },
        { name: 'className', type: 'string', description: "Extra classes appended after the atom's own `uxm-button-danger`." },
        { name: '...rest', type: 'ButtonHTMLAttributes<HTMLButtonElement>', description: 'All other native button attributes (aria-label, tabIndex, etc.) pass through to the underlying <button>.' },
      ],
    },
  },
  {
    id: 'button-with-icon',
    name: 'Button — With Icon',
    category: 'Buttons',
    description: 'Labelled button with a leading icon; outline/secondary styling.',
    styleProperties: [
      // Default — text-muted border (a step darker than tertiary's
      // `--color-border`) gives this atom a more visible outline without
      // the accent shout. Tertiary stays softer with the lightest grey border.
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'states', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'states', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
      // Hover / Pressed — mirror button-primary's accent → accent-bold
      // progression with inverse text. The outlined-at-rest atom "wakes up
      // into" a filled primary-style button on interaction. Border matches
      // the fill so the button reads as fully filled in both states.
      { key: 'hoverBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverBorderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'activeBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeBorderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'active' } },
      // Focus
      { key: 'focusRingColor', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'focusColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'states', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
      // Shared style
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 20, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 32, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 8, min: 2, max: 16, step: 1, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600', '700'] },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 12, max: 24, step: 1, unit: 'px' },
      { key: 'gap', label: 'Icon Gap', control: 'number', defaultValue: 8, min: 2, max: 16, step: 1, unit: 'px' },
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
      { name: 'onClick', description: 'Fires on mouse click or Enter/Space activation while focused.', payload: 'MouseEvent<HTMLButtonElement>' },
      { name: 'onFocus', description: 'Fires when the button receives keyboard focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the button loses keyboard focus.', payload: 'FocusEvent' },
    ],
  },
  {
    id: 'button-icon',
    name: 'Button — Icon',
    category: 'Buttons',
    description: 'Standalone icon-only action button (e.g. "add", "create new"). Icon variant of the primary button family.',
    styleProperties: [
      // State-scoped knobs — one "States" section, filtered to the
      // currently-selected State variant via showWhen. Matches the Tag
      // convention (colors per type). Every state owns both background
      // and icon color so designers can tune contrast independently
      // (e.g. inverse icon on a bold pressed bg).
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'states', showWhen: { state: 'default' } },
      { key: 'color', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
      // Pressed
      { key: 'activeBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'states', showWhen: { state: 'active' } },
      // Focus
      { key: 'focusRingColor', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'focusColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'states', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
      // Always-visible sizing — shared across all states.
      { key: 'size', label: 'Size', control: 'number', defaultValue: 40, min: 24, max: 64, step: 4, unit: 'px' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 32, step: 1, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 18, min: 12, max: 32, step: 1, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'glyph',
        label: 'Glyph',
        options: ICON_OPTIONS,
        defaultValue: 'plus',
      },
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
      { name: 'onClick', description: 'Fires on mouse click or Enter/Space activation while focused.', payload: 'MouseEvent<HTMLButtonElement>' },
      { name: 'onFocus', description: 'Fires when the button receives keyboard focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the button loses keyboard focus.', payload: 'FocusEvent' },
    ],
  },

  // ── Inputs ──
  {
    id: 'input-text',
    name: 'Text Input',
    category: 'Inputs',
    description: 'Standard text input field with label. State knobs cover default / hover / focus / disabled / error — error replaces the previous standalone `Input with Error` atom (one tone surface, one shape surface).',
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Label + Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      // Label theming AND label position live on FormField. This atom
      // is just the input element — no label rendered, no labelPosition
      // variant. Wrap with `<FormField>` when you want a label.
      // Previously had `labelColor` knob + shared `labelPositionVariant`
      // here; both only affected the workbench preview's hand-rolled
      // label and have been removed as part of the consolidation pass.
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
    ],
    events: [
      { name: 'onChange', description: 'Fires after the user commits a change (blur or Enter).', payload: '{ value: string }' },
      { name: 'onInput', description: 'Fires on every keystroke. High-frequency — use for live validation, not for save.', payload: '{ value: string }' },
      { name: 'onFocus', description: 'Fires when the field receives focus (click or Tab).', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the field loses focus.', payload: 'FocusEvent' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'TextInput',
      props: [
        { name: 'value', type: 'string', description: 'Current value (controlled).' },
        { name: 'onChange', type: '(e: ChangeEvent<HTMLInputElement>) => void', description: 'Change handler. Read `e.target.value`.' },
        { name: 'placeholder', type: 'string', description: 'Placeholder shown when empty.' },
        { name: 'type', type: '"text" | "email" | "tel" | "url" | "password" | "search"', defaultValue: '"text"', description: 'Native input type — affects keyboard and validation hints on mobile.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input.' },
        { name: 'clearable', type: 'boolean', defaultValue: 'true', description: 'Show a clear (✕) button at the trailing edge when the field has content. On by default; the ✕ self-clears and fires `onChange` with "", so no wiring is needed for controlled fields. Pass `false` to opt out.' },
        { name: 'onClear', type: '() => void', description: 'Optional override for the clear action. By default the field clears itself (and notifies via `onChange`); pass `onClear` only for custom reset logic beyond emptying the value.' },
        { name: '...rest', type: 'InputHTMLAttributes<HTMLInputElement>', description: 'All other native input attributes (aria-label, name, autoComplete, etc.) pass through.' },
      ],
    },
  },
  {
    id: 'editable-cell',
    name: 'Editable Cell',
    category: 'Inputs',
    description: 'Inline-editable cell. Text / number swap the display for an input (Enter or blur commits, Esc cancels); date pairs the input with a Calendar popover — type a date or pick a day, either commits an ISO date string; select is pick-only — clicking opens a Listbox dropdown and picking an option commits its value immediately (display can still be a custom Tag/Badge via `format`); multiselect is select\'s array sibling — a MultiListbox toggles options with the panel open, the value is a string[] of picked option values shown as joined labels. Problems surface in a popover Banner under the cell — warning (yellow) for sync validate failures, error (red) for a rejected async `onCommit` — so the table row never changes height. Designed for DataTable cells but works anywhere an inline-edit pattern fits (PageHeader rename, StatCard label, etc.).',
    styleProperties: [
      // Layout — shared across all states (no showWhen).
      { key: 'minHeight', label: 'Min Height', control: 'number', defaultValue: 24, min: 18, max: 48, step: 2, unit: 'px' },
      { key: 'maxWidth', label: 'Max Width', control: 'number', defaultValue: 320, min: 120, max: 640, step: 10, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 6, min: 2, max: 16, step: 1, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 2, min: 0, max: 10, step: 1, unit: 'px' },
      { key: 'radius', label: 'Border Radius', control: 'slider', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px' },
      // Display chrome — one knob per peer state, matching the input
      // family's default / hover / focus / disabled convention. Each is
      // gated to its own state so the panel shows only what's relevant.
      { key: 'placeholderColor', label: 'Placeholder Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'cellColors', showWhen: { state: 'default' } },
      { key: 'hoverBg', label: 'Hover Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'cellColors', showWhen: { state: 'hover' } },
      // The hover affordance differs by type: text / number / date reveal a pencil,
      // the pickers (select / multiselect) reveal a chevron. Gate each so only the
      // relevant one shows under Hover.
      { key: 'pencilColor', label: 'Pencil Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'cellColors', showWhen: { state: 'hover', type: '!select|multiselect' } },
      { key: 'chevronColor', label: 'Chevron Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'cellColors', showWhen: { state: 'hover', type: 'select|multiselect' } },
      { key: 'focusBorder', label: 'Focus Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'cellColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Focus Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'cellColors', showWhen: { state: 'focus' } },
      { key: 'disabledOpacity', label: 'Disabled Opacity', control: 'slider', defaultValue: 0.55, min: 0.2, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Editing — the active input swapped in on click.
      { key: 'inputBg', label: 'Input Background', control: 'color', defaultValue: 'var(--color-card)', section: 'editingColors', showWhen: { state: 'editing' } },
      { key: 'inputColor', label: 'Input Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'editingColors', showWhen: { state: 'editing' } },
      { key: 'inputBorder', label: 'Input Border', control: 'color', defaultValue: 'var(--color-border)', section: 'editingColors', showWhen: { state: 'editing' } },
      { key: 'inputFocusBorder', label: 'Input Focus Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'editingColors', showWhen: { state: 'editing' } },
      // Problem severities — each tints the editing input's border; the
      // message itself rides in a popover Banner whose look comes from the
      // Banner atom's own warning / error tokens (not per-cell knobs), so
      // problems read identically everywhere in the product.
      { key: 'warningBorder', label: 'Input Border', control: 'color', defaultValue: 'var(--color-warning-text)', section: 'warningColors', showWhen: { state: 'warning' } },
      { key: 'errorBorder', label: 'Input Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorColors', showWhen: { state: 'error' } },
    ],
    layoutVariants: [
      {
        // Editor-only state switcher (ephemeral — variants never reach the
        // saved overrides). Peer states mirror the rest of the input family
        // (default / hover / focus / disabled / error); `editing` is
        // EditableCell-specific — the input swapped in on click — and
        // `warning` is the recoverable-validation severity (vs `error` =
        // failed save). The preview forces each state visually so its knobs
        // are tunable without interaction. `submitting` is intentionally
        // absent: it has no knobs of its own (it reuses the editing chrome
        // with a disabled input).
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'focus', label: 'Focus' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'editing', label: 'Editing' },
          { value: 'warning', label: 'Warning' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'default',
      },
      {
        key: 'type',
        label: 'Type',
        options: [
          { value: 'text', label: 'Text' },
          { value: 'number', label: 'Number' },
          { value: 'date', label: 'Date' },
          { value: 'select', label: 'Select' },
          { value: 'multiselect', label: 'Multi-select' },
        ],
        defaultValue: 'text',
      },
      {
        // One format drives everything the user sees on a date cell —
        // the rendered value, the empty-cell hint, the input mask, and
        // parsing. Committed values stay ISO regardless.
        key: 'dateFormat',
        label: 'Date Format',
        options: [
          { value: 'ymd', label: 'YYYY-MM-DD' },
          { value: 'dmy', label: 'DD/MM/YYYY' },
          { value: 'mdy', label: 'MM/DD/YYYY' },
        ],
        defaultValue: 'ymd',
        showWhen: { type: 'date' },
      },
      {
        key: 'align',
        label: 'Align',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ],
        defaultValue: 'left',
      },
    ],
    events: [
      { name: 'onCommit', description: 'Fires when the user confirms a change (Enter, or blur with no validation error; for multiselect, each toggle). Async — the atom shows a submitting state until the returned promise settles.', payload: '(next: string | number | string[]) => void | Promise<void>' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'EditableCell',
      props: [
        { name: 'value', type: 'string | number | string[]', required: true, description: 'Current committed value (a string[] of picked option values for multiselect). The atom keeps a draft internally during edit.' },
        { name: 'onCommit', type: '(next: string | number | string[]) => void | Promise<void>', required: true, description: "Called when the user commits a change. Async — reject the promise to surface a red error Banner in the cell's popover and keep the cell in edit mode for retry (multiselect reverts its optimistic toggle)." },
        { name: 'type', type: '"text" | "number" | "date" | "select" | "multiselect"', defaultValue: '"text"', description: 'Editor type. Number coerces to Number on commit; date pairs a masked input with a Calendar popover — typing and picking both commit a normalized ISO date string; select is pick-only — a Listbox dropdown whose chosen option\'s value commits immediately; multiselect toggles options in a MultiListbox and commits a string[].' },
        { name: 'dateFormat', type: '"mdy" | "dmy" | "ymd"', defaultValue: '"ymd"', description: 'Display / typing format for date cells (same options as DateInput): one format drives the rendered value, the empty-cell hint, the input mask, and parsing. Committed values stay ISO regardless — presentation, not storage.' },
        { name: 'options', type: '{ value: string; label: string }[]', description: 'Options for `type="select"` / `"multiselect"`. Picking one commits its `value` (or toggles it into the array); display shows the `label`(s) unless `format` overrides it.' },
        { name: 'searchable', type: 'boolean', description: 'Show a search box in the dropdown. Defaults to auto — shown only when there are more than 6 options.' },
        { name: 'clearable', type: 'boolean', description: 'For select / multiselect: show a "Clear" action in the dropdown footer that commits an empty value ("" / [], the cell then shows its placeholder). Use for optional pickers.' },
        { name: 'align', type: '"left" | "right" | "center"', defaultValue: '"left"', description: "Text alignment for both display and edit modes — pass through from a DataTable column's `align`." },
        { name: 'format', type: '(value: string | number | string[]) => ReactNode', description: 'Display-mode formatter (receives a string[] for multiselect — e.g. render chips). The raw value is still what gets edited.' },
        { name: 'validate', type: '(next: string | number | string[]) => string | null | undefined', description: "Synchronous validation. Return a message to block commit — it surfaces as a yellow warning Banner in the cell's popover (recoverable input problem, vs the red error Banner for a failed save)." },
        { name: 'disabled', type: 'boolean', description: 'Read-only — clicking does nothing, no edit affordance.' },
        { name: 'placeholder', type: 'string', description: 'Shown when value is empty / blank.' },
      ],
    },
  },
  {
    id: 'input-with-icon',
    name: 'Input with Icon',
    category: 'Inputs',
    description: 'Text input with a leading icon — search-style field. State knobs cover default / hover / focus / disabled / error.',
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'iconColor', label: 'Icon', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 99, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 12, max: 24, step: 1, unit: 'px' },
      { key: 'iconOffset', label: 'Icon Offset', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px' },
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
    ],
    events: [
      { name: 'onChange', description: 'Fires after the user commits a change (blur or Enter).', payload: '{ value: string }' },
      { name: 'onInput', description: 'Fires on every keystroke. High-frequency — use for live validation, not save.', payload: '{ value: string }' },
      { name: 'onClear', description: 'Fires when the user clicks the trailing clear (×) affordance.', payload: 'void' },
      { name: 'onFocus', description: 'Fires when the field receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the field loses focus.', payload: 'FocusEvent' },
    ],
  },
  {
    id: 'password-input',
    name: 'Password Input',
    category: 'Inputs',
    description: "Password entry field with a trailing show/hide eye toggle. State knobs cover default / hover / focus / disabled / error; the trailing toggle has its own hover knob since it's an interactive button. The toggle can be disabled per-instance with the `toggle` variant for stricter UX.",
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'iconColor', label: 'Toggle Icon', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 99, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      { key: 'iconSize', label: 'Toggle Size', control: 'number', defaultValue: 16, min: 12, max: 24, step: 1, unit: 'px' },
      { key: 'iconOffset', label: 'Toggle Offset', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px' },
      { key: 'iconHoverColor', label: 'Toggle Hover', control: 'color', defaultValue: 'var(--color-text)' },
    ],
    layoutVariants: [
      // No `toggle` variant. The show/hide eye is a consumer-code decision
      // (the `toggle` prop on PasswordInput), not a design-system decision —
      // turning it off doesn't introduce a new theming surface, the trailing
      // button simply isn't rendered. Same pattern as InputWithIcon's
      // `clearable` prop: exposed on the component, not promoted to a UXM
      // variant. Designers theme the canonical shape (toggle on) and call
      // sites override at the prop layer when policy demands a strict field.
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
      { name: 'onChange', description: 'Fires on every keystroke. `e.target.value` is the password text.', payload: 'ChangeEvent<HTMLInputElement>' },
      { name: 'onToggleVisible', description: 'Fires when the user clicks the show/hide eye toggle.', payload: '{ visible: boolean }' },
      { name: 'onFocus', description: 'Fires when the field receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the field loses focus.', payload: 'FocusEvent' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'PasswordInput',
      props: [
        { name: 'value', type: 'string', description: 'Current value (controlled).' },
        { name: 'onChange', type: '(e: ChangeEvent<HTMLInputElement>) => void', description: 'Change handler — `e.target.value` is the password.' },
        { name: 'toggle', type: 'boolean', defaultValue: 'true', description: 'Render the trailing show/hide eye toggle. Pass `false` to suppress.' },
        { name: 'visible', type: 'boolean', description: 'Visibility (controlled). Pair with `onToggleVisible` to drive the toggle externally.' },
        { name: 'defaultVisible', type: 'boolean', defaultValue: 'false', description: 'Initial visibility for uncontrolled toggle usage.' },
        { name: 'onToggleVisible', type: '(visible: boolean) => void', description: 'Fires when the user clicks the eye toggle.' },
        { name: 'autoComplete', type: 'string', defaultValue: '"current-password"', description: 'Browser autofill hint — `current-password` for sign-in, `new-password` for sign-up.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input and the toggle.' },
        { name: '...rest', type: 'InputHTMLAttributes<HTMLInputElement>', description: 'All other native input attributes (placeholder, name, aria-label, etc.) pass through.' },
      ],
    },
  },
  {
    id: 'date-input',
    name: 'Date Input',
    category: 'Inputs',
    description: "Date entry field with a trailing calendar icon and format-mask placeholder. State knobs cover default / hover / focus / disabled / error; the trailing calendar icon has its own hover knob since it's an interactive button.",
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'iconColor', label: 'Icon', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 99, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 12, max: 24, step: 1, unit: 'px' },
      { key: 'iconOffset', label: 'Icon Offset', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px' },
      { key: 'iconHoverColor', label: 'Icon Hover', control: 'color', defaultValue: 'var(--color-text)' },
    ],
    layoutVariants: [
      {
        key: 'mode',
        label: 'Mode',
        options: [
          { value: 'single', label: 'Single Date' },
          { value: 'range', label: 'Range' },
        ],
        defaultValue: 'single',
      },
      {
        key: 'format',
        label: 'Format',
        options: [
          { value: 'mdy', label: 'MM/DD/YYYY' },
          { value: 'dmy', label: 'DD/MM/YYYY' },
          { value: 'ymd', label: 'YYYY-MM-DD' },
        ],
        defaultValue: 'mdy',
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
      { name: 'onChange', description: 'Fires when the picker selects a date or the user commits a manual edit.', payload: '{ value: Date | null }' },
      { name: 'onOpen', description: 'Fires when the calendar popover opens.', payload: 'void' },
      { name: 'onClose', description: 'Fires when the calendar popover closes (selection or outside click).', payload: 'void' },
      { name: 'onFocus', description: 'Fires when the field receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the field loses focus.', payload: 'FocusEvent' },
    ],
  },
  {
    id: 'time-input',
    name: 'Time Input',
    category: 'Inputs',
    description: 'Time entry field with a trailing clock icon and an HH:MM mask. The `12h` format adds an AM/PM selector at the trailing edge. State knobs cover default / hover / focus / disabled / error.',
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'iconColor', label: 'Icon', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 99, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 12, max: 24, step: 1, unit: 'px' },
      { key: 'iconOffset', label: 'Icon Offset', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px' },
      { key: 'iconHoverColor', label: 'Icon Hover', control: 'color', defaultValue: 'var(--color-text)' },
      // 12h-mode-only — the AM/PM suffix is a quiet inline label (no chip
      // background), so only the text color is themable. Gated by `showWhen`
      // so the knob only surfaces in 12h mode, matching DateInput's
      // range-mode-only knobs precedent.
      { key: 'meridiemColor', label: 'AM/PM Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'meridiem', showWhen: { format: '12h' } },
      // Popover knobs — the column-scroll picker that opens when the
      // clock icon is clicked. Grouped into their own section so the
      // panel reads as "the floating surface" distinct from the field.
      { key: 'popoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'popover' },
      { key: 'popoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'popover' },
      { key: 'popoverRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px', section: 'popover' },
      { key: 'popoverHeadBg', label: 'Column Heading', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'popover' },
      // Row hover + selected defaults align with the Listbox option
      // tokens (`--uxm-listbox-option-{active,selected}-{bg,color}`) so a
      // selected time visually matches a selected listbox option out of
      // the box. TimeInput keeps its own knobs (the columns aren't a
      // Listbox), but the defaults stay in lockstep — designers can tune
      // them independently if they want a different time-picker palette.
      { key: 'popoverRowHoverBg', label: 'Row Hover', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'popover' },
      { key: 'popoverRowSelectedBg', label: 'Selected Row', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'popover' },
      { key: 'popoverRowSelectedColor', label: 'Selected Text', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'popover' },
    ],
    layoutVariants: [
      {
        key: 'format',
        label: 'Format',
        options: [
          { value: '24h', label: '24-hour (HH:MM)' },
          { value: '12h', label: '12-hour (HH:MM AM/PM)' },
        ],
        defaultValue: '24h',
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
      { name: 'onChange', description: 'Fires on every keystroke, meridiem flip, or popover column pick. Payload is the masked, joined value (`HH:MM` for 24h, `HH:MM AM/PM` for 12h).', payload: '{ value: string }' },
      { name: 'onOpen', description: 'Fires when the time-picker popover opens.', payload: 'void' },
      { name: 'onClose', description: 'Fires when the time-picker popover closes (selection or outside click).', payload: 'void' },
      { name: 'onFocus', description: 'Fires when the field receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the field loses focus.', payload: 'FocusEvent' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'TimeInput',
      props: [
        { name: 'value', type: 'string', description: 'Current value (controlled). 24h: `"HH:MM"`. 12h: `"HH:MM AM"` or `"HH:MM PM"`.' },
        { name: 'onChange', type: '(value: string) => void', description: 'Called with the masked, joined value after each edit.' },
        { name: 'format', type: '"24h" | "12h"', defaultValue: '"24h"', description: 'Clock convention. `12h` adds an AM/PM selector and a third popover column.' },
        { name: 'clock', type: 'boolean', defaultValue: 'true', description: 'Render the trailing clock icon. Pass `false` for an icon-less field.' },
        { name: 'picker', type: 'boolean', defaultValue: 'true', description: 'Mount the click-list popover (hour / minute / AM-PM). Pass `false` for a typing-only field — the clock icon stays decorative.' },
        { name: 'minuteStep', type: 'number', defaultValue: '1', description: "Increment shown in the minute column of the popover. Off-step values typed into the field are still included (sorted), so a typed `09:03` under `minuteStep={5}` doesn't vanish." },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input, the AM/PM selector, and the picker trigger.' },
        { name: '...rest', type: 'InputHTMLAttributes<HTMLInputElement>', description: 'All other native input attributes (placeholder, name, aria-label, etc.) pass through.' },
      ],
    },
  },
  {
    id: 'phone-input',
    name: 'Phone Input',
    category: 'Inputs',
    description: 'International phone field: leading country picker (flag + dial code) with a searchable popover, followed by a national number input with per-country digit masking. Value is an object `{ country, number }` — `country` is the ISO-3166 alpha-2 code, `number` is raw digits. The component handles display formatting and consumers get clean digits back.',
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'countryHoverBg', label: 'Country Hover', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared geometry — same across all states
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 99, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      // Shared trim — picker chrome that stays constant across states.
      // Country divider + caret don't morph between hover / focus /
      // disabled in any meaningful way (the field bg + border do all
      // the state work). Keeping them out of the per-state section
      // prevents the misleading "tune these per state" affordance.
      { key: 'dividerColor', label: 'Country Divider', control: 'color', defaultValue: 'var(--color-border)' },
      { key: 'caretColor', label: 'Caret', control: 'color', defaultValue: 'var(--color-text-muted)' },
      // Popover knobs — the searchable country list under the field.
      { key: 'popoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'popover' },
      { key: 'popoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'popover' },
      { key: 'popoverRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px', section: 'popover' },
      { key: 'popoverRowHoverBg', label: 'Row Hover', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'popover' },
      { key: 'popoverRowSelectedBg', label: 'Selected Row', control: 'color', defaultValue: 'var(--color-accent)', section: 'popover' },
      { key: 'popoverRowSelectedColor', label: 'Selected Text', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'popover' },
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
    ],
    events: [
      { name: 'onChange', description: 'Fires on every keystroke and on country pick. Payload is the next `{ country, number }` object.', payload: '{ country: string, number: string }' },
      { name: 'onOpen', description: 'Fires when the country popover opens.', payload: 'void' },
      { name: 'onClose', description: 'Fires when the country popover closes (selection or outside click).', payload: 'void' },
      { name: 'onFocus', description: 'Fires when either the country button or national-number input receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when focus leaves the field.', payload: 'FocusEvent' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'PhoneInput',
      props: [
        { name: 'value', type: '{ country: string, number: string }', description: 'Controlled value. `country` is an ISO-3166 alpha-2 code; `number` is raw digits.' },
        { name: 'onChange', type: '(value: PhoneValue) => void', description: 'Called with the next value after each keystroke or country pick.' },
        { name: 'defaultValue', type: 'PhoneValue', defaultValue: '{ country: "US", number: "" }', description: 'Initial value for uncontrolled usage.' },
        { name: 'countries', type: 'PhoneCountry[]', defaultValue: 'CURATED_COUNTRIES', description: 'Country list shown in the picker. Default is ~30 curated countries; pass a custom list to extend or restrict coverage.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the field and country picker.' },
        { name: '...rest', type: 'InputHTMLAttributes<HTMLInputElement>', description: 'All other native input attributes (placeholder, name, aria-label, etc.) pass through to the national-number input.' },
      ],
    },
  },
  {
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
  },
  {
    id: 'number-stepper',
    name: 'Number Stepper',
    category: 'Inputs',
    description: 'Numeric input with explicit ± step buttons and an optional unit suffix. Suppresses the native browser spinner — the explicit buttons own the increment/decrement affordance and theming surface. State knobs cover default / hover / focus / disabled on the input sub-element (mirrors the input-text family pattern). Sister atoms: `Number Input` (plain typing-only, no buttons) and `Currency Input` (typing + locale formatting + currency picker).',
    styleProperties: [
      // ── Per-state input colors. Same shape as input-text: each state
      // owns its bg / border / text colors, plus standalone focus-ring
      // and disabled-opacity. Steppers and unit suffix stay shared
      // across states (separate sub-elements).
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error — out-of-range typed values, server-side rejection, or
      // custom business-rule failures (step buttons can't be the
      // sole error trigger because they enforce min/max themselves;
      // error mode is for the typing path + external validation).
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // ── Shared input geometry (applies to every state)
      { key: 'inputWidth', label: 'Input Width', control: 'number', defaultValue: 64, min: 32, max: 160, step: 4, unit: 'px' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 6, min: 0, max: 12, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 8, min: 2, max: 16, step: 1, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 6, min: 2, max: 12, step: 1, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 12, min: 10, max: 18, step: 1, unit: 'px' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px' },
      // ± step buttons compose the `IconButton` atom — their size /
      // radius / hover state / focus ring come from IconButton's own
      // registry knobs, not from NumberStepper. Tune IconButton once
      // in the workbench and every consumer (including this stepper,
      // toolbar icon buttons, etc.) inherits the look automatically.
      // ── Unit suffix (shared)
      { key: 'unitColor', label: 'Unit Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'unit' },
      { key: 'unitSize', label: 'Unit Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px', section: 'unit' },
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
    ],
    events: [
      { name: 'onChange', description: 'Fires when the value changes — typing, stepper click, or paste.', payload: '{ value: number }' },
      { name: 'onIncrement', description: 'Fires when the user clicks the up stepper.', payload: 'void' },
      { name: 'onDecrement', description: 'Fires when the user clicks the down stepper.', payload: 'void' },
      { name: 'onFocus', description: 'Fires when the input receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the input loses focus.', payload: 'FocusEvent' },
    ],
  },
  {
    id: 'number-input',
    name: 'Number Input',
    category: 'Inputs',
    description: 'Plain typing-only numeric field — no increment/decrement buttons (use `Number Field` for that, soon to be renamed `Stepper`). Masks non-digits in real time; optional sign and decimal support; min/max clamping on blur. For monetary values use `Currency Input`. State knobs cover default / hover / focus / disabled / error on the input itself (the root IS the visible surface, same shape as `Text Input`).',
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Label + Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      // Number-specific: digits read more naturally right-aligned in
      // tables and forms with mixed-width numbers, but the default
      // mirrors text-input's left alignment so it drops in next to
      // other fields without surprise.
      { key: 'textAlign', label: 'Text Align', control: 'select', options: ['left', 'right'], defaultValue: 'left' },
    ],
    layoutVariants: [
      // No label-position variant — NumberInput is intentionally bare
      // (just the field). Labels, hints, and error messages are the
      // FormField atom's concern; consumers compose them together
      // when they need a labeled control.
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
      { name: 'onChange', description: 'Fires on every keystroke. Payload is the masked, digit-only string.', payload: '{ value: string }' },
      { name: 'onBlur', description: 'Fires when the field loses focus. Triggers min/max clamping if bounds are set.', payload: 'FocusEvent' },
      { name: 'onFocus', description: 'Fires when the field receives focus.', payload: 'FocusEvent' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'NumberInput',
      props: [
        { name: 'value', type: 'string', description: 'Current value as a digit string (controlled).' },
        { name: 'onChange', type: '(value: string) => void', description: 'Called with the masked, digit-only string on every keystroke.' },
        { name: 'defaultValue', type: 'string', description: 'Initial value for uncontrolled usage.' },
        { name: 'min', type: 'number', description: 'Lower bound. Clamping fires on blur, not per-keystroke.' },
        { name: 'max', type: 'number', description: 'Upper bound. Same blur-clamp behavior.' },
        { name: 'allowNegative', type: 'boolean', defaultValue: 'false', description: 'Allow a leading `-` sign.' },
        { name: 'allowDecimal', type: 'boolean', defaultValue: 'false', description: 'Allow a single `.` decimal separator.' },
        { name: 'decimals', type: 'number', defaultValue: '2', description: 'Max decimal places when `allowDecimal` is true. Excess digits are dropped during masking.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input.' },
        { name: '...rest', type: 'InputHTMLAttributes<HTMLInputElement>', description: 'All other native input attributes (placeholder, name, aria-label, etc.) pass through.' },
      ],
    },
  },
  {
    id: 'currency-input',
    name: 'Currency Input',
    category: 'Inputs',
    description: "Monetary input with a leading interactive currency picker (searchable popover, ~20 curated currencies by default). End users pick the currency at runtime — there's no design-time currency variant. Value is an object `{ currency, amount }`; amount is the raw digit string (consumers get clean data, the component owns display formatting). Standard finance UX: focus reveals raw digits, blur renders locale-formatted with thousands separators.",
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'pickerHoverBg', label: 'Picker Hover', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared geometry — same across all states
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      // Shared trim — picker chrome that stays constant across states.
      // Symbol / caret / divider don't morph between hover / focus /
      // disabled in any meaningful way (the field bg + border do all
      // the state work). Keeping them out of the per-state section
      // prevents the misleading "tune these per state" affordance.
      { key: 'dividerColor', label: 'Picker Divider', control: 'color', defaultValue: 'var(--color-border)' },
      { key: 'symbolColor', label: 'Symbol', control: 'color', defaultValue: 'var(--color-text)' },
      { key: 'caretColor', label: 'Caret', control: 'color', defaultValue: 'var(--color-text-muted)' },
      // Popover knobs — the searchable currency list under the field.
      { key: 'popoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'popover' },
      { key: 'popoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'popover' },
      { key: 'popoverRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px', section: 'popover' },
      { key: 'popoverRowHoverBg', label: 'Row Hover', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'popover' },
      { key: 'popoverRowSelectedBg', label: 'Selected Row', control: 'color', defaultValue: 'var(--color-accent)', section: 'popover' },
      { key: 'popoverRowSelectedColor', label: 'Selected Text', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'popover' },
    ],
    layoutVariants: [
      // No `currency` variant — that's an end-user runtime choice
      // handled by the picker. The picker always sits on the left
      // (the prefix `$1,234.56` read), so there's no position knob.
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
      { name: 'onChange', description: 'Fires on every keystroke or currency pick. Payload is the next `{ currency, amount }` object.', payload: '{ currency: string, amount: string }' },
      { name: 'onOpen', description: 'Fires when the currency popover opens.', payload: 'void' },
      { name: 'onClose', description: 'Fires when the currency popover closes (selection or outside click).', payload: 'void' },
      { name: 'onFocus', description: 'Fires when the amount input receives focus. Display flips from formatted to raw digits.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the amount input loses focus. Triggers min/max clamping AND switches display back to locale-formatted.', payload: 'FocusEvent' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'CurrencyInput',
      props: [
        { name: 'value', type: '{ currency: string, amount: string }', description: 'Controlled value. `currency` is an ISO 4217 code; `amount` is the raw digit string.' },
        { name: 'onChange', type: '(value: CurrencyValue) => void', description: 'Called with the next value after each keystroke or currency pick.' },
        { name: 'defaultValue', type: 'CurrencyValue', defaultValue: '{ currency: "USD", amount: "" }', description: 'Initial value for uncontrolled usage.' },
        { name: 'currencies', type: 'Currency[]', defaultValue: 'CURATED_CURRENCIES', description: 'List shown in the picker. Default is ~20 curated currencies. Pass a single-entry array to effectively lock currency selection.' },
        { name: 'locale', type: 'string', defaultValue: '"en-US"', description: 'BCP-47 locale tag. Drives thousands separator style on blur display.' },
        { name: 'allowNegative', type: 'boolean', defaultValue: 'false', description: 'Allow a leading `-` sign for refunds / credits.' },
        { name: 'clearable', type: 'boolean', defaultValue: 'true', description: 'Show a trailing clear (✕) button when the amount has a value. Clearing wipes the amount and keeps the selected currency.' },
        { name: 'min', type: 'number', description: 'Lower bound on the amount. Clamped on blur.' },
        { name: 'max', type: 'number', description: 'Upper bound on the amount. Clamped on blur.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input and the currency picker.' },
      ],
    },
  },
  {
    id: 'textarea',
    name: 'Textarea',
    category: 'Inputs',
    description: 'Multi-line text area. State knobs cover default / hover / focus / disabled / error.',
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Label + Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      { key: 'minHeight', label: 'Min Height', control: 'number', defaultValue: 100, min: 60, max: 300, step: 10, unit: 'px' },
      // Label theming + position live on FormField. See input-text for
      // the same consolidation rationale.
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
    ],
    events: [
      { name: 'onChange', description: 'Fires after the user commits a change (blur or Enter).', payload: '{ value: string }' },
      { name: 'onInput', description: 'Fires on every keystroke.', payload: '{ value: string }' },
      { name: 'onFocus', description: 'Fires when the textarea receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the textarea loses focus.', payload: 'FocusEvent' },
    ],
  },
  {
    id: 'file-upload',
    name: 'File Upload',
    category: 'Inputs',
    description: 'File-upload atom. Click anywhere on the drop area opens the system file picker; dragging files in fires the drag-over state and drop sends them to `onFiles`. Two state spaces: (1) drop-area state covers default / hover / drag-over / focus / disabled / error (page-level errors only), and (2) per-file lifecycle status — `queued | uploading | done | error` — lives on each `FileUploadFileMeta.status` and paints each row independently. The drop area never shows an aggregate progress bar; each row has its own. Visual-only atom: no built-in upload; `onFiles` returns native `File[]` for the caller to drive. v2 backlog: image rows render a `Thumbnail` preview keyed off MIME instead of the generic document glyph.',
    styleProperties: [
      // ── Per-state drop-area surface colors ──
      // Note: `dropAreaColors` (not the generic `fieldColors` used by
      // input-text / textarea / etc.) — the dropzone is a drop area, not
      // a text field. Same shape as fieldColors otherwise: bg / border /
      // text per state, gated by `showWhen: { state }`.
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'dropAreaColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'dropAreaColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'dropAreaColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'dropAreaColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'dropAreaColors', showWhen: { state: 'hover' } },
      // Drag-over — overlay style: only the surface bg / border / icon tint change.
      { key: 'dragBg', label: 'Background', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-accent) 8%, var(--color-card))', section: 'dragState', showWhen: { state: 'drag-over' } },
      { key: 'dragBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'dragState', showWhen: { state: 'drag-over' } },
      { key: 'dragAccent', label: 'Icon Tint', control: 'color', defaultValue: 'var(--color-accent)', section: 'dragState', showWhen: { state: 'drag-over' } },
      // Focus — paints via :focus-within on the label (the hidden input owns focus).
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'dropAreaColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Error — surface tint + dedicated message slot below the drop area.
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'dropAreaColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'dropAreaColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Message Color', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'dropAreaColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'dropAreaColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'dropAreaColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // ── Shared geometry (always visible) ──
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 12, min: 0, max: 24, step: 1, unit: 'px' },
      { key: 'borderStyle', label: 'Border Style', control: 'select', defaultValue: 'dashed', options: ['dashed', 'solid', 'dotted'] },
      { key: 'borderWidth', label: 'Border Width', control: 'slider', defaultValue: 1.5, min: 1, max: 4, step: 0.5, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 24, min: 8, max: 48, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 24, min: 8, max: 64, step: 2, unit: 'px' },
      { key: 'minHeight', label: 'Min Height', control: 'number', defaultValue: 160, min: 80, max: 320, step: 10, unit: 'px' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px' },
      // ── Icon sub-element ──
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 40, min: 20, max: 72, step: 2, unit: 'px', section: 'icon' },
      { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'icon' },
      // ── Text sub-elements ──
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 15, min: 12, max: 22, step: 1, unit: 'px', section: 'text' },
      { key: 'helpSize', label: 'Help Size', control: 'number', defaultValue: 13, min: 10, max: 16, step: 1, unit: 'px', section: 'text' },
      { key: 'helpColor', label: 'Help Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'text' },
      { key: 'allowedTypesSize', label: 'Allowed-types Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px', section: 'text' },
      { key: 'allowedTypesColor', label: 'Allowed-types Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'text' },
      // ── File-list row knobs (only consumed when `withList: on`) ──
      { key: 'rowBg', label: 'Row Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'fileList' },
      { key: 'rowBorder', label: 'Row Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fileList' },
      { key: 'rowRadius', label: 'Row Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px', section: 'fileList' },
      { key: 'rowGap', label: 'Row Gap', control: 'number', defaultValue: 6, min: 0, max: 16, step: 1, unit: 'px', section: 'fileList' },
      { key: 'rowPaddingX', label: 'Row Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px', section: 'fileList' },
      { key: 'rowPaddingY', label: 'Row Padding Y', control: 'number', defaultValue: 8, min: 2, max: 20, step: 1, unit: 'px', section: 'fileList' },
      { key: 'rowNameColor', label: 'Filename', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'fileList' },
      { key: 'rowMetaColor', label: 'Meta Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fileList' },
      { key: 'rowIconColor', label: 'File Icon', control: 'color', defaultValue: 'var(--color-accent)', section: 'fileList' },
      { key: 'removeIconColor', label: 'Remove Icon', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fileList' },
      // ── File List · Progress ──
      // Per-row progress strip (applied during status="uploading"). It's a
      // single thin colored bar painted directly on the row's bottom edge —
      // no separate track element, so no `progressTrack` knob (the row's
      // own background IS the implicit track at 2px height).
      { key: 'progressFill', label: 'Progress Fill', control: 'color', defaultValue: 'var(--color-accent)', section: 'fileListProgress' },
      { key: 'progressHeight', label: 'Progress Height', control: 'number', defaultValue: 2, min: 1, max: 6, step: 1, unit: 'px', section: 'fileListProgress' },
      // ── File List · Status ──
      // Per-status visual overrides — "what changes when a row succeeds or
      // fails." Grouped together because they're all conditional styling
      // on the same base row, not standalone properties of any one state.
      { key: 'rowDoneBg', label: 'Done Background', control: 'color', defaultValue: 'var(--color-success-bg)', section: 'fileListStatus' },
      { key: 'rowDoneBorderColor', label: 'Done Border', control: 'color', defaultValue: 'var(--color-success-border)', section: 'fileListStatus' },
      { key: 'rowDoneIconColor', label: 'Done Icon', control: 'color', defaultValue: 'var(--color-success-text)', section: 'fileListStatus' },
      { key: 'rowErrorBg', label: 'Error Background', control: 'color', defaultValue: 'var(--color-danger-bg)', section: 'fileListStatus' },
      { key: 'rowErrorBorderColor', label: 'Error Border', control: 'color', defaultValue: 'var(--color-danger-border)', section: 'fileListStatus' },
      { key: 'rowErrorIconColor', label: 'Error Icon', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fileListStatus' },
      { key: 'rowErrorMetaColor', label: 'Error Text', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fileListStatus' },
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'drag-over', label: 'Drag Over' },
          { value: 'focus', label: 'Focus' },
          { value: 'uploading', label: 'Uploading' },
          { value: 'error', label: 'Error' },
          { value: 'disabled', label: 'Disabled' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onFiles', description: 'Fires when the user picks files (via picker or drop). Receives a native `File[]`.', payload: 'File[]' },
      { name: 'onRemove', description: "Fires when a row's remove button is clicked (only when `showFileList` is on).", payload: '{ id: string }' },
      { name: 'onDragEnter', description: 'Fires when a drag enters the drop area.', payload: 'DragEvent' },
      { name: 'onDragLeave', description: 'Fires when a drag leaves the drop area.', payload: 'DragEvent' },
      { name: 'onError', description: 'Fires when the caller rejects a drop (e.g. wrong MIME). The atom never fires this on its own — drive it from your validation in `onFiles`.', payload: '{ reason: string }' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'FileUpload',
      props: [
        { name: 'onFiles', type: '(files: File[]) => void', description: 'Receives picked or dropped files.' },
        { name: 'onRemove', type: '(id: string) => void', description: "Called when a row's remove button is clicked. Only meaningful with `showFileList`." },
        { name: 'multiple', type: 'boolean', defaultValue: 'true', description: 'Allow selecting more than one file at a time. Maps to `<input multiple>`.' },
        { name: 'accept', type: 'string', description: 'Standard `<input accept>` filter, e.g. `"image/*"` or `".pdf,.docx"`. Runtime prop — not a workbench knob.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables click + drop interactions.' },
        { name: 'titleText', type: 'string', defaultValue: '"Upload a file"', description: 'Heading inside the drop area.' },
        { name: 'helpText', type: 'string', description: 'Hint line under the title. Defaults to a `multiple`-aware string if omitted.' },
        { name: 'allowedTypesText', type: 'string', description: 'Optional constraint line below the help text — e.g. "PDF, DOCX · up to 10 MB". Caller-controlled copy: the atom never invents it and never enforces it. Keep it in sync with the `accept` filter and your `onFiles` validation. If omitted, no slot renders.' },
        { name: 'error', type: 'string', description: 'Page-level error message (e.g. "Connection lost"). Paints the drop area in the `error` state and renders the message below it. Named `error` to match the rest of the input family. Distinct from per-file errors — set `status: "error"` + `errorMessage` on a `FileUploadFileMeta` for single-file failures.' },
        { name: 'errorMessage', type: 'string', description: 'Deprecated alias for `error` (back-compat); `error` wins when both are set.' },
        { name: 'files', type: 'FileUploadFileMeta[]', description: "Files to display in the inline list under the drop area. Each row: `{ id, name, size, status?, progress?, errorMessage? }`. `status` is `queued | uploading | done | error` and drives row rendering independently. List is always rendered when `files.length > 0` — to keep the list elsewhere on the page, just don't pass `files` to the atom." },
        { name: 'state', type: '"default" | "drag-over" | "uploading" | "error"', description: 'Drop-area visual state. Caller-controlled — the atom never auto-derives this from per-file statuses. Set `"uploading"` for batch lockouts / pre-file validation / indeterminate uploads; the help text swaps to "Uploading…" and `aria-busy` is applied. Per-file states (queued/uploading/done/error) live on each `FileUploadFileMeta.status` and are orthogonal to this.' },
        { name: 'iconGlyph', type: 'string', defaultValue: '"cloud-arrow-up"', description: 'Override the drop-area icon glyph.' },
      ],
    },
  },
  {
    id: 'select-dropdown',
    name: 'Select / Dropdown',
    category: 'Inputs',
    description: 'Dropdown selection field — internally a Listbox-backed picker. This entry themes the trigger (default / hover / focus / disabled / error); the trigger is identical whether or not the panel searches, so searchability isn\'t a knob here — it\'s the `searchable` prop (default auto: the panel grows a search box once the option list is long enough), and the search box itself is previewed + themed in the Listbox entry. For a search-first combobox with its own trigger chrome (icon glyphs, dial codes), use the SearchDropdown atom instead.',
    styleProperties: [
      // Default
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'fieldColors', showWhen: { state: 'default' } },
      // Hover
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'hover' } },
      // Focus
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'fieldColors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fieldColors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fieldColors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Label + Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      // Label theming + position live on FormField. See input-text for
      // the same consolidation rationale.
      // The search input's placeholder is NOT a workbench knob: its TEXT
      // is per-instance content the consumer passes at the call site (the
      // searchable Select renders the shared Listbox panel), and its only
      // themeable aspect — the placeholder COLOR — lives once on the
      // `listbox` entry (`searchPlaceholderColor`). A text knob here would
      // also serialize to a dead `--uxm-…-search-placeholder` CSS var that
      // paints nothing.
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
      // Behavioral variants — they change WHAT gets shown, not how the
      // trigger looks. Style knobs (colors, padding, font) apply across
      // all of these. (Searchability is deliberately NOT here: the trigger
      // is identical with/without search, and the search box is previewed
      // in the Listbox entry — see this component's description.)
      {
        key: 'multiSelect',
        label: 'Mode',
        options: [
          { value: 'single', label: 'Single' },
          { value: 'multi', label: 'Multi' },
        ],
        defaultValue: 'single',
      },
      {
        key: 'clearable',
        label: 'Clearable',
        options: [
          { value: 'off', label: 'Off' },
          { value: 'on', label: 'On' },
        ],
        defaultValue: 'off',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires when the user picks a different option.', payload: '{ value: string }' },
      { name: 'onFocus', description: 'Fires when the select receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the select loses focus.', payload: 'FocusEvent' },
    ],
  },
  {
    id: 'search-dropdown',
    name: 'Search Dropdown',
    category: 'Inputs',
    description: 'Combobox: trigger button opens a popover with a search input + filtered list. Use for long option lists (icon glyphs, country codes, large enums); native Select covers short ones. Keyboard-navigable (ArrowUp/Down, Enter, Escape) and click-outside-aware. Trigger state coverage matches the rest of the input family — default / hover / focus / disabled / error.',
    styleProperties: [
      // Default — trigger
      { key: 'triggerBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'triggerColors', showWhen: { state: 'default' } },
      { key: 'triggerBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'triggerColors', showWhen: { state: 'default' } },
      { key: 'triggerColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'triggerColors', showWhen: { state: 'default' } },
      // Hover — trigger
      { key: 'triggerHoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'triggerColors', showWhen: { state: 'hover' } },
      { key: 'triggerHoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'triggerColors', showWhen: { state: 'hover' } },
      // Focus — trigger
      { key: 'triggerFocusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'triggerColors', showWhen: { state: 'focus' } },
      { key: 'triggerFocusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled — trigger
      { key: 'triggerDisabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'triggerColors', showWhen: { state: 'disabled' } },
      { key: 'triggerDisabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'triggerColors', showWhen: { state: 'disabled' } },
      { key: 'triggerDisabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'triggerColors', showWhen: { state: 'disabled' } },
      { key: 'triggerDisabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error — trigger
      { key: 'triggerErrorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'triggerColors', showWhen: { state: 'error' } },
      { key: 'triggerErrorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'triggerColors', showWhen: { state: 'error' } },
      { key: 'triggerErrorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'triggerErrorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shared — trigger
      { key: 'triggerRadius', label: 'Trigger Radius', control: 'slider', defaultValue: 6, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'triggerPaddingX', label: 'Trigger Padding X', control: 'number', defaultValue: 12, min: 4, max: 20, step: 1, unit: 'px' },
      { key: 'triggerPaddingY', label: 'Trigger Padding Y', control: 'number', defaultValue: 10, min: 2, max: 14, step: 1, unit: 'px' },
      { key: 'triggerFontSize', label: 'Trigger Font Size', control: 'number', defaultValue: 14, min: 10, max: 18, step: 1, unit: 'px' },
      // SearchDropdown's popover is owned by the shared Listbox atom —
      // see the `listbox` registry entry for panel chrome (bg, border,
      // radius, shadow), option row states (hover, selected, disabled),
      // search input, group headers, empty + footer slots. Tune Listbox
      // once and every dropdown in the app reflects it.
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
    ],
    events: [
      { name: 'onChange', description: 'Fires when the user picks an option from the dropdown (click or Enter).', payload: '{ value: string }' },
      { name: 'onSearch', description: 'Fires as the user types in the search box. Use to debounce server-side filtering.', payload: '{ query: string }' },
      { name: 'onOpen', description: 'Fires when the popover opens (trigger click or keyboard activation).', payload: 'void' },
      { name: 'onClose', description: 'Fires when the popover closes (selection, Escape, or outside click).', payload: 'void' },
    ],
  },
  {
    id: 'listbox',
    name: 'Listbox (Dropdown Panel)',
    category: 'Inputs',
    description: "Shared dropdown panel used by every select / picker in the app (SearchDropdown, PhoneInput country, CurrencyInput, PillSelect, native Select replacement, ColorPicker). The atom is generic over item shape — consumers pass items + a renderItem and own the trigger entirely. This entry themes the PANEL only: chrome, search input, option rows + states, group headers, empty state, footer. Trigger / field theming lives on each consuming component's own registry entry.",
    styleProperties: [
      // Panel chrome — the floating card.
      { key: 'panelBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'panel' },
      { key: 'panelBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'panel' },
      { key: 'panelRadius', label: 'Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px', section: 'panel' },
      // Drop shadow — decomposed into Color / Blur / Offset Y (colour picker
      // + sliders) instead of a raw box-shadow text field. Same pattern as
      // the Calendar / Menu atoms; the box-shadow is composed from these
      // three vars in listbox.scss.
      { key: 'shadowColor', label: 'Color', control: 'color', defaultValue: 'rgba(0, 0, 0, 0.10)', section: 'shadow' },
      { key: 'shadowBlur', label: 'Blur', control: 'slider', defaultValue: 20, min: 0, max: 48, step: 1, unit: 'px', section: 'shadow' },
      { key: 'shadowOffsetY', label: 'Offset Y', control: 'slider', defaultValue: 6, min: 0, max: 24, step: 1, unit: 'px', section: 'shadow' },
      { key: 'panelMaxHeight', label: 'Max Height', control: 'number', defaultValue: 320, min: 120, max: 600, step: 20, unit: 'px', section: 'panel' },

      // Search input — only meaningful when the consumer enables search.
      { key: 'searchBorder', label: 'Divider', control: 'color', defaultValue: 'var(--color-border)', section: 'search', showWhen: { withSearch: 'yes' } },
      { key: 'searchIconColor', label: 'Icon', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'search', showWhen: { withSearch: 'yes' } },
      { key: 'searchColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'search', showWhen: { withSearch: 'yes' } },
      { key: 'searchPlaceholderColor', label: 'Placeholder', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'search', showWhen: { withSearch: 'yes' } },
      { key: 'searchFontSize', label: 'Font Size', control: 'number', defaultValue: 12, min: 10, max: 18, step: 1, unit: 'px', section: 'search', showWhen: { withSearch: 'yes' } },

      // Option row — sizing knobs apply across all states. The shared
      // (always-visible) section keeps padding / font / radius next to
      // the state-specific colours so they're easy to find.
      { key: 'optionPaddingX', label: 'Padding X', control: 'number', defaultValue: 10, min: 4, max: 20, step: 1, unit: 'px', section: 'option' },
      { key: 'optionPaddingY', label: 'Padding Y', control: 'number', defaultValue: 6, min: 2, max: 14, step: 1, unit: 'px', section: 'option' },
      { key: 'optionFontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px', section: 'option' },
      { key: 'optionRadius', label: 'Radius', control: 'slider', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px', section: 'option' },

      // Per-state colour knobs — scoped by `state` variant so only the
      // knobs relevant to the currently-displayed showcase state are
      // visible. Matches the search-dropdown / select-dropdown / input-text
      // convention. State labels in showWhen match the variant `value`
      // strings ("default" / "active" / "selected" / "selected-active" /
      // "disabled"). Default state has no row background of its own — the
      // panel bg shows through — so only the text colour is exposed there.
      // Default state — bg + text. Bg defaults to transparent so the
      // panel chrome shows through (the common case); tune it if you
      // want every row to have its own surface (e.g. striped rows).
      { key: 'optionDefaultBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'optionState', showWhen: { state: 'default' } },
      { key: 'optionColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'optionState', showWhen: { state: 'default' } },

      // "Hover" state covers both mouse hover and keyboard arrow-key
      // highlight — they paint the same modifier class (`--active`)
      // because the atom keeps them visually equivalent. Registry key
      // names stay `optionActive*` to match the CSS class + var
      // namespace; the workbench label is "Hover" because that's the
      // term designers use.
      { key: 'optionActiveBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'optionState', showWhen: { state: 'hover' } },
      { key: 'optionActiveColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'optionState', showWhen: { state: 'hover' } },

      { key: 'optionSelectedBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'optionState', showWhen: { state: 'selected' } },
      { key: 'optionSelectedColor', label: 'Text', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'optionState', showWhen: { state: 'selected' } },

      { key: 'optionDisabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'optionState', showWhen: { state: 'disabled' } },

      // Group headers — only meaningful when the consumer groups items.
      { key: 'groupHeaderFontSize', label: 'Font Size', control: 'number', defaultValue: 10, min: 9, max: 14, step: 1, unit: 'px', section: 'groupHeader', showWhen: { withGroups: 'yes' } },
      { key: 'groupHeaderColor', label: 'Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'groupHeader', showWhen: { withGroups: 'yes' } },

      // Empty-state line (e.g. "No matches").
      { key: 'emptyColor', label: 'Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'empty' },

      // Footer divider — only shown when a consumer passes a footer slot
      // (ColorPicker's custom-hex panel).
      { key: 'footerBorder', label: 'Divider', control: 'color', defaultValue: 'var(--color-border)', section: 'footer', showWhen: { withFooter: 'yes' } },

      // No "Selection Indicator" knobs — the atom decides the pattern
      // (single-select → right-edge ✓ on selected, multi-select → left
      // checkboxes on every row). The right-edge ✓ inherits the row's
      // `--selected` text colour (tune via Selected → Text). The
      // checkbox marker reads `--uxm-checkbox-*` (tune via the Checkbox
      // atom). No new tuning surface here.
    ],
    layoutVariants: [
      {
        // Which state's classes to apply to the static showcase row at
        // the top of the preview. The interactive instance below is
        // always live — hover / keyboard / selection exercise the real
        // CSS rules independently. This picker is purely for VISUAL
        // confirmation of the per-state knobs (active bg, selected
        // bg/color, disabled opacity) — without it you'd have to hover
        // / click the interactive instance to verify each state.
        key: 'state',
        label: 'Row State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'selected', label: 'Selected' },
          { value: 'disabled', label: 'Disabled' },
        ],
        defaultValue: 'default',
      },
      {
        key: 'withSearch',
        label: 'Search Input',
        options: [
          { value: 'yes', label: 'On' },
          { value: 'no', label: 'Off' },
        ],
        defaultValue: 'yes',
      },
      {
        key: 'withGroups',
        label: 'Group Headers',
        options: [
          { value: 'no', label: 'Off' },
          { value: 'yes', label: 'On' },
        ],
        defaultValue: 'no',
      },
      {
        key: 'withFooter',
        label: 'Footer Slot',
        options: [
          { value: 'no', label: 'Off' },
          { value: 'yes', label: 'On' },
        ],
        defaultValue: 'no',
      },
      {
        // Which atom the interactive preview mounts. The indicator
        // pattern is decided by the atom, not by the workbench:
        //   - `Listbox` (single)   → right-edge ✓ on the selected row
        //   - `MultiListbox` (multi) → left-edge checkbox on every row
        // The static showcase above respects this too — single mode
        // shows the right-✓ when `state=selected`; multi mode shows
        // checkboxes on the row regardless of state.
        key: 'mode',
        label: 'Selection',
        options: [
          { value: 'single', label: 'Single' },
          { value: 'multi', label: 'Multi' },
        ],
        defaultValue: 'single',
      },
      // Multi-only — the Checkboxes variant shows the with/without
      // indicator design choice for multi-select panels. `excludeSelected`
      // (hide picked items from the list) is intentionally NOT exposed
      // — it's a consumer-level decision baked into atoms like
      // PillSelect, not a panel-design choice designers should tune.
      // `showWhen: { mode: "multi" }` keeps it out of single mode.
      {
        key: 'showCheckbox',
        label: 'Checkboxes',
        options: [
          { value: 'on', label: 'On' },
          { value: 'off', label: 'Off' },
        ],
        defaultValue: 'on',
        showWhen: { mode: 'multi' },
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires when the user picks an option (click or Enter). Multi-select toggles items in/out of the array.', payload: 'T (single) | T[] (multi)' },
      { name: 'onOpenChange', description: 'Fires when the panel opens or closes.', payload: 'boolean' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: ['Listbox', 'MultiListbox'],
      props: [
        { name: 'items', type: 'T[]', required: true, description: "Source data — the listbox is generic over T and has no knowledge of what's inside." },
        { name: 'getKey', type: '(item: T) => string', required: true, description: 'Stable React key per item.' },
        { name: 'getLabel', type: '(item: T) => string', required: true, description: 'Plain text used for default substring filter and a11y.' },
        { name: 'value', type: 'T | null  // Listbox\nT[]         // MultiListbox', required: true, description: 'Current selection.' },
        { name: 'onChange', type: '(item: T | null) => void  // Listbox — null when consumer clears\n(items: T[]) => void        // MultiListbox — empty array when cleared', required: true, description: 'Selection callback. Listbox passes null when the consumer wires up a clear affordance (e.g. ✕ in their renderTrigger). MultiListbox passes an empty array when all selections are cleared.' },
        { name: 'renderTrigger', type: '(state: { open, selected, triggerProps }) => ReactNode', required: true, description: "Render the consumer's trigger. Spread `triggerProps` on a button — that wires ref + click + ARIA in one go." },
        { name: 'renderItem', type: '(item: T, state: { active, selected }) => ReactNode', required: true, description: 'Render each row body — the atom owns layout + states; consumer owns visuals (icon, flag, swatch, etc.).' },
        { name: 'searchable', type: 'boolean | "auto"', defaultValue: 'true', description: 'Show a search input above the list. `"auto"` reveals it only once the option count exceeds the shared threshold (6) — the one place that rule lives, so every Listbox-backed picker shares it.' },
        { name: 'filterItems', type: '(items: T[], query: string) => T[]', description: 'Override the default case-insensitive substring filter on `getLabel`.' },
        { name: 'groupBy', type: '(item: T) => string', description: 'Group items under section headers in declared order.' },
        { name: 'footer', type: 'ReactNode', description: "Slot below the list (e.g. ColorPicker's custom hex panel)." },
        { name: 'isItemDisabled', type: '(item: T) => boolean', description: 'Mark individual items inert (not selectable, skipped by keyboard nav).' },
        { name: 'placement', type: '"bottom-start" | "bottom-end" | "top-start" | "top-end"', defaultValue: '"bottom-start"', description: 'Preferred placement; flips on overflow.' },
        { name: 'matchAnchorWidth', type: 'boolean', defaultValue: 'true', description: "Match the positioning anchor's width (the trigger by default, or `anchorRef` if provided)." },
        { name: 'anchorRef', type: 'RefObject<HTMLElement | null>', description: "Override what the popover positions / sizes against. Defaults to the trigger element. Use when the trigger is a small affordance inside a larger field (e.g. PhoneInput's country button inside the phone field)." },
        { name: 'showCheckmark', type: 'boolean', defaultValue: 'true', description: 'Listbox only — show the right-edge ✓ on the selected row. Set to `false` when row content already has trailing meta (dial codes, currency codes) that would compete for the right edge.' },
        { name: 'portal', type: 'boolean', defaultValue: 'true', description: 'Mount the panel into document.body — escapes clipping parents.' },
        { name: 'excludeSelected', type: 'boolean', defaultValue: 'true', description: 'MultiListbox only — hide items already in `value` from the panel.' },
      ],
    },
  },
  {
    id: 'menu',
    name: 'Menu (Action Menu)',
    category: 'Inputs',
    description:
      "Action / dropdown menu — a list of commands invoked from a consumer-owned trigger (a ⋮ IconButton, a Button, anything). Built on the same headless Popover as Listbox (positioning, portal, outside-click, Escape) but with menu semantics (role=menu / menuitem / separator) and NO selected-value state: pick a row → run its action → dismiss. Reach for Listbox/Select when you need to HOLD a chosen value; reach for Menu for row ⋮ actions, overflow menus, and command lists. Supports leading icons, trailing hints (e.g. shortcuts), separators, disabled rows, and destructive (danger) items. This entry themes the PANEL + rows; the trigger is owned entirely by the consumer's renderTrigger.",
    styleProperties: [
      // Panel chrome — the floating card.
      { key: 'panelBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'panel' },
      { key: 'panelBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'panel' },
      { key: 'panelRadius', label: 'Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px', section: 'panel' },
      { key: 'panelMaxHeight', label: 'Max Height', control: 'number', defaultValue: 360, min: 120, max: 600, step: 20, unit: 'px', section: 'panel' },

      // Drop shadow — decomposed into Color / Blur / Offset Y instead of a
      // raw `box-shadow` text field, so designers tune it with a colour
      // picker + sliders. Same pattern as the Calendar atom; the box-shadow
      // is composed from these three vars in styles.css. Defaults match the
      // floating-panel elevation (0 6px 20px rgba(0,0,0,0.10)).
      { key: 'shadowColor', label: 'Color', control: 'color', defaultValue: 'rgba(0, 0, 0, 0.10)', section: 'shadow' },
      { key: 'shadowBlur', label: 'Blur', control: 'slider', defaultValue: 20, min: 0, max: 48, step: 1, unit: 'px', section: 'shadow' },
      { key: 'shadowOffsetY', label: 'Offset Y', control: 'slider', defaultValue: 6, min: 0, max: 24, step: 1, unit: 'px', section: 'shadow' },

      // Item row — sizing knobs apply across all states.
      { key: 'itemPaddingX', label: 'Padding X', control: 'number', defaultValue: 10, min: 4, max: 20, step: 1, unit: 'px', section: 'item' },
      { key: 'itemPaddingY', label: 'Padding Y', control: 'number', defaultValue: 7, min: 2, max: 14, step: 1, unit: 'px', section: 'item' },
      { key: 'itemFontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px', section: 'item' },
      { key: 'itemRadius', label: 'Radius', control: 'slider', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px', section: 'item' },

      // Per-state colours — scoped by the `state` showcase variant so only
      // the knobs relevant to the displayed row state are visible. Mirrors
      // the listbox / select-dropdown convention. "Hover" covers both
      // mouse hover and keyboard arrow-key highlight (same `--active`
      // class). Default row has no surface of its own (panel bg shows
      // through), so only text colour is exposed there.
      { key: 'itemColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'itemState', showWhen: { state: 'default' } },

      { key: 'itemActiveBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'itemState', showWhen: { state: 'hover' } },
      { key: 'itemActiveColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'itemState', showWhen: { state: 'hover' } },

      { key: 'itemDisabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'itemState', showWhen: { state: 'disabled' } },

      // Destructive rows (Delete etc.) — danger text at rest, danger-tinted
      // surface when highlighted.
      { key: 'itemDangerColor', label: 'Text', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'itemState', showWhen: { state: 'danger' } },
      { key: 'itemDangerActiveBg', label: 'Hover Background', control: 'color', defaultValue: 'var(--color-danger-bg)', section: 'itemState', showWhen: { state: 'danger' } },

      // Leading icon colour at rest (tracks the row text colour when
      // active / danger — no separate knobs for those states).
      { key: 'itemIconColor', label: 'Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'icon', showWhen: { withIcons: 'yes' } },

      // Separator divider colour.
      { key: 'separatorColor', label: 'Color', control: 'color', defaultValue: 'var(--color-border)', section: 'separator', showWhen: { withSeparator: 'yes' } },
    ],
    layoutVariants: [
      {
        // Which state the static showcase rows paint. The interactive
        // instance (a real ⋮ trigger) below is always live — hover /
        // keyboard exercise the real CSS independently. This picker is
        // purely to VISUALLY confirm each per-state knob without having
        // to hover the live menu.
        key: 'state',
        label: 'Row State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'danger', label: 'Danger' },
        ],
        defaultValue: 'default',
      },
      {
        key: 'withIcons',
        label: 'Leading Icons',
        options: [
          { value: 'yes', label: 'On' },
          { value: 'no', label: 'Off' },
        ],
        defaultValue: 'yes',
      },
      {
        key: 'withSeparator',
        label: 'Separator',
        options: [
          { value: 'yes', label: 'On' },
          { value: 'no', label: 'Off' },
        ],
        defaultValue: 'yes',
      },
    ],
    events: [
      { name: 'onSelect', description: "Fires when an item is invoked (click / Enter / Space). The menu closes afterward. Per-item — wired via each item's `onSelect`.", payload: 'void' },
      { name: 'onOpenChange', description: 'Fires when the menu opens or closes.', payload: 'boolean' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'Menu',
      props: [
        { name: 'items', type: 'MenuEntry[]', required: true, description: 'Menu entries — actionable items ({ key, label, icon?, hint?, onSelect?, disabled?, danger? }) and separators ({ separator: true }), in display order.' },
        { name: 'renderTrigger', type: '(api: { open, triggerProps }) => ReactNode', required: true, description: 'Render the trigger. Spread `triggerProps` on your interactive element (an IconButton ⋮, a Button) — wires ref + click + ARIA in one go.' },
        { name: 'placement', type: '"bottom-start" | "bottom-end" | "top-start" | "top-end"', defaultValue: '"bottom-end"', description: 'Preferred placement; flips on overflow. Defaults to bottom-end since menus usually align to a trailing ⋮.' },
        { name: 'open', type: 'boolean', description: 'Controlled open state. Pair with onOpenChange. Omit for uncontrolled.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called whenever the menu wants to open/close.' },
        { name: 'minWidth', type: 'number', defaultValue: '160', description: 'Minimum panel width in px.' },
        { name: 'maxWidth', type: 'number', defaultValue: '280', description: 'Maximum panel width in px — long labels truncate beyond it.' },
      ],
    },
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    category: 'Inputs',
    description: 'Checkbox input with label. State knobs cover unchecked × checked across default / hover / focus, plus a shared disabled opacity.',
    styleProperties: [
      // Default — unchecked
      { key: 'uncheckedBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'uncheckedColors', showWhen: { state: 'default' } },
      { key: 'uncheckedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'uncheckedColors', showWhen: { state: 'default' } },
      // Default — checked
      { key: 'checkedBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent)', section: 'checkedColors', showWhen: { state: 'default' } },
      { key: 'checkedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'checkedColors', showWhen: { state: 'default' } },
      { key: 'checkGlyphColor', label: 'Check Glyph', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'checkedColors', showWhen: { state: 'default' } },
      // Hover — unchecked
      { key: 'hoverUncheckedBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'uncheckedColors', showWhen: { state: 'hover' } },
      { key: 'hoverUncheckedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'uncheckedColors', showWhen: { state: 'hover' } },
      // Hover — checked
      { key: 'hoverCheckedBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'checkedColors', showWhen: { state: 'hover' } },
      { key: 'hoverCheckedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'checkedColors', showWhen: { state: 'hover' } },
      { key: 'hoverCheckGlyphColor', label: 'Check Glyph', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'checkedColors', showWhen: { state: 'hover' } },
      // Focus — single shared ring color (outline applies the same to
      // checked and unchecked; splitting it into two knobs was overkill).
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled — single shared opacity (no per-mode colors)
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Shared — always visible
      { key: 'size', label: 'Size', control: 'number', defaultValue: 20, min: 14, max: 32, step: 2, unit: 'px' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px' },
      { key: 'gap', label: 'Label Gap', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      // Error — the box + label stay neutral; the message below is the sole
      // signal (errorColor colors it, errorMessageSize sizes it). Shared keys
      // with the input family so the editor's "Match in N" sync applies.
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
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
    ],
    events: [
      { name: 'onChange', description: 'Fires when the user toggles the checked state via click or Space.', payload: '{ checked: boolean }' },
      { name: 'onFocus', description: 'Fires when the checkbox receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the checkbox loses focus.', payload: 'FocusEvent' },
    ],
  },
  {
    id: 'toggle-switch',
    name: 'Toggle Switch',
    category: 'Inputs',
    description: 'On/off toggle switch. State knobs cover off × on across default / hover / focus, plus a shared disabled opacity.',
    styleProperties: [
      // Default — off
      { key: 'offTrack', label: 'Track', control: 'color', defaultValue: 'var(--color-border)', section: 'offColors', showWhen: { state: 'default' } },
      { key: 'offThumb', label: 'Thumb', control: 'color', defaultValue: 'var(--color-card)', section: 'offColors', showWhen: { state: 'default' } },
      // Default — on
      { key: 'onTrack', label: 'Track', control: 'color', defaultValue: 'var(--color-accent)', section: 'onColors', showWhen: { state: 'default' } },
      { key: 'onThumb', label: 'Thumb', control: 'color', defaultValue: 'var(--color-card)', section: 'onColors', showWhen: { state: 'default' } },
      // Hover — off
      { key: 'hoverOffTrack', label: 'Track', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'offColors', showWhen: { state: 'hover' } },
      { key: 'hoverOffThumb', label: 'Thumb', control: 'color', defaultValue: 'var(--color-card)', section: 'offColors', showWhen: { state: 'hover' } },
      // Hover — on
      { key: 'hoverOnTrack', label: 'Track', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'onColors', showWhen: { state: 'hover' } },
      { key: 'hoverOnThumb', label: 'Thumb', control: 'color', defaultValue: 'var(--color-card)', section: 'onColors', showWhen: { state: 'hover' } },
      // Focus — single shared ring color (outline applies the same to
      // off and on; splitting it into two knobs was overkill).
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled — shared opacity
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Shared — always visible
      { key: 'width', label: 'Width', control: 'number', defaultValue: 44, min: 32, max: 64, step: 4, unit: 'px' },
      { key: 'height', label: 'Height', control: 'number', defaultValue: 24, min: 18, max: 36, step: 2, unit: 'px' },
      // Error — the track + label stay neutral; the message below is the sole
      // signal (errorColor colors it, errorMessageSize sizes it).
      { key: 'errorColor', label: 'Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
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
    ],
    events: [
      { name: 'onChange', description: 'Fires when the toggle flips on/off.', payload: '{ checked: boolean }' },
      { name: 'onFocus', description: 'Fires when the toggle receives focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the toggle loses focus.', payload: 'FocusEvent' },
    ],
  },
  {
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
      { key: 'hoverUnselectedBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'unselectedColors', showWhen: { state: 'hover' } },
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
  },

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
  // (middle list). Distinct from `segment-tree-row` above, which models a
  // collapsible single-column tree.
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
  // ── Feedback ──
  {
    id: 'segment-tree-row',
    name: 'Segment Tree Row',
    category: 'Composite',
    description: 'Collapsible nested tree node — drag handle, depth-cycled accent rail, chevron, title, item count, hover actions.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 12, min: 0, max: 20, step: 1, unit: 'px' },
      { key: 'accentColor', label: 'Rail Color', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'colors' },
      { key: 'accentWidth', label: 'Rail Width', control: 'number', defaultValue: 4, min: 1, max: 8, step: 1, unit: 'px' },
      { key: 'accentHeight', label: 'Rail Height', control: 'number', defaultValue: 20, min: 12, max: 40, step: 2, unit: 'px' },
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 15, min: 12, max: 20, step: 1, unit: 'px' },
      { key: 'titleColor', label: 'Title Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'countBadgeBg', label: 'Count Bg', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors' },
      { key: 'countBadgeText', label: 'Count Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 16, min: 8, max: 32, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 18, min: 8, max: 32, step: 2, unit: 'px' },
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
    ],
  },
  {
    id: 'timeline-entry',
    name: 'Timeline Entry',
    category: 'Display',
    description: 'Single entry in a vertical history timeline — dot + connecting line + content card.',
    styleProperties: [
      { key: 'dotColor', label: 'Dot Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
      { key: 'dotIdleColor', label: 'Idle Dot Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'dotSize', label: 'Dot Size', control: 'number', defaultValue: 8, min: 4, max: 20, step: 1, unit: 'px' },
      { key: 'dotRingColor', label: 'Dot Ring', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'lineColor', label: 'Line Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'lineWidth', label: 'Line Width', control: 'number', defaultValue: 1, min: 1, max: 4, step: 1, unit: 'px' },
      { key: 'contentBg', label: 'Content Bg', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'contentBorderColor', label: 'Content Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'contentRadius', label: 'Content Radius', control: 'slider', defaultValue: 5, min: 0, max: 12, step: 1, unit: 'px' },
      { key: 'contentPadding', label: 'Content Padding', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 10, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px' },
      { key: 'titleColor', label: 'Title Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'metaSize', label: 'Meta Size', control: 'number', defaultValue: 10.5, min: 9, max: 14, step: 0.5, unit: 'px' },
      { key: 'metaColor', label: 'Meta Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'past', label: 'Past' },
        ],
        defaultValue: 'active',
      },
    ],
  },
  {
    id: 'loader',
    name: 'Loader',
    category: 'Feedback',
    description: 'Small in-flight indicator — spinner, pulsing dots, or indeterminate bar — with an optional message.',
    styleProperties: [
      { key: 'size', label: 'Size', control: 'number', defaultValue: 24, min: 12, max: 64, step: 2, unit: 'px' },
      { key: 'color', label: 'Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
      { key: 'trackColor', label: 'Track Color', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-accent-bold) 18%, transparent)', section: 'colors' },
      { key: 'speed', label: 'Speed (ms)', control: 'number', defaultValue: 800, min: 200, max: 2400, step: 50 },
      { key: 'barWidth', label: 'Bar Width', control: 'number', defaultValue: 200, min: 80, max: 480, step: 10, unit: 'px' },
      { key: 'message', label: 'Message', control: 'text', defaultValue: 'Loading…' },
      { key: 'messageInterval', label: 'Cycle (ms)', control: 'number', defaultValue: 2400, min: 600, max: 8000, step: 100 },
      { key: 'messageSize', label: 'Message Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px' },
      { key: 'messageColor', label: 'Message Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 12, min: 4, max: 32, step: 2, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'variant',
        label: 'Variant',
        options: [
          { value: 'spinner', label: 'Spinner' },
          { value: 'dots', label: 'Dots' },
          { value: 'bar', label: 'Bar' },
        ],
        defaultValue: 'spinner',
      },
      {
        key: 'layout',
        label: 'Layout',
        options: [
          { value: 'stacked', label: 'Stacked' },
          { value: 'inline', label: 'Inline' },
        ],
        defaultValue: 'stacked',
      },
    ],
  },
  {
    id: 'progress-bar',
    name: 'Progress Bar',
    category: 'Feedback',
    description:
      'Determinate progress (0–100%) — the companion to Loader\'s indeterminate spinner/dots/bar. Use for uploads, batch operations, and stepped flows where the share of work done is known; for "something is happening, no ETA" use Loader instead. Two variants share one Value knob: a linear track+fill and a circular ring (CSS conic-gradient, no SVG). Root is layout-only — all theming routes through `--uxm-progress-bar-*` vars on inner elements, so saves need no PER_COMPONENT_MAPPING entry. The value drives the linear fill width and the ring sweep via the same var.',
    styleProperties: [
      // `value` is a preview proxy for what will be runtime/dynamic data — the
      // editor slider lets designers eyeball fill levels, but in production the
      // consumer drives it via the `value` prop (the saved
      // `--uxm-progress-bar-value` is always overridden inline). The numeric
      // percentage label is always shown (determinate by nature).
      { key: 'value', label: 'Value (%)', control: 'slider', defaultValue: 60, min: 0, max: 100, step: 1 },
      { key: 'fillColor', label: 'Fill Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
      { key: 'trackColor', label: 'Track Color', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-accent-bold) 16%, transparent)', section: 'colors' },
      // ── Linear shape (showWhen variant=linear) ──
      { key: 'barHeight', label: 'Bar Height', control: 'number', defaultValue: 8, min: 2, max: 24, step: 1, unit: 'px', showWhen: { variant: 'linear' } },
      { key: 'barRadius', label: 'Bar Radius', control: 'slider', defaultValue: 999, min: 0, max: 999, step: 1, unit: 'px', showWhen: { variant: 'linear' } },
      // ── Ring shape (showWhen variant=ring) ──
      { key: 'ringSize', label: 'Ring Size', control: 'number', defaultValue: 72, min: 40, max: 160, step: 2, unit: 'px', showWhen: { variant: 'ring' } },
      { key: 'ringThickness', label: 'Ring Thickness', control: 'number', defaultValue: 8, min: 2, max: 28, step: 1, unit: 'px', showWhen: { variant: 'ring' } },
      // ── Value label — always rendered; its own section ──
      { key: 'valueColor', label: 'Value Color', control: 'color', defaultValue: 'var(--color-text)', section: 'value' },
      { key: 'valueSize', label: 'Value Size', control: 'number', defaultValue: 13, min: 10, max: 28, step: 1, unit: 'px', section: 'value' },
      // ── Caption + layout ──
      { key: 'label', label: 'Caption', control: 'text', defaultValue: 'Uploading…' },
      { key: 'labelColor', label: 'Caption Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'labelSize', label: 'Caption Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px' },
      { key: 'stackGap', label: 'Gap', control: 'number', defaultValue: 8, min: 0, max: 24, step: 2, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'variant',
        label: 'Variant',
        options: [
          { value: 'linear', label: 'Linear' },
          { value: 'ring', label: 'Ring' },
        ],
        defaultValue: 'linear',
      },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'ProgressBar',
      props: [
        { name: 'value', type: 'number', required: true, description: 'Completion 0–100. Clamped into range. In production the consumer drives this from real progress data.' },
        { name: 'variant', type: '"linear" | "ring"', defaultValue: '"linear"', description: 'Linear track+fill or circular ring (CSS conic-gradient, no SVG). Both are determinate.' },
        { name: 'label', type: 'string', description: 'Optional caption — above the bar (linear) / below the ring (ring). Also becomes the accessible name.' },
        { name: 'valueText', type: 'string', description: 'Override the percentage text (defaults to `${Math.round(value)}%`).' },
        { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Native attributes pass through to the root.' },
      ],
    },
  },
  {
    id: 'banner',
    name: 'Banner',
    category: 'Feedback',
    description: 'Persistent full-width strip rendered inline in page flow — stays until user dismisses or consumer removes. Use for system states and announcements (e.g. "Maintenance at 02:00", "Q1 forecast beat target"). For transient feedback ("Saved", "Copied") use Toast via `toast.*()` instead. Color knobs are variant-scoped via `showWhen` (success / info / warning / error) — switching the variant picker swaps which 3 color knobs are visible, each defaulting to its own semantic palette. Shape knobs (radius / paddings / font) apply across all variants.',
    styleProperties: [
      // ── Success colors (showWhen: variant=success) ──
      { key: 'successBg',     label: 'Background',  control: 'color', defaultValue: 'var(--color-success-bg)',     section: 'colors', showWhen: { variant: 'success' } },
      { key: 'successText',   label: 'Text Color',  control: 'color', defaultValue: 'var(--color-success-text)',   section: 'colors', showWhen: { variant: 'success' } },
      { key: 'successBorder', label: 'Border Color', control: 'color', defaultValue: 'var(--color-success-border)', section: 'colors', showWhen: { variant: 'success' } },
      // ── Info colors (showWhen: variant=info) ──
      { key: 'infoBg',     label: 'Background',  control: 'color', defaultValue: 'var(--color-info-bg)',     section: 'colors', showWhen: { variant: 'info' } },
      { key: 'infoText',   label: 'Text Color',  control: 'color', defaultValue: 'var(--color-info-text)',   section: 'colors', showWhen: { variant: 'info' } },
      { key: 'infoBorder', label: 'Border Color', control: 'color', defaultValue: 'var(--color-info-border)', section: 'colors', showWhen: { variant: 'info' } },
      // ── Warning colors (showWhen: variant=warning) ──
      { key: 'warningBg',     label: 'Background',  control: 'color', defaultValue: 'var(--color-warning-bg)',     section: 'colors', showWhen: { variant: 'warning' } },
      { key: 'warningText',   label: 'Text Color',  control: 'color', defaultValue: 'var(--color-warning-text)',   section: 'colors', showWhen: { variant: 'warning' } },
      { key: 'warningBorder', label: 'Border Color', control: 'color', defaultValue: 'var(--color-warning-border)', section: 'colors', showWhen: { variant: 'warning' } },
      // ── Error colors (showWhen: variant=error) — defaults reference the
      // `--color-danger-*` token family (existing token naming) but the
      // variant key itself is `error` to match the BannerVariant union. ──
      { key: 'errorBg',     label: 'Background',  control: 'color', defaultValue: 'var(--color-danger-bg)',     section: 'colors', showWhen: { variant: 'error' } },
      { key: 'errorText',   label: 'Text Color',  control: 'color', defaultValue: 'var(--color-danger-text)',   section: 'colors', showWhen: { variant: 'error' } },
      { key: 'errorBorder', label: 'Border Color', control: 'color', defaultValue: 'var(--color-danger-border)', section: 'colors', showWhen: { variant: 'error' } },
      // ── Shape (variant-agnostic) ──
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 16, min: 8, max: 32, step: 4, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 12, min: 4, max: 24, step: 4, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'variant',
        label: 'Variant',
        options: [
          { value: 'success', label: 'Success' },
          { value: 'info', label: 'Info' },
          { value: 'warning', label: 'Warning' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'success',
      },
    ],
    events: [
      { name: 'onDismiss', description: 'Fires when the user clicks the close affordance — only present if the Banner was rendered with one.', payload: 'void' },
    ],
  },
  {
    id: 'bulk-action-bar',
    name: 'Bulk Action Bar',
    category: 'Feedback',
    description: "Floating toolbar that surfaces once rows are selected: \"{N} selected · actions · × clear\". Purely presentational — the consumer wires it to its own `selectedKeys` state and positions it (typically fixed/sticky near the bottom of a table view). Pairs with the DataTable's row selection. The `.uxm-bulk-action-bar` root IS the styled card surface (background / border / decomposed shadow); the per-part colours (action / danger / divider / clear ×) theme the inner buttons. Destructive actions get the danger treatment via `danger: true`.",
    styleProperties: [
      // ── Bar surface (the floating card) ──
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'bar' },
      { key: 'color', label: 'Count Text', control: 'color', defaultValue: 'var(--color-text)', section: 'bar' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'bar' },
      { key: 'borderRadius', label: 'Radius', control: 'slider', defaultValue: 12, min: 0, max: 24, step: 1, unit: 'px', section: 'bar' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 28, step: 2, unit: 'px', section: 'bar' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 8, min: 2, max: 20, step: 1, unit: 'px', section: 'bar' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 8, min: 0, max: 20, step: 1, unit: 'px', section: 'bar' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 18, step: 1, unit: 'px', section: 'bar' },

      // ── Drop shadow — decomposed into Color / Blur / Offset Y (same
      //    pattern as the Menu / Calendar floating panels). Composed into
      //    a single box-shadow in styles.css. Default lifts the bar off
      //    the page (0 10px 28px rgba(0,0,0,0.16)). ──
      { key: 'shadowColor', label: 'Color', control: 'color', defaultValue: 'rgba(0, 0, 0, 0.16)', section: 'shadow' },
      { key: 'shadowBlur', label: 'Blur', control: 'slider', defaultValue: 28, min: 0, max: 60, step: 1, unit: 'px', section: 'shadow' },
      { key: 'shadowOffsetY', label: 'Offset Y', control: 'slider', defaultValue: 10, min: 0, max: 32, step: 1, unit: 'px', section: 'shadow' },

      // ── Action buttons (the plain commands) ──
      { key: 'actionColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'actions' },
      { key: 'actionHoverBg', label: 'Hover Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'actions' },
      { key: 'actionRadius', label: 'Radius', control: 'slider', defaultValue: 6, min: 0, max: 12, step: 1, unit: 'px', section: 'actions' },

      // ── Destructive action (Delete etc.) — danger text at rest, a
      //    danger-tinted surface on hover. Reuses the danger token trio. ──
      { key: 'dangerColor', label: 'Text', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'danger' },
      { key: 'dangerHoverBg', label: 'Hover Background', control: 'color', defaultValue: 'var(--color-danger-bg)', section: 'danger' },

      // ── Divider ── (the clear × is the IconButton atom, themed there)
      { key: 'dividerColor', label: 'Divider', control: 'color', defaultValue: 'var(--color-border)', section: 'divider' },
    ],
    // No layout variants — the selection count is runtime data, not a
    // design knob, and the × clear is a behavioral prop (`onClear`), so the
    // preview just renders a representative count.
    layoutVariants: [],
    events: [
      { name: 'onClear', description: 'Fires when the user clicks the trailing × to clear the selection. Omit `onClear` to hide the ×.', payload: 'void' },
      { name: 'action.onClick', description: "Per-action handler — fires when an action button is clicked. Wired via each entry's `onClick`.", payload: 'void' },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: 'BulkActionBar',
      props: [
        { name: 'count', type: 'number', required: true, description: 'Number of selected items. Drives the default "{n} selected" label.' },
        { name: 'actions', type: 'BulkAction[]', description: 'Action buttons in display order. Each: { key, label, icon?, danger?, disabled?, onClick? }. Set `danger: true` for destructive actions (Delete/Remove).' },
        { name: 'onClear', type: '() => void', description: 'When provided, renders a trailing × that clears the selection.' },
        { name: 'countLabel', type: '(count: number) => ReactNode', description: 'Override the count label — e.g. for pluralisation or a different noun ("3 rows").' },
        { name: 'className', type: 'string', description: "Extra classes appended after the atom's own `uxm-bulk-action-bar`." },
        { name: 'style', type: 'CSSProperties', description: 'Inline style — use for fixed/sticky positioning in the consuming layout.' },
      ],
    },
  },
  {
    id: 'toast',
    name: 'Toast',
    category: 'Feedback',
    description: 'Transient corner notification rendered inside the Toaster shell. Neutral elevated card surface (matches the active theme — white in light, raised-dark in dark) with a colored left-edge accent + colored icon communicating the variant. Fired imperatively via `toast.success("…")`. Use for brief after-the-fact feedback ("Saved", "Copied"); for persistent status messages inline in the page, use Banner instead.',
    styleProperties: [
      // ── Neutral surface (variant-agnostic) ──
      { key: 'backgroundColor', label: 'Background',  control: 'color', defaultValue: 'var(--color-card)',   section: 'colors' },
      { key: 'color',           label: 'Text Color',  control: 'color', defaultValue: 'var(--color-text)',   section: 'colors' },
      // Default `transparent` — the shadow does the lift; outer border
      // is opt-in for designers who want a visible outline. The colored
      // left-edge accent is set per-variant and isn't affected by this.
      { key: 'borderColor',     label: 'Border Color', control: 'color', defaultValue: 'transparent', section: 'colors' },
      // ── Per-variant icon color — only the active variant's knob is
      //    visible at a time. The icon is the sole variant signal; no
      //    stripe / pill / background tint. ──
      { key: 'successAccent', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-success-text)', section: 'colors', showWhen: { variant: 'success' } },
      { key: 'infoAccent',    label: 'Icon Color', control: 'color', defaultValue: 'var(--color-info-text)',    section: 'colors', showWhen: { variant: 'info' } },
      { key: 'warningAccent', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-warning-text)', section: 'colors', showWhen: { variant: 'warning' } },
      // Error variant: default references the `--color-danger-*` family
      // (existing brand-token naming). Save var name: `--uxm-toast-
      // error-accent`.
      { key: 'errorAccent',   label: 'Icon Color', control: 'color', defaultValue: 'var(--color-danger-text)',  section: 'colors', showWhen: { variant: 'error' } },
      // ── Shape (variant-agnostic) ──
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 10, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 16, min: 8, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 12, min: 6, max: 20, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 16, step: 1, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 12, max: 24, step: 1, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'variant',
        label: 'Variant',
        options: [
          { value: 'success', label: 'Success' },
          { value: 'info', label: 'Info' },
          { value: 'warning', label: 'Warning' },
          { value: 'error', label: 'Error' },
        ],
        defaultValue: 'success',
      },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: ['Toaster', 'toast'],
      props: [
        { name: 'toast.success(message, options?)', type: '(message: string, options?: { duration?: number, id?: string }) => string', description: 'Fire a success toast. Returns the toast id for manual dismissal via toast.dismiss(id).' },
        { name: 'toast.info(message, options?)', type: '(message: string, options?: ToastOptions) => string', description: 'Fire an info toast.' },
        { name: 'toast.warning(message, options?)', type: '(message: string, options?: ToastOptions) => string', description: 'Fire a warning toast.' },
        { name: 'toast.error(message, options?)', type: '(message: string, options?: ToastOptions) => string', description: 'Fire an error toast.' },
        { name: '<Toaster position max />', type: 'ToasterProps', description: "Mount once at the app root. `position`: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'. `max`: stack cap." },
      ],
    },
    events: [
      { name: 'onDismiss', description: 'Fires when the user clicks the close X or the auto-dismiss timer elapses.', payload: 'void' },
    ],
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    category: 'Feedback',
    description: 'Small popup tooltip for extra information.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 6, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 6, min: 2, max: 16, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px' },
      { key: 'showArrow', label: 'Show Arrow', control: 'toggle', defaultValue: true },
    ],
    layoutVariants: [],
  },

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

  // ── Layout ──
  // Boring building blocks for page composition. No colour, no chrome —
  // these encode "items, related, with a consistent rhythm" so page
  // authors and AI page-generation pipelines don't pick gap values
  // ad-hoc. The editor knobs theme the gap rhythm globally.
  {
    id: 'responsive-grid',
    name: 'Responsive Grid',
    category: 'Layout',
    description: "Auto-fit grid that wraps children based on a minimum column width. Adapts to its container's width without media queries — same instance lays out as 4-up in a wide pane and 1-up in a narrow drawer.",
    styleProperties: [
      { key: 'min', label: 'Min Column Width', control: 'text', defaultValue: '200px' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 16, min: 0, max: 48, step: 2, unit: 'px' },
    ],
    layoutVariants: [],
    canvasBackground: false,
  },
  {
    id: 'stack',
    name: 'Stack',
    category: 'Layout',
    description: 'Vertical flex column with a consistent gap. The boring building block that replaces ad-hoc div soup in page layouts.',
    styleProperties: [
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 16, min: 0, max: 48, step: 2, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'align',
        label: 'Align',
        options: [
          { value: 'stretch', label: 'Stretch' },
          { value: 'start', label: 'Start' },
          { value: 'center', label: 'Center' },
          { value: 'end', label: 'End' },
        ],
        defaultValue: 'stretch',
      },
    ],
    canvasBackground: false,
  },
  {
    id: 'cluster',
    name: 'Cluster',
    category: 'Layout',
    description: "Horizontal row that wraps when there's not enough room — tag lists, filter chips, button rows. Wrap-friendly by design.",
    styleProperties: [
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 12, min: 0, max: 32, step: 2, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'align',
        label: 'Align',
        options: [
          { value: 'center', label: 'Center' },
          { value: 'start', label: 'Start' },
          { value: 'end', label: 'End' },
          { value: 'baseline', label: 'Baseline' },
        ],
        defaultValue: 'center',
      },
      {
        key: 'justify',
        label: 'Justify',
        options: [
          { value: 'start', label: 'Start' },
          { value: 'center', label: 'Center' },
          { value: 'end', label: 'End' },
          { value: 'between', label: 'Space Between' },
        ],
        defaultValue: 'start',
      },
    ],
    canvasBackground: false,
  },

  // ── Composite ──
  {
    id: 'pill-select',
    name: 'Pill Select',
    category: 'Composite',
    description: "Multi-select tag input. Selected values render as <Chip mode=\"input\"> (chip theming lives on the Chip atom's registry). This shell owns the field shape and state visuals — default / hover / focus / disabled — matching the input-text / input-with-icon family.",
    styleProperties: [
      // Field colors (per state). The visible field is `.uxm-pill-select__
      // field` — an inner div on the layout-only `.uxm-pill-select` root.
      // `backgroundColor` and `borderColor` are REAL_CSS_PROPS so they're
      // routed through `--uxm-pill-select-{bg,border-color}` via
      // PER_COMPONENT_MAPPING in save/route.ts (otherwise saves would land
      // on the layout wrapper and silently no-op). The per-state keys
      // (hoverBg, focusBorder, …) are custom names that route through the
      // kebab fallback path correctly.
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors', showWhen: { state: 'default' } },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors', showWhen: { state: 'default' } },
      { key: 'placeholderColor', label: 'Placeholder', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors', showWhen: { state: 'default' } },
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors', showWhen: { state: 'hover' } },
      { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'colors', showWhen: { state: 'hover' } },
      { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'colors', showWhen: { state: 'focus' } },
      { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      // Disabled defaults intentionally match the default state — the
      // visible "disabled" signal comes from the chips inside (which
      // receive the forwarded `disabled` prop and render the Chip atom's
      // own muted palette) plus `cursor: not-allowed` and the field
      // being skipped in the tab order. Stacking an opacity dim on the
      // wrapper would double-dim the already-muted chips and ruin
      // readability, so opacity defaults to 1 — exposed as a knob if the
      // brand really wants a dimmed disabled treatment.
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors', showWhen: { state: 'disabled' } },
      { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors', showWhen: { state: 'disabled' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 1, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Error state — field-style atom (constrained picker), so it gets
      // the standard error surface: red border + bg on the inner `__field`,
      // plus the shared message knobs. errorBg / errorBorder paint the
      // field; errorColor + errorMessageSize theme the `__error-message`
      // below it. The latter two share keys with the rest of the input
      // family so the editor's "Match in N Inputs" sync links them. All
      // four kebab through the fallback path to `--uxm-pill-select-error-*`
      // (declared on the root, cascade down to `__field`). `colors` section
      // for bg/border matches the other per-state field colors above.
      { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors', showWhen: { state: 'error' } },
      { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'colors', showWhen: { state: 'error' } },
      { key: 'errorColor', label: 'Label + Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
      { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
      // Shape (universal, no showWhen). Keys `radius` and `chipGap` are
      // deliberately NOT named `borderRadius` / `gap` (which would land
      // in REAL_CSS_PROPS and emit plain CSS on the root); the field-
      // radius lives on the inner `__field`, and `chipGap` is the field's
      // flex gap. `paddingX` / `paddingY` ARE REAL_CSS_PROPS — routed via
      // PER_COMPONENT_MAPPING so they land on `__field`, not the root.
      { key: 'radius', label: 'Field Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'chipGap', label: 'Chip Gap', control: 'number', defaultValue: 6, min: 2, max: 12, step: 2, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 10, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 8, min: 4, max: 20, step: 2, unit: 'px' },
      // Label rendering is the consumer's responsibility — the atom
      // doesn't own a `<label>` element. Preview-only label knobs
      // (labelColor, labelSize) were removed pending a project-wide
      // decision on label theming has now landed: FormField is the sole
      // owner. Wrap pill-select in `<FormField>` to add a label; this
      // atom is just the multi-select field. labelPosition variant was
      // removed here for the same reason — labels are FormField's concern.
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
      // Chip layout variant — `inside` keeps chips inline within the
      // trigger (tag-input pattern); `below` puts them in a separate row
      // beneath the trigger (filter-bar pattern). Default `below` —
      // modern default, trigger stays a constant height. Consumers
      // wanting the classic compact "To:" tag-input switch to `inside`.
      {
        key: 'chipsPosition',
        label: 'Chips Position',
        options: [
          { value: 'below', label: 'Below' },
          { value: 'inside', label: 'Inside' },
        ],
        defaultValue: 'below',
      },
    ],
  },
  {
    id: 'inline-filter',
    name: 'Inline Filters',
    category: 'Composite',
    description: "Horizontal filter bar — three slots (search / filters / trailing). The filters slot accepts <Chip mode=\"filter\"> from the consumer; chip theming lives on the Chip atom's registry, not here. This shell is layout-only.",
    styleProperties: [
      // Layout-only. The chip-shape knobs that used to live here
      // (chipBg, chipActiveBg, chipText, chipActiveText, plus
      // borderRadius / fontSize / paddingX / paddingY) have moved to
      // the Chip atom — the shell shouldn't claim theming responsibility
      // for what its consumers slot in.
      { key: 'gap', label: 'Slot Gap', control: 'number', defaultValue: 12, min: 4, max: 32, step: 2, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'content-tooltip',
    name: 'Content Tooltip',
    category: 'Composite',
    description: 'Rich tooltip with title, description, and action.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 12, min: 0, max: 20, step: 1, unit: 'px' },
      { key: 'padding', label: 'Padding', control: 'number', defaultValue: 16, min: 8, max: 32, step: 4, unit: 'px' },
      { key: 'shadow', label: 'Shadow', control: 'toggle', defaultValue: true },
      { key: 'maxWidth', label: 'Max Width', control: 'number', defaultValue: 280, min: 180, max: 400, step: 20, unit: 'px' },
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 14, min: 11, max: 18, step: 1, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'form-multirow',
    name: 'Multi-Row Form',
    category: 'Composite',
    description: "Multi-section form with two-column rows. Composes FormField + TextInput / Select / Textarea; input theming flows through the input atoms' registries, label theming through FormField's. Always renders top labels — side labels + multi-section is a cramped combination and adds no signal worth exposing.",
    styleProperties: [
      // Form card shape + section/field spacing only. `inputRadius` is
      // gone (TextInput owns its own border-radius); `borderColor` is
      // now exclusively the form card outline.
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 12, min: 0, max: 24, step: 1, unit: 'px' },
      { key: 'padding', label: 'Padding', control: 'number', defaultValue: 32, min: 16, max: 48, step: 4, unit: 'px' },
      { key: 'fieldGap', label: 'Field Gap', control: 'number', defaultValue: 20, min: 8, max: 40, step: 4, unit: 'px' },
      { key: 'sectionGap', label: 'Section Gap', control: 'number', defaultValue: 32, min: 16, max: 48, step: 4, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'columns',
        label: 'Columns',
        options: [
          { value: '1', label: 'Single' },
          { value: '2', label: 'Two Column' },
        ],
        defaultValue: '2',
      },
    ],
  },
  {
    id: 'data-table',
    name: 'Data Table',
    category: 'Composite',
    description: 'Sortable data table with header, rows, and actions.',
    styleProperties: [
      { key: 'headerBg', label: 'Header Bg', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors' },
      { key: 'headerText', label: 'Header Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'rowBg', label: 'Row Bg', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'rowHoverBg', label: 'Row Hover Bg', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors' },
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 11, max: 16, step: 1, unit: 'px' },
      { key: 'cellPaddingX', label: 'Cell Padding X', control: 'number', defaultValue: 12, min: 8, max: 24, step: 2, unit: 'px' },
      { key: 'cellPaddingY', label: 'Cell Padding Y', control: 'number', defaultValue: 12, min: 6, max: 20, step: 2, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'density',
        label: 'Density',
        options: [
          { value: 'compact', label: 'Compact' },
          { value: 'default', label: 'Default' },
          { value: 'relaxed', label: 'Relaxed' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onRowClick', description: 'Fires when the user clicks a row (not bubbled from clicks inside the row-actions cell).', payload: '{ row: T }' },
      { name: 'onCommit', description: 'Fires when an editable cell commits a new value — Enter or blur.', payload: '{ row: T, value: EditableCellValue }' },
    ],
  },
  {
    id: 'view-switcher',
    name: 'View Switcher',
    category: 'Composite',
    description: 'Compact icon-only segmented control for toggling grid / list view. State knobs cover default / hover / focus / active / disabled across the individual icon button — the track surface is shared.',
    styleProperties: [
      // ── Track surface (shared across all states)
      { key: 'trackBg', label: 'Track Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'track' },
      { key: 'trackBorder', label: 'Track Border', control: 'color', defaultValue: 'var(--color-border)', section: 'track' },
      { key: 'trackRadius', label: 'Track Radius', control: 'slider', defaultValue: 8, min: 0, max: 99, step: 1, unit: 'px', section: 'track' },
      { key: 'trackPadding', label: 'Track Padding', control: 'number', defaultValue: 2, min: 0, max: 8, step: 1, unit: 'px', section: 'track' },
      { key: 'gap', label: 'Button Gap', control: 'number', defaultValue: 0, min: 0, max: 8, step: 1, unit: 'px', section: 'track' },
      // ── Per-state colors (filtered by State variant). Icon-only atom,
      // so the foreground knob is the icon color (CSS `color` driving
      // `currentColor` in the icon SVG).
      { key: 'inactiveIcon', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverIcon', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'focusIcon', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'activeBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeIcon', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'active' } },
      { key: 'disabledIcon', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
      // Focus ring + disabled opacity in their own sections.
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // ── Shared sizing (applies to every button state)
      { key: 'buttonSize', label: 'Button Size', control: 'number', defaultValue: 28, min: 20, max: 44, step: 2, unit: 'px' },
      { key: 'buttonRadius', label: 'Button Radius', control: 'slider', defaultValue: 6, min: 0, max: 99, step: 1, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 12, max: 24, step: 1, unit: 'px' },
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
    ],
    events: [
      { name: 'onChange', description: 'Fires when the user picks a different view.', payload: '{ value: string }' },
    ],
  },
  {
    id: 'tabs',
    name: 'Tabs',
    category: 'Composite',
    description: 'Horizontal tab strip with icon + label, splitting the width between tabs. State knobs cover default / hover / focus / active / disabled across the individual tab item — the track surface is shared.',
    styleProperties: [
      // ── Track surface (shared across all tab states)
      { key: 'trackBg', label: 'Track Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'track' },
      { key: 'trackBorder', label: 'Track Border', control: 'color', defaultValue: 'var(--color-border)', section: 'track' },
      { key: 'trackRadius', label: 'Track Radius', control: 'slider', defaultValue: 8, min: 0, max: 99, step: 1, unit: 'px', section: 'track' },
      { key: 'trackPadding', label: 'Track Padding', control: 'number', defaultValue: 2, min: 0, max: 8, step: 1, unit: 'px', section: 'track' },
      { key: 'gap', label: 'Tab Gap', control: 'number', defaultValue: 0, min: 0, max: 8, step: 1, unit: 'px', section: 'track' },
      // ── Per-state tab colors. Mirrors the button family: each state owns
      // its own bg/text knobs, filtered into a single "States" section by
      // the State variant. Default is the resting inactive tab; active is
      // the currently-selected tab's appearance.
      { key: 'inactiveText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'focusText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'activeBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'active' } },
      { key: 'disabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
      // Focus ring + disabled opacity each live in their own section — they
      // sit semantically next to the state-scoped color knobs but are
      // standalone treatments (ring outline / dimming) rather than
      // foreground/background colors.
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // ── Shared sizing (applies to every tab state)
      { key: 'tabRadius', label: 'Tab Radius', control: 'slider', defaultValue: 6, min: 0, max: 99, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Tab Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Tab Padding Y', control: 'number', defaultValue: 6, min: 2, max: 14, step: 1, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Inactive Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'] },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 12, min: 10, max: 20, step: 1, unit: 'px' },
      { key: 'iconGap', label: 'Icon Gap', control: 'number', defaultValue: 6, min: 2, max: 12, step: 1, unit: 'px' },
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
    ],
    events: [
      { name: 'onChange', description: 'Fires when the user picks a different tab.', payload: '{ value: string }' },
    ],
  },
  {
    id: 'tabs-underline',
    name: 'Tabs — Underline',
    category: 'Composite',
    description: 'Page-nav tab strip — text labels with an animated underline bar under the active tab. State knobs cover default / hover / focus / active / disabled across the individual tab item — the track bottom rule and bar shape are shared.',
    styleProperties: [
      // ── Track surface (shared — just the bottom rule + tab spacing)
      { key: 'trackBorderColor', label: 'Track Border', control: 'color', defaultValue: 'var(--color-border)', section: 'track' },
      { key: 'trackBorderWidth', label: 'Track Border Width', control: 'number', defaultValue: 1, min: 0, max: 6, step: 1, unit: 'px', section: 'track' },
      { key: 'gap', label: 'Tab Gap', control: 'number', defaultValue: 4, min: 0, max: 16, step: 1, unit: 'px', section: 'track' },
      // ── Per-state tab colors. Mirrors the tabs atom shape: each state
      // owns its own text color, filtered into a single "States" section
      // by the State variant. Active also owns the underline bar color —
      // the bar is the active-state's defining visual.
      { key: 'inactiveText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
      { key: 'hoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'focusText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'activeText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'active' } },
      { key: 'barColor', label: 'Bar Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'active' } },
      { key: 'disabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
      // Focus ring + disabled opacity in their own sections — standalone
      // treatments (ring outline / dimming) rather than fg/bg colors.
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // ── Bar shape (structural — always defines what the bar looks like
      // when an active tab is rendered, so shared across states)
      { key: 'barHeight', label: 'Bar Height', control: 'number', defaultValue: 2, min: 1, max: 6, step: 1, unit: 'px' },
      { key: 'barRadius', label: 'Bar Radius', control: 'slider', defaultValue: 2, min: 0, max: 4, step: 1, unit: 'px' },
      // ── Shared sizing (applies to every tab state)
      { key: 'paddingX', label: 'Tab Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Tab Padding Y', control: 'number', defaultValue: 8, min: 4, max: 16, step: 1, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 11, max: 16, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Inactive Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'] },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      { key: 'iconGap', label: 'Icon Gap', control: 'number', defaultValue: 6, min: 2, max: 12, step: 1, unit: 'px' },
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
    ],
    events: [
      { name: 'onChange', description: 'Fires when the user picks a different tab.', payload: '{ value: string }' },
    ],
  },
  {
    id: 'filter-tabs',
    name: 'Filter Tabs',
    category: 'Composite',
    description: 'Segmented tab strip used for status filters like All / Active / Draft. State knobs cover default / hover / focus / active / disabled across the individual filter chip — the track surface is shared.',
    styleProperties: [
      // ── Track surface (shared across all states)
      { key: 'trackBg', label: 'Track Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'track' },
      { key: 'trackBorder', label: 'Track Border', control: 'color', defaultValue: 'var(--color-border)', section: 'track' },
      { key: 'trackRadius', label: 'Track Radius', control: 'slider', defaultValue: 8, min: 0, max: 99, step: 1, unit: 'px', section: 'track' },
      { key: 'trackPadding', label: 'Track Padding', control: 'number', defaultValue: 2, min: 0, max: 8, step: 1, unit: 'px', section: 'track' },
      { key: 'gap', label: 'Tab Gap', control: 'number', defaultValue: 0, min: 0, max: 8, step: 1, unit: 'px', section: 'track' },
      // ── Per-state colors (filtered by State variant)
      { key: 'inactiveText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'focusText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'activeBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'active' } },
      { key: 'disabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
      // Focus ring + disabled opacity in their own sections — standalone
      // treatments (ring outline / dimming) rather than fg/bg colors.
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // ── Shared sizing (applies to every chip state)
      { key: 'tabRadius', label: 'Tab Radius', control: 'slider', defaultValue: 6, min: 0, max: 99, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Tab Padding X', control: 'number', defaultValue: 12, min: 6, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Tab Padding Y', control: 'number', defaultValue: 6, min: 2, max: 14, step: 1, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Inactive Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'] },
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
    ],
    events: [
      { name: 'onChange', description: 'Fires when the user picks a different filter.', payload: '{ value: string }' },
    ],
  },
  {
    id: 'button-group',
    name: 'Button Group',
    category: 'Composite',
    description: 'Segmented button group with connected buttons. State knobs cover default / hover / focus / active / disabled across the individual button — the connecting border and outer frame are shared.',
    styleProperties: [
      // ── Frame (shared across all states — the connecting borders and
      // outer rounded frame define the group as a single unit)
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'frame' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 20, step: 1, unit: 'px', section: 'frame' },
      // ── Per-state colors (filtered by State variant). Unlike the other
      // segmented atoms, each button has its own non-transparent bg so
      // every state owns both bg and text.
      { key: 'inactiveBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'states', showWhen: { state: 'default' } },
      { key: 'inactiveText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'focusText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'activeBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'active' } },
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'states', showWhen: { state: 'disabled' } },
      { key: 'disabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
      // Focus ring + disabled opacity in their own sections.
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // ── Shared sizing (applies to every button state)
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 16, min: 8, max: 32, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 8, min: 4, max: 16, step: 2, unit: 'px' },
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
    ],
    events: [
      { name: 'onChange', description: 'Fires when the user picks a different option.', payload: '{ value: string }' },
    ],
  },
  {
    id: 'side-flexpane',
    name: 'Side Flexpane',
    category: 'Composite',
    description: 'Right-sliding edit panel with header, scrollable body, and footer actions.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 0, min: 0, max: 20, step: 1, unit: 'px' },
      { key: 'width', label: 'Width', control: 'number', defaultValue: 380, min: 280, max: 520, step: 20, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 24, min: 12, max: 40, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 16, min: 8, max: 32, step: 2, unit: 'px' },
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 16, min: 13, max: 22, step: 1, unit: 'px' },
      { key: 'labelColor', label: 'Label Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    ],
    layoutVariants: [],
    events: [
      { name: 'onClose', description: 'Fires when the user dismisses the flexpane via the close affordance or backdrop click.', payload: 'void' },
      { name: 'onResize', description: 'Fires while the user drags the left-edge handle to resize. Final width on drag end.', payload: '{ width: number }' },
    ],
  },
  {
    id: 'page-header',
    name: 'Page Header',
    category: 'Composite',
    description: 'Icon + title + meta text with trailing action buttons.',
    styleProperties: [
      { key: 'titleColor', label: 'Title Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 22, min: 16, max: 32, step: 1, unit: 'px' },
      { key: 'metaColor', label: 'Meta Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'metaSize', label: 'Meta Size', control: 'number', defaultValue: 13, min: 11, max: 18, step: 1, unit: 'px' },
      { key: 'iconBg', label: 'Icon Bg', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'colors' },
      { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 40, min: 24, max: 64, step: 4, unit: 'px' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 16, min: 6, max: 32, step: 2, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 0, min: 0, max: 40, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 0, min: 0, max: 32, step: 2, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'divider',
    name: 'Divider',
    category: 'Display',
    description: 'Horizontal rule, optionally with a centred label.',
    styleProperties: [
      { key: 'color', label: 'Line Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'thickness', label: 'Thickness', control: 'slider', defaultValue: 1, min: 1, max: 4, step: 1, unit: 'px' },
      { key: 'showLabel', label: 'Show Label', control: 'toggle', defaultValue: false },
      { key: 'labelColor', label: 'Label Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'labelSize', label: 'Label Size', control: 'number', defaultValue: 10, min: 9, max: 14, step: 1, unit: 'px' },
      { key: 'gap', label: 'Label Gap', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'login-page',
    name: 'Login Page',
    category: 'Composite',
    description: 'Sign-in screen with a centered form card on a configurable background — solid, pattern, or image.',
    styleProperties: [
      { key: 'bgColor', label: 'Background Color', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors' },
      { key: 'patternColor', label: 'Pattern Color', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-text) 8%, transparent)', section: 'colors' },
      { key: 'patternSize', label: 'Pattern Size', control: 'number', defaultValue: 18, min: 6, max: 48, step: 2, unit: 'px' },
      { key: 'imageUrl', label: 'Image URL', control: 'text', defaultValue: '' },
      { key: 'imageFit', label: 'Image Fit', control: 'select', defaultValue: 'cover', options: ['cover', 'contain', 'repeat'] },
      { key: 'cardBg', label: 'Card Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'cardBorderColor', label: 'Card Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'cardBorderWidth', label: 'Card Border Width', control: 'number', defaultValue: 1, min: 0, max: 3, step: 1, unit: 'px' },
      { key: 'cardRadius', label: 'Card Radius', control: 'slider', defaultValue: 12, min: 0, max: 32, step: 1, unit: 'px' },
      { key: 'cardShadow', label: 'Card Shadow', control: 'toggle', defaultValue: true },
      { key: 'cardMaxWidth', label: 'Card Max Width', control: 'number', defaultValue: 360, min: 240, max: 560, step: 8, unit: 'px' },
      { key: 'cardPadding', label: 'Card Padding', control: 'number', defaultValue: 32, min: 16, max: 64, step: 4, unit: 'px' },
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 22, min: 14, max: 36, step: 1, unit: 'px' },
      { key: 'titleColor', label: 'Title Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'subtitleSize', label: 'Subtitle Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px' },
      { key: 'subtitleColor', label: 'Subtitle Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'logoSize', label: 'Logo Size', control: 'number', defaultValue: 36, min: 16, max: 80, step: 2, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'background',
        label: 'Background',
        options: [
          { value: 'solid', label: 'Solid' },
          { value: 'dots', label: 'Dot Grid' },
          { value: 'stripes', label: 'Diagonal Stripes' },
          { value: 'image', label: 'Image' },
        ],
        defaultValue: 'solid',
      },
    ],
  },
  {
    id: 'error-page',
    name: 'Error Page',
    category: 'Composite',
    description: 'Centered error / not-found layout — code, title, message, and action buttons.',
    styleProperties: [
      { key: 'codeSize', label: 'Code Size', control: 'number', defaultValue: 88, min: 48, max: 160, step: 4, unit: 'px' },
      { key: 'codeColor', label: 'Code Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'colors' },
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 24, min: 16, max: 40, step: 1, unit: 'px' },
      { key: 'titleColor', label: 'Title Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'messageSize', label: 'Message Size', control: 'number', defaultValue: 14, min: 11, max: 20, step: 1, unit: 'px' },
      { key: 'messageColor', label: 'Message Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'iconBg', label: 'Icon Tile Bg', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'colors' },
      { key: 'iconColor', label: 'Icon Tile Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
      { key: 'iconSize', label: 'Icon Tile Size', control: 'number', defaultValue: 56, min: 32, max: 96, step: 4, unit: 'px' },
      { key: 'messageMaxWidth', label: 'Message Max Width', control: 'number', defaultValue: 448, min: 240, max: 720, step: 8, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'variant',
        label: 'Variant',
        options: [
          { value: '404', label: '404 — Not Found' },
          { value: '500', label: '500 — Server Error' },
          { value: 'empty', label: 'Empty / Generic' },
        ],
        defaultValue: '404',
      },
    ],
  },
  {
    id: 'sidebar-nav-item',
    name: 'Sidebar Nav Item',
    category: 'Composite',
    description: 'Icon + label row used in the left navigation. State knobs cover default / hover / focus / active / disabled across the row — the active state is the currently-selected nav item (renders with `aria-current="page"`). Icon tile and sizing are shared across every state.',
    styleProperties: [
      // ── Per-state row colors. Filtered into a single "States" section
      // by the State variant. Each state owns both bg and text knobs
      // (the row is opaque enough that bg matters). Focus is the
      // exception — text knob plus the standalone ring.
      { key: 'inactiveBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'default' } },
      { key: 'inactiveText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'states', showWhen: { state: 'default' } },
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-surface) 60%, transparent)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'focusText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'activeBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'active' } },
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'disabled' } },
      { key: 'disabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
      // Focus ring + disabled opacity in their own sections.
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // ── Shared sizing (applies to every state)
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 16, step: 1, unit: 'px' },
      { key: 'gap', label: 'Icon Gap', control: 'number', defaultValue: 10, min: 4, max: 20, step: 1, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 11, max: 18, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600', '700'] },
      // ── Icon tile (sub-element, shared across every state)
      { key: 'iconBg', label: 'Icon Tile Bg', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'icon' },
      { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'icon' },
      { key: 'iconBoxSize', label: 'Icon Tile Size', control: 'number', defaultValue: 24, min: 16, max: 36, step: 2, unit: 'px', section: 'icon' },
      { key: 'iconRadius', label: 'Icon Tile Radius', control: 'slider', defaultValue: 6, min: 0, max: 12, step: 1, unit: 'px', section: 'icon' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 14, min: 10, max: 24, step: 1, unit: 'px', section: 'icon' },
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
    ],
    events: [
      { name: 'onClick', description: 'Fires when the user clicks the nav item (or activates it via Enter).', payload: 'MouseEvent' },
    ],
  },
  {
    id: 'explorer-list-item',
    name: 'Explorer List Item',
    category: 'Composite',
    description: "Component-explorer / file-tree row. State knobs cover default / hover / focus / active / disabled — the active state is the selected entry and shows a left rail (an accent bar) instead of a filled tile, distinguishing it from SidebarNavItem's icon-tile style.",
    styleProperties: [
      // ── Per-state row colors. Filtered into a single "States" section
      // by the State variant. Each state owns bg + text where relevant;
      // focus is the exception (text knob + standalone ring).
      { key: 'inactiveBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'default' } },
      { key: 'inactiveText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'states', showWhen: { state: 'default' } },
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-surface) 60%, transparent)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'focusText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'activeBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'active' } },
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'disabled' } },
      { key: 'disabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
      // Focus ring + disabled opacity in their own sections.
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // Rail — the visual treatment of the active state. Scoped to the
      // active state so the knobs sit next to activeBg / activeText.
      { key: 'railColor', label: 'Rail Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'rail', showWhen: { state: 'active' } },
      { key: 'railWidth', label: 'Rail Width', control: 'number', defaultValue: 2, min: 1, max: 6, step: 1, unit: 'px', section: 'rail', showWhen: { state: 'active' } },
      { key: 'railHeight', label: 'Rail Height', control: 'number', defaultValue: 16, min: 8, max: 24, step: 2, unit: 'px', section: 'rail', showWhen: { state: 'active' } },
      { key: 'railRadius', label: 'Rail Radius', control: 'slider', defaultValue: 999, min: 0, max: 999, step: 1, unit: 'px', section: 'rail', showWhen: { state: 'active' } },
      // Trailing slot — shared across every state (always visible).
      { key: 'trailingColor', label: 'Trailing Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'trailing' },
      { key: 'trailingSize', label: 'Trailing Size', control: 'number', defaultValue: 10, min: 8, max: 14, step: 1, unit: 'px', section: 'trailing' },
      // ── Shared sizing (applies to every state)
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 8, min: 4, max: 16, step: 1, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 11, max: 16, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'] },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 8, min: 2, max: 16, step: 1, unit: 'px' },
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
    ],
    events: [
      { name: 'onClick', description: 'Fires when the user clicks the row (selection or navigation).', payload: 'MouseEvent' },
    ],
  },
  {
    id: 'explorer-section',
    name: 'Explorer Section',
    category: 'Composite',
    description: 'Disclosure-style section header for grouping rows in a navigation list. Chevron rotates with the open state; indicator slot is for category color dots etc. State knobs cover default / hover / focus / disabled. `active` is intentionally omitted — section headers have no selection concept; toggling drives the orthogonal `open` variant.',
    styleProperties: [
      // ── Per-state row colors. Filtered into the "States" section by
      // the State variant. The header is always a button, so all state
      // rules fire on the root selector. Disabled is a visual treatment
      // (dimmed, muted), not strictly an interaction state.
      { key: 'inactiveBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'default' } },
      { key: 'inactiveText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-surface) 40%, transparent)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'focusText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'disabled' } },
      { key: 'disabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'states', showWhen: { state: 'disabled' } },
      // Focus ring + disabled opacity in their own sections.
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // ── Shared sizing (applies to every state)
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 6, min: 0, max: 12, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 8, min: 0, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '600', options: ['500', '600', '700'] },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 8, min: 2, max: 16, step: 1, unit: 'px' },
      // ── Chevron sub-element (shared across every state)
      { key: 'chevronColor', label: 'Chevron Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'chevron' },
      { key: 'chevronSize', label: 'Chevron Size', control: 'number', defaultValue: 12, min: 8, max: 18, step: 1, unit: 'px', section: 'chevron' },
      // ── Trailing sub-element (shared)
      { key: 'trailingColor', label: 'Trailing Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'trailing' },
      { key: 'trailingSize', label: 'Trailing Size', control: 'number', defaultValue: 10, min: 8, max: 14, step: 1, unit: 'px', section: 'trailing' },
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
        // chevron rotation and `aria-expanded` on the atom.
        key: 'open',
        label: 'Open',
        options: [
          { value: 'true', label: 'Expanded' },
          { value: 'false', label: 'Collapsed' },
        ],
        defaultValue: 'true',
      },
    ],
    events: [
      { name: 'onToggle', description: 'Fires when the user clicks the section header to expand or collapse children.', payload: '{ open: boolean }' },
    ],
  },
  {
    id: 'inline-action',
    name: 'Inline Action',
    category: 'Buttons',
    description: 'Tertiary text-with-optional-icon button for dense UI — "Reset section," "Match in N other," "Edit." Muted by default; transitions to accent on hover. Smaller and less prominent than ButtonGhost; used inline in section headers and field rows.',
    styleProperties: [
      // Text-only button: only icon color (well, text color) changes per state.
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
      { key: 'hoverColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'activeColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'active' } },
      { key: 'focusRingColor', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'focusColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'states', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
      // Shared style
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 10, min: 9, max: 14, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'] },
      { key: 'gap', label: 'Icon Gap', control: 'number', defaultValue: 4, min: 2, max: 8, step: 1, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 10, min: 8, max: 16, step: 1, unit: 'px' },
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
      { name: 'onClick', description: 'Fires on mouse click or Enter/Space activation.', payload: 'MouseEvent<HTMLButtonElement>' },
    ],
  },
  {
    id: 'section-header',
    name: 'Section Header',
    category: 'Display',
    description: 'Small uppercase label for grouping fields in dense settings panels — the "VARIANT" / "COLORS" / "STYLE" labels above grouped form rows. Distinct from PageHeader (page-level) and DetailSection (bordered card).',
    styleProperties: [
      { key: 'titleColor', label: 'Title Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'colors' },
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px' },
      { key: 'titleWeight', label: 'Title Weight', control: 'select', defaultValue: '600', options: ['500', '600', '700'] },
      { key: 'subtitleColor', label: 'Subtitle Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'subtitleSize', label: 'Subtitle Size', control: 'number', defaultValue: 10, min: 9, max: 14, step: 1, unit: 'px' },
      { key: 'gap', label: 'Title-Subtitle Gap', control: 'number', defaultValue: 2, min: 0, max: 12, step: 1, unit: 'px' },
      { key: 'marginBottom', label: 'Margin Bottom', control: 'number', defaultValue: 12, min: 0, max: 32, step: 2, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'detail-section',
    name: 'Detail Section',
    category: 'Display',
    description: 'Card-like section with icon header, title/subtitle, and an accent rail.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 4, min: 0, max: 20, step: 1, unit: 'px' },
      { key: 'padding', label: 'Padding', control: 'number', defaultValue: 20, min: 8, max: 40, step: 2, unit: 'px' },
      { key: 'iconBg', label: 'Icon Bg', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors' },
      { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 15, min: 12, max: 22, step: 1, unit: 'px' },
      { key: 'subtitleColor', label: 'Subtitle Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'accentWidth', label: 'Accent Rail Width', control: 'slider', defaultValue: 3, min: 0, max: 8, step: 1, unit: 'px' },
      { key: 'accentColor', label: 'Accent Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'colors' },
    ],
    layoutVariants: [],
  },
  {
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
  },
  {
    id: 'link',
    name: 'Link',
    category: 'Display',
    description: "Generic inline text link — three underline modes plus an optional external indicator. State knobs cover default / hover / focus / disabled on the anchor. `:active` is intentionally omitted — for a plain anchor it's the transient mouse-down pseudo and overlaps with hover semantically.",
    styleProperties: [
      // ── Per-state colors. Filtered into a single "States" section by
      // the State variant. Link is transparent in every state — no bg
      // knobs, just text colors plus the standalone focus ring and
      // disabled opacity.
      { key: 'inactiveText', label: 'Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'default' } },
      { key: 'hoverText', label: 'Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'focusText', label: 'Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'disabledText', label: 'Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // ── Shared typography + underline knobs (apply across every state)
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 10, max: 20, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'] },
      { key: 'underlineOffset', label: 'Underline Offset', control: 'number', defaultValue: 3, min: 1, max: 8, step: 1, unit: 'px' },
      { key: 'underlineThickness', label: 'Underline Thickness', control: 'number', defaultValue: 1, min: 1, max: 3, step: 1, unit: 'px' },
      { key: 'externalIconSize', label: 'External Icon Size', control: 'number', defaultValue: 12, min: 8, max: 18, step: 1, unit: 'px' },
      { key: 'externalIconGap', label: 'External Icon Gap', control: 'number', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px' },
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
        key: 'underline',
        label: 'Underline',
        options: [
          { value: 'none', label: 'None' },
          { value: 'hover', label: 'On Hover' },
          { value: 'always', label: 'Always' },
        ],
        defaultValue: 'hover',
      },
      {
        key: 'external',
        label: 'External',
        options: [
          { value: 'false', label: 'Internal' },
          { value: 'true', label: 'External' },
        ],
        defaultValue: 'false',
      },
    ],
    events: [
      { name: 'onClick', description: "Fires on click. The consumer's router or `href` handles the navigation.", payload: 'MouseEvent<HTMLAnchorElement>' },
    ],
  },
  {
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
  },
  {
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
  },
  {
    id: 'thumbnail',
    name: 'Thumbnail',
    category: 'Display',
    description: 'Bounded image frame for product photos, file previews, and entity logos. Falls back to a placeholder icon when no image is provided.',
    styleProperties: [
      { key: 'size', label: 'Size', control: 'number', defaultValue: 48, min: 24, max: 120, step: 4, unit: 'px' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 12, min: 0, max: 60, step: 1, unit: 'px', section: 'colors' },
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderWidth', label: 'Border Width', control: 'number', defaultValue: 2, min: 0, max: 4, step: 1, unit: 'px' },
      { key: 'placeholderColor', label: 'Placeholder Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'colors' },
    ],
    layoutVariants: [
      {
        key: 'fit',
        label: 'Fit',
        options: [
          { value: 'cover', label: 'Cover' },
          { value: 'contain', label: 'Contain' },
        ],
        defaultValue: 'cover',
      },
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'image', label: 'With Image' },
          { value: 'placeholder', label: 'Placeholder' },
        ],
        defaultValue: 'image',
      },
    ],
  },
  {
    id: 'calendar',
    name: 'Calendar',
    category: 'Display',
    description: "Month-view calendar. Selects today on mount; click a day to move the selection. Today's outline stays put regardless of selection. Light-touch atom — selection state internal (overridable), no library binding.",
    styleProperties: [
      // ── Frame: the outer container's surface, border, corners, padding.
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'frame' },
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'frame' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 12, min: 0, max: 24, step: 1, unit: 'px', section: 'frame' },
      { key: 'padding', label: 'Padding', control: 'number', defaultValue: 16, min: 4, max: 32, step: 2, unit: 'px', section: 'frame' },
      // Elevation — on by default (the floating-surface look), tunable rather
      // than a bare on/off: the box-shadow is built from these three vars.
      // (Code can still drop it entirely with the `shadow={false}` prop.)
      { key: 'shadowColor', label: 'Color', control: 'color', defaultValue: 'rgba(0, 0, 0, 0.12)', section: 'shadow' },
      { key: 'shadowBlur', label: 'Blur', control: 'slider', defaultValue: 20, min: 0, max: 48, step: 1, unit: 'px', section: 'shadow' },
      { key: 'shadowOffsetY', label: 'Offset Y', control: 'slider', defaultValue: 6, min: 0, max: 24, step: 1, unit: 'px', section: 'shadow' },

      // ── Header: month / year label + prev/next nav buttons.
      { key: 'titleColor', label: 'Title Color', control: 'color', defaultValue: 'var(--color-text)', section: 'header' },
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 14, min: 12, max: 20, step: 1, unit: 'px', section: 'header' },
      { key: 'navColor', label: 'Nav Button Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'header' },

      // ── Weekday row: the "Sun Mon Tue..." labels above the day grid.
      { key: 'weekdayColor', label: 'Weekday Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'weekday' },
      { key: 'weekdaySize', label: 'Weekday Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px', section: 'weekday' },

      // ── Shared States: state colors that apply across day, month, and
      // year cells. Tuning these once changes all three cell types in the
      // matching state. Section appears only for the four states whose
      // knobs live here (default / today / selected / hover). Listed before
      // per-cell-type sections so designers tune cross-cutting concerns first.
      { key: 'defaultColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'shared-states', showWhen: { cellState: 'default' } },
      { key: 'todayBorderColor', label: 'Outline Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'shared-states', showWhen: { cellState: 'today' } },
      { key: 'todayColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'shared-states', showWhen: { cellState: 'today' } },
      { key: 'selectedBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'shared-states', showWhen: { cellState: 'selected' } },
      { key: 'selectedColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'shared-states', showWhen: { cellState: 'selected' } },
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-text) 6%, transparent)', section: 'shared-states', showWhen: { cellState: 'hover' } },

      // ── Date Cell: dimensions + day-only state colors. In-range / range
      // edges / outside-month / disabled only exist on day cells, so their
      // color knobs live here gated by `cellState`. (Today, selected, hover,
      // and default text color are shared across all cell types — those
      // live in "Shared States" above.)
      { key: 'cellSize', label: 'Cell Size', control: 'number', defaultValue: 36, min: 28, max: 48, step: 2, unit: 'px', section: 'day-cell' },
      { key: 'cellFontSize', label: 'Cell Font Size', control: 'number', defaultValue: 13, min: 11, max: 18, step: 1, unit: 'px', section: 'day-cell' },
      { key: 'cellRadius', label: 'Cell Radius', control: 'slider', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px', section: 'day-cell' },
      { key: 'inRangeBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'day-cell', showWhen: { cellState: 'in-range' } },
      { key: 'inRangeColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'day-cell', showWhen: { cellState: 'in-range' } },
      { key: 'rangeStartBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'day-cell', showWhen: { cellState: 'range-start' } },
      { key: 'rangeStartColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'day-cell', showWhen: { cellState: 'range-start' } },
      { key: 'rangeEndBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'day-cell', showWhen: { cellState: 'range-end' } },
      { key: 'rangeEndColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'day-cell', showWhen: { cellState: 'range-end' } },
      { key: 'outsideColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'day-cell', showWhen: { cellState: 'outside' } },
      { key: 'disabledColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'day-cell', showWhen: { cellState: 'disabled' } },

      // ── Month & Year Cells: drill-up navigation surfaces. One Cell Size
      // knob drives both dimensions (square cells, same pattern as Date Cell)
      // and is shared between month and year cells — they live in the same
      // 4-col grid with the same visual role, so one set of knobs is enough.
      // Knob keeps the `monthCell` prefix; CSS for both `.uxm-calendar__month`
      // and `.uxm-calendar__year` reads it.
      { key: 'monthCellSize', label: 'Cell Size', control: 'number', defaultValue: 64, min: 40, max: 120, step: 4, unit: 'px', section: 'month-year-cells' },
      { key: 'monthCellFontSize', label: 'Cell Font Size', control: 'number', defaultValue: 13, min: 11, max: 18, step: 1, unit: 'px', section: 'month-year-cells' },

      // ── Today button: the footer action that jumps the view back to the
      // current month. Its own knobs (not the today-CELL ones above).
      { key: 'todayButtonColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'todayButton' },
      { key: 'todayButtonHoverBg', label: 'Hover Background', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-accent) 12%, transparent)', section: 'todayButton' },
      { key: 'todayButtonSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 11, max: 18, step: 1, unit: 'px', section: 'todayButton' },
    ],
    layoutVariants: [
      {
        key: 'cellState',
        label: 'Cell State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'today', label: 'Today' },
          { value: 'selected', label: 'Selected' },
          { value: 'in-range', label: 'In Range' },
          { value: 'range-start', label: 'Range Start' },
          { value: 'range-end', label: 'Range End' },
          { value: 'outside', label: 'Outside Month' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'hover', label: 'Hover' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onChange', description: 'Fires when the user picks a date cell.', payload: '{ value: Date }' },
      { name: 'onMonthChange', description: 'Fires when the user navigates to a different month via the prev/next chevrons or by tapping the header.', payload: '{ year: number, month: number }' },
    ],
  },
  {
    id: 'icon-tile',
    name: 'Icon Tile',
    category: 'Display',
    description: 'Small rounded square wrapping an icon with a colored background — the accent chip in front of row cards / list items / type entries.',
    styleProperties: [
      { key: 'size', label: 'Tile Size', control: 'number', defaultValue: 28, min: 16, max: 56, step: 2, unit: 'px' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 6, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'iconBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors' },
      { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 14, min: 10, max: 28, step: 1, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'meta-row',
    name: 'Meta Row',
    category: 'Display',
    description: 'Dot-separated metadata strip — "v1.2 · 3 days ago · Sarah" — used in card footers and list rows.',
    styleProperties: [
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px' },
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'gap', label: 'Item Gap', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px' },
      { key: 'dotSize', label: 'Dot Size', control: 'number', defaultValue: 4, min: 2, max: 10, step: 1, unit: 'px' },
      { key: 'dotColor', label: 'Dot Color', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-text) 20%, transparent)', section: 'colors' },
    ],
    layoutVariants: [],
  },
  {
    id: 'form-field',
    name: 'Form Field',
    category: 'Forms',
    description: 'Sole owner of label theming for the form family. Pairs a label with any UXM input (TextInput, Select, ToggleSwitch, etc.); optional hint line below. `labelPosition` flips between top (column stack) and side (grid layout).',
    styleProperties: [
      { key: 'labelColor', label: 'Label Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'colors' },
      { key: 'labelSize', label: 'Label Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px' },
      { key: 'labelWeight', label: 'Label Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'] },
      { key: 'hintColor', label: 'Hint Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'hintSize', label: 'Hint Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px' },
      // Label Gap — top-layout-specific. Lives in its own `topLayout`
      // section parallel to `sideLayout`, so the default STYLE section
      // contains only truly-shared knobs (labelSize, weight, hintSize,
      // hintGap) instead of getting polluted with a per-position knob.
      // Top and side layouts use the gap for visually different
      // distances (vertical vs horizontal), so each owns its own value.
      { key: 'gap', label: 'Label Gap', control: 'number', defaultValue: 8, min: 2, max: 32, step: 1, unit: 'px', section: 'topLayout', showWhen: { labelPosition: 'top' } },
      { key: 'hintGap', label: 'Hint Gap', control: 'number', defaultValue: 2, min: 0, max: 12, step: 1, unit: 'px' },
      // Side-layout only: width of the label column. Gated on
      // labelPosition=side because it has no effect in top layout.
      { key: 'sideLabelWidth', label: 'Side Label Width', control: 'number', defaultValue: 120, min: 60, max: 240, step: 4, unit: 'px', section: 'sideLayout', showWhen: { labelPosition: 'side' } },
      // Side-layout only: horizontal gap between the label column and
      // the input column. Separate from the top-layout `gap` knob since
      // horizontal label-input distance is visually different from
      // vertical (and brands often want different values for each).
      { key: 'sideGap', label: 'Label Gap', control: 'number', defaultValue: 16, min: 2, max: 48, step: 1, unit: 'px', section: 'sideLayout', showWhen: { labelPosition: 'side' } },
      // Side-layout only: alignment of the label text within the label
      // column. Default "start" (left in LTR) puts label text at the
      // column's left edge — reads naturally with the eye flowing
      // left-to-right into the input. "end" (right) is the alternative
      // for projects that prefer labels flush against the input.
      { key: 'sideLabelAlign', label: 'Side Label Align', control: 'select', defaultValue: 'start', options: ['start', 'end'], section: 'sideLayout', showWhen: { labelPosition: 'side' } },
    ],
    layoutVariants: [
      // Local labelPosition variant (top / side). Floating is intentionally
      // omitted — it requires absolute positioning + state-driven CSS
      // (:has(:not(:placeholder-shown))) that doesn't work with non-input
      // children like Select or PillSelect. Top + side cover the layout
      // shapes that work uniformly with every input atom.
      {
        key: 'labelPosition',
        label: 'Label Position',
        options: [
          { value: 'top', label: 'Top' },
          { value: 'side', label: 'Side' },
        ],
        defaultValue: 'top',
      },
    ],
  },
  {
    id: 'property-field',
    name: 'Property Field',
    category: 'Display',
    description: 'Single label + monospace value pair used for metadata readouts. The grid layout that arranges multiple PropertyFields is a separate atom (`property-grid`).',
    styleProperties: [
      { key: 'labelColor', label: 'Label Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'labelSize', label: 'Label Size', control: 'number', defaultValue: 10, min: 9, max: 14, step: 1, unit: 'px' },
      { key: 'valueColor', label: 'Value Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'valueSize', label: 'Value Size', control: 'number', defaultValue: 13, min: 11, max: 18, step: 1, unit: 'px' },
      { key: 'gap', label: 'Label/Value Gap', control: 'number', defaultValue: 4, min: 2, max: 12, step: 1, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'property-grid',
    name: 'Property Grid',
    category: 'Display',
    description: "Auto-fill grid wrapper that lays out PropertyField pairs. Layout-only — chip / field theming flows through the PropertyField atom's own registry.",
    styleProperties: [
      { key: 'rowGap', label: 'Row Gap', control: 'number', defaultValue: 16, min: 4, max: 32, step: 2, unit: 'px' },
      { key: 'columnGap', label: 'Column Gap', control: 'number', defaultValue: 32, min: 12, max: 64, step: 4, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'list-item',
    name: 'List Item',
    category: 'Composite',
    description: "Row with icon, title, and optional trailing slot — used in stacked lists. Renders as `<div>` (static) or `<button>` / `<a>` (interactive) depending on the atom's `interactive` / `href` props. State knobs gate on `mode` rather than trailing — trailing is purely a visual choice and the two are orthogonal: an interactive row can have any trailing, a static row can have a chevron decoration without being tappable.",
    styleProperties: [
      // ── Per-state row colors. Filtered into the "States" section by
      // the State variant. Default-state knobs (`inactiveBg`,
      // `inactiveText`) gate on `state: "default"` only — so the bg /
      // text are editable in both static and interactive modes. The
      // interactive-only state knobs (hover / focus / active)
      // additionally gate on `mode: "interactive"` so they hide
      // entirely when the row is rendered as a display-only `<div>`.
      // `disabled` is a visual treatment, not an interaction state, so
      // its knobs are NOT mode-gated.
      { key: 'inactiveBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'states', showWhen: { state: 'default' } },
      { key: 'inactiveText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'default' } },
      { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'states', showWhen: { state: 'hover', mode: 'interactive' } },
      { key: 'hoverText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover', mode: 'interactive' } },
      { key: 'focusText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus', mode: 'interactive' } },
      { key: 'activeBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'states', showWhen: { state: 'active', mode: 'interactive' } },
      { key: 'activeText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'active', mode: 'interactive' } },
      { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'states', showWhen: { state: 'disabled' } },
      { key: 'disabledText', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
      // Focus ring + disabled opacity in their own sections.
      { key: 'focusRing', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus', mode: 'interactive' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
      // ── Container (List wrapper)
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'container' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px', section: 'container' },
      // ── Shared sizing (applies to every state)
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 16, min: 8, max: 32, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'gap', label: 'Icon Gap', control: 'number', defaultValue: 12, min: 4, max: 24, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 14, min: 11, max: 18, step: 1, unit: 'px' },
      // ── Sub-elements (shared across every state)
      { key: 'valueColor', label: 'Value Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'value', showWhen: { value: 'shown' } },
      { key: 'valueSize', label: 'Value Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'value', showWhen: { value: 'shown' } },
      // Trailing slot is purely composable — the consumer passes whatever
      // ReactNode they want. The preview demos the canonical pattern per
      // mode (chevron for interactive nav rows, Tag for static status
      // rows), so a single Chevron Color knob covers the interactive
      // example. Other trailing decorations (Tag, Badge, Avatar, etc.)
      // bring their own styling via their respective atoms.
      { key: 'chevronColor', label: 'Chevron Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'trailing', showWhen: { mode: 'interactive' } },
      // High-contrast icon "stamp" — bright accent tile with a card-coloured
      // glyph inside. Keeps the icon visually distinct from the row bg in
      // every state (default / hover / active / disabled), so the shared
      // icon knobs don't need to vary per-state.
      { key: 'iconBg', label: 'Icon Bg', control: 'color', defaultValue: 'var(--color-accent)', section: 'icon' },
      { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-card)', section: 'icon' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 24, min: 16, max: 40, step: 2, unit: 'px', section: 'icon' },
    ],
    layoutVariants: [
      {
        key: 'mode',
        label: 'Mode',
        options: [
          // `static` → renders as `<div>`; no hover / focus / active
          // styling. `interactive` → renders as `<button>` (or `<a>`
          // when href is passed); full state styling. Mode is
          // orthogonal to trailing: any trailing can sit in either mode.
          { value: 'static', label: 'Static' },
          { value: 'interactive', label: 'Interactive' },
        ],
        defaultValue: 'interactive',
      },
      {
        key: 'state',
        label: 'State',
        options: [
          // `default` and `disabled` are always available — every row
          // has a resting state, and `disabled` is a visual treatment
          // (dimmed, muted) that applies regardless of mode. The CSS
          // rule includes a bare `.uxm-list-item[aria-disabled]`
          // selector that fires on `<div>` as well as `<button>` /
          // `<a>`. The interactive-only states (hover / focus / active)
          // are option-level-gated to `mode: "interactive"`: when the
          // row is static, the picker collapses to "Default" +
          // "Disabled", which self-explains as "this row only has
          // visual states" without the picker disappearing.
          { value: 'default', label: 'Default' },
          { value: 'hover', label: 'Hover', showWhen: { mode: 'interactive' } },
          { value: 'focus', label: 'Focus', showWhen: { mode: 'interactive' } },
          { value: 'active', label: 'Active', showWhen: { mode: 'interactive' } },
          { value: 'disabled', label: 'Disabled' },
        ],
        defaultValue: 'default',
      },
      {
        key: 'value',
        label: 'Value Text',
        options: [
          { value: 'shown', label: 'Shown' },
          { value: 'hidden', label: 'Hidden' },
        ],
        defaultValue: 'shown',
      },
      // No `trailing` variant — the preview chooses what to show in
      // the trailing slot based on `mode` (chevron for interactive,
      // Tag for static). Real consumers pass any ReactNode via the
      // atom's `trailing` prop; the editor preview demos the
      // canonical patterns only.
    ],
  },
  {
    id: 'stat-card',
    name: 'Stat Card',
    category: 'Composite',
    description: 'Metric card with value, label, and trend indicator.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 20, step: 1, unit: 'px' },
      { key: 'padding', label: 'Padding', control: 'number', defaultValue: 24, min: 12, max: 40, step: 4, unit: 'px' },
      { key: 'valueSize', label: 'Value Size', control: 'number', defaultValue: 28, min: 18, max: 48, step: 2, unit: 'px' },
      { key: 'labelSize', label: 'Label Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px' },
      { key: 'trendUpColor', label: 'Trend Up', control: 'color', defaultValue: 'var(--color-success-text)', section: 'colors' },
      { key: 'trendDownColor', label: 'Trend Down', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'colors' },
    ],
    layoutVariants: [],
  },
  {
    id: 'page-shell',
    name: 'Page Shell',
    category: 'Composite',
    description:
      'Top-level page layout — sidebar + (optional) top bar + content. Two variants drive the chrome: standard (full chrome, padded content) and canvas (no top bar, full-bleed content for diagrams/lifecycle).',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'colors' },
      { key: 'contentPadding', label: 'Content Padding', control: 'number', defaultValue: 32, min: 0, max: 64, step: 4, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'variant',
        label: 'Variant',
        options: [
          { value: 'standard', label: 'Standard' },
          { value: 'canvas', label: 'Canvas' },
        ],
        defaultValue: 'standard',
      },
    ],
  },
  {
    id: 'type-overview-card',
    name: 'Type Overview Card',
    category: 'Composite',
    description: 'Dashboard summary tile — accent stripe, icon tile, label, count, hover affordance.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 4, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'padding', label: 'Padding', control: 'number', defaultValue: 20, min: 12, max: 40, step: 2, unit: 'px' },
      { key: 'accentColor', label: 'Accent Stripe', control: 'color', defaultValue: 'var(--color-accent)', section: 'colors' },
      { key: 'accentWidth', label: 'Accent Width', control: 'number', defaultValue: 4, min: 2, max: 12, step: 1, unit: 'px' },
      { key: 'iconBg', label: 'Icon Tile Bg', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'colors' },
      { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
      { key: 'iconBoxSize', label: 'Icon Tile Size', control: 'number', defaultValue: 32, min: 24, max: 48, step: 2, unit: 'px' },
      { key: 'iconRadius', label: 'Icon Tile Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'labelSize', label: 'Label Size', control: 'number', defaultValue: 14, min: 11, max: 18, step: 1, unit: 'px' },
      { key: 'labelColor', label: 'Label Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'colors' },
      { key: 'valueSize', label: 'Value Size', control: 'number', defaultValue: 30, min: 20, max: 48, step: 2, unit: 'px' },
      { key: 'valueColor', label: 'Value Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
    ],
    layoutVariants: [],
  },

  // ── Diagram (BI Lifecycle) ──
  {
    id: 'lifecycle-node-card',
    name: 'Lifecycle Node Card',
    category: 'Diagram',
    description: 'State / Condition / Task node card used in the BI Lifecycle canvas.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 6, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 16, min: 8, max: 32, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 12, min: 6, max: 24, step: 2, unit: 'px' },
      { key: 'width', label: 'Width', control: 'number', defaultValue: 280, min: 200, max: 360, step: 10, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 32, min: 24, max: 48, step: 2, unit: 'px' },
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 14, min: 11, max: 18, step: 1, unit: 'px' },
      { key: 'kindSize', label: 'Kind Label Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'type',
        label: 'Node Type',
        options: [
          { value: 'state', label: 'State' },
          { value: 'condition', label: 'Condition' },
          { value: 'task', label: 'Task' },
        ],
        defaultValue: 'state',
      },
    ],
    events: [
      { name: 'onClick', description: 'Fires when the user clicks the node card. Typically opens an inspector or selects the node.', payload: 'MouseEvent' },
    ],
  },
  {
    id: 'lifecycle-terminal',
    name: 'Lifecycle Terminal',
    category: 'Diagram',
    description: "Start / End pill used as the graph's terminal nodes.",
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 4, min: 0, max: 20, step: 1, unit: 'px' },
      { key: 'width', label: 'Width', control: 'number', defaultValue: 60, min: 40, max: 120, step: 4, unit: 'px' },
      { key: 'height', label: 'Height', control: 'number', defaultValue: 32, min: 20, max: 48, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600', '700'] },
    ],
    layoutVariants: [
      {
        key: 'label',
        label: 'Label',
        options: [
          { value: 'Start', label: 'Start' },
          { value: 'End', label: 'End' },
        ],
        defaultValue: 'Start',
      },
    ],
  },
  {
    id: 'lifecycle-edge-label',
    name: 'Lifecycle Edge Label',
    category: 'Diagram',
    description: 'Pill label attached to a transition edge (true / false / custom).',
    styleProperties: [
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 3, min: 0, max: 10, step: 1, unit: 'px' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 999, min: 4, max: 999, step: 1, unit: 'px' },
      { key: 'borderWidth', label: 'Border Width', control: 'number', defaultValue: 1, min: 0, max: 3, step: 1, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 12, min: 9, max: 16, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600', '700'] },
    ],
    layoutVariants: [
      {
        key: 'variant',
        label: 'Variant',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' },
          { value: 'neutral', label: 'Custom / Neutral' },
        ],
        defaultValue: 'true',
      },
    ],
  },
  {
    id: 'lifecycle-plus-button',
    name: 'Lifecycle Plus Button',
    category: 'Diagram',
    description: 'Floating circular + button used to insert a node on a canvas edge.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-accent)', section: 'colors' },
      { key: 'hoverBackgroundColor', label: 'Hover Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
      { key: 'color', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'colors' },
      { key: 'size', label: 'Size', control: 'number', defaultValue: 24, min: 16, max: 40, step: 2, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 14, min: 8, max: 24, step: 1, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'lifecycle-connector',
    name: 'Lifecycle Connector',
    category: 'Diagram',
    description: 'Edge between two nodes — idle / hovered stroke, thickness, arrow, and dashed variant.',
    styleProperties: [
      { key: 'connectorIdleColor', label: 'Idle Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'connectorActiveColor', label: 'Active Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'colors' },
      { key: 'connectorIdleStrokeWidth', label: 'Stroke Width', control: 'slider', defaultValue: 1.5, min: 0.5, max: 4, step: 0.5, unit: 'px' },
      { key: 'connectorActiveStrokeWidth', label: 'Active Stroke Width', control: 'slider', defaultValue: 2, min: 0.5, max: 5, step: 0.5, unit: 'px' },
      { key: 'connectorArrowSize', label: 'Arrow Size', control: 'number', defaultValue: 7, min: 3, max: 14, step: 1, unit: 'px' },
      { key: 'connectorDashPattern', label: 'Dash Pattern', control: 'text', defaultValue: '6 4' },
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'idle', label: 'Idle' },
          { value: 'active', label: 'Active' },
          { value: 'dashed', label: 'Dashed (false)' },
        ],
        defaultValue: 'idle',
      },
    ],
  },
  {
    id: 'lifecycle-connector-knobs',
    name: 'Lifecycle Connector Knobs',
    category: 'Diagram',
    description: 'Pair of insert (+) and rename (pencil) circles that appear when hovering a connector.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Circle Fill', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'size', label: 'Diameter', control: 'number', defaultValue: 22, min: 16, max: 36, step: 1, unit: 'px' },
      { key: 'borderWidth', label: 'Border Width', control: 'number', defaultValue: 1.5, min: 0.5, max: 3, step: 0.5, unit: 'px' },
      { key: 'insertBorderColor', label: 'Insert Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'colors' },
      { key: 'insertIconColor', label: 'Insert Icon', control: 'color', defaultValue: 'var(--color-accent)', section: 'colors' },
      { key: 'editBorderColor', label: 'Edit Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'editIconColor', label: 'Edit Icon', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'gap', label: 'Gap Between Knobs', control: 'number', defaultValue: 4, min: 0, max: 16, step: 1, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'orientation',
        label: 'Orientation',
        options: [
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'vertical', label: 'Vertical' },
        ],
        defaultValue: 'horizontal',
      },
    ],
  },
  {
    id: 'lifecycle-zoom-control',
    name: 'Lifecycle Zoom Control',
    category: 'Diagram',
    description: 'Segmented −/percent/+ zoom control docked at the canvas corner.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 6, min: 0, max: 20, step: 1, unit: 'px' },
      { key: 'buttonSize', label: 'Button Size', control: 'number', defaultValue: 32, min: 24, max: 48, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Value Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px' },
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    ],
    layoutVariants: [],
  },
  {
    id: 'lifecycle-minimap',
    name: 'Lifecycle Minimap',
    category: 'Diagram',
    description: 'Miniature graph overview with a viewport indicator.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 6, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'nodeColor', label: 'Node Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'edgeColor', label: 'Edge Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'viewportBorder', label: 'Viewport Border', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
      { key: 'viewportFill', label: 'Viewport Fill', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-accent) 10%, transparent)', section: 'colors' },
      { key: 'width', label: 'Width', control: 'number', defaultValue: 240, min: 160, max: 320, step: 10, unit: 'px' },
      { key: 'height', label: 'Height', control: 'number', defaultValue: 104, min: 60, max: 200, step: 4, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'lifecycle-action-row',
    name: 'Lifecycle Action Row',
    category: 'Diagram',
    description: 'Row with a type badge + action name + delete — used inside the node flexpane.',
    styleProperties: [
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 6, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 10, min: 4, max: 20, step: 1, unit: 'px' },
      { key: 'fontSize', label: 'Text Size', control: 'number', defaultValue: 13, min: 10, max: 16, step: 1, unit: 'px' },
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'badgeRadius', label: 'Badge Radius', control: 'slider', defaultValue: 999, min: 4, max: 999, step: 1, unit: 'px' },
      { key: 'badgeSize', label: 'Badge Text Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'actionType',
        label: 'Action Type',
        options: [
          { value: 'notify', label: 'Notify' },
          { value: 'transform', label: 'Transform' },
          { value: 'validate', label: 'Validate' },
        ],
        defaultValue: 'notify',
      },
    ],
  },
  {
    id: 'modal',
    name: 'Modal',
    category: 'Feedback',
    description:
      'Standard modal panel — header / body / footer slots — rendered inside the Dialog shell. Theming knobs live here; backdrop styling is global (tokens).',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 12, min: 0, max: 24, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 20, min: 8, max: 40, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 16, min: 8, max: 32, step: 2, unit: 'px' },
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 16, min: 12, max: 24, step: 1, unit: 'px' },
      { key: 'titleColor', label: 'Title Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
    ],
    layoutVariants: [
      {
        key: 'size',
        label: 'Size',
        options: [
          { value: 'sm', label: 'Small (360px)' },
          { value: 'md', label: 'Medium (480px)' },
          { value: 'lg', label: 'Large (640px)' },
          { value: 'fullscreen', label: 'Fullscreen' },
        ],
        defaultValue: 'md',
      },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: ['Dialog', 'Modal'],
      props: [
        { name: 'open', type: 'boolean', required: true, description: 'Dialog open state (controlled). Pair with onOpenChange.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', required: true, description: 'Called when the user requests close (Escape or backdrop click).' },
        { name: 'size', type: '"sm" | "md" | "lg" | "fullscreen"', defaultValue: '"md"', description: 'Modal panel width preset.' },
        { name: 'onClose', type: '() => void', description: 'When set, Modal.Header renders a close X that calls this.' },
        { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Escape key dismisses the dialog.' },
        { name: 'closeOnOutsideClick', type: 'boolean', defaultValue: 'true', description: 'Backdrop click dismisses the dialog.' },
        { name: 'initialFocus', type: 'RefObject<HTMLElement>', description: 'Element to focus on open. Defaults to first focusable in panel.' },
      ],
    },
  },
  {
    id: 'lifecycle-add-step-modal',
    name: 'Lifecycle Add-Step Modal',
    category: 'Diagram',
    description: 'Modal for inserting a new lifecycle step — type radio list + name input.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 6, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'width', label: 'Width', control: 'number', defaultValue: 420, min: 320, max: 560, step: 10, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 20, min: 12, max: 32, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 16, min: 8, max: 28, step: 2, unit: 'px' },
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 16, min: 13, max: 22, step: 1, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'lifecycle-edge-insert-menu',
    name: 'Lifecycle Edge Insert Menu',
    category: 'Diagram',
    description: 'Popover menu appearing on an edge with State / Condition / Task pickers.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 4, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 4, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'itemPaddingX', label: 'Item Padding X', control: 'number', defaultValue: 12, min: 6, max: 24, step: 2, unit: 'px' },
      { key: 'itemPaddingY', label: 'Item Padding Y', control: 'number', defaultValue: 8, min: 4, max: 16, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Text Size', control: 'number', defaultValue: 13, min: 10, max: 16, step: 1, unit: 'px' },
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
    ],
    layoutVariants: [],
  },

  // ── Icons ──
  {
    id: 'icon',
    name: 'Icon',
    category: 'Icons',
    description: 'Decorative line icon. Pick a glyph from the modo icon set, then tune size / stroke / colour.',
    styleProperties: [
      { key: 'color', label: 'Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'size', label: 'Size', control: 'number', defaultValue: 20, min: 10, max: 48, step: 1, unit: 'px' },
      { key: 'strokeWidth', label: 'Stroke Width', control: 'slider', defaultValue: 1.5, min: 0.5, max: 3, step: 0.25, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'glyph',
        label: 'Glyph',
        options: ICON_OPTIONS,
        defaultValue: 'search',
      },
    ],
  },
  {
    id: 'icon-button',
    name: 'Icon Button',
    category: 'Buttons',
    description: 'Utility icon-only button used inside other components (close, edit, delete, kebab, etc.). Full state coverage parity with the rest of the button family.',
    styleProperties: [
      // State-scoped colors — Tag-style filter via showWhen.
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'states', showWhen: { state: 'default' } },
      { key: 'color', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'default' } },
      { key: 'hoverBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'activeBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'active' } },
      { key: 'focusRingColor', label: 'Ring Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'focusColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'focus' } },
      { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'states', showWhen: { state: 'disabled' } },
      { key: 'disabledColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'disabled' } },
      // Shared style
      { key: 'size', label: 'Button Size', control: 'number', defaultValue: 32, min: 20, max: 48, step: 2, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 16, min: 10, max: 28, step: 1, unit: 'px' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'strokeWidth', label: 'Stroke Width', control: 'slider', defaultValue: 1.75, min: 0.5, max: 3, step: 0.25, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'glyph',
        label: 'Glyph',
        options: ICON_OPTIONS,
        defaultValue: 'close',
      },
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
      { name: 'onClick', description: 'Fires on mouse click or Enter/Space activation while focused.', payload: 'MouseEvent<HTMLButtonElement>' },
      { name: 'onFocus', description: 'Fires when the button receives keyboard focus.', payload: 'FocusEvent' },
      { name: 'onBlur', description: 'Fires when the button loses keyboard focus.', payload: 'FocusEvent' },
    ],
  },
];

export function getComponentDef(id: string): ComponentDef | undefined {
  return registry.find((c) => c.id === id);
}

export function getComponentsByCategory(): Record<Category, ComponentDef[]> {
  const result: Record<Category, ComponentDef[]> = {
    App: [],
    Buttons: [],
    Inputs: [],
    Display: [],
    Feedback: [],
    Forms: [],
    Composite: [],
    Layout: [],
    Diagram: [],
    Icons: [],
  };
  for (const def of registry) {
    result[def.category].push(def);
  }
  return result;
}
