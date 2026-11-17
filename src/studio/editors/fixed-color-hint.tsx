import { useMemo } from 'react';

import { resolveCssColor } from '@/lib/contrast';
import { themeTokens } from '@/tokens';

import { useStudioT } from '../i18n';
import { isFixedColor, isTranslucent, nearestColor, sameColorValue } from '../lib/fixed-color';
import { useGlobalTheme } from '../lib/use-global-theme';

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
  /**
   * The theme the knob's component paints in when it sets its own (a dark
   * Surface on a light page). The suggestion is measured there: a token is
   * only "nearest" in the theme the person is looking at.
   */
  panelTheme?: 'light' | 'dark';
}

/**
 * Every token's colour as an element in `theme` would resolve it. A probe with
 * `data-theme` picks up the scope's tokens (and any brand override written for
 * that scope), so the suggestion matches what the panel actually paints.
 */
function tokenColorsIn(theme: 'light' | 'dark') {
  const probe = typeof document !== 'undefined' ? document.createElement('div') : null;
  if (probe) {
    probe.dataset.theme = theme;
    probe.hidden = true;
    document.body.appendChild(probe);
  }
  try {
    return themeTokens.flatMap((tok) => {
      const color = resolveCssColor(tok.variable, probe);
      const fallback = theme === 'dark' ? tok.darkHex : tok.hex;
      const usable = color && !color.startsWith('var(') ? color : fallback;
      return isTranslucent(usable) ? [] : [{ item: tok, color: usable }];
    });
  } finally {
    probe?.remove();
  }
}

/**
 * The line under a colour knob holding a fixed opaque colour someone picked:
 * it paints the same in a dark panel, a light panel and the page, where a
 * token follows each. Offers the theme token nearest to it, as resolved in the
 * theme the component paints in: its own (`panelTheme`) or else the page's. Rendered BELOW the property row rather than inside the picker,
 * so the row's reset button stays centred on the control.
 */
export function FixedColorHint({ label, value, defaultValue, onChange, panelTheme }: FixedColorHintProps) {
  const t = useStudioT();
  const pageTheme = useGlobalTheme();
  const theme = panelTheme ?? pageTheme;
  const show =
    typeof value === 'string' &&
    isFixedColor(value) &&
    !isTranslucent(value) &&
    !(typeof defaultValue === 'string' && sameColorValue(value, defaultValue));

  // Every token's colour in the theme the component paints in, translucent
  // ones left out: a tint can't stand in for an opaque colour. Resolved only
  // while the hint shows, and again when the value or that theme changes —
  // measured against the page while a dark panel is previewed, "Use Text" on a
  // near-black background wrote a token that paints near-white in the panel.
  const suggestion = useMemo(() => {
    if (!show) return undefined;
    return nearestColor(value as string, tokenColorsIn(theme));
  }, [show, value, theme]);

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
