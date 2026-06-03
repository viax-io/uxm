import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Breadcrumb, type BreadcrumbSeparator } from '@/ui';
import { Icon } from '@/ui';
import { InlineAction } from '@/ui';

type Styles = PreviewProps['styles'];

const ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'Smartphones', href: '#smartphones' },
  { label: 'iPhone 15', href: '#iphone-15' },
];

/**
 * Project every registry knob as a `--uxm-breadcrumb-*` custom property
 * on the wrapper. The showcase isolates a single link crumb in the
 * displayed state (no separators, no neighbouring crumbs) so the state
 * treatment reads cleanly. The interactive instance below renders the
 * full Breadcrumb atom; clicking any link crumb truncates the path so
 * that crumb becomes the new current — exercising the active-state
 * styling against the projected vars.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-breadcrumb-inactive-text': styles.inactiveText as string,
    '--uxm-breadcrumb-hover-text': styles.hoverText as string,
    '--uxm-breadcrumb-focus-text': styles.focusText as string,
    '--uxm-breadcrumb-focus-ring': styles.focusRing as string,
    '--uxm-breadcrumb-active-text': styles.activeText as string,
    '--uxm-breadcrumb-active-font-weight': styles.activeFontWeight as string,
    '--uxm-breadcrumb-disabled-text': styles.disabledText as string,
    '--uxm-breadcrumb-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-breadcrumb-link-weight': styles.linkWeight as string,
    '--uxm-breadcrumb-separator-color': styles.separatorColor as string,
    '--uxm-breadcrumb-separator-size': `${styles.separatorSize}px`,
    '--uxm-breadcrumb-font-size': `${styles.fontSize}px`,
    '--uxm-breadcrumb-gap': `${styles.gap}px`,
    '--uxm-breadcrumb-underline-offset': `${styles.underlineOffset}px`,
    '--uxm-breadcrumb-underline-thickness': `${styles.underlineThickness}px`,
  } as CSSProperties;
}

/**
 * Static showcase — a single link crumb in the displayed state, wrapped
 * in a `.uxm-breadcrumb` scope so the breadcrumb-scoped CSS rules apply.
 * Inert: `pointer-events: none` blocks `:hover` from firing on mouse-
 * over and `tabIndex={-1}` keeps the anchor out of the focus order so
 * `:focus-visible` can't fire from real keyboard input. The interactive
 * instance below uses the real atom — so production CSS exercises on
 * real interaction.
 */
function StaticShowcase({ state }: { state: string }) {
  const stateClass = ['hover', 'focus', 'active'].includes(state)
    ? `uxm-link--state-${state}`
    : null;
  const showAriaDisabled = state === 'disabled';

  return (
    <nav
      aria-label="Breadcrumb"
      className="uxm-breadcrumb"
      style={{ pointerEvents: 'none' }}
    >
      <a
        href="#preview"
        onClick={(e) => e.preventDefault()}
        tabIndex={-1}
        className={cn(
          'uxm-link',
          'uxm-link--underline-hover',
          'uxm-breadcrumb__link',
          stateClass,
        )}
        {...(showAriaDisabled ? { 'aria-disabled': true } : {})}
      >
        Smartphones
      </a>
    </nav>
  );
}

const SECTION_LABEL: CSSProperties = {
  fontSize: 11,
  color: 'var(--color-text-muted)',
  marginBottom: 12,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
};

export function BreadcrumbPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  const separator = (variants.separator ?? 'chevron') as BreadcrumbSeparator;
  const cssVars = buildVars(styles);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 320, ...cssVars } as CSSProperties}>
      <div>
        <div style={SECTION_LABEL}>{state} state</div>
        <StaticShowcase state={state} />
      </div>

      {/* Interactive instance — keyed by state so changing the State knob
          remounts and restores the full path. Real `:hover` /
          `:focus-visible` exercise the production CSS via the projected
          vars above; the State dropdown only carries through to
          `disabled` here (applied to the crumb before current). */}
      <InteractiveBreadcrumb key={state} state={state} separator={separator} />
    </div>
  );
}

function InteractiveBreadcrumb({
  state,
  separator,
}: {
  state: string;
  separator: BreadcrumbSeparator;
}) {
  // Track which crumb is the "active" (current) one. Clicking a link crumb
  // truncates the path so that crumb becomes the new current — links lose
  // their href on the truncated tail. Parent's `key={state}` resets this
  // to `ITEMS.length - 1` on every State change.
  const [currentIndex, setCurrentIndex] = useState(ITEMS.length - 1);

  // Build the interactive item list. Items past the current crumb are
  // dropped (truncating the path so the clicked crumb becomes the new
  // tail). When State=disabled, the crumb before current is rendered
  // disabled to demo the styling alongside enabled crumbs.
  const interactiveItems = ITEMS.slice(0, currentIndex + 1).map((item, i) => {
    const isCurrent = i === currentIndex;
    return {
      label: item.label,
      href: isCurrent ? undefined : item.href,
      disabled: state === 'disabled' && i === currentIndex - 1,
    };
  });

  return (
    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
      <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
        <div style={{ ...SECTION_LABEL, marginBottom: 0 }}>Interactive</div>
        {currentIndex < ITEMS.length - 1 && (
          <InlineAction
            onClick={() => setCurrentIndex(ITEMS.length - 1)}
            icon={<Icon glyph="refresh" strokeWidth={2.25} aria-hidden />}
            title="Restore the full breadcrumb path"
          >
            Reset path
          </InlineAction>
        )}
      </div>
      <Breadcrumb
        separator={separator}
        items={interactiveItems}
        onClick={(e) => {
          e.preventDefault();
          const anchor = (e.target as HTMLElement).closest('a.uxm-link');
          if (!anchor || anchor.getAttribute('aria-disabled') === 'true') return;
          const all = Array.from(e.currentTarget.querySelectorAll('a.uxm-link'));
          const idx = all.indexOf(anchor as HTMLAnchorElement);
          if (idx >= 0) setCurrentIndex(idx);
        }}
      />
    </div>
  );
}
