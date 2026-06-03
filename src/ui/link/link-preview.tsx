import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';
import { type LinkUnderline } from '@/ui';

import type { CSSProperties } from 'react';

type Styles = PreviewProps['styles'];

/**
 * Project every registry knob as a `--uxm-link-*` custom property on the
 * wrapper. The showcase is the real Link element — when state=default it
 * stays interactive so real `:hover` / `:focus-visible` exercise the
 * production CSS via the projected vars. For the forced states (hover,
 * focus, disabled) the showcase becomes inert (`pointer-events: none` +
 * `tabIndex={-1}`) and the displayed state is forced by `--state-*`
 * modifier classes or `aria-disabled`, so real input can't override the
 * intended preview.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-link-inactive-text': styles.inactiveText as string,
    '--uxm-link-hover-text': styles.hoverText as string,
    '--uxm-link-focus-text': styles.focusText as string,
    '--uxm-link-focus-ring': styles.focusRing as string,
    '--uxm-link-disabled-text': styles.disabledText as string,
    '--uxm-link-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-link-font-size': `${styles.fontSize}px`,
    '--uxm-link-font-weight': styles.fontWeight as string,
    '--uxm-link-underline-offset': `${styles.underlineOffset}px`,
    '--uxm-link-underline-thickness': `${styles.underlineThickness}px`,
    '--uxm-link-external-icon-size': `${styles.externalIconSize}px`,
    '--uxm-link-external-icon-gap': `${styles.externalIconGap}px`,
  } as CSSProperties;
}

export function LinkPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  const underline = (variants.underline ?? 'hover') as LinkUnderline;
  const external = variants.external === 'true';
  const cssVars = buildVars(styles);
  const isDefault = state === 'default';

  return (
    <div style={cssVars}>
      <a
        href="#preview"
        onClick={(e) => e.preventDefault()}
        {...(isDefault ? {} : { tabIndex: -1 })}
        className={cn(
          'uxm-link',
          `uxm-link--underline-${underline}`,
          external && 'uxm-link--external',
          state === 'hover' && 'uxm-link--state-hover',
          state === 'focus' && 'uxm-link--state-focus',
        )}
        {...(state === 'disabled' ? { 'aria-disabled': true } : {})}
        {...(!isDefault ? { style: { pointerEvents: 'none' } } : {})}
      >
        View documentation
        {external && (
          <Icon
            glyph="arrow-up-right"
            className="uxm-link__external-icon"
            aria-hidden
          />
        )}
      </a>
    </div>
  );
}
