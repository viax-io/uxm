import type { AllOverrides } from './types';
import type { BrandConfig } from '../lib/types';

/**
 * Pure CSS generator for UXM Studio overrides.
 *
 * Single source of truth (R5): the modo Hono `/api/uxm/save` route imports
 * `generateOverridesCss` from here instead of keeping its own copy. No Node
 * APIs — runs in browser (client export) and server alike.
 *
 * Emits a stylesheet from per-component style overrides plus brand config
 * (font, logo/icon URLs, brand token blocks). All attacker-controlled brand
 * values are sanitised before interpolation because the output is served to
 * every browser session.
 */

const BRAND_FONT_WEIGHTS = 'wght@400;500;600;700';

export function fontFileUrl(fontFamily: string): string {
  const encoded = fontFamily.trim().replace(/\s+/g, '+');
  return `https://fonts.googleapis.com/css2?family=${encoded}:${BRAND_FONT_WEIGHTS}&display=swap`;
}

const REAL_CSS_PROPS = new Set([
  'background', 'backgroundColor',
  'color',
  'border', 'borderColor', 'borderRadius', 'borderWidth', 'borderStyle',
  'padding', 'paddingX', 'paddingY', 'margin',
  'gap', 'rowGap', 'columnGap',
  'width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
  'fontSize', 'fontWeight', 'fontFamily', 'lineHeight',
  'opacity',
  'cursor', 'display', 'position', 'overflow', 'direction',
]);

// Per-component selector overrides for the emitted rule. Defaults to
// `.uxm-{id}`. Override when the atom renders the styled element via a PORTAL
// (Listbox / Popover panel mounts to document.body): CSS custom properties
// cascade DOWN from the declaring element, so vars on the in-page wrapper
// never reach a portaled descendant. Emit on BOTH wrapper and panel selector.
const PER_COMPONENT_SELECTOR: Record<string, string> = {
  listbox: '.uxm-listbox, .uxm-listbox__panel',
  // Menu mirrors Listbox: the `.uxm-menu` wrapper lives in-page around the
  // trigger, but the `.uxm-menu__panel` portals to document.body, so vars on
  // the wrapper never reach it. Emit on both so the panel carries them.
  menu: '.uxm-menu, .uxm-menu__panel',
  // PhoneInput no longer needs a panel-scoped selector: its country picker
  // now delegates to the shared `Listbox`, whose portaled panel already gets
  // its vars via the `listbox` entry above. All `--uxm-phone-input-*` knobs
  // target the in-page field, so the default `.uxm-phone-input` selector is
  // correct.
};

