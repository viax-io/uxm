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

function fontFileUrl(fontFamily: string): string {
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
  // PhoneInput's country picker portals via `Popover`: the field wrapper
  // stays in-page but `.uxm-phone-input__popover` mounts to document.body,
  // so the `--uxm-phone-input-popover-*` knobs must be emitted on the panel
  // selector too or they never reach it.
  'phone-input': '.uxm-phone-input, .uxm-phone-input__popover',
};

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
  },
  'number-input': {
    backgroundColor: '--uxm-number-input-bg',
    borderColor: '--uxm-number-input-border-color',
    color: '--uxm-number-input-color',
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
  },
  'select-dropdown': {
    backgroundColor: '--uxm-select-dropdown-bg',
    borderColor: '--uxm-select-dropdown-border-color',
    color: '--uxm-select-dropdown-color',
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
  },
  'data-table': {
    borderColor: '--uxm-data-table-border-color',
    fontSize: '--uxm-data-table-font-size',
  },
  'app-sidebar': {
    borderColor: '--uxm-app-sidebar-border-color',
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
  },
  'button-primary': {
    backgroundColor: '--uxm-button-primary-background-color',
    color: '--uxm-button-primary-color',
  },
  'button-secondary': {
    backgroundColor: '--uxm-button-secondary-background-color',
    color: '--uxm-button-secondary-color',
    borderColor: '--uxm-button-secondary-border-color',
  },
  'button-tertiary': {
    backgroundColor: '--uxm-button-tertiary-background-color',
    color: '--uxm-button-tertiary-color',
    borderColor: '--uxm-button-tertiary-border-color',
  },
  'button-ghost': {
    backgroundColor: '--uxm-button-ghost-background-color',
    color: '--uxm-button-ghost-color',
  },
  'button-danger': {
    backgroundColor: '--uxm-button-danger-background-color',
    color: '--uxm-button-danger-color',
    borderColor: '--uxm-button-danger-border-color',
  },
  'button-with-icon': {
    backgroundColor: '--uxm-button-with-icon-background-color',
    color: '--uxm-button-with-icon-color',
    borderColor: '--uxm-button-with-icon-border-color',
  },
  'button-icon': {
    backgroundColor: '--uxm-button-icon-background-color',
    color: '--uxm-button-icon-color',
  },
  'back-link': {
    color: '--uxm-back-link-color',
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
};

function toCSS(key: string, componentId: string): string {
  const componentMapping = PER_COMPONENT_MAPPING[componentId];
  if (componentMapping?.[key]) return componentMapping[key];

  const mapping: Record<string, string> = {
    paddingX: 'padding-inline',
    paddingY: 'padding-block',
    connectorIdleColor: '--lc-idle-color',
    connectorActiveColor: '--lc-active-color',
    connectorIdleStrokeWidth: '--lc-stroke-width',
    connectorActiveStrokeWidth: '--lc-active-stroke-width',
    connectorDashPattern: '--lc-dash-pattern',
  };
  if (mapping[key]) return mapping[key];

  const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase();
  if (REAL_CSS_PROPS.has(key)) return kebab;
  return `--uxm-${componentId}-${kebab}`;
}

function formatValue(value: string | number | boolean, key: string): string {
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (typeof value === 'number') {
    const unitless = ['fontWeight', 'shadow', 'disabledOpacity'];
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
function safeFontFamily(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  const trimmed = v.trim();
  return /^[A-Za-z0-9 _-]+$/.test(trimmed) ? trimmed : undefined;
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
  const logoUrl = safeUrl(brand.logoUrl);
  const iconUrl = safeUrl(brand.iconUrl);
  const logoUrlDark = safeUrl(brand.logoUrlDark);
  const iconUrlDark = safeUrl(brand.iconUrlDark);

  if (fontFamily) {
    lines.push(`@import url("${fontFileUrl(fontFamily)}");`);
    lines.push('');
  }

  const brandRules: string[] = [];
  if (fontFamily) {
    brandRules.push(`  --brand-font: "${fontFamily}", var(--font-inter), system-ui, sans-serif;`);
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
  emitTokens(':root', brand.tokens?.light);
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
