import { useRef, useLayoutEffect, useState } from 'react';

import {
  contrastRatio,
  parseColor,
  rgbToHex,
  suggestAccessibleColor,
  suggestAccessibleToken,
  wcagLevel,
  type RGB,
  type TokenCandidate,
} from '@/lib/contrast';
import { themeTokens } from '@/tokens';
import { Chip, Icon, SectionHeader, Tag, type TagType } from '@/ui';

import { useUxm } from '../lib/context';

import type { ComponentDef } from '../lib/types';

const colorDist = (a: RGB, b: RGB) => {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return dr * dr + dg * dg + db * db;
};

interface Pair {
  fgKey: string;
  fgLabel: string;
  fgValue: string;
  bgKey: string | null;
  bgLabel: string;
  bgValue: string;
}

type Level = ReturnType<typeof wcagLevel>;

interface Suggestion {
  value: string; // string to pass to setOverride — either `var(--...)` or `#hex`
  label: string; // display label, e.g. "Text" or "#1C1C1C"
}

interface Result {
  pair: Pair;
  ratio: number | null;
  level: Level | null;
  suggestion: Suggestion | null;
}

// Tokens that are valid foreground candidates (exclude pure backgrounds/borders).
const FOREGROUND_TOKEN_GROUPS = new Set(['text', 'accent', 'semantic', 'highlights']);
const FOREGROUND_TOKEN_VARIABLES = themeTokens
  .filter((t) => FOREGROUND_TOKEN_GROUPS.has(t.group))
  .map((t) => ({ variable: t.variable, name: t.name }));

// Keys we treat as text-like foregrounds (text contrast matters, WCAG 1.4.3).
// Per-state color knobs (`hoverColor`, `activeColor`, `focusColor`,
// `disabledColor`) are included so atoms with state coverage get WCAG
// evaluation in every state, paired against the matching state bg or the
// fall-through to default `backgroundColor`.
const FOREGROUND_KEYS = new Set([
  'color', 'textColor', 'iconColor', 'labelColor', 'checkColor',
  'titleColor', 'descriptionColor',
  'hoverColor', 'activeColor', 'focusColor', 'disabledColor',
  'errorColor', 'trendUpColor', 'trendDownColor',
  'chipText', 'chipActiveText', 'activeText', 'inactiveText',
  'headerText', 'pillTextColor',
]);
// Keys we treat as backgrounds for pairing.
const BACKGROUND_KEYS = new Set([
  'backgroundColor', 'bgColor',
  'pillColor', 'chipBg', 'chipActiveBg', 'activeBg', 'inactiveBg',
  'headerBg', 'rowBg', 'rowHoverBg',
]);
const FOREGROUND_SUFFIX_RE = /(?:^|[a-z0-9])(Text|TextColor)$/;
const BACKGROUND_SUFFIX_RE = /(?:^|[a-z0-9])(Bg|Background|BackgroundColor)$/i;
const MAIN_BG_KEYS = ['backgroundColor', 'bgColor'];

function isForeground(key: string): boolean {
  return FOREGROUND_KEYS.has(key) || FOREGROUND_SUFFIX_RE.test(key);
}
function isBackground(key: string): boolean {
  return BACKGROUND_KEYS.has(key) || BACKGROUND_SUFFIX_RE.test(key);
}
const CANVAS_BG_FALLBACK = 'var(--color-card)';

function stemOf(key: string, side: 'fg' | 'bg'): string {
  let s = key;
  if (side === 'fg') {
    s = s.replace(/TextColor$/, '').replace(/Text$/, '').replace(/Color$/, '');
  } else {
    s = s.replace(/BackgroundColor$/i, '').replace(/Background$/i, '').replace(/Bg$/, '').replace(/Color$/, '');
  }
  return s.toLowerCase();
}

