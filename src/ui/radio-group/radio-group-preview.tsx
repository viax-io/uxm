import { type CSSProperties } from 'react';

import type { PreviewProps } from '@/previews/types';
import { RadioGroup, RadioOption } from '@/ui';

type Styles = PreviewProps['styles'];

function ShowcaseRow({
  selected,
  state,
  styles,
  label,
  variant,
  indicator,
}: {
  selected: boolean;
  state: string;
  styles: Styles;
  label: string;
  variant: 'default' | 'card';
  indicator: 'hidden' | 'corner';
}) {
  // Static showcase — paints the selected forced state regardless of
  // pointer interaction. Inline JSX (not the real <RadioOption>) so each
  // forced state can override the circle + dot directly; the interactive
  // instance below is where production CSS rules exercise.
  //
  // It has to follow `variant`: this is the ONLY thing that paints the forced
  // hover / focus / disabled states — the interactive group below shows the
  // resting state and real input. Left as a row while the variant is `card`,
  // the States picker would show a hovered CIRCLE for a control that is a
  // tile, and the hover / focus knobs (which the card frame genuinely reads)
  // would be tuned against feedback that is not what ships.
  const isHover = state === 'hover';
  const isFocus = state === 'focus';
  const isDisabled = state === 'disabled';
  const isCard = variant === 'card';

  const bg = isHover
    ? styles.hoverUnselectedBg
    : styles.unselectedBg;
  const border = isHover
    ? (selected ? styles.hoverSelectedBorder : styles.hoverUnselectedBorder)
    : (selected ? styles.selectedBorder : styles.unselectedBorder);
  const dot = isHover ? styles.hoverDotColor : styles.dotColor;
  const ring = styles.focusRing;
  const size = (styles.size as number) ?? 20;

  const circle = (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: '50%',
        border: `2px solid ${border as string}`,
        backgroundColor: bg as string,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'border-color 0.15s, background-color 0.15s',
        ...(isFocus && !isCard
          ? { outline: `2px solid ${ring as string}`, outlineOffset: 2 }
          : {}),
        ...(isCard
          ? { position: 'absolute' as const, top: styles.cardPadding as number, right: styles.cardPadding as number }
          : {}),
      }}
    >
      {selected && (
        <span
          style={{
            width: size * 0.5,
            height: size * 0.5,
            borderRadius: '50%',
            backgroundColor: dot as string,
          }}
        />
      )}
    </span>
  );

  if (isCard) {
    // Mirrors `.uxm-radio--card`: the tile carries the frame and the focus
    // ring, and the circle is either gone or pinned to the corner.
    return (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: styles.cardGap as number,
          minWidth: 150,
          boxSizing: 'border-box',
          padding: styles.cardPadding as number,
          borderRadius: styles.cardRadius as number,
          border: `${styles.cardBorderWidth}px solid ${border as string}`,
          backgroundColor: styles.cardBg as string,
          fontSize: 14,
          color: 'var(--color-text)',
          opacity: isDisabled ? ((styles.disabledOpacity as number) ?? 0.4) : 1,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: 'border-color 0.15s, background-color 0.15s',
          ...(isFocus ? { outline: `2px solid ${ring as string}`, outlineOffset: 2 } : {}),
        }}
      >
        {indicator === 'corner' && circle}
        <strong>{label}</strong>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
          What this option does
        </span>
      </div>
    );
  }

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
      {circle}
      {label}
    </div>
  );
}

const INTERACTIVE_OPTIONS = ['Small', 'Medium', 'Large'];

export function RadioGroupPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  const direction = (variants.direction as 'vertical' | 'horizontal' | undefined) ?? 'vertical';
  const variant = (variants.variant as 'default' | 'card' | undefined) ?? 'default';
  const indicator = (variants.indicator as 'hidden' | 'corner' | undefined) ?? 'hidden';

  // Project every registry knob as a `--uxm-radio-group-*` custom property
  // on the wrapper. The interactive <RadioGroup> below renders the real
  // component whose styles.css rules read these vars — live editor edits
  // paint immediately, and production `:hover` / `:focus-visible` rules
  // exercise exactly as they would in prod.
  const cssVars: Record<string, string | undefined> = {
    '--uxm-radio-group-size': styles.size != null ? `${styles.size}px` : undefined,
    '--uxm-radio-group-gap': styles.gap != null ? `${styles.gap}px` : undefined,
    '--uxm-radio-group-unselected-bg': styles.unselectedBg as string | undefined,
    '--uxm-radio-group-unselected-border': styles.unselectedBorder as string | undefined,
    '--uxm-radio-group-selected-border': styles.selectedBorder as string | undefined,
    '--uxm-radio-group-dot-color': styles.dotColor as string | undefined,
    '--uxm-radio-group-hover-unselected-bg': styles.hoverUnselectedBg as string | undefined,
    '--uxm-radio-group-hover-unselected-border': styles.hoverUnselectedBorder as string | undefined,
    '--uxm-radio-group-hover-selected-border': styles.hoverSelectedBorder as string | undefined,
    '--uxm-radio-group-hover-dot-color': styles.hoverDotColor as string | undefined,
    '--uxm-radio-group-focus-ring': styles.focusRing as string | undefined,
    '--uxm-radio-group-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-radio-group-error-color': styles.errorColor as string | undefined,
    '--uxm-radio-group-error-message-size':
      styles.errorMessageSize != null ? `${styles.errorMessageSize}px` : undefined,
    '--uxm-radio-card-padding': `${styles.cardPadding}px`,
    '--uxm-radio-card-radius': `${styles.cardRadius}px`,
    '--uxm-radio-card-gap': `${styles.cardGap}px`,
    '--uxm-radio-card-border-width': `${styles.cardBorderWidth}px`,
    '--uxm-radio-card-bg': styles.cardBg as string,
  };

  const sectionLabel = {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  };

  // Pair the state and direction into the interactive `key` so that
  // toggling either variant resets the radio group cleanly (matches the
  // freshly-{re,dis}abled UX and clears any stale selection when the user
  // flips layout).
  const interactiveKey = `${state}-${direction}`;
  const interactiveDisabled = state === 'disabled';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, ...cssVars } as CSSProperties}>
      <div>
        <div style={sectionLabel}>{state} state</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ShowcaseRow selected={false} state={state} styles={styles} label="Unselected" variant={variant} indicator={indicator} />
          <ShowcaseRow selected={true} state={state} styles={styles} label="Selected" variant={variant} indicator={indicator} />
        </div>
      </div>

      {/* Interactive instance — uncontrolled so the browser owns the
          checked state. React (and the canvas's event-capture re-renders)
          can't fight the DOM here, so click/keyboard navigation toggle
          reliably between options. Three options share a unique `name`
          so the browser's radio-group semantics work natively. */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Interactive</div>
        <RadioGroup
          key={interactiveKey}
          name={`uxm-radio-preview-${interactiveKey}`}
          direction={direction}
          variant={variant}
          indicator={indicator}
          error={state === 'error' ? 'Pick an option to continue' : undefined}
        >
          {INTERACTIVE_OPTIONS.map((opt) => (
            <RadioOption
              key={opt}
              name={`uxm-radio-preview-${interactiveKey}`}
              value={opt}
              disabled={interactiveDisabled}
            >
              {variant === 'card' ? (
                // Card mode is for rich content — a one-word label in a tile
                // would demo a box, not the shape the variant exists for.
                <>
                  <strong>{opt}</strong>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
                    What this option does
                  </span>
                </>
              ) : (
                opt
              )}
            </RadioOption>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
