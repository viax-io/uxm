import { Fragment } from 'react';

import { SectionHeader } from '@/ui';

import { usePreviewShell } from '../../lib/preview-shell';
import { previewMap } from '../canvas';

import type { ComponentDef, PreviewProps } from '../../lib/types';

/**
 * Dev tab — Variant Matrix section. Renders every variant × variant
 * combination of the current component as a thumbnail grid. Each cell
 * is the real Preview component (same `previewMap` the canvas uses)
 * with variants locked to that cell's combination; styles flow from
 * the user's current overrides so saved theming carries through.
 *
 * Layout strategy:
 *   - 1 variant   → single column of N thumbnails
 *   - 2 variants  → 2D grid (variant 1 as columns, variant 2 as rows)
 *   - 3+ variants → first two as the matrix axes; remaining variants
 *                   stay at their default value (3-D grids don't read
 *                   well in a panel; if a particular axis matters,
 *                   the user can pick it in the Visual tab and re-
 *                   visit the matrix)
 *
 * Each cell:
 *   - `pointer-events: none` so the thumbnail doesn't capture clicks
 *     (matches the MobileGallery's read-only convention)
 *   - `overflow: hidden` so wide atoms (SideFlexpane, AppSidebar) clip
 *     rather than overflow the matrix
 *   - thin caption beneath labeling the variant value
 */
