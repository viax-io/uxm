export type Category = 'App' | 'Buttons' | 'Inputs' | 'Display' | 'Feedback' | 'Forms' | 'Composite' | 'Diagram' | 'Icons' | 'Layout';

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
  showWhen?: Record<string, string>;
  section?: string;
}

export interface LayoutVariant {
  key: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
    showWhen?: Record<string, string>;
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
  /** Optional event-API documentation, surfaced in the Events tab. */
  events?: EventSpec[];
  /** Optional dev-facing API documentation, surfaced in the Dev tab. */
  api?: ComponentApi;
}

export type StyleOverrides = Record<string, string | number | boolean>;

// Authoritative PreviewProps now lives in @viax/uxm/previews. Re-exported
// here so the rest of the shell (registry, panels) keeps working without
// import-site changes.
export type { PreviewProps } from '@/previews';