// One knob → one variable. A multi-target (string[]) form was briefly added so
// Card's Row Gap could write both the Stack and Cluster gap vars; that was the
// only use, and it was the wrong shape (see the `card` entry below), so the
// mapping stays single-target on purpose — a knob that themes a SIBLING atom's
// var cannot win against that atom's own knob.
const PER_COMPONENT_MAPPING: Record<string, Record<string, string>> = {
  'input-with-icon': {
    backgroundColor: '--uxm-input-with-icon-bg',
    borderColor: '--uxm-input-with-icon-border-color',
    borderRadius: '--uxm-input-with-icon-radius',
    paddingX: '--uxm-input-with-icon-padding-x',
    paddingY: '--uxm-input-with-icon-padding-y',
    fontSize: '--uxm-input-with-icon-font-size',
    color: '--uxm-input-with-icon-color',
  },
  'input-text': {
    backgroundColor: '--uxm-input-text-bg',
    borderColor: '--uxm-input-text-border-color',
    color: '--uxm-input-text-color',
    borderRadius: '--uxm-input-text-border-radius',
    paddingX: '--uxm-input-text-padding-x',
    paddingY: '--uxm-input-text-padding-y',
    fontSize: '--uxm-input-text-font-size',
  },
  'number-input': {
    backgroundColor: '--uxm-number-input-bg',
    borderColor: '--uxm-number-input-border-color',
    color: '--uxm-number-input-color',
    borderRadius: '--uxm-number-input-border-radius',
    paddingX: '--uxm-number-input-padding-x',
    paddingY: '--uxm-number-input-padding-y',
    fontSize: '--uxm-number-input-font-size',
  },
  // Without this entry `fontSize` falls through REAL_CSS_PROPS and emits a
  // literal `font-size` on `.uxm-color-input`, which the atom's own children
  // (`__value-field`, `__format`) always beat — so the knob did nothing at all.
  'color-input': {
    fontSize: '--uxm-color-input-font-size',
  },
  'currency-input': {
    backgroundColor: '--uxm-currency-input-background-color',
    borderColor: '--uxm-currency-input-border-color',
    borderRadius: '--uxm-currency-input-border-radius',
    paddingX: '--uxm-currency-input-padding-x',
    paddingY: '--uxm-currency-input-padding-y',
    fontSize: '--uxm-currency-input-font-size',
    color: '--uxm-currency-input-color',
  },
  textarea: {
    backgroundColor: '--uxm-textarea-bg',
    borderColor: '--uxm-textarea-border-color',
    color: '--uxm-textarea-color',
    minHeight: '--uxm-textarea-min-height',
    borderRadius: '--uxm-textarea-border-radius',
    paddingX: '--uxm-textarea-padding-x',
    paddingY: '--uxm-textarea-padding-y',
    fontSize: '--uxm-textarea-font-size',
  },
  'file-upload': {
    backgroundColor: '--uxm-file-upload-bg',
    borderColor: '--uxm-file-upload-border-color',
    color: '--uxm-file-upload-color',
    borderRadius: '--uxm-file-upload-border-radius',
    borderStyle: '--uxm-file-upload-border-style',
    borderWidth: '--uxm-file-upload-border-width',
    paddingX: '--uxm-file-upload-padding-x',
    paddingY: '--uxm-file-upload-padding-y',
    minHeight: '--uxm-file-upload-min-height',
    gap: '--uxm-file-upload-gap',
    rowGap: '--uxm-file-upload-row-gap',
  },
  'select-dropdown': {
    backgroundColor: '--uxm-select-dropdown-bg',
    borderColor: '--uxm-select-dropdown-border-color',
    color: '--uxm-select-dropdown-color',
    borderRadius: '--uxm-select-dropdown-border-radius',
    paddingX: '--uxm-select-dropdown-padding-x',
    paddingY: '--uxm-select-dropdown-padding-y',
    fontSize: '--uxm-select-dropdown-font-size',
  },
  'date-input': {
    backgroundColor: '--uxm-date-input-background-color',
    borderColor: '--uxm-date-input-border-color',
    borderRadius: '--uxm-date-input-border-radius',
    paddingX: '--uxm-date-input-padding-x',
    paddingY: '--uxm-date-input-padding-y',
    fontSize: '--uxm-date-input-font-size',
    color: '--uxm-date-input-color',
  },
  'password-input': {
    backgroundColor: '--uxm-password-input-background-color',
    borderColor: '--uxm-password-input-border-color',
    borderRadius: '--uxm-password-input-border-radius',
    paddingX: '--uxm-password-input-padding-x',
    paddingY: '--uxm-password-input-padding-y',
    fontSize: '--uxm-password-input-font-size',
    color: '--uxm-password-input-color',
  },
  'time-input': {
    backgroundColor: '--uxm-time-input-background-color',
    borderColor: '--uxm-time-input-border-color',
    borderRadius: '--uxm-time-input-border-radius',
    paddingX: '--uxm-time-input-padding-x',
    paddingY: '--uxm-time-input-padding-y',
    fontSize: '--uxm-time-input-font-size',
    color: '--uxm-time-input-color',
  },
  'phone-input': {
    backgroundColor: '--uxm-phone-input-background-color',
    borderColor: '--uxm-phone-input-border-color',
    borderRadius: '--uxm-phone-input-border-radius',
    paddingX: '--uxm-phone-input-padding-x',
    paddingY: '--uxm-phone-input-padding-y',
    fontSize: '--uxm-phone-input-font-size',
    color: '--uxm-phone-input-color',
  },
  calendar: {
    backgroundColor: '--uxm-calendar-background-color',
    borderColor: '--uxm-calendar-border-color',
    borderRadius: '--uxm-calendar-border-radius',
    padding: '--uxm-calendar-padding',
  },
  tabs: {
    gap: '--uxm-tabs-gap',
    paddingX: '--uxm-tabs-padding-x',
    paddingY: '--uxm-tabs-padding-y',
    fontSize: '--uxm-tabs-font-size',
    fontWeight: '--uxm-tabs-font-weight',
  },
  'tabs-underline': {
    gap: '--uxm-tabs-underline-gap',
    paddingX: '--uxm-tabs-underline-padding-x',
    paddingY: '--uxm-tabs-underline-padding-y',
    fontSize: '--uxm-tabs-underline-font-size',
    fontWeight: '--uxm-tabs-underline-font-weight',
  },
  'filter-tabs': {
    gap: '--uxm-filter-tabs-gap',
    paddingX: '--uxm-filter-tabs-padding-x',
    paddingY: '--uxm-filter-tabs-padding-y',
    fontSize: '--uxm-filter-tabs-font-size',
    fontWeight: '--uxm-filter-tabs-font-weight',
  },
  'view-switcher': {
    gap: '--uxm-view-switcher-gap',
  },
  'button-group': {
    borderColor: '--uxm-button-group-border-color',
    borderRadius: '--uxm-button-group-border-radius',
    paddingX: '--uxm-button-group-padding-x',
    paddingY: '--uxm-button-group-padding-y',
    fontSize: '--uxm-button-group-font-size',
  },
  checkbox: {
    borderRadius: '--uxm-checkbox-border-radius',
    gap: '--uxm-checkbox-gap',
  },
  card: {
    backgroundColor: '--uxm-card-bg',
    borderColor: '--uxm-card-border-color',
    borderRadius: '--uxm-card-radius',
    padding: '--uxm-card-padding',
    // `gap` ("Header Gap") collides with REAL_CSS_PROPS — the generic fallback
    // would emit a literal `gap` property that `.uxm-card` never activates (the
    // card is only a flex column via the `--gap` modifier). Route it to the var
    // the modifier actually reads.
    //
    // There is deliberately NO Card knob for the CONTENT's row gap. It looks
    // like it belongs here, but the row gap is owned by the nested Stack /
    // Cluster, which already have their own Gap knobs — and those emit
    // `--uxm-stack-gap` DIRECTLY on `.uxm-stack`, where a directly-set custom
    // property always beats one inherited from `.uxm-card`. A Card-side knob
    // would therefore lose the moment anyone themed Stack, while also leaking
    // to every Stack/Cluster at any depth inside any card (custom properties
    // inherit). One owner per visual property; Card owns only its own gap.
    gap: '--uxm-card-gap',
  },
  'toggle-switch': {
    width: '--uxm-toggle-switch-width',
    height: '--uxm-toggle-switch-height',
  },
  'radio-group': {
    gap: '--uxm-radio-group-gap',
  },
  loader: {
    color: '--uxm-loader-color',
    gap: '--uxm-loader-gap',
  },
  'data-table': {
    borderColor: '--uxm-data-table-border-color',
    fontSize: '--uxm-data-table-font-size',
    borderRadius: '--uxm-data-table-border-radius',
  },
  'app-sidebar': {
    borderColor: '--uxm-app-sidebar-border-color',
    backgroundColor: '--uxm-app-sidebar-background-color',
  },
  // Every key here collides with REAL_CSS_PROPS, where the generic fallback
  // emits the LITERAL css property on the root selector instead of the var.
  //
  // For `fontSize` / `fontWeight` that is a silent no-op rather than a mere
  // detour: the atom reads those vars on `.uxm-sidebar-nav-trigger__value`, and
  // a `font-size` landing on the root is beaten by the child's own declaration.
  // The live workbench hides it — that path projects custom properties through
  // the preview's `buildVars`, so the knob only dies once a brand is SAVED.
  //
  // The rest (padding, gap, radius) do sit on the root and would survive the
  // literal route on source order alone, but they are mapped too: the sibling
  // `sidebar-nav-item` maps all six, and leaving half of them to cascade luck
  // invites exactly the question of which half.
  'sidebar-nav-trigger': {
    paddingX: '--uxm-sidebar-nav-trigger-padding-x',
    paddingY: '--uxm-sidebar-nav-trigger-padding-y',
    fontSize: '--uxm-sidebar-nav-trigger-font-size',
    fontWeight: '--uxm-sidebar-nav-trigger-font-weight',
    gap: '--uxm-sidebar-nav-trigger-gap',
    borderRadius: '--uxm-sidebar-nav-trigger-border-radius',
  },
  'sidebar-nav-item': {
    paddingX: '--uxm-sidebar-nav-item-padding-x',
    paddingY: '--uxm-sidebar-nav-item-padding-y',
    fontSize: '--uxm-sidebar-nav-item-font-size',
    fontWeight: '--uxm-sidebar-nav-item-font-weight',
    gap: '--uxm-sidebar-nav-item-gap',
    borderRadius: '--uxm-sidebar-nav-item-border-radius',
  },
  'explorer-list-item': {
    paddingX: '--uxm-explorer-list-item-padding-x',
    paddingY: '--uxm-explorer-list-item-padding-y',
    fontSize: '--uxm-explorer-list-item-font-size',
    fontWeight: '--uxm-explorer-list-item-font-weight',
    gap: '--uxm-explorer-list-item-gap',
    borderRadius: '--uxm-explorer-list-item-border-radius',
  },
  'app-top-bar': {
    borderColor: '--uxm-app-top-bar-border-color',
    backgroundColor: '--uxm-app-top-bar-background-color',
    height: '--uxm-app-top-bar-height',
    paddingX: '--uxm-app-top-bar-padding-x',
    gap: '--uxm-app-top-bar-gap',
  },
  'explorer-section': {
    paddingX: '--uxm-explorer-section-padding-x',
    paddingY: '--uxm-explorer-section-padding-y',
    borderRadius: '--uxm-explorer-section-border-radius',
    gap: '--uxm-explorer-section-gap',
    fontSize: '--uxm-explorer-section-font-size',
    fontWeight: '--uxm-explorer-section-font-weight',
  },
  'number-field': {
    backgroundColor: '--uxm-number-field-input-bg',
    borderColor: '--uxm-number-field-input-border',
    color: '--uxm-number-field-input-color',
    borderRadius: '--uxm-number-field-input-radius',
    paddingX: '--uxm-number-field-input-padding-x',
    paddingY: '--uxm-number-field-input-padding-y',
    fontSize: '--uxm-number-field-font-size',
    gap: '--uxm-number-field-gap',
  },
  'icon-button': {
    color: '--uxm-icon-button-color',
    backgroundColor: '--uxm-icon-button-bg',
    hoverBackgroundColor: '--uxm-icon-button-hover-bg',
    activeBackgroundColor: '--uxm-icon-button-active-bg',
    borderRadius: '--uxm-icon-button-radius',
  },
  'button-primary': {
    backgroundColor: '--uxm-button-primary-background-color',
    color: '--uxm-button-primary-color',
    borderRadius: '--uxm-button-primary-border-radius',
    fontSize: '--uxm-button-primary-font-size',
    fontWeight: '--uxm-button-primary-font-weight',
    paddingX: '--uxm-button-primary-padding-x',
    paddingY: '--uxm-button-primary-padding-y',
  },
  'button-secondary': {
    backgroundColor: '--uxm-button-secondary-background-color',
    color: '--uxm-button-secondary-color',
    borderColor: '--uxm-button-secondary-border-color',
    borderRadius: '--uxm-button-secondary-border-radius',
    fontSize: '--uxm-button-secondary-font-size',
    fontWeight: '--uxm-button-secondary-font-weight',
    paddingX: '--uxm-button-secondary-padding-x',
    paddingY: '--uxm-button-secondary-padding-y',
  },
  'button-tertiary': {
    backgroundColor: '--uxm-button-tertiary-background-color',
    color: '--uxm-button-tertiary-color',
    borderColor: '--uxm-button-tertiary-border-color',
    borderRadius: '--uxm-button-tertiary-border-radius',
    fontSize: '--uxm-button-tertiary-font-size',
    fontWeight: '--uxm-button-tertiary-font-weight',
    paddingX: '--uxm-button-tertiary-padding-x',
    paddingY: '--uxm-button-tertiary-padding-y',
  },
  'button-ghost': {
    backgroundColor: '--uxm-button-ghost-background-color',
    color: '--uxm-button-ghost-color',
    borderRadius: '--uxm-button-ghost-border-radius',
    fontSize: '--uxm-button-ghost-font-size',
    fontWeight: '--uxm-button-ghost-font-weight',
    paddingX: '--uxm-button-ghost-padding-x',
    paddingY: '--uxm-button-ghost-padding-y',
  },
  'button-danger': {
    backgroundColor: '--uxm-button-danger-background-color',
    color: '--uxm-button-danger-color',
    borderColor: '--uxm-button-danger-border-color',
    borderRadius: '--uxm-button-danger-border-radius',
    fontSize: '--uxm-button-danger-font-size',
    fontWeight: '--uxm-button-danger-font-weight',
    paddingX: '--uxm-button-danger-padding-x',
    paddingY: '--uxm-button-danger-padding-y',
  },
  'button-with-icon': {
    backgroundColor: '--uxm-button-with-icon-background-color',
    color: '--uxm-button-with-icon-color',
    borderColor: '--uxm-button-with-icon-border-color',
    borderRadius: '--uxm-button-with-icon-border-radius',
    fontSize: '--uxm-button-with-icon-font-size',
    fontWeight: '--uxm-button-with-icon-font-weight',
    paddingX: '--uxm-button-with-icon-padding-x',
    paddingY: '--uxm-button-with-icon-padding-y',
  },
  'button-icon': {
    backgroundColor: '--uxm-button-icon-background-color',
    color: '--uxm-button-icon-color',
    borderRadius: '--uxm-button-icon-border-radius',
  },
  'back-link': {
    color: '--uxm-back-link-color',
    fontSize: '--uxm-back-link-font-size',
    fontWeight: '--uxm-back-link-font-weight',
    gap: '--uxm-back-link-gap',
  },
  breadcrumb: {
    fontSize: '--uxm-breadcrumb-font-size',
    gap: '--uxm-breadcrumb-gap',
  },
  disclosure: {
    paddingX: '--uxm-disclosure-padding-x',
    paddingY: '--uxm-disclosure-padding-y',
    fontSize: '--uxm-disclosure-font-size',
    gap: '--uxm-disclosure-gap',
    borderRadius: '--uxm-disclosure-border-radius',
  },
  'side-flexpane': {
    paddingX: '--uxm-side-flexpane-padding-x',
    paddingY: '--uxm-side-flexpane-padding-y',
    backgroundColor: '--uxm-side-flexpane-background-color',
    borderColor: '--uxm-side-flexpane-border-color',
    borderRadius: '--uxm-side-flexpane-border-radius',
    width: '--uxm-side-flexpane-width',
  },
  'list-item': {
    paddingX: '--uxm-list-item-padding-x',
    paddingY: '--uxm-list-item-padding-y',
    fontSize: '--uxm-list-item-font-size',
    gap: '--uxm-list-item-gap',
    borderRadius: '--uxm-list-item-border-radius',
    borderColor: '--uxm-list-item-border-color',
  },
  'pill-select': {
    backgroundColor: '--uxm-pill-select-bg',
    borderColor: '--uxm-pill-select-border-color',
    paddingX: '--uxm-pill-select-padding-x',
    paddingY: '--uxm-pill-select-padding-y',
  },
  modal: {
    backgroundColor: '--uxm-modal-background-color',
    borderColor: '--uxm-modal-border-color',
    borderRadius: '--uxm-modal-border-radius',
    paddingX: '--uxm-modal-padding-x',
    paddingY: '--uxm-modal-padding-y',
  },
  toast: {
    backgroundColor: '--uxm-toast-background-color',
    color: '--uxm-toast-color',
    borderColor: '--uxm-toast-border-color',
    borderRadius: '--uxm-toast-border-radius',
    paddingX: '--uxm-toast-padding-x',
    paddingY: '--uxm-toast-padding-y',
    fontSize: '--uxm-toast-font-size',
  },
  avatar: {
    backgroundColor: '--uxm-avatar-background-color',
    borderColor: '--uxm-avatar-border-color',
    borderRadius: '--uxm-avatar-border-radius',
    borderWidth: '--uxm-avatar-border-width',
    color: '--uxm-avatar-color',
    fontSize: '--uxm-avatar-font-size',
    fontWeight: '--uxm-avatar-font-weight',
  },
  banner: {
    borderRadius: '--uxm-banner-border-radius',
    paddingX: '--uxm-banner-padding-x',
    paddingY: '--uxm-banner-padding-y',
    fontSize: '--uxm-banner-font-size',
  },
  'bulk-action-bar': {
    backgroundColor: '--uxm-bulk-action-bar-background-color',
    color: '--uxm-bulk-action-bar-color',
    borderColor: '--uxm-bulk-action-bar-border-color',
    borderRadius: '--uxm-bulk-action-bar-border-radius',
    paddingX: '--uxm-bulk-action-bar-padding-x',
    paddingY: '--uxm-bulk-action-bar-padding-y',
    gap: '--uxm-bulk-action-bar-gap',
    fontSize: '--uxm-bulk-action-bar-font-size',
  },
  cluster: {
    gap: '--uxm-cluster-gap',
  },
  'config-component-row': {
    padding: '--uxm-config-component-row-padding',
    borderRadius: '--uxm-config-component-row-radius',
  },
  'config-segment-item': {
    paddingX: '--uxm-config-segment-item-padding-x',
    paddingY: '--uxm-config-segment-item-padding-y',
    borderRadius: '--uxm-config-segment-item-radius',
  },
  'detail-section': {
    backgroundColor: '--uxm-detail-section-bg',
    borderColor: '--uxm-detail-section-border-color',
    borderRadius: '--uxm-detail-section-radius',
    padding: '--uxm-detail-section-padding',
  },
  divider: {
    color: '--uxm-divider-color',
    gap: '--uxm-divider-gap',
  },
  'editable-cell': {
    // Dimensions are per-size keys (smallPaddingX, mediumMaxWidth, …) that
    // resolve via the generic `--uxm-editable-cell-{kebab(key)}` fallback in
    // toCSS; only the value colour needs an explicit entry (`color` is in
    // REAL_CSS_PROPS, so the fallback would emit a real CSS property that
    // outranks the component layer).
    color: '--uxm-editable-cell-color',
    // RETIRED knobs, kept mapped on purpose. The per-size split replaced these
    // four, but `generateOverridesCss` emits whatever keys are PERSISTED — not
    // what the registry currently declares — so a config saved before the split
    // still carries them. Without an entry here they'd fall through to
    // REAL_CSS_PROPS / the paddingX-paddingY special case in toCSS and emit
    // REAL `min-height` / `padding-inline` / `padding-block` declarations on
    // `.uxm-editable-cell`, which land in a sheet loaded after the library CSS
    // and would hard-override BOTH size presets (killing `medium`) and
    // resurrect the min-height the size work deliberately removed. Mapped to
    // their old, now-unread custom properties they are true no-ops instead.
    // Safe to delete once persisted overrides are pruned against the registry.
    minHeight: '--uxm-editable-cell-min-height',
    paddingX: '--uxm-editable-cell-padding-x',
    paddingY: '--uxm-editable-cell-padding-y',
    // `maxWidth` joined them when the cap went per-size: it is in
    // REAL_CSS_PROPS, so without this it would emit a real `max-width` that
    // pins BOTH presets (and would silently re-cap `medium`, whose whole point
    // is filling its container).
    maxWidth: '--uxm-editable-cell-max-width',
  },
  'empty-state': {
    padding: '--uxm-empty-state-padding',
  },
  'form-field': {
    gap: '--uxm-form-field-gap',
    // Per-tint label colours — the component reads `--uxm-form-field-label-
    // tint-*` (see form-field.scss tone classes); the generic kebab fallback
    // would emit `--uxm-form-field-tint-strong-color` etc., which nothing
    // reads, so the saved colour would silently not apply.
    tintStrongColor: '--uxm-form-field-label-tint-strong',
    tintDefaultColor: '--uxm-form-field-label-tint-default',
    tintMutedColor: '--uxm-form-field-label-tint-muted',
    // MIGRATION — `labelColor` was the single label-colour knob the tints
    // replaced. It is gone from the registry, but `generateOverridesCss` emits
    // whatever is PERSISTED, and its generic fallback lands on
    // `--uxm-form-field-label-color` — the very var the tint classes assign,
    // at equal specificity from a later sheet. Left alone it would beat ALL
    // THREE tints and silently disable them, with no knob left in the panel to
    // notice or clear it. Routed to the STRONG tint instead: strong was the
    // old (only) label colour and is still the default tone, so a pre-split
    // theme keeps the exact look it saved. A newly-saved `tintStrongColor`
    // still wins — overrides are appended, so it emits after this one.
    labelColor: '--uxm-form-field-label-tint-strong',
  },
  'icon-tile': {
    borderRadius: '--uxm-icon-tile-radius',
    iconBg: '--uxm-icon-tile-bg',
    iconColor: '--uxm-icon-tile-color',
  },
  icon: {
    color: '--uxm-icon-color',
  },
  'inline-action': {
    color: '--uxm-inline-action-color',
    fontSize: '--uxm-inline-action-font-size',
    fontWeight: '--uxm-inline-action-font-weight',
    gap: '--uxm-inline-action-gap',
  },
  'inline-filter': {
    gap: '--uxm-inline-filter-gap',
  },
  'lifecycle-edge-label': {
    paddingX: '--uxm-lifecycle-edge-label-padding-x',
    paddingY: '--uxm-lifecycle-edge-label-padding-y',
    borderRadius: '--uxm-lifecycle-edge-label-radius',
    borderWidth: '--uxm-lifecycle-edge-label-border-width',
    fontSize: '--uxm-lifecycle-edge-label-font-size',
    fontWeight: '--uxm-lifecycle-edge-label-font-weight',
  },
  // Same rule as lifecycle-group-box below — only the REAL_CSS_PROPS collisions
  // need an entry. `color` is the one that matters: a real `color` declaration
  // on `.uxm-lifecycle-drop-slot` from a later sheet would paint the text but
  // leave the dashes on the token, splitting a pair the atom deliberately drives
  // from one variable. The shape-scoped knobs (`cardRadius`, `pillFontSize`, …)
  // and `bg` need nothing: the generic `--uxm-{id}-{kebab}` rule already lands
  // on the names the stylesheet reads.
  'lifecycle-drop-slot': {
    borderColor: '--uxm-lifecycle-drop-slot-border-color',
    borderStyle: '--uxm-lifecycle-drop-slot-border-style',
    borderWidth: '--uxm-lifecycle-drop-slot-border-width',
    color: '--uxm-lifecycle-drop-slot-color',
  },
  // Only the knobs whose keys collide with REAL_CSS_PROPS need an entry: left
  // to the generic path they'd emit a real `background-color` / `border-width` /
  // `padding` on `.uxm-lifecycle-group-box` from a later sheet, hard-overriding
  // the rule's own `var(--uxm-… , token)` chain — and `padding` is read BY THE
  // CONSUMER off the custom property to inset the group's members, so a real
  // declaration would leave that value unreadable.
  //
  // `blur` and the three `target*` knobs are absent on purpose: the generic
  // `--uxm-{id}-{kebab}` rule already lands on the names the stylesheet reads.
  'lifecycle-group-box': {
    backgroundColor: '--uxm-lifecycle-group-box-bg',
    borderColor: '--uxm-lifecycle-group-box-border-color',
    borderWidth: '--uxm-lifecycle-group-box-border-width',
    borderRadius: '--uxm-lifecycle-group-box-radius',
    padding: '--uxm-lifecycle-group-box-padding',
  },
  'lifecycle-minimap': {
    backgroundColor: '--uxm-lifecycle-minimap-bg',
    borderColor: '--uxm-lifecycle-minimap-border-color',
    borderRadius: '--uxm-lifecycle-minimap-radius',
    width: '--uxm-lifecycle-minimap-width',
    height: '--uxm-lifecycle-minimap-height',
  },
  'lifecycle-node-card': {
    backgroundColor: '--uxm-lifecycle-node-card-bg',
    borderColor: '--uxm-lifecycle-node-card-border-color',
    borderRadius: '--uxm-lifecycle-node-card-radius',
    paddingX: '--uxm-lifecycle-node-card-padding-x',
    paddingY: '--uxm-lifecycle-node-card-padding-y',
    width: '--uxm-lifecycle-node-card-width',
    minHeight: '--uxm-lifecycle-node-card-min-height',
  },
  'lifecycle-terminal': {
    backgroundColor: '--uxm-lifecycle-terminal-bg',
    borderColor: '--uxm-lifecycle-terminal-border-color',
    color: '--uxm-lifecycle-terminal-color',
    borderRadius: '--uxm-lifecycle-terminal-radius',
    width: '--uxm-lifecycle-terminal-width',
    height: '--uxm-lifecycle-terminal-height',
    fontSize: '--uxm-lifecycle-terminal-font-size',
    fontWeight: '--uxm-lifecycle-terminal-font-weight',
  },
  'lifecycle-zoom-control': {
    backgroundColor: '--uxm-lifecycle-zoom-bg',
    borderColor: '--uxm-lifecycle-zoom-border-color',
    borderRadius: '--uxm-lifecycle-zoom-radius',
    fontSize: '--uxm-lifecycle-zoom-font-size',
    color: '--uxm-lifecycle-zoom-color',
    buttonSize: '--uxm-lifecycle-zoom-button-size',
    iconColor: '--uxm-lifecycle-zoom-icon-color',
  },
  link: {
    fontSize: '--uxm-link-font-size',
    fontWeight: '--uxm-link-font-weight',
  },
  'meta-row': {
    fontSize: '--uxm-meta-row-font-size',
    color: '--uxm-meta-row-color',
    gap: '--uxm-meta-row-gap',
  },
  'number-stepper': {
    backgroundColor: '--uxm-number-stepper-input-bg',
    borderColor: '--uxm-number-stepper-input-border',
    color: '--uxm-number-stepper-input-color',
    borderRadius: '--uxm-number-stepper-input-radius',
    paddingX: '--uxm-number-stepper-input-padding-x',
    paddingY: '--uxm-number-stepper-input-padding-y',
    fontSize: '--uxm-number-stepper-font-size',
    gap: '--uxm-number-stepper-gap',
  },
  'page-header': {
    gap: '--uxm-page-header-gap',
    paddingX: '--uxm-page-header-padding-x',
    paddingY: '--uxm-page-header-padding-y',
  },
  'page-shell': {
    backgroundColor: '--uxm-page-shell-bg',
  },
  'property-field': {
    gap: '--uxm-property-field-gap',
  },
  'property-grid': {
    rowGap: '--uxm-property-grid-row-gap',
    columnGap: '--uxm-property-grid-column-gap',
  },
  'responsive-grid': {
    gap: '--uxm-responsive-grid-gap',
  },
  'section-header': {
    gap: '--uxm-section-header-gap',
  },
  stack: {
    gap: '--uxm-stack-gap',
  },
  'stat-card': {
    backgroundColor: '--uxm-stat-card-background-color',
    borderColor: '--uxm-stat-card-border-color',
    borderRadius: '--uxm-stat-card-border-radius',
    padding: '--uxm-stat-card-padding',
  },
  tag: {
    borderRadius: '--uxm-tag-border-radius',
    fontWeight: '--uxm-tag-font-weight',
  },
  thumbnail: {
    borderRadius: '--uxm-thumbnail-border-radius',
    backgroundColor: '--uxm-thumbnail-background-color',
    borderColor: '--uxm-thumbnail-border-color',
    borderWidth: '--uxm-thumbnail-border-width',
  },
  'timeline-entry': {
    gap: '--uxm-timeline-entry-gap',
  },
  'segment-row': {
    paddingX: '--uxm-segment-row-padding-x',
    paddingY: '--uxm-segment-row-padding-y',
    gap: '--uxm-segment-row-gap',
    dragColor: '--uxm-segment-row-drag-color',
    dragHoverColor: '--uxm-segment-row-drag-hover-color',
    chevronColor: '--uxm-segment-row-chevron-color',
    chevronSize: '--uxm-segment-row-chevron-size',
    accentColor: '--uxm-segment-row-accent-color',
    accentWidth: '--uxm-segment-row-accent-width',
    accentRadius: '--uxm-segment-row-accent-radius',
    titleColor: '--uxm-segment-row-title-color',
    titleSize: '--uxm-segment-row-title-size',
    titleWeight: '--uxm-segment-row-title-weight',
    countBg: '--uxm-segment-row-count-bg',
    countColor: '--uxm-segment-row-count-color',
    countSize: '--uxm-segment-row-count-size',
    countPaddingX: '--uxm-segment-row-count-padding-x',
    countPaddingY: '--uxm-segment-row-count-padding-y',
    countRadius: '--uxm-segment-row-count-radius',
    rowHoverBg: '--uxm-segment-row-row-hover-bg',
    rowHoverRadius: '--uxm-segment-row-row-hover-radius',
  },
  'segment-card': {
    borderColor: '--uxm-segment-card-border-color',
    borderWidth: '--uxm-segment-card-border-width',
    borderRadius: '--uxm-segment-card-border-radius',
    backgroundColor: '--uxm-segment-card-background',
    paddingX: '--uxm-segment-card-padding-x',
    paddingY: '--uxm-segment-card-padding-y',
    childrenInsetX: '--uxm-segment-card-children-inset-x',
    childrenInsetY: '--uxm-segment-card-children-inset-y',
    childrenGap: '--uxm-segment-card-children-gap',
    dividerColor: '--uxm-segment-card-divider-color',
    dividerWidth: '--uxm-segment-card-divider-width',
  },
  'component-row': {
    paddingX: '--uxm-component-row-padding-x',
    paddingY: '--uxm-component-row-padding-y',
    gap: '--uxm-component-row-gap',
    backgroundColor: '--uxm-component-row-background',
    dragColor: '--uxm-component-row-drag-color',
    dragHoverColor: '--uxm-component-row-drag-hover-color',
    iconBadgeSize: '--uxm-component-row-icon-badge-size',
    iconBadgeRadius: '--uxm-component-row-icon-badge-radius',
    iconBadgePadding: '--uxm-component-row-icon-badge-padding',
    nameColor: '--uxm-component-row-name-color',
    nameSize: '--uxm-component-row-name-size',
    nameWeight: '--uxm-component-row-name-weight',
    typeLabelColor: '--uxm-component-row-type-label-color',
    typeLabelSize: '--uxm-component-row-type-label-size',
    typeLabelWeight: '--uxm-component-row-type-label-weight',
    chevronColor: '--uxm-component-row-chevron-color',
    chevronSize: '--uxm-component-row-chevron-size',
    rowHoverBg: '--uxm-component-row-row-hover-bg',
    rowHoverRadius: '--uxm-component-row-row-hover-radius',
  },
  'option-list': {
    indent: '--uxm-option-list-indent',
    backgroundColor: '--uxm-option-list-background',
    borderColor: '--uxm-option-list-border-color',
    borderWidth: '--uxm-option-list-border-width',
    borderRadius: '--uxm-option-list-border-radius',
    paddingX: '--uxm-option-list-padding-x',
    paddingY: '--uxm-option-list-padding-y',
    gap: '--uxm-option-list-gap',
    rowPaddingX: '--uxm-option-list-row-padding-x',
    rowPaddingY: '--uxm-option-list-row-padding-y',
    dragColor: '--uxm-option-list-drag-color',
    dragHoverColor: '--uxm-option-list-drag-hover-color',
    bulletSize: '--uxm-option-list-bullet-size',
    bulletGap: '--uxm-option-list-bullet-gap',
    nameColor: '--uxm-option-list-name-color',
    nameSize: '--uxm-option-list-name-size',
    nameWeight: '--uxm-option-list-name-weight',
    rowHoverBg: '--uxm-option-list-row-hover-bg',
    rowHoverRadius: '--uxm-option-list-row-hover-radius',
  },
  tooltip: {
    backgroundColor: '--uxm-tooltip-background-color',
    color: '--uxm-tooltip-color',
    borderRadius: '--uxm-tooltip-border-radius',
    paddingX: '--uxm-tooltip-padding-x',
    paddingY: '--uxm-tooltip-padding-y',
    fontSize: '--uxm-tooltip-font-size',
  },
  'content-tooltip': {
    backgroundColor: '--uxm-content-tooltip-background-color',
    borderColor: '--uxm-content-tooltip-border-color',
    borderRadius: '--uxm-content-tooltip-border-radius',
    padding: '--uxm-content-tooltip-padding',
    maxWidth: '--uxm-content-tooltip-max-width',
  },
  'type-overview-card': {
    backgroundColor: '--uxm-typeoverview-bg',
    borderColor: '--uxm-typeoverview-border-color',
    borderRadius: '--uxm-typeoverview-radius',
    padding: '--uxm-typeoverview-padding',
    accentColor: '--uxm-typeoverview-accent-color',
    accentWidth: '--uxm-typeoverview-accent-width',
    iconBg: '--uxm-typeoverview-icon-bg',
    iconColor: '--uxm-typeoverview-icon-color',
    iconBoxSize: '--uxm-typeoverview-icon-tile-size',
    iconRadius: '--uxm-typeoverview-icon-tile-radius',
    labelSize: '--uxm-typeoverview-label-size',
    labelColor: '--uxm-typeoverview-label-color',
    valueSize: '--uxm-typeoverview-value-size',
    valueColor: '--uxm-typeoverview-value-color',
  },
  // Without an entry here every knob would fall through to the generic
  // `--uxm-{id}-{kebab}` rule and double the segment — `connectorIdleColor`
  // under id `lifecycle-connector` becomes
  // `--uxm-lifecycle-connector-connector-idle-color`. The stylesheet reads the
  // canonical single-`connector` names (and still accepts the doubled ones as
  // a fallback alias), so map the knobs explicitly.
  //
  // `connectorArrowSize` sizes an SVG polygon rather than setting any CSS
  // property, so no rule can consume it — `useThemedArrowSize` in
  // lifecycle-connector.tsx reads `--uxm-lifecycle-connector-arrow-size` back
  // off the element instead. It is published here for that reason, not for
  // naming tidiness: drop this line and a saved Arrow Size stops applying.
  'lifecycle-connector': {
    connectorIdleColor: '--uxm-lifecycle-connector-idle-color',
    connectorActiveColor: '--uxm-lifecycle-connector-active-color',
    connectorIdleStrokeWidth: '--uxm-lifecycle-connector-idle-stroke-width',
    connectorActiveStrokeWidth: '--uxm-lifecycle-connector-active-stroke-width',
    connectorDashedColor: '--uxm-lifecycle-connector-dashed-color',
    connectorDashedStrokeWidth: '--uxm-lifecycle-connector-dashed-stroke-width',
    connectorDashPattern: '--uxm-lifecycle-connector-dash-pattern',
    connectorArrowSize: '--uxm-lifecycle-connector-arrow-size',
  },
};

