import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';

/**
 * Renders the real <Icon> atom so every glyph type works — both path-
 * based (the heroicons-style outlines) and body-based (the multi-shape
 * primitives like dock-bottom, dock-right, drag-handle, the model-*
 * variants). Was previously hand-rolling the SVG and only handling
 * `path`, which silently rendered an empty SVG for body-based glyphs.
 *
 * Color flows through CSS `color`-on-wrapper since Icon's stroke
 * defaults to `currentColor`.
 */
export function IconPreview({ styles, variants }: PreviewProps) {
  const id = (variants.glyph as string) ?? 'search';
  const size = styles.size as number;
  const strokeWidth = styles.strokeWidth as number;
  return (
    <div style={{ padding: 16, display: 'inline-flex' }}>
      {/* Color flows through the atom's own `--uxm-icon-color` re-theme
          surface — the same variable a production consumer would set. */}
      <Icon
        glyph={id}
        size={size}
        strokeWidth={strokeWidth}
        style={{ ['--uxm-icon-color' as string]: styles.color as string }}
      />
    </div>
  );
}
