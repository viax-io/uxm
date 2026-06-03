import { useState, type CSSProperties } from 'react';

import type { PreviewProps } from '@/previews/types';
import { RangeSlider } from '@/ui';
import { Slider } from '@/ui';

type Styles = PreviewProps['styles'];

/**
 * Build the projected `--uxm-slider-*` var set for the wrapper. The
 * `showcaseState` argument optionally overrides the default thumb color
 * to whatever state the designer has forced (hover / focus / disabled),
 * so the showcase paints that state even though no real pointer
 * interaction is happening. Default-state callers pass undefined and
 * get the natural live `:hover` / `:active` behavior.
 */
function buildVars(styles: Styles, showcaseState?: string): CSSProperties {
  const forced = showcaseState === 'hover' ? styles.hoverThumbColor : undefined;

  return {
    '--uxm-slider-track-color': styles.trackColor as string,
    '--uxm-slider-accent-color': styles.accentColor as string,
    '--uxm-slider-thumb-color': (forced ?? styles.thumbColor) as string,
    '--uxm-slider-hover-thumb-color': styles.hoverThumbColor as string,
    '--uxm-slider-focus-ring': styles.focusRing as string,
    '--uxm-slider-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-slider-track-height': `${styles.trackHeight}px`,
    '--uxm-slider-track-radius': `${styles.trackRadius}px`,
    '--uxm-slider-thumb-size': `${styles.thumbSize}px`,
    '--uxm-slider-value-color': styles.valueColor as string,
    '--uxm-slider-value-size': `${styles.valueSize}px`,
    width: 280,
  } as CSSProperties;
}

export function SliderPreview({ styles, variants }: PreviewProps) {
  // Independent state per mode so toggling Mode in the editor doesn't
  // throw away the user's current value or the range tuple.
  const [single, setSingle] = useState(40);
  const [range, setRange] = useState<[number, number]>([20, 80]);
  const mode = (variants.mode as string) ?? 'single';
  const state = (variants.state as string) ?? 'default';

  const showcaseVars = buildVars(styles, state);
  const interactiveVars = buildVars(styles);

  // Forced-state visual overrides for the showcase slider only. The
  // interactive instance below always paints in default styling so the
  // designer can exercise real hover / pressed / focus / disabled
  // through actual pointer + keyboard interaction.
  const showcaseExtras: CSSProperties = {
    ...(state === 'focus'
      ? {
          outline: `2px solid ${styles.focusRing as string}`,
          outlineOffset: 4,
          borderRadius: `${styles.trackRadius}px`,
        }
      : {}),
    ...(state === 'disabled'
      ? {
          opacity: (styles.disabledOpacity as number) ?? 0.4,
          cursor: 'not-allowed',
        }
      : {}),
  };

  const sectionLabel = {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  };

  // Showcase value is fixed so the thumb sits in a consistent place
  // across states (designer compares colors, not value positions). The
  // interactive instance owns its own state from useState above.
  const showcaseValue = 40;
  const showcaseRange: [number, number] = [20, 80];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <div style={sectionLabel}>{state} state</div>
        <div style={{ ...showcaseVars, ...showcaseExtras } as CSSProperties}>
          {mode === 'range' ? (
            <RangeSlider
              value={showcaseRange}
              onChange={() => {}}
              min={0}
              max={100}
              step={1}
              disabled={state === 'disabled'}
              showStart={Boolean(styles.showStart)}
              showEnd={Boolean(styles.showEnd)}
              showRange={Boolean(styles.showRange)}
            />
          ) : (
            <Slider
              value={showcaseValue}
              onChange={() => {}}
              min={0}
              max={100}
              step={1}
              disabled={state === 'disabled'}
              // `tabIndex={-1}` keeps the showcase slider out of the
              // keyboard tab order — the user shouldn't be able to
              // focus a non-functional preview accidentally.
              tabIndex={-1}
            />
          )}
        </div>
      </div>

      {/* Interactive instance — uses the production <Slider> / <RangeSlider>
          atoms with controlled state. Drag now works smoothly thanks to
          the canvas's onInputCapture skipping type="range" events (see
          commit 7cae344) — previously the per-pixel input events caused
          a re-render cascade that stuttered the thumb. `key={mode}`
          resets value shape when designers flip between single and range. */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Interactive</div>
        <div style={interactiveVars}>
          {mode === 'range' ? (
            <RangeSlider
              key="range"
              value={range}
              onChange={setRange}
              min={0}
              max={100}
              step={1}
              showStart={Boolean(styles.showStart)}
              showEnd={Boolean(styles.showEnd)}
              showRange={Boolean(styles.showRange)}
            />
          ) : (
            <Slider key="single" value={single} onChange={setSingle} min={0} max={100} step={1} />
          )}
        </div>
      </div>
    </div>
  );
}