function toCSS(key: string, componentId: string): string {
  const componentMapping = PER_COMPONENT_MAPPING[componentId];
  if (componentMapping?.[key]) return componentMapping[key];

  const mapping: Record<string, string> = {
    paddingX: 'padding-inline',
    paddingY: 'padding-block',
  };
  if (mapping[key]) return mapping[key];

  const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase();
  if (REAL_CSS_PROPS.has(key)) return kebab;
  return `--uxm-${componentId}-${kebab}`;
}

function formatValue(value: string | number | boolean, key: string): string {
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (typeof value === 'number') {
    // `lineHeight` is a ratio, not a length — without it here a knob saved as
    // 1.5 emits `line-height: 1.5px`, which collapses every line box.
    const unitless = ['fontWeight', 'titleWeight', 'nameWeight', 'typeLabelWeight', 'lineHeight', 'shadow', 'disabledOpacity'];
    // `opacity` is always unitless — match every *Opacity knob (e.g. the
    // per-element `itemDisabledOpacity` / `optionDisabledOpacity` variants)
    // so a saved value never gets a spurious `px` suffix.
    if (unitless.includes(key) || key.endsWith('Opacity')) return String(value);
    return `${value}px`;
  }
  // String style-override values are user/attacker-controlled and persisted
  // to a stylesheet served to every browser session — sanitise the same way
  // as brand token values so one can't break out of the declaration (e.g.
  // `red; } body{display:none}/*`). An unsafe value is dropped to '' rather
  // than throwing, so a single bad override can't blank the whole rule.
  return safeTokenValue(value) ?? '';
}

