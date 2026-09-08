import type { ComponentDef } from '../../types';

export const loginPageDef: ComponentDef = {
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
};