export function VariantMatrix({
  def,
  styles,
  currentVariants,
}: {
  def: ComponentDef;
  styles: Record<string, string | number | boolean>;
  currentVariants: Record<string, string | number | boolean>;
}) {
  const Preview = previewMap[def.id];
  const shell = usePreviewShell();
  if (!Preview) {
    return null;
  }

  // Filter variants suitable for matrix expansion. Two ineligibility
  // rules — both about cells that "don't make sense":
  //
  //   1. Large-enum variants (`glyph` with 56 icons): content
  //      selections, not visual variants. A 56×5 grid is pure noise.
  //      Heuristic cap: 8 options.
  //
  //   2. Gating variants: a variant V is a "gate" if some OTHER variant
  //      references it from a `showWhen` clause. Example: list-item's
  //      `state` has `showWhen: { mode: "interactive" }`, so `mode` is
  //      a gate. Expanding both as axes produces rows like (static,
  //      hover) / (static, focus) / etc., where every cell collapses
  //      to the same static rendering — wasted space. We instead lock
  //      the gate to the value the dependent needs (here: "interactive")
  //      and only expand the dependent.
  const MATRIX_AXIS_OPTION_CAP = 8;

  // Collect the gate map: gateKey → required value (from the FIRST
  // dependent's showWhen). Most components have a single dependent per
  // gate, so "first wins" is fine in practice; if conflicts ever come
  // up, the registry author can pick the variant order they want.
  const gateLocks: Record<string, string> = {};
  for (const v of def.layoutVariants) {
    const showWhen = (v as { showWhen?: Record<string, string> }).showWhen;
    if (!showWhen) continue;
    for (const [gateKey, gateVal] of Object.entries(showWhen)) {
      if (!(gateKey in gateLocks)) gateLocks[gateKey] = gateVal;
    }
  }

  const expandable = def.layoutVariants.filter(
    (v) =>
      v.options.length <= MATRIX_AXIS_OPTION_CAP &&
      !(v.key in gateLocks),
  );

  // If nothing's expandable, the matrix has nothing meaningful to
  // compare — hide the section. The Visual tab still covers variant
  // selection via the picker.
  if (expandable.length === 0) {
    return null;
  }

  const [axisX, axisY] = expandable;
  // Base variants — three priority layers:
  //   1. Gate locks (from another variant's showWhen) win first, so
  //      the matrix shows the dependent variant in the context where
  //      it actually applies.
  //   2. User's current selection from the editor (so e.g. the icon-
  //      button matrix reflects the user's picked glyph).
  //   3. Variant defaults as a final fallback.
  const baseVariants: Record<string, string> = {};
  for (const v of def.layoutVariants) {
    baseVariants[v.key] =
      gateLocks[v.key]
      ?? (currentVariants[v.key] as string | undefined)
      ?? v.defaultValue;
  }

  const xs = axisX.options;
  const ys = axisY ? axisY.options : null;

  const renderCell = (cellVariants: Record<string, string>, caption: string) => (
    <div
      key={caption}
      className="rounded border border-border bg-card overflow-hidden"
    >
      <div
        className="flex items-center justify-center p-3"
        style={{
          // Read-only thumbnail. Clip wide atoms so they don't blow up
          // the cell width; centred so small atoms stay readable.
          //
          // Sizing: minHeight gives small atoms (icon buttons, chips) a
          // consistent visual weight; maxHeight caps tall atoms (Card,
          // LifecycleNodeCard) so a single oversized atom can't make
          // every row in a 2D grid 200px tall. Scale 0.6 is the sweet
          // spot for the atoms we ship today — wide ones (SideFlexpane,
          // AppSidebar) still clip, but everything fits the cell width
          // budget at typical panel sizes.
          pointerEvents: 'none',
          minHeight: 80,
          maxHeight: 140,
          overflow: 'hidden',
        }}
      >
        <div
          className="uxm-matrix-cell-preview"
          style={{ transform: 'scale(0.6)', transformOrigin: 'center' }}
        >
          <Preview
            styles={styles as PreviewProps['styles']}
            variants={cellVariants}
            componentId={def.id}
            shell={shell}
          />
        </div>
      </div>
      <div className="border-t border-border/60 px-2 py-1 text-[10px] font-medium text-text-muted truncate text-center">
        {caption}
      </div>
    </div>
  );

  return (
    <div>
      <SectionHeader>Variant Matrix</SectionHeader>
      {/* Horizontal-scroll wrapper. Cells have a 120px minimum so they
          stay readable; if the panel is too narrow to show every column
          at that width, the matrix scrolls instead of crushing cells
          into illegibility. -mx-5 + px-5 lets the scroll surface bleed
          to the panel edges so a thumb shadow at the right edge hints
          at "more content". */}
      <div className="-mx-5 overflow-x-auto px-5">
        {ys ? (
          // 2D grid: ys as rows, xs as columns. Each row has a leading
          // row-label cell so the user can read both axes without
          // hovering captions. `minmax(120px, 1fr)` gives cells a
          // legible floor — narrower than that and atoms (esp. Card,
          // StatCard, button-with-icon) lose meaningful detail even at
          // 0.6 scale.
          <div
            className="grid gap-1.5"
            style={{
              gridTemplateColumns: `auto repeat(${xs.length}, minmax(120px, 1fr))`,
              minWidth: 'min-content',
            }}
          >
            {/* corner cell + column headers */}
            <div />
            {xs.map((x) => (
              <div
                key={`xh-${x.value}`}
                className="text-[10px] font-semibold uppercase tracking-wider text-text-subtle text-center truncate"
              >
                {x.label}
              </div>
            ))}
            {ys.map((y) => (
              <Fragment key={`row-${y.value}`}>
                <div className="self-center pr-1 text-[10px] font-semibold uppercase tracking-wider text-text-subtle text-right truncate">
                  {y.label}
                </div>
                {xs.map((x) => {
                  const cellV: Record<string, string> = {
                    ...baseVariants,
                    [axisX.key]: x.value,
                    [axisY.key]: y.value,
                  };
                  return renderCell(cellV, `${x.label} / ${y.label}`);
                })}
              </Fragment>
            ))}
          </div>
        ) : (
          // 1D row of thumbnails. `auto-fit` lets it reflow to multiple
          // rows on narrow panes — when the parent is wide enough we
          // get one row; when it isn't, cells wrap rather than scroll.
          <div
            className="grid gap-1.5"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            }}
          >
            {xs.map((x) => {
              const cellV: Record<string, string> = {
                ...baseVariants,
                [axisX.key]: x.value,
              };
              return renderCell(cellV, x.label);
            })}
          </div>
        )}
      </div>
    </div>
  );
}
