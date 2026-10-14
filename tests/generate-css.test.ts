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

  it('emits the strong weight on :root and drops anything but 500/600/700', () => {
    expect(generateOverridesCss({}, { strongFontWeight: '500' })).toContain('--font-weight-strong: 500;');
    expect(generateOverridesCss({}, { strongFontWeight: '900; color: red' })).not.toContain('--font-weight-strong');
    expect(generateOverridesCss({}, {})).not.toContain('--font-weight-strong');
  });

  it('emits the medium weight on :root from its own lower set', () => {
    expect(generateOverridesCss({}, { mediumFontWeight: '400' })).toContain('--font-weight-medium: 400;');
    expect(generateOverridesCss({}, { mediumFontWeight: '700' })).not.toContain('--font-weight-medium');
    expect(generateOverridesCss({}, {})).not.toContain('--font-weight-medium');
  });

  it('drops unsafe brand urls instead of emitting them', () => {
    const css = generateOverridesCss({}, { logoUrl: 'javascript:alert(1)', iconUrl: '/icon.svg' } as BrandConfig);
    expect(css).not.toContain('javascript:');
    expect(css).toContain('--brand-icon-url: url("/icon.svg");');
  });
});

describe('range-bar knob mapping', () => {
  // Three of this atom's knob names are REAL_CSS_PROPS, so without an explicit
  // PER_COMPONENT_MAPPING entry the generator publishes `height`,
  // `border-radius` and `min-width` on the root. The last one is the real
  // break: it floors the TRACK, while the knob exists to floor the FILL — so
  // Minimum Fill silently does nothing in a published sheet while looking
  // correct in the workbench, which feeds the vars directly.
  const css = () =>
    generateOverridesCss(
      { 'range-bar': { height: 20, borderRadius: 4, minWidth: 8 } } as never,
      brand,
    );

  it('publishes the documented custom properties', () => {
    expect(css()).toContain('--uxm-range-bar-height: 20px;');
    expect(css()).toContain('--uxm-range-bar-radius: 4px;');
    expect(css()).toContain('--uxm-range-bar-min-width: 8px;');
  });

  it('publishes no bare CSS property that would land on the track', () => {
    const out = css();
    const block = out.slice(out.indexOf('.uxm-range-bar'), out.indexOf('}', out.indexOf('.uxm-range-bar')));
    expect(block).not.toMatch(/^\s*min-width:/m);
    expect(block).not.toMatch(/^\s*height:/m);
    expect(block).not.toMatch(/^\s*border-radius:/m);
  });
});
