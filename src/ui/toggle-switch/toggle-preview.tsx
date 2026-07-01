import { type CSSProperties } from 'react';

import type { PreviewProps } from '@/previews/types';
import { ToggleSwitch } from '@/ui';

type Styles = PreviewProps['styles'];

function ShowcaseRow({
  on,
  state,
  styles,
  label,
}: {
  on: boolean;
  state: string;
  styles: Styles;
  label: string;
}) {
  // Static showcase — paints the selected forced state regardless of
  // pointer interaction. Inline JSX (not the real <ToggleSwitch>) so each
  // forced state can override the visible track + thumb directly; the
  // interactive instance below is where production CSS rules exercise.
  const isHover = state === 'hover';
  const isFocus = state === 'focus';
  const isDisabled = state === 'disabled';

  const track = isHover
    ? (on ? styles.hoverOnTrack : styles.hoverOffTrack)
    : (on ? styles.onTrack : styles.offTrack);
  const thumb = isHover
    ? (on ? styles.hoverOnThumb : styles.hoverOffThumb)
    : (on ? styles.onThumb : styles.offThumb);
  const ring = styles.focusRing;
  const width = (styles.width as number) ?? 44;
  const height = (styles.height as number) ?? 24;
  const thumbSize = height - 4;
  // Thumb position math mirrors `styles.css`: off → 2px from left,
  // on → width minus track-height minus 2px. Keeps the dot snug in
  // either end regardless of width/height.
  const thumbLeft = on ? width - height + 2 : 2;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 14,
        color: 'var(--color-text)',
        opacity: isDisabled ? ((styles.disabledOpacity as number) ?? 0.4) : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'relative',
          width,
          height,
          flexShrink: 0,
          borderRadius: 99,
          backgroundColor: track as string,
          transition: 'background-color 0.15s',
          ...(isFocus
            ? { outline: `2px solid ${ring as string}`, outlineOffset: 2 }
            : {}),
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: thumbLeft,
            width: thumbSize,
            height: thumbSize,
            borderRadius: '50%',
            backgroundColor: thumb as string,
            boxShadow: 'var(--shadow-sm)',
            transition: 'left 0.15s, background-color 0.15s',
          }}
        />
      </span>
      {label}
    </div>
  );
}

export function TogglePreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';

  // Project every registry knob as a `--uxm-toggle-switch-*` custom
  // property on the wrapper. The interactive <ToggleSwitch> below renders
  // the real component whose styles.css rules read these vars — live
  // editor edits paint immediately, and production `:hover` /
  // `:focus-visible` rules exercise exactly as they would in prod.
  const cssVars: Record<string, string | undefined> = {
    '--uxm-toggle-switch-width': styles.width != null ? `${styles.width}px` : undefined,
    '--uxm-toggle-switch-height': styles.height != null ? `${styles.height}px` : undefined,
    '--uxm-toggle-switch-off-track': styles.offTrack as string | undefined,
    '--uxm-toggle-switch-off-thumb': styles.offThumb as string | undefined,
    '--uxm-toggle-switch-on-track': styles.onTrack as string | undefined,
    '--uxm-toggle-switch-on-thumb': styles.onThumb as string | undefined,
    '--uxm-toggle-switch-hover-off-track': styles.hoverOffTrack as string | undefined,
    '--uxm-toggle-switch-hover-off-thumb': styles.hoverOffThumb as string | undefined,
    '--uxm-toggle-switch-hover-on-track': styles.hoverOnTrack as string | undefined,
    '--uxm-toggle-switch-hover-on-thumb': styles.hoverOnThumb as string | undefined,
    '--uxm-toggle-switch-focus-ring': styles.focusRing as string | undefined,
    '--uxm-toggle-switch-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-toggle-switch-error-color': styles.errorColor as string | undefined,
    '--uxm-toggle-switch-error-message-size':
      styles.errorMessageSize != null ? `${styles.errorMessageSize}px` : undefined,
  };

  const sectionLabel = {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, ...cssVars } as CSSProperties}>
      <div>
        <div style={sectionLabel}>{state} state</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ShowcaseRow on={false} state={state} styles={styles} label="Off" />
          <ShowcaseRow on={true} state={state} styles={styles} label="On" />
        </div>
      </div>

      {/* Interactive instance — uncontrolled so the browser owns the
          checked state. React (and the canvas's event-capture re-renders)
          can't fight the DOM here, so click/space-key toggle reliably in
          both directions. State knobs apply via the projected
          `--uxm-toggle-switch-*` vars on the wrapper above. The `key={state}`
          resets the toggle when designers flip into and out of disabled
          so the visual matches the freshly-disabled UX. */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Interactive</div>
        <ToggleSwitch
          key={state}
          disabled={state === 'disabled'}
          error={state === 'error' ? 'Enable notifications to continue' : undefined}
        >
          Click, hover, or Tab-focus this toggle
        </ToggleSwitch>
      </div>
    </div>
  );
}
