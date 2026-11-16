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

  it('saves the background knob as each surface\'s var, never a bare `background`', () => {
    // `background` is a REAL_CSS_PROPS key: unmapped, a save writes a bare
    // `background` on the root, which would also beat every modifier's colour.
    const value = 'url(/grid.svg) 0 0 / 30px 30px, var(--color-surface)';
    const ids = ['card', 'detail-section', 'page-shell', 'stat-card', 'app-top-bar'];
    const css = generateOverridesCss(Object.fromEntries(ids.map((id) => [id, { background: value }])), brand);
    for (const id of ids) expect(css).toContain(`  --uxm-${id}-background: ${value};`);
    expect(css).not.toMatch(/^\s*background:/m);
  });

  it('saves the per-side border knobs as the vars the stylesheets read', () => {
    // None of these keys is a REAL_CSS_PROPS entry, so each falls through to
    // its own --uxm-<comp>-<kebab> name; pinned so a later mapping or a
    // REAL_CSS_PROPS addition can't turn them into bare properties.
    const css = generateOverridesCss(
      {
        card: { borderTopWidth: 4, borderTopColor: 'var(--color-accent)', borderBottomWidth: 0 },
        'detail-section': { borderTopWidth: 3, borderBottomColor: '#123456' },
        'app-top-bar': { borderBottomWidth: 5 },
      },
      brand,
    );
    expect(css).toContain('  --uxm-card-border-top-width: 4px;');
    expect(css).toContain('  --uxm-card-border-top-color: var(--color-accent);');
    expect(css).toContain('  --uxm-card-border-bottom-width: 0px;');
    expect(css).toContain('  --uxm-detail-section-border-top-width: 3px;');
    expect(css).toContain('  --uxm-detail-section-border-bottom-color: #123456;');
    expect(css).toContain('  --uxm-app-top-bar-border-bottom-width: 5px;');
    expect(css).not.toMatch(/^\s*border-(top|bottom)-(width|color):/m);
  });

  it('saves the media object gap as its var, not a bare `gap` on the non-grid root', () => {
    const css = generateOverridesCss({ 'media-object': { gap: 32 } }, brand);
    expect(css).toContain('  --uxm-media-object-gap: 32px;');
    expect(css).not.toMatch(/^\s*gap:/m);
  });

  it('saves the surface knobs as the vars its stylesheet reads, never bare properties', () => {
    const css = generateOverridesCss(
      { surface: { backgroundColor: 'var(--color-card)', background: 'linear-gradient(#000, #111)', textColor: 'var(--color-text-strong)', borderRadius: 12, padding: 16 } },
      brand,
    );
    expect(css).toContain('  --uxm-surface-bg: var(--color-card);');
    expect(css).toContain('  --uxm-surface-background: linear-gradient(#000, #111);');
    expect(css).toContain('  --uxm-surface-text-color: var(--color-text-strong);');
    expect(css).toContain('  --uxm-surface-radius: 12px;');
    expect(css).toContain('  --uxm-surface-padding: 16px;');
    expect(css).not.toMatch(/^\s*(background|background-color|border-radius|padding):/m);
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
          return declared?.trim().endsWith(`: ${p.defaultValue}${p.unit};`) ? [] : [`${def.id}.${p.key} (${p.unit}): ${declared?.trim()}`];
        }),
    );
    expect(wrong).toEqual([]);
  });

  it('drops an override value that could break out of the declaration', () => {
    const css = generateOverridesCss({ card: { color: 'red; } body { display: none } /*' } }, brand);
    expect(css).not.toContain('display: none');
    // Left out entirely, not written as `color: ;` (see the next case).
    expect(css).not.toMatch(/^\s*color:/m);
  });

  it('leaves out a dropped or empty value instead of emitting an empty declaration', () => {
    // An empty CUSTOM property is valid CSS: `--uxm-card-background: ;` makes
    // the background declaration that reads it resolve to nothing, and the
    // card turns transparent, where an unset knob keeps its colour fallback.
    // A data: URI is the likeliest way in — Studio's preview paints it, the
    // sanitiser rejects it.
    const css = generateOverridesCss(
      { card: { background: 'url(data:image/png;base64,AAAA)', backgroundColor: '' , padding: 16 } },
      brand,
    );
    expect(css).not.toContain('--uxm-card-background');
    expect(css).not.toContain('--uxm-card-bg');
    expect(css).toContain('  --uxm-card-padding: 16px;');
    // A component whose every value is dropped emits no rule at all.
    expect(generateOverridesCss({ card: { background: 'url(javascript:alert(1))' } }, brand)).not.toContain('.uxm-card');
  });

  it('keeps a quoted root-relative url and a gradient in the background knob', () => {
    const css = generateOverridesCss(
      { card: { background: 'url("/grid.svg") 0 0 / 30px 30px, linear-gradient(135deg, rgba(0, 0, 0, 0.1), #fff)' } },
      brand,
    );
    expect(css).toContain('  --uxm-card-background: url("/grid.svg") 0 0 / 30px 30px, linear-gradient(135deg, rgba(0, 0, 0, 0.1), #fff);');
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
    // One rule for the root and for a light panel inside a dark page.
    expect(css).toContain(':root:not([data-theme="dark"]), [data-theme="light"] {\n  --color-accent: #123456;\n}');
    expect(css).not.toContain('bad key');
    expect(css).not.toContain('[data-theme="dark"] {');
  });

  it('restores the light artwork on a light panel only when there is a dark variant', () => {
    const both = generateOverridesCss({}, {
      logoUrl: '/logo.svg', logoUrlDark: '/logo-dark.svg', iconUrl: '/icon.svg',
    } as BrandConfig);
    expect(both).toContain('[data-theme="dark"] {\n  --brand-logo-url: url("/logo-dark.svg");\n}');
    expect(both).toContain('[data-theme="light"] {\n  --brand-logo-url: url("/logo.svg");\n}');
    // The icon has no dark variant: one value, inherited everywhere.
    expect(both).not.toMatch(/\[data-theme="light"\] \{[^}]*--brand-icon-url/);
    const lightOnly = generateOverridesCss({}, { logoUrl: '/logo.svg' } as BrandConfig);
    expect(lightOnly).not.toContain('[data-theme="light"]');
  });

  it('publishes the mono typeface as --brand-mono-font over a mono stack, imported once', () => {
    const css = generateOverridesCss({}, { fontFamily: 'Manrope', monoFontFamily: 'IBM Plex Mono' } as BrandConfig);
    expect(css).toContain('--brand-mono-font: "IBM Plex Mono", ui-monospace,');
    // The fallback is fixed-width, never the body's sans stack.
    expect(css).not.toMatch(/--brand-mono-font:[^;]*font-inter/);
    expect(css.match(/family=IBM\+Plex\+Mono/g)).toHaveLength(1);
    // The same face for body and mono is fetched once.
    const same = generateOverridesCss({}, { fontFamily: 'JetBrains Mono', monoFontFamily: 'JetBrains Mono' } as BrandConfig);
    expect(same.match(/family=JetBrains\+Mono/g)).toHaveLength(1);
    // Unset or unsafe → no var at all, so each atom keeps its own stack.
    expect(generateOverridesCss({}, {} as BrandConfig)).not.toContain('--brand-mono-font');
    expect(generateOverridesCss({}, { monoFontFamily: 'x"; } body {' } as BrandConfig)).not.toContain('--brand-mono-font');
  });

  it('publishes the heading case and tracking on :root, and drops anything else', () => {
    const css = generateOverridesCss({}, { headingTextTransform: 'uppercase', headingLetterSpacing: '0.05em' } as BrandConfig);
    expect(css).toContain('  --brand-heading-text-transform: uppercase;');
    expect(css).toContain('  --brand-heading-letter-spacing: 0.05em;');
    // Unset or unsafe → no var, so every title keeps inheriting.
    expect(generateOverridesCss({}, {} as BrandConfig)).not.toMatch(/--brand-heading-(text-transform|letter-spacing)/);
    const bad = generateOverridesCss({}, { headingTextTransform: 'uppercase; color: red', headingLetterSpacing: '2px' } as BrandConfig);
    expect(bad).not.toMatch(/--brand-heading-(text-transform|letter-spacing)/);
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
