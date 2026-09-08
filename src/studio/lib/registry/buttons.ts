import { ICON_OPTIONS } from '@/ui';

import type { ComponentDef } from '../types';

export const buttonsDefs: ComponentDef[] = [
  // ── Buttons ──
  {
    id: 'button-primary',
    name: 'Button — Primary',
    category: 'Buttons',
    description: 'Primary call-to-action button with solid background.',
    styleProperties: [
      // State-scoped colors — Tag-style filter via showWhen. Designers tune
      // background + text per state. Hover shades accent-bold slightly toward
      // text (contrast-safe with white text — a brighter accent would fail);
      // active returns to bold. Matches the atom's `--uxm-button-primary-*`
      // fallbacks so the studio default equals the shipped default.
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'states', showWhen: { state: 'default' } },
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'states', showWhen: { state: 'default' } },
      { key: 'hoverBackgroundColor', label: 'Background', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-accent-bold) 88%, var(--color-text))', section: 'states', showWhen: { state: 'hover' } },
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
      // Hover — a faint accent-subtle wash (like button-secondary), border to
      // accent and text to `--color-text`. Defaults mirror the atom's
      // `--uxm-button-with-icon-hover-*` fallbacks so the studio default equals
      // the shipped default.
      { key: 'hoverBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'hover' } },
      { key: 'hoverBorderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'hover' } },
      // Active — pressing settles back to the resting card fill (like the rest
      // of the family), keeping the hover border/text. Mirrors the atom's
      // `--uxm-button-with-icon-active-*` fallbacks.
      { key: 'activeBackgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeColor', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'states', showWhen: { state: 'active' } },
      { key: 'activeBorderColor', label: 'Border Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'active' } },
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
    name: 'Button — Icon (deprecated)',
    category: 'Buttons',
    description: 'DEPRECATED — use Icon Button with variant="filled" (same look; its knobs live under `--uxm-icon-button-filled-*`). Kept until the next major so saved themes keep painting.',
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
];
