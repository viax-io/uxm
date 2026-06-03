import { type CSSProperties } from 'react';

import type { PreviewProps } from '@/previews/types';
import { Checkbox } from '@/ui';
import { Icon } from '@/ui';

type Styles = PreviewProps['styles'];

function ShowcaseRow({
  checked,
  state,
  styles,
  label,
}: {
  checked: boolean;
  state: string;
  styles: Styles;
  label: string;
}) {
  // Static showcase always paints the selected forced state, regardless of
  // pointer interaction — that's the whole point of the showcase (one row
  // per checked/unchecked mode so designers see all four cells at a glance).
  // Inline JSX (not the real <Checkbox>) is used here so each forced state
  // can override the box visuals directly; the interactive instance below
  // is where production CSS rules exercise.
  const isHover = state === 'hover';
  const isFocus = state === 'focus';
  const isDisabled = state === 'disabled';

  const bg = isHover
    ? (checked ? styles.hoverCheckedBg : styles.hoverUncheckedBg)
    : (checked ? styles.checkedBg : styles.uncheckedBg);
  const border = isHover
    ? (checked ? styles.hoverCheckedBorder : styles.hoverUncheckedBorder)
    : (checked ? styles.checkedBorder : styles.uncheckedBorder);
  const glyph = isHover ? styles.hoverCheckGlyphColor : styles.checkGlyphColor;
  const ring = styles.focusRing;
  const size = (styles.size as number) ?? 20;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: styles.gap as number,
        fontSize: 14,
        color: 'var(--color-text)',
        opacity: isDisabled ? ((styles.disabledOpacity as number) ?? 0.4) : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: size,
          height: size,
          borderRadius: styles.borderRadius as number,
          border: `1.5px solid ${border as string}`,
          backgroundColor: bg as string,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.15s',
          ...(isFocus
            ? { outline: `2px solid ${ring as string}`, outlineOffset: 2 }
            : {}),
        }}
      >
        {checked && (
          <Icon
            glyph="check"
            size={size * 0.6}
            strokeWidth={3}
            style={{ color: glyph as string }}
          />
        )}
      </span>
      {label}
    </div>
  );
}

export function CheckboxPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';

  // Project every registry knob as a `--uxm-checkbox-*` custom property on
  // the wrapper. The interactive <Checkbox> below renders the real component
  // whose styles.css rules read these vars — so live editor changes paint
  // immediately, and the production :hover / :focus-visible rules exercise
  // exactly as they would in prod.
  const cssVars: Record<string, string | undefined> = {
    '--uxm-checkbox-size': styles.size != null ? `${styles.size}px` : undefined,
    '--uxm-checkbox-border-radius': styles.borderRadius != null ? `${styles.borderRadius}px` : undefined,
    '--uxm-checkbox-gap': styles.gap != null ? `${styles.gap}px` : undefined,
    '--uxm-checkbox-unchecked-bg': styles.uncheckedBg as string | undefined,
    '--uxm-checkbox-unchecked-border': styles.uncheckedBorder as string | undefined,
    '--uxm-checkbox-checked-bg': styles.checkedBg as string | undefined,
    '--uxm-checkbox-checked-border': styles.checkedBorder as string | undefined,
    '--uxm-checkbox-check-glyph-color': styles.checkGlyphColor as string | undefined,
    '--uxm-checkbox-hover-unchecked-bg': styles.hoverUncheckedBg as string | undefined,
    '--uxm-checkbox-hover-unchecked-border': styles.hoverUncheckedBorder as string | undefined,
    '--uxm-checkbox-hover-checked-bg': styles.hoverCheckedBg as string | undefined,
    '--uxm-checkbox-hover-checked-border': styles.hoverCheckedBorder as string | undefined,
    '--uxm-checkbox-hover-check-glyph-color': styles.hoverCheckGlyphColor as string | undefined,
    '--uxm-checkbox-focus-ring': styles.focusRing as string | undefined,
    '--uxm-checkbox-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
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
          <ShowcaseRow checked={false} state={state} styles={styles} label="Unchecked" />
          <ShowcaseRow checked={true} state={state} styles={styles} label="Checked" />
        </div>
      </div>

      {/* Interactive instance — uncontrolled so the browser owns the
          checked state. React (and the canvas's event-capture re-renders)
          can't fight the DOM here, so click/space-key toggle reliably in
          both directions. State knobs still apply via the projected
          `--uxm-checkbox-*` vars on the wrapper above. The forced `key`
          on the disabled-state branch lets the input reset when
          designers flip into and out of disabled. */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Interactive</div>
        <Checkbox key={state} disabled={state === 'disabled'}>
          Click, hover, or Tab-focus this checkbox
        </Checkbox>
      </div>
    </div>
  );
}