function findPairs(
  def: ComponentDef,
  resolve: (key: string, fallback: string | number | boolean) => string | number | boolean,
): Pair[] {
  const visibleColorProps = def.styleProperties.filter((p) => {
    if (p.control !== 'color') return false;
    if (!p.showWhen) return true;
    for (const [vKey, vVal] of Object.entries(p.showWhen)) {
      const fallback = def.layoutVariants.find((v) => v.key === vKey)?.defaultValue ?? '';
      if (resolve(vKey, fallback) !== vVal) return false;
    }
    return true;
  });
  const bgProps = visibleColorProps.filter((p) => isBackground(p.key));
  const fgProps = visibleColorProps.filter((p) => isForeground(p.key));

  // Default `backgroundColor` for fall-through pairing — search across ALL
  // bg color knobs (not just the currently-visible set). In non-default
  // states like Focus or Disabled the default bg knob is hidden via
  // `showWhen`, but the actual visible background on the canvas is still
  // the default bg (state changes only the ring / opacity / text). So we
  // resolve against the default bg's value rather than dropping to canvas.
  const allBgProps = def.styleProperties.filter(
    (p) => p.control === 'color' && isBackground(p.key),
  );
  const mainBgProp =
    bgProps.find((p) => MAIN_BG_KEYS.includes(p.key)) ??
    allBgProps.find((p) => MAIN_BG_KEYS.includes(p.key));

  const pairs: Pair[] = [];
  for (const fg of fgProps) {
    const stem = stemOf(fg.key, 'fg');
    let bg = bgProps.find((b) => stemOf(b.key, 'bg') === stem);
    if (!bg) bg = mainBgProp;
    const fgValue = String(resolve(fg.key, fg.defaultValue));
    const bgValue = bg ? String(resolve(bg.key, bg.defaultValue)) : CANVAS_BG_FALLBACK;
    pairs.push({
      fgKey: fg.key,
      fgLabel: fg.label,
      fgValue,
      bgKey: bg?.key ?? null,
      bgLabel: bg?.label ?? 'Canvas',
      bgValue,
    });
  }
  return pairs;
}

