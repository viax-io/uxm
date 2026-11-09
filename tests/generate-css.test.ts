import { describe, expect, it } from 'vitest';

import { registry } from '@/studio/lib/registry';
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

  it('saves the bordered buttons\' border width as their var, never a bare property', () => {
    // `borderWidth` is a REAL_CSS_PROPS key: unmapped, a save writes a literal
    // `border-width` on the root, which only beats the stylesheet's own
    // `border:` shorthand (equal specificity) when it happens to load later.
    // The preview projects the var, so the workbench looked right either way.
    for (const variant of ['secondary', 'tertiary', 'danger', 'with-icon']) {
      const css = generateOverridesCss({ [`button-${variant}`]: { borderWidth: 3 } }, brand);
      expect(css).toContain(`  --uxm-button-${variant}-border-width: 3px;`);
      expect(css).not.toMatch(/^\s*border-width:/m);
    }
  });

  it('saves the empty state\'s gap and first-run frame as the vars its stylesheet reads', () => {
    // `gap` is a REAL_CSS_PROPS key: unmapped, a save writes a bare `gap` on the
    // root, which the `compact` size's own gap can't be told apart from. The
    // frame knobs are first-run vars, so a saved frame never paints the default.
    const css = generateOverridesCss(
      { 'empty-state': { gap: 16, firstRunBorderWidth: 2, firstRunRadius: 8, firstRunBorderStyle: 'solid', descriptionMaxWidth: '40ch' } },
      brand,
    );
    expect(css).toContain('  --uxm-empty-state-gap: 16px;');
    expect(css).not.toMatch(/^\s*gap:/m);
    expect(css).toContain('  --uxm-empty-state-first-run-border-width: 2px;');
    expect(css).toContain('  --uxm-empty-state-first-run-radius: 8px;');
    expect(css).toContain('  --uxm-empty-state-first-run-border-style: solid;');
    expect(css).toContain('  --uxm-empty-state-description-max-width: 40ch;');
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

  it('saves letter spacing in em, the unit the preview and every stylesheet use', () => {
    const css = generateOverridesCss({ 'sidebar-nav-trigger': { captionLetterSpacing: 0.1 } }, brand);
    expect(css).toContain('--uxm-sidebar-nav-trigger-caption-letter-spacing: 0.1em;');
    expect(css).not.toContain('0.1px');
  });

  it('saves every registry number knob in the unit it declares', () => {
    // A knob's `unit` is metadata the save path never sees: formatValue picks
    // units by key name. When the two disagree, the preview (which projects the
    // declared unit) and a saved theme render different values, as Sidebar Nav
    // Trigger's em letter spacing did when it saved as px. Each knob goes through
    // the real emitter at its default and must come out in its declared unit.
    const wrong = registry.flatMap((def) =>
      def.styleProperties
        .filter((p) => (p.control === 'number' || p.control === 'slider') && p.unit && typeof p.defaultValue === 'number')
        .flatMap((p) => {
          const css = generateOverridesCss({ [def.id]: { [p.key]: p.defaultValue } }, brand);
          const declared = css.split('\n').find((line) => line.trim().endsWith(';') && !line.includes('{'));
          return declared?.trim().endsWith(`${p.defaultValue}${p.unit};`) ? [] : [`${def.id}.${p.key} (${p.unit}): ${declared?.trim()}`];
        }),
    );
    expect(wrong).toEqual([]);
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

describe('expandable-text knob mapping', () => {
  // `color`, `fontSize`, `lineHeight` and `gap` are all REAL_CSS_PROPS. Without
  // the PER_COMPONENT_MAPPING entry they publish as bare properties on the root,
  // which the toggle link (it declares its own size and colour) never inherits —
  // a saved brand would change nothing while the workbench, feeding the vars
  // directly, looked right.
  const css = () =>
    generateOverridesCss(
      { 'expandable-text': { color: '#123456', fontSize: 15, lineHeight: 1.6, gap: 6 } } as never,
      brand,
    );

  it('publishes the documented custom properties', () => {
    expect(css()).toContain('--uxm-expandable-text-color: #123456;');
    expect(css()).toContain('--uxm-expandable-text-font-size: 15px;');
    expect(css()).toContain('--uxm-expandable-text-line-height: 1.6;');
    expect(css()).toContain('--uxm-expandable-text-gap: 6px;');
  });

  it('publishes no bare CSS property on the root', () => {
    const out = css();
    const block = out.slice(out.indexOf('.uxm-expandable-text'), out.indexOf('}', out.indexOf('.uxm-expandable-text')));
    expect(block).not.toMatch(/^\s*(color|font-size|line-height|gap):/m);
  });
});

describe('page-header knob mapping', () => {
  const css = (overrides: Record<string, unknown>) =>
    generateOverridesCss({ 'page-header': overrides } as never, brand);

  it('publishes the title line height verbatim \u2014 a ratio unitless, `normal` as-is', () => {
    // `titleLineHeight` is a select, so Studio saves strings. Both have to reach
    // the stylesheet untouched: a `px` suffix on the ratio would collapse the
    // line box, and a mangled `normal` would silently drop the default.
    expect(css({ titleLineHeight: '1.3' })).toContain('--uxm-page-header-title-line-height: 1.3;');
    expect(css({ titleLineHeight: 'normal' })).toContain('--uxm-page-header-title-line-height: normal;');
  });

  it('publishes the glyph size in px', () => {
    // Split from the line-height case on purpose: sharing one `it` meant a
    // failure here reported as a line-height problem.
    expect(css({ iconGlyphSize: 20 })).toContain('--uxm-page-header-icon-glyph-size: 20px;');
  });

  it('publishes a NUMERIC line-height unitless too', () => {
    // Not reachable from the Studio UI \u2014 the select always sends a string \u2014 but
    // reachable from an imported or hand-written overrides document, and it
    // pins `formatValue`'s `*LineHeight` rule for the next per-element knob
    // declared as a number. Without that rule a saved 1.3 publishes as
    // `1.3px`: a 1px line box, with the title's lines stacked on each other.
    expect(css({ titleLineHeight: 1.3 })).toContain('--uxm-page-header-title-line-height: 1.3;');
  });
});
