/**
 * The closed option sets of the Brand Settings editor, as DATA.
 *
 * Separated from the component for the same reason `SECTION_LABELS` is:
 * `scripts/extract-studio-i18n.mjs` bundles this module and harvests the
 * labels. A label declared inside a component body is invisible to the
 * extractor and would ship untranslated in every locale.
 *
 * What is here is CHROME — the words a designer operates. What is deliberately
 * NOT here is specimen text (`$48.2K`, `Quarterly performance review`): those
 * are placeholders showing where copy lands and at what size, and translating
 * them would imply the library picks a real app's wording. See
 * `PreviewTranslate` in `src/previews/types.ts`.
 */

/**
 * Typefaces on offer. The names are proper nouns and never translate — only
 * the parenthetical on the default does.
 */
export const FONT_OPTIONS: { label: string; value: string; stack: string }[] = [
  { label: 'Inter (default)', value: 'Inter', stack: "'Inter', var(--font-inter), system-ui, sans-serif" },
  { label: 'Geist', value: 'Geist', stack: "'Geist', system-ui, sans-serif" },
  { label: 'Manrope', value: 'Manrope', stack: "'Manrope', system-ui, sans-serif" },
  { label: 'Space Grotesk', value: 'Space Grotesk', stack: "'Space Grotesk', system-ui, sans-serif" },
  { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans', stack: "'Plus Jakarta Sans', system-ui, sans-serif" },
  { label: 'DM Sans', value: 'DM Sans', stack: "'DM Sans', system-ui, sans-serif" },
  { label: 'Figtree', value: 'Figtree', stack: "'Figtree', system-ui, sans-serif" },
  { label: 'Roboto', value: 'Roboto', stack: "'Roboto', system-ui, sans-serif" },
  { label: 'IBM Plex Sans', value: 'IBM Plex Sans', stack: "'IBM Plex Sans', system-ui, sans-serif" },
  { label: 'JetBrains Mono', value: 'JetBrains Mono', stack: "'JetBrains Mono', ui-monospace, monospace" },
];

/** Only these font labels carry translatable words; the rest are brand names. */
export const TRANSLATABLE_FONT_LABELS = ['Inter (default)'];

/**
 * Shared by the base-size knob and each role's size knob.
 * Sub-100% values do NOT shrink AA-floor-reasoned small text: surfaces with a
 * documented minimum (Menu's 11px subtitle / 12px hint) floor themselves via
 * `max()` in their own SCSS, so "compact" compacts everything else.
 */
export const SCALE_OPTIONS = [
  { value: '', label: 'Default (100%)' },
  { value: '0.875', label: '87.5% — compact' },
  { value: '1.125', label: '112.5% — large' },
  { value: '1.25', label: '125% — larger' },
  { value: '1.5', label: '150% — largest' },
];

/**
 * Closed sets small enough to show as segments — every option visible, one
 * click instead of open-then-pick. Labels stay short so the track fits.
 * The numeric weights are numbers, not words, and never translate.
 */
export const WEIGHT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: '500', label: '500' },
  { value: '600', label: '600' },
  { value: '700', label: '700' },
];

export const LINE_HEIGHT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: '1.4', label: 'Tight' },
  { value: '1.5', label: 'Normal' },
  { value: '1.7', label: 'Relaxed' },
  { value: '2', label: 'Loose' },
];

/**
 * The three heading roles, in visual order. `basePx` / `baseWeight` are the
 * representative surface's own values, used only to render the specimen at a
 * believable size — the atoms keep their individual literals.
 *
 * `label` and `short` are chrome and translate. `sample` is specimen text and
 * does NOT — it exists to show the typeface at that size, not to be read.
 */
export const ROLES = [
  { key: 'display', label: 'Display', short: 'Display', sample: '$48.2K', basePx: 28, baseWeight: 700,
    familyKey: 'displayFontFamily', weightKey: 'displayFontWeight', scaleKey: 'displayScale' },
  { key: 'pageTitle', label: 'Page titles', short: 'Page title', sample: 'Quarterly performance review', basePx: 22, baseWeight: 600,
    familyKey: 'pageTitleFontFamily', weightKey: 'pageTitleFontWeight', scaleKey: 'pageTitleScale' },
  { key: 'sectionTitle', label: 'Section titles', short: 'Section title', sample: 'Revenue motions', basePx: 16, baseWeight: 600,
    familyKey: 'sectionTitleFontFamily', weightKey: 'sectionTitleFontWeight', scaleKey: 'sectionTitleScale' },
] as const;

/**
 * The three brand assets, in render order. `title` and `hint` are chrome and
 * translate; `defaultSrc` and the geometry are not copy.
 *
 * `box` sets only the frame's WIDTH — the height stretches to the row, so a
 * frame always matches the field beside it even when the Base text size knob
 * grows it. Width stays explicit because `aspect-ratio` cannot derive it from a
 * stretched height (flex resolves main size from content first).
 */
export const ASSETS = [
  { kind: 'logo' as const, title: 'Logo', defaultSrc: '/viax-logo.svg',
    box: { width: 110 }, imgStyle: { maxWidth: '90%', maxHeight: '70%' },
    hint: 'Shown in the expanded sidebar. Upload a file or paste a URL.' },
  { kind: 'icon' as const, title: 'Sidebar Icon', defaultSrc: '/viax-icon.svg',
    box: { width: 44 }, imgStyle: { maxWidth: '70%', maxHeight: '70%' },
    hint: 'Shown in the collapsed sidebar.' },
  { kind: 'favicon' as const, title: 'Favicon', defaultSrc: undefined,
    box: { width: 44 }, imgStyle: { maxWidth: '60%', maxHeight: '60%' },
    hint: 'Browser tab icon. Accepts .ico, .png, .svg.' },
];
