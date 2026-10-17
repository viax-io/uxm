
import type { PreviewProps } from '@/previews/types';
import { ExpandableText } from '@/ui';

import type { CSSProperties } from 'react';

type Styles = PreviewProps['styles'];

const LONG_TEXT =
  'Quarterly renewals are quoted from the contract anniversary, not the invoice date, so a mid-term amendment never restarts the notice window. A renewal that lands inside the final thirty days is quoted at the renewal-term price, never at the expiring one.\n\n' +
  'Discounts above the approval threshold route to the regional director; anything beyond that goes to finance. Until the approval lands, the quote stays in draft and the customer sees the list price.\n\n' +
  'Renewals under the minimum term are rejected at submission, with the reason shown to the account owner.';

const SHORT_TEXT = 'Short text fits in full, so no toggle is shown.';

const sectionLabel = {
  fontSize: 11,
  color: 'var(--color-text-muted)',
  marginBottom: 8,
  letterSpacing: 0.5,
  textTransform: 'uppercase' as const,
};

/**
 * Every registry knob projected as a `--uxm-expandable-text-*` custom property,
 * the same surface a consumer re-themes through.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-expandable-text-color': styles.color as string,
    '--uxm-expandable-text-font-size': `${styles.fontSize}px`,
    '--uxm-expandable-text-line-height': String(styles.lineHeight),
    '--uxm-expandable-text-gap': `${styles.gap}px`,
    '--uxm-expandable-text-toggle-color': styles.toggleColor as string,
    '--uxm-expandable-text-toggle-hover-color': styles.toggleHoverColor as string,
    '--uxm-expandable-text-toggle-font-size': `${styles.toggleFontSize}px`,
    '--uxm-expandable-text-toggle-font-weight': styles.toggleFontWeight as string,
    '--uxm-expandable-text-toggle-gap': `${styles.toggleGap}px`,
    '--uxm-expandable-text-focus-ring': styles.focusRing as string,
  } as CSSProperties;
}

export function ExpandableTextPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  // The registry has no `lines` variant: it is a prop, not a style, and a
  // digit-only picker would put bare numerals into every studio dictionary.
  // The preview pins the atom's own default.
  const lines = 4;
  const expanded = variants.expanded === 'expanded';

  // Forced hover / focus classes — the real toggle is only reachable by
  // pointer / keyboard, so the canvas mirrors those states via the same
  // selectors the `:hover` / `:focus-visible` rules share.
  const forced =
    state === 'hover' ? 'uxm-expandable-text--state-hover'
      : state === 'focus' ? 'uxm-expandable-text--state-focus'
        : undefined;

  return (
    <div style={{ ...buildVars(styles), display: 'flex', flexDirection: 'column', gap: 24, width: 320 }}>
      <div>
        <div style={sectionLabel}>Long text — {lines} lines</div>
        {/* `key` remounts on a variant change so `defaultExpanded` is re-read,
            while the toggle stays a real, clickable control. */}
        <ExpandableText key={String(expanded)} lines={lines} defaultExpanded={expanded} className={forced}>
          {LONG_TEXT}
        </ExpandableText>
      </div>
      <div>
        <div style={sectionLabel}>Short text</div>
        <ExpandableText lines={lines}>{SHORT_TEXT}</ExpandableText>
      </div>
    </div>
  );
}
