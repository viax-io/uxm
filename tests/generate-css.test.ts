import { describe, expect, it } from 'vitest';

import type { BrandConfig } from '@/studio/lib/types';
import { generateOverridesCss } from '@/studio/persistence/generate-css';


const brand = {} as BrandConfig;

describe('generateOverridesCss', () => {
  it('emits one rule per component, on the default .uxm-<id> selector', () => {
    const css = generateOverridesCss({ badge: { backgroundColor: 'var(--color-card)' } }, brand);
    expect(css).toContain('.uxm-badge {');
    expect(css).toContain('  background-color: var(--color-card);');
  });

  it('routes a mapped knob to the component var the stylesheet reads', () => {
    // Card's background is a two-layer var, not a real property — the mapping
    // table in generate-css-mapping.ts is what keeps a save from painting
    // nothing.
    const css = generateOverridesCss({ card: { backgroundColor: 'var(--color-card)' } }, brand);
    expect(css).toContain('  --uxm-card-bg: var(--color-card);');
  });

  it('adds px to lengths but never to weights or opacities', () => {
    const css = generateOverridesCss(
      { 'input-text': { borderRadius: 8, fontWeight: 600, disabledOpacity: 0.4, itemDisabledOpacity: 0.5 } },
      brand,
    );
    expect(css).toContain('border-radius: 8px;');
    expect(css).toContain('font-weight: 600;');
    expect(css).toContain('--uxm-input-text-disabled-opacity: 0.4;');
    expect(css).toContain('--uxm-input-text-item-disabled-opacity: 0.5;');
  });

  it('drops an override value that could break out of the declaration', () => {
    const css = generateOverridesCss({ card: { color: 'red; } body { display: none } /*' } }, brand);
    expect(css).not.toContain('display: none');
    expect(css).toContain('  color: ;');
  });

  it('emits portaled panels on both the wrapper and the panel selector', () => {
    const css = generateOverridesCss({ listbox: { panelRadius: 8 } }, brand);
    expect(css).toContain('.uxm-listbox, .uxm-listbox__panel {');
  });

  it('imports a brand font once and scopes light tokens to non-dark', () => {
    const css = generateOverridesCss({}, {
      fontFamily: 'Manrope',
      headingFontFamily: 'Manrope',
      tokens: { light: { '--color-accent': '#123456', 'bad key': '#000' }, dark: { '--color-card': '#000; }' } },
    } as unknown as BrandConfig);
    expect(css.match(/@import url\("https:\/\/fonts\.googleapis\.com/g)).toHaveLength(1);
    expect(css).toContain(':root:not([data-theme="dark"]) {\n  --color-accent: #123456;\n}');
    expect(css).not.toContain('bad key');
    expect(css).not.toContain('[data-theme="dark"] {');
  });

  it('drops unsafe brand urls instead of emitting them', () => {
    const css = generateOverridesCss({}, { logoUrl: 'javascript:alert(1)', iconUrl: '/icon.svg' } as BrandConfig);
    expect(css).not.toContain('javascript:');
    expect(css).toContain('--brand-icon-url: url("/icon.svg");');
  });
});
