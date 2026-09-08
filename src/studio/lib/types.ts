export type Category = 'App' | 'Buttons' | 'Inputs' | 'Display' | 'Feedback' | 'Forms' | 'Composite' | 'Configuration' | 'Diagram' | 'Icons' | 'Layout';

export interface BrandTokens {
  light?: Record<string, string>;
  dark?: Record<string, string>;
}

export interface BrandConfig {
  logoUrl?: string;
  iconUrl?: string;
  faviconUrl?: string;
  logoUrlDark?: string;
  iconUrlDark?: string;
  faviconUrlDark?: string;
  fontFamily?: string;
  /** Typeface for heading surfaces. Unset = headings inherit the body face. */
  headingFontFamily?: string;
  /** Weight for heading surfaces ('500' | '600' | '700'). Unset = each
   *  component keeps its own default (600, or 700 for the display sizes). */
  headingFontWeight?: string;
  /** Per-role heading refinements, layered UNDER the umbrella above: unset =
   *  the role follows `headingFontFamily` / `headingFontWeight`. Roles are
   *  display (StatCard value, ErrorPage code), h1 (PageHeader / ErrorPage
   *  title) and h2 (DetailSection / SegmentRow title). */
  displayFontFamily?: string;
  displayFontWeight?: string;
  displayScale?: string;
  pageTitleFontFamily?: string;
  pageTitleFontWeight?: string;
  pageTitleScale?: string;
  sectionTitleFontFamily?: string;
  sectionTitleFontWeight?: string;
  sectionTitleScale?: string;
  /** Base text size multiplier applied to every font-size in the library. */
  typeScale?: string;
  /** Line height for multi-line body copy. Unset = each surface's own value. */
  bodyLineHeight?: string;
  tokens?: BrandTokens;
}

export type EditorControlType = 'color' | 'number' | 'select' | 'toggle' | 'slider' | 'text';

export interface StyleProperty {
  key: string;
  label: string;
  control: EditorControlType;
  defaultValue: string | number | boolean;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** Variant scoping. A string matches one variant value; a string[] matches
   *  any of several (same shape as a LayoutVariant option's `showWhen`) — use
   *  the array form for "this knob applies to several types / states" instead
   *  of a `'a|b'` string, which is compared verbatim and can never match. */
  showWhen?: Record<string, string | string[]>;
  section?: string;
}

export interface LayoutVariant {
  key: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
    /** Per-option scoping. A string matches one variant value; a string[]
     *  matches any of several (e.g. show `editing` only for the input-like
     *  types `['text','number','date']`, hiding it for the pickers). */
    showWhen?: Record<string, string | string[]>;
  }>;
  defaultValue: string;
  /** Variant-level scoping — same shape as styleProperties.showWhen. The
   *  entire variant picker is hidden when its conditions aren't met by
   *  the current variant selections. Use to hide a picker that's
   *  irrelevant in a given context (e.g. the State picker on list-item
   *  when `trailing` is `meta` / `none`). */
  showWhen?: Record<string, string>;
}

/**
 * One emitted event a component fires during interaction. Surfaces in
 * the Events tab of the Properties pane: a static spec on top (what
 * fires when, with what payload) and a live log below (chronological
 * capture of real events from the canvas).
 *
 * Names use the canonical React handler name (`onClick`, `onChange`)
 * rather than the DOM event name (`click`, `change`) so the spec reads
 * the way a consumer would type it in JSX. The DOM-event → handler
 * mapping lives in canvas.tsx's capture wrapper.
 */
export interface EventSpec {
  /** Handler name, e.g. "onClick". */
  name: string;
  /** Short prose describing what triggers the event. */
  description: string;
  /** TypeScript-ish payload signature, e.g. "MouseEvent" or "{ value: string }". */
  payload?: string;
  /** Variant scoping — same shape as styleProperties.showWhen. */
  showWhen?: Record<string, string>;
}

/**
 * One prop in the developer-facing API documentation. Surfaces in the
 * Dev tab's API section as a row in the props table.
 *
 * Authored alongside the atom (in the registry) rather than auto-
 * extracted from TypeScript today. The shape mirrors what an
 * extraction tool (react-docgen-typescript, ts-morph) would emit, so a
 * future build-time generator can populate this slot without changing
 * the consumer shape.
 */
export interface PropSpec {
  /** Prop name as it appears in JSX, e.g. "variant". */
  name: string;
  /** TypeScript-ish type signature, e.g. `"primary" | "ghost"`, `ReactNode`, `(e: MouseEvent) => void`. */
  type: string;
  /** Whether the prop is required (no `?` in the source interface). */
  required?: boolean;
  /** Default value as it appears in the destructured fn signature, stringified. */
  defaultValue?: string;
  /** Short prose — JSDoc summary, or hand-authored description. */
  description?: string;
}

/**
 * Developer-facing API documentation for a component. Drives the Dev
 * tab's API section (import path + props table + usage snippet).
 * Optional — atoms without `api` show only Events + Variant Matrix.
 */
export interface ComponentApi {
  /** Import path consumers use, e.g. "@modo/uxm/ui". */
  importPath: string;
  /** Named export(s) to import. Single string or array for atoms that ship multiple exports (Button family). */
  importNames: string | string[];
  /** Props in declaration order — exclude inherited HTML attributes for clarity. */
  props: PropSpec[];
}

export interface ComponentDef {
  id: string;
  name: string;
  category: Category;
  description: string;
  styleProperties: StyleProperty[];
  layoutVariants: LayoutVariant[];
  canvasBackground?: boolean;
  /**
   * Fill the canvas width and top-align instead of the default center-both-
   * axes layout. For previews that are galleries / long lists (e.g. the Icon
   * set grid) where centering wastes horizontal space and — worse — re-centres
   * vertically as content height changes (a filter shrinking results makes the
   * whole block jump); top-aligning keeps it anchored so filtering stays in
   * place.
   */
  canvasFill?: boolean;
  /** Optional event-API documentation, surfaced in the Events tab. */
  events?: EventSpec[];
  /** Optional dev-facing API documentation, surfaced in the Dev tab. */
  api?: ComponentApi;
}

export type StyleOverrides = Record<string, string | number | boolean>;

// Authoritative PreviewProps now lives in @viax.io/uxm/previews. Re-exported
// here so the rest of the shell (registry, panels) keeps working without
// import-site changes.
export type { PreviewProps } from '@/previews';
