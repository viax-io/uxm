import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Avatar, Icon } from '@/ui';

import { SidebarNavTrigger, type SidebarNavTriggerVariant } from './sidebar-nav-trigger';

import type { CSSProperties } from 'react';

type Styles = PreviewProps['styles'];

/**
 * Project every registry knob onto its CSS custom property. Names follow
 * `--uxm-sidebar-nav-trigger-{kebab(key)}`, which is exactly what generate-css's
 * kebab fallback produces — so no PER_COMPONENT_MAPPING entry is needed.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-sidebar-nav-trigger-padding-x': `${styles.paddingX}px`,
    '--uxm-sidebar-nav-trigger-padding-y': `${styles.paddingY}px`,
    '--uxm-sidebar-nav-trigger-gap': `${styles.gap}px`,
    '--uxm-sidebar-nav-trigger-border-radius': `${styles.borderRadius}px`,

    '--uxm-sidebar-nav-trigger-bg': styles.bg as string,
    '--uxm-sidebar-nav-trigger-hover-bg': styles.hoverBg as string,
    '--uxm-sidebar-nav-trigger-outlined-bg': styles.outlinedBg as string,
    '--uxm-sidebar-nav-trigger-outlined-border': styles.outlinedBorder as string,
    '--uxm-sidebar-nav-trigger-focus-ring': styles.focusRing as string,

    '--uxm-sidebar-nav-trigger-font-size': `${styles.fontSize}px`,
    '--uxm-sidebar-nav-trigger-font-weight': styles.fontWeight as string,
    '--uxm-sidebar-nav-trigger-value-color': styles.valueColor as string,

    '--uxm-sidebar-nav-trigger-caption-font-size': `${styles.captionFontSize}px`,
    '--uxm-sidebar-nav-trigger-caption-font-weight': styles.captionFontWeight as string,
    '--uxm-sidebar-nav-trigger-caption-letter-spacing': `${styles.captionLetterSpacing}em`,
    '--uxm-sidebar-nav-trigger-caption-text-transform': styles.captionTextTransform as string,
    '--uxm-sidebar-nav-trigger-caption-color': styles.captionColor as string,
    '--uxm-sidebar-nav-trigger-caption-gap': `${styles.captionGap}px`,

    '--uxm-sidebar-nav-trigger-icon-size': `${styles.iconSize}px`,
    '--uxm-sidebar-nav-trigger-icon-color': styles.iconColor as string,
    '--uxm-sidebar-nav-trigger-trailing-color': styles.trailingColor as string,
  } as CSSProperties;
}

/**
 * ONE specimen, driven entirely by the pickers.
 *
 * It used to be two rows — a switcher above an account row — to show that one
 * component serves both ends of the rail. But only the first row followed
 * `variant` and `state`, while the slot toggles moved both, so nothing told you
 * which picker reached which row. A showcase that is half-driven is worse than
 * one that shows less: the reader cannot trust what they are looking at.
 *
 * The account case is not lost, it moved into a picker. `mark` chooses `Icon`,
 * `Avatar` or nothing — and `Avatar` is the case worth keeping, since it proves
 * the slot paints no tile and does not squeeze a child that brings its own
 * size. The caption and value follow the mark, because an avatar beside a
 * workspace name would misrepresent what the atom is for.
 *
 * `open` and `disabled` are applied as the real `aria-expanded="true"` and
 * `disabled` attributes rather than classes — those ARE the atom's selectors for
 * those states, so the picker exercises the production mechanism instead of
 * imitating it. Only hover and focus need the atom's `--state-hover` /
 * `--state-focus` classes, since neither a pointer nor the tab ring can be
 * parked where the picker wants them; those share a declaration block with the
 * real pseudo-selectors, so a forced state cannot drift from the real one.
 */
export function SidebarNavTriggerPreview({ styles, variants }: PreviewProps & { componentId: string }) {
  const state = (variants.state as string) ?? 'default';
  const variant = ((variants.variant as string) ?? 'outlined') as SidebarNavTriggerVariant;
  const mark = (variants.mark as string) ?? 'icon';
  const withCaption = (variants.withCaption ?? 'yes') === 'yes';
  const captionPlacement = ((variants.captionPlacement as string) ?? 'above') as 'above' | 'below';
  const withTrailing = (variants.withTrailing ?? 'yes') === 'yes';

  const isAccount = mark === 'avatar';
  const markNode = isAccount
    ? <Avatar initials="DR" />
    : mark === 'icon'
      ? <Icon glyph="product" size={18} />
      : undefined;

  const cssVars = buildVars(styles);

  const sectionLabel: CSSProperties = {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, ...cssVars } as CSSProperties}>
      <div>
        <div style={sectionLabel}>{state} state · {variant}</div>
        {/* A rail-width column: these rows are always full-bleed inside a
            sidebar, and reviewing one at page width would hide every
            truncation decision the atom makes. */}
        <div style={{ width: 260 }}>
          <SidebarNavTrigger
            variant={variant}
            aria-expanded={state === 'open' ? true : undefined}
            disabled={state === 'disabled' || undefined}
            className={cn(
              state === 'hover' && 'uxm-sidebar-nav-trigger--state-hover',
              state === 'focus' && 'uxm-sidebar-nav-trigger--state-focus',
            )}
            icon={markNode}
            caption={withCaption ? (isAccount ? 'Tenant owner' : 'Workspace') : undefined}
            captionPlacement={captionPlacement}
            trailing={withTrailing ? <Icon glyph="chevron-down" size={16} /> : undefined}
          >
            {isAccount ? 'dan@acme.com' : 'order-processing'}
          </SidebarNavTrigger>
        </div>
      </div>
    </div>
  );
}
