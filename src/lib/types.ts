export type Category = 'App' | 'Buttons' | 'Inputs' | 'Display' | 'Feedback' | 'Forms' | 'Composite' | 'Diagram' | 'Icons';

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
}

export interface ComponentDef {
  id: string;
  name: string;
  category: Category;
  description: string;
  styleProperties: StyleProperty[];
  layoutVariants: LayoutVariant[];
  canvasBackground?: boolean;
}

export type StyleOverrides = Record<string, string | number | boolean>;

export interface PreviewProps {
  styles: Record<string, string | number | boolean>;
  variants: Record<string, string>;
}