// CSS sanitizers — applied to every brand value before interpolation. The
// output is persisted and served to all browser sessions, so attacker-
// controlled values must not break out of the declaration they belong to.
function safeUrl(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  const trimmed = v.trim();
  if (!/^(https?:\/\/|\/)/.test(trimmed)) return undefined;
  if (/[")\n\r]/.test(trimmed)) return undefined;
  return trimmed;
}
export function safeFontFamily(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  const trimmed = v.trim();
  return /^[A-Za-z0-9 _-]+$/.test(trimmed) ? trimmed : undefined;
}
// Heading weight is a closed set (the editor offers exactly these three), so a
// strict whitelist is both the sanitizer and the contract. Numbers are accepted
// defensively — a persisted config may carry the JSON number rather than the
// string the <select> yields.
export function safeFontWeight(v: unknown): string | undefined {
  const s = typeof v === 'number' ? String(v) : typeof v === 'string' ? v.trim() : undefined;
  return s !== undefined && /^(500|600|700)$/.test(s) ? s : undefined;
}
export function safeTokenKey(v: string): boolean {
  return /^--[A-Za-z0-9-]+$/.test(v);
}
export function safeTokenValue(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  return /[{};\n\r]/.test(v) ? undefined : v;
}

/** Generate the overrides stylesheet from style overrides + brand config. */
export function generateOverridesCss(allOverrides: AllOverrides, brand: BrandConfig): string {
  const lines: string[] = ['/* Auto-generated by UXM — do not edit manually */', ''];

  const fontFamily = safeFontFamily(brand.fontFamily);
  const headingFontFamily = safeFontFamily(brand.headingFontFamily);
  const headingFontWeight = safeFontWeight(brand.headingFontWeight);
  const logoUrl = safeUrl(brand.logoUrl);
  const iconUrl = safeUrl(brand.iconUrl);
  const logoUrlDark = safeUrl(brand.logoUrlDark);
  const iconUrlDark = safeUrl(brand.iconUrlDark);

  if (fontFamily) {
    lines.push(`@import url("${fontFileUrl(fontFamily)}");`);
    lines.push('');
  }
  // Second font file only when the heading face is actually a different family
  // — picking the same one for both is a no-op, not a reason to fetch twice.
  if (headingFontFamily && headingFontFamily !== fontFamily) {
    lines.push(`@import url("${fontFileUrl(headingFontFamily)}");`);
    lines.push('');
  }

  const brandRules: string[] = [];
  if (fontFamily) {
    brandRules.push(`  --brand-font: "${fontFamily}", var(--font-inter), system-ui, sans-serif;`);
  }
  // Heading vars are consumed by the components' own two-layer fallbacks (see
  // e.g. page-header.scss), so there is no `body` rule and no `!important`:
  // an unset var simply lets each component's own default paint.
  if (headingFontFamily) {
    brandRules.push(`  --brand-heading-font: "${headingFontFamily}", var(--font-inter), system-ui, sans-serif;`);
  }
  if (headingFontWeight) {
    brandRules.push(`  --brand-heading-weight: ${headingFontWeight};`);
  }
  if (logoUrl) brandRules.push(`  --brand-logo-url: url("${logoUrl}");`);
  if (iconUrl) brandRules.push(`  --brand-icon-url: url("${iconUrl}");`);

  if (brandRules.length > 0) {
    lines.push(':root {');
    lines.push(...brandRules);
    lines.push('}');
    lines.push('');
    if (fontFamily) {
      lines.push('body { font-family: var(--brand-font) !important; }');
      lines.push('');
    }
  }

  const darkBrandRules: string[] = [];
  if (logoUrlDark) darkBrandRules.push(`  --brand-logo-url: url("${logoUrlDark}");`);
  if (iconUrlDark) darkBrandRules.push(`  --brand-icon-url: url("${iconUrlDark}");`);
  if (darkBrandRules.length > 0) {
    lines.push('[data-theme="dark"] {');
    lines.push(...darkBrandRules);
    lines.push('}');
    lines.push('');
  }

  const emitTokens = (selector: string, overrides: Record<string, string> | undefined) => {
    if (!overrides) return;
    const safeEntries = Object.entries(overrides).flatMap(([k, v]) => {
      if (!safeTokenKey(k)) return [];
      const safeValue = safeTokenValue(v);
      return safeValue === undefined ? [] : [[k, safeValue] as const];
    });
    if (safeEntries.length === 0) return;
    lines.push(`${selector} {`);
    for (const [cssVar, value] of safeEntries) {
      lines.push(`  ${cssVar}: ${value};`);
    }
    lines.push('}');
    lines.push('');
  };
  // Scope customized light-mode color tokens to non-dark. `:root` and
  // `[data-theme="dark"]` carry equal specificity, so an unconditional
  // `:root` block would win over this stylesheet's own dark block for any
  // token NOT also customized for dark (equal specificity, later source
  // order) — pinning that token to its light value in dark mode too. Scoping
  // lets an unset dark token fall through the cascade to tokens/index.css's
  // own `[data-theme="dark"]` default instead.
  emitTokens(':root:not([data-theme="dark"])', brand.tokens?.light);
  emitTokens('[data-theme="dark"]', brand.tokens?.dark);

  const componentIds = Object.keys(allOverrides).sort();

  for (const id of componentIds) {
    const overrides = allOverrides[id];
    const entries = Object.entries(overrides);
    if (entries.length === 0) continue;

    const selector = PER_COMPONENT_SELECTOR[id] ?? `.uxm-${id}`;
    lines.push(`${selector} {`);
    for (const [key, value] of entries) {
      const cssProp = toCSS(key, id);
      const cssValue = formatValue(value, key);
      lines.push(`  ${cssProp}: ${cssValue};`);
    }
    lines.push('}');
    lines.push('');
  }

  return lines.join('\n');
}