export function WcagPanel({ def }: { def: ComponentDef }) {
  const { theme, selectedId, getOverrides, setOverride, getCurrentVariants } = useUxm();
  const scopeRef = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<Result[]>([]);

  const overrides = getOverrides(selectedId);
  const currentVariants = getCurrentVariants();
  const overridesKey = JSON.stringify({
    colors: Object.fromEntries(
      def.styleProperties
        .filter((p) => p.control === 'color')
        .map((p) => [p.key, overrides[p.key]]),
    ),
    variants: Object.fromEntries(
      def.layoutVariants.map((v) => [v.key, currentVariants[v.key]]),
    ),
  });

  useLayoutEffect(() => {
    // Variant-aware resolver: variants live in ephemeral session state,
    // styleProperty edits live in persisted overrides. `findPairs` uses
    // this for both `showWhen` evaluation (variant keys) and color value
    // lookup (styleProperty keys).
    const variantKeys = new Set(def.layoutVariants.map((v) => v.key));
    const resolve = (key: string, fallback: string | number | boolean) => {
      if (variantKeys.has(key)) return currentVariants[key] ?? fallback;
      return overrides[key] ?? fallback;
    };
    const pairs = findPairs(def, resolve);
    const scope = scopeRef.current;

    const tokenCandidates: TokenCandidate[] = FOREGROUND_TOKEN_VARIABLES
      .map(({ variable, name }) => {
        const rgb = parseColor(variable, scope);
        return rgb ? { variable, name, rgb } : null;
      })
      .filter((t): t is TokenCandidate => t !== null);

    const computed: Result[] = pairs.map((pair) => {
      const fg = parseColor(pair.fgValue, scope);
      const bg = parseColor(pair.bgValue, scope);
      if (!fg || !bg) {
        return { pair, ratio: null, level: null, suggestion: null };
      }
      const ratio = contrastRatio(fg, bg);
      const level = wcagLevel(ratio);
      let suggestion: Suggestion | null = null;
      if (level === 'fail' || level === 'AA-large') {
        const improvers = tokenCandidates.filter(
          (t) => contrastRatio(t.rgb, bg) > ratio + 0.05,
        );
        const token =
          suggestAccessibleToken(fg, bg, 4.5, improvers) ??
          (level === 'fail' ? suggestAccessibleToken(fg, bg, 3, improvers) : null);

        if (token) {
          suggestion = { value: token.variable, label: token.name };
        } else {
          const hex45 = suggestAccessibleColor(fg, bg, 4.5);
          const hex = hex45 ?? (level === 'fail' ? suggestAccessibleColor(fg, bg, 3) : null);
          if (hex && contrastRatio(hex, bg) > ratio + 0.05) {
            // If any improving semantic token is visually close to the hex fallback, prefer it.
            const nearby = [...improvers]
              .map((t) => ({ t, dist: colorDist(hex, t.rgb) }))
              .sort((a, b) => a.dist - b.dist)[0];
            const NEAR_THRESHOLD = 60 * 60 * 3; // ≈60 RGB units total deviation
            if (nearby && nearby.dist < NEAR_THRESHOLD) {
              suggestion = { value: nearby.t.variable, label: nearby.t.name };
            } else {
              const hexStr = rgbToHex(hex);
              suggestion = { value: hexStr, label: hexStr.toUpperCase() };
            }
          }
        }
      }
      return { pair, ratio, level, suggestion };
    });
    setResults(computed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [def.id, overridesKey, theme]);

  if (results.length === 0) return <div ref={scopeRef} />;

  return (
    <div ref={scopeRef} className="mb-6">
      <SectionHeader>Accessibility</SectionHeader>
      <div className="space-y-2">
        {results.map(({ pair, ratio, level, suggestion }) => {
          const failing = level === 'fail' || level === 'AA-large';
          return (
            <div
              key={pair.fgKey}
              className="rounded-lg border border-border bg-surface p-3"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex shrink-0">
                    <span
                      className="h-4 w-4 rounded-l-[4px] border border-border"
                      style={{ backgroundColor: pair.bgValue }}
                    />
                    <span
                      className="h-4 w-4 rounded-r-[4px] border border-l-0 border-border"
                      style={{ backgroundColor: pair.fgValue }}
                    />
                  </div>
                  <span className="text-[11px] text-text-strong truncate">
                    {pair.fgLabel} / {pair.bgLabel}
                  </span>
                </div>
                <LevelBadge level={level} ratio={ratio} />
              </div>
              {failing && suggestion && (
                <Chip
                  mode="suggestion"
                  onClick={() => setOverride(selectedId, pair.fgKey, suggestion.value)}
                  iconLeft={<Icon glyph="sparkle" size={12} strokeWidth={2} />}
                >
                  Quick fix → {suggestion.label}
                </Chip>
              )}
              {level === null && (
                <p className="text-[10px] text-text-muted">
                  Couldn&apos;t evaluate (unresolvable colour).
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Render the WCAG level + contrast ratio as a Tag. The level→type mapping:
//   AAA, AA       → success  (passing)
//   AA-large      → warning  (passing only at ≥18pt — borderline)
//   fail          → danger   (under 4.5:1)
// Falls back to an em-dash placeholder when contrast can't be evaluated
// (e.g. unresolvable colour token).
const LEVEL_TAG_TYPE: Record<Level, TagType> = {
  AAA: 'success',
  AA: 'success',
  'AA-large': 'warning',
  fail: 'danger',
};

const LEVEL_LABEL: Record<Level, string> = {
  AAA: 'AAA',
  AA: 'AA',
  'AA-large': 'AA-large',
  fail: 'Fail',
};

function LevelBadge({ level, ratio }: { level: Level | null; ratio: number | null }) {
  if (level === null || ratio === null) {
    return <span className="text-[10px] text-text-subtle">—</span>;
  }
  return (
    <Tag type={LEVEL_TAG_TYPE[level]} style={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
      {LEVEL_LABEL[level]} · {ratio.toFixed(2)}
    </Tag>
  );
}
