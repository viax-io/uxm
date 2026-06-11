import type { PreviewProps } from '@/previews/types';
import { PillSelect } from '@/ui';

import type { CSSProperties } from 'react';

const ALL_OPTIONS = ['React', 'TypeScript', 'Tailwind', 'Next.js', 'Node.js', 'GraphQL', 'Prisma'];
const DEFAULT_SELECTED = ['React', 'TypeScript', 'Tailwind'];

/**
 * Real atomic composition: the preview renders the actual <PillSelect>,
 * which itself composes <Chip mode="input"> for each selected value. So:
 *
 *   - Chip-shape changes (radius, padding, colors) live on the Chip atom's
 *     registry and flow into this preview automatically through Chip's
 *     own CSS — no theming knobs duplicated here.
 *   - PillSelect's own knobs project as `--uxm-pill-select-*` custom
 *     properties on the rendered atom. Inline-on-element wins over
 *     class-on-element for custom properties, so live slider drags flash
 *     through even when overrides have been published — same Pattern A
 *     used by the rest of the previews.
 *   - The forced-state modifier class (`uxm-pill-select--state-{value}`)
 *     mirrors the production `:hover` / `:focus-visible` /
 *     `[aria-disabled="true"]` rules so the editor can paint any state
 *     on canvas without real interaction. For disabled, the modifier is
 *     redundant when we also pass `disabled` to the atom (the atom adds
 *     `aria-disabled="true"` itself), but applying both keeps the
 *     preview's signal independent of the prop wiring.
 *
 * The preview shows the bare pill-select field — no label. Labels are
 * owned entirely by `<FormField>`; wrap with FormField when you want
 * one.
 */
export function PillSelectPreview({ styles, variants }: PreviewProps & { componentId: string }) {
  const state = ((variants.state as string) ?? 'default') as
    | 'default'
    | 'hover'
    | 'focus'
    | 'disabled'
    | 'error';
  const chipsPosition = ((variants.chipsPosition as string) ?? 'below') as
    | 'inside'
    | 'below';

  // Map every registry knob to its `--uxm-pill-select-{kebab}` CSS var.
  // Numbers get a `px` suffix except `disabledOpacity` which is a unitless
  // multiplier — special-case to avoid emitting `0.6px` (invalid).
  const cssVars: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(styles)) {
    const varName = '--uxm-pill-select-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
    if (typeof value === 'number') {
      cssVars[varName] = key === 'disabledOpacity' ? value : `${value}px`;
    } else {
      cssVars[varName] = String(value);
    }
  }

  const modifierClass = `uxm-pill-select--state-${state}`;

  return (
    <div style={{ width: 360 }}>
      <PillSelect
        className={modifierClass}
        style={cssVars as CSSProperties}
        options={ALL_OPTIONS}
        defaultValue={DEFAULT_SELECTED}
        placeholder="Select tags…"
        disabled={state === 'disabled'}
        chipsPosition={chipsPosition}
        // Error is a real prop (not a CSS pseudo), so the preview drives
        // the actual atom path: `error` adds `__field--error` + renders the
        // message. The error vars projected via `cssVars` above theme both.
        error={state === 'error' ? 'Select at least one tag.' : undefined}
      />
    </div>
  );
}
