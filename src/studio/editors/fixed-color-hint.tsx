import { useMemo } from 'react';

import { resolveCssColor } from '@/lib/contrast';
import { themeTokens } from '@/tokens';

import { useStudioT } from '../i18n';
import { isFixedColor, isTranslucent, nearestColor, sameColorValue } from '../lib/fixed-color';

interface FixedColorHintProps {
  /** The knob's label, so the button names the knob it changes. */
  label: string;
  value: string | number | boolean;
  /**
   * The knob's registry default. A fixed colour that IS the default was
   * chosen on purpose by the library, so it gets no hint.
   */
  defaultValue: string | number | boolean | undefined;
  onChange: (value: string | number | boolean) => void;
}

/**
 * The line under a colour knob holding a fixed opaque colour someone picked:
 * it paints the same in a dark panel, a light panel and the page, where a
 * token follows each. Offers the theme token nearest to it, as resolved in the
 * active theme. Rendered BELOW the property row rather than inside the picker,
 * so the row's reset button stays centred on the control.
 */
export function FixedColorHint({ label, value, defaultValue, onChange }: FixedColorHintProps) {
  const t = useStudioT();
  const show =
    typeof value === 'string' &&
    isFixedColor(value) &&
    !isTranslucent(value) &&
    !(typeof defaultValue === 'string' && sameColorValue(value, defaultValue));

  // Every token's colour in the active theme, translucent ones left out: a
  // tint can't stand in for an opaque colour. Resolved only while the hint
  // shows, and once per value rather than on every render.
  const suggestion = useMemo(() => {
    if (!show) return undefined;
    const candidates = themeTokens.flatMap((tok) => {
      const color = resolveCssColor(tok.variable);
      const usable = color && !color.startsWith('var(') ? color : tok.hex;
      return isTranslucent(usable) ? [] : [{ item: tok, color: usable }];
    });
    return nearestColor(value as string, candidates);
  }, [show, value]);

  if (!show) return null;
  const tokenName = suggestion ? t('token', suggestion.name) : '';
  return (
    <p className="mt-1.5 pr-5 text-[11px] leading-snug text-text-muted">
      {t('chrome', 'Fixed color: it won’t follow a dark or light panel.')}
      {suggestion && (
        <>
          {' '}
          <button
            type="button"
            onClick={() => onChange(suggestion.variable)}
            aria-label={t('chrome', 'Use {token} for {label}', { token: tokenName, label })}
            className="rounded-sm font-medium text-accent-bold underline underline-offset-2 decoration-accent-bold/40 hover:decoration-accent-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t('chrome', 'Use {token}', { token: tokenName })}
          </button>
        </>
      )}
    </p>
  );
}
