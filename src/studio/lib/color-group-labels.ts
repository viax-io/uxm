/**
 * Display titles for the colour picker's token groups.
 *
 * Data, not render logic, for the same reason as {@link ./section-labels}: a
 * title declared inside a component body is invisible to
 * `scripts/extract-studio-i18n.mjs` and would ship untranslated in every
 * locale. The extractor bundles this module and harvests its values.
 *
 * Keys match `ThemeToken['group']`; `categories` is deliberately absent — those
 * tokens are studio-internal category tints and the picker never groups by them.
 */
export const COLOR_GROUP_LABELS: Record<string, string> = {
  surfaces: 'Surfaces',
  text: 'Text',
  borders: 'Borders',
  accent: 'Accent',
  highlights: 'Highlights',
  semantic: 'Semantic',
};

/** Render order for the groups above. */
export const COLOR_GROUP_ORDER = ['surfaces', 'text', 'borders', 'accent', 'highlights', 'semantic'];
