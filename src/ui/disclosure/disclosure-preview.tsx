import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Disclosure } from '@/ui';
import { Icon } from '@/ui';
import { IconTile } from '@/ui';

type Styles = PreviewProps['styles'];

/**
 * Project every registry knob as a `--uxm-disclosure-*` custom property
 * on the wrapper. Both the static showcase and the interactive instance
 * below read from the same vars; the showcase is inert so the forced
 * state isn't overridden by real input, and the interactive instance
 * exercises `:hover` / `:focus-visible` / `:disabled` on real pointer
 * + keyboard.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-disclosure-inactive-bg': styles.inactiveBg as string,
    '--uxm-disclosure-inactive-text': styles.inactiveText as string,
    '--uxm-disclosure-hover-bg': styles.hoverBg as string,
    '--uxm-disclosure-hover-text': styles.hoverText as string,
    '--uxm-disclosure-focus-text': styles.focusText as string,
    '--uxm-disclosure-focus-ring': styles.focusRing as string,
    '--uxm-disclosure-disabled-bg': styles.disabledBg as string,
    '--uxm-disclosure-disabled-text': styles.disabledText as string,
    '--uxm-disclosure-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-disclosure-border-radius': `${styles.borderRadius}px`,
    '--uxm-disclosure-padding-x': `${styles.paddingX}px`,
    '--uxm-disclosure-padding-y': `${styles.paddingY}px`,
    '--uxm-disclosure-gap': `${styles.gap}px`,
    '--uxm-disclosure-font-size': `${styles.fontSize}px`,
    '--uxm-disclosure-chevron-color': styles.chevronColor as string,
    '--uxm-disclosure-chevron-size': `${styles.chevronSize}px`,
  } as CSSProperties;
}

const ICON_TILE_STYLE: CSSProperties = {
  ['--uxm-icon-tile-bg' as string]: 'var(--color-success-bg)',
  ['--uxm-icon-tile-color' as string]: 'var(--color-success-text)',
  ['--uxm-icon-tile-size' as string]: '32px',
  ['--uxm-icon-tile-radius' as string]: '6px',
};

/**
 * Static showcase — ONE Disclosure with the forced-state class matching
 * the State dropdown. Inert (`pointer-events: none` + `tabIndex={-1}`)
 * so the forced state isn't overridden by real input. Hand-rendered
 * because the atom doesn't expose a way to set the showcase-only
 * `--state-*` modifier class.
 */
function StaticShowcase({ state, open }: { state: string; open: boolean }) {
  const isDisabled = state === 'disabled';
  return (
    <button
      type="button"
      tabIndex={-1}
      disabled={isDisabled}
      aria-expanded={open}
      className={cn(
        'uxm-disclosure',
        open && 'uxm-disclosure--open',
        state === 'hover' && 'uxm-disclosure--state-hover',
        state === 'focus' && 'uxm-disclosure--state-focus',
      )}
      style={{ pointerEvents: 'none' }}
    >
      <span className="uxm-disclosure__icon">
        <IconTile style={ICON_TILE_STYLE}>
          <Icon glyph="square" size={18} />
        </IconTile>
      </span>
      <span className="uxm-disclosure__content">
        <span className="uxm-disclosure__label">Owner</span>
      </span>
      <Icon
        glyph="chevron-right"
        className="uxm-disclosure__chevron"
        size={16}
        aria-hidden="true"
      />
    </button>
  );
}

export function DisclosurePreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  const open = (variants.open as string ?? 'expanded') === 'expanded';
  const [interactiveOpen, setInteractiveOpen] = useState(true);
  const cssVars = buildVars(styles);

  const sectionLabel = {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 380, ...cssVars } as CSSProperties}>
      <div>
        <div style={sectionLabel}>{state} state</div>
        <StaticShowcase state={state} open={open} />
      </div>

      {/* Interactive instance — real <Disclosure> atom. Real `:hover` /
          `:focus-visible` exercise the production CSS via the projected
          vars above. Clicking the header toggles `aria-expanded` and
          rotates the chevron. The State dropdown only carries through
          to `disabled` here; the rest are exercised by real input. */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Interactive</div>
        <Disclosure
          icon={
            <IconTile style={ICON_TILE_STYLE}>
              <Icon glyph="square" size={18} />
            </IconTile>
          }
          label="Owner"
          open={interactiveOpen}
          onOpenChange={setInteractiveOpen}
          disabled={state === 'disabled'}
        />
      </div>
    </div>
  );
}
