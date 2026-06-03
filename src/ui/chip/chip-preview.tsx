import { useState, type CSSProperties, type ReactNode } from 'react';

import type { PreviewProps } from '@/previews/types';
import { Chip, type ChipMode } from '@/ui';
import { Icon } from '@/ui';

function PlusIcon() {
  return <Icon glyph="plus" size={16} strokeWidth={2} aria-hidden />
}

/**
 * Project the resolved style knobs onto `--uxm-chip-{kebab(key)}` CSS
 * custom properties, applied INLINE on each chip element (not on a
 * wrapper).
 *
 * Why per-element instead of cascade-from-wrapper: when the editor has
 * already published overrides to components.css, those declarations
 * sit on `.uxm-chip { --uxm-chip-…: … }` AT the chip element's class.
 * For custom properties, an own-class declaration beats a value
 * inherited from an ancestor — so a wrapper-level inline style for
 * the slider value would lose to the saved override and the live
 * preview wouldn't react. Inline style on the chip element itself
 * wins (inline > class specificity), so slider drags flash through
 * even when a saved override exists.
 */
function stylesToCssVars(styles: PreviewProps['styles']): CSSProperties {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(styles)) {
    const cssVar = '--uxm-chip-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
    if (typeof value === 'boolean') {
      out[cssVar] = value ? '1' : '0';
    } else if (typeof value === 'number') {
      out[cssVar] = `${value}px`;
    } else {
      out[cssVar] = String(value);
    }
  }
  return out as CSSProperties;
}

/**
 * Consumes the real `<Chip>` atom. Disabled honours the registry's
 * `state` variant via Chip's `disabled` prop; selected (filter mode)
 * honours it via the `selected` prop. Hover (and selected on non-filter
 * modes) is forced visually by inline-projecting the per-mode-per-state
 * color knobs — without this, switching State to "Hover" in the panel
 * shows nothing on canvas because the production CSS `:hover` rule only
 * fires on real pointer interaction.
 */
export function ChipPreview({ styles, variants }: PreviewProps) {
  const mode = ((variants.mode as string) ?? 'assist') as ChipMode;
  const stateVariant = ((variants.state as string) ?? 'default') as
    | 'default'
    | 'hover'
    | 'focus'
    | 'selected'
    | 'disabled';
  const forceDisabled = stateVariant === 'disabled';
  const forceSelected = stateVariant === 'selected'; // applies only to filter
  // Forced-focus modifier class. `.uxm-chip--state-focus` mirrors the
  // `:focus-visible` rule in styles.css, painting the shared ring on
  // canvas without real keyboard interaction. Applied to every chip in
  // the preview so the focus visual is unambiguous regardless of mode.
  const focusClass = stateVariant === 'focus' ? 'uxm-chip--state-focus' : undefined;
  const chipStyle = stylesToCssVars(styles);

  // For Hover (any mode) and Selected on non-filter modes, paint the
  // forced-state colors inline. Inline > class specificity, so the
  // visual stays painted regardless of real pointer interaction. Filter +
  // selected already paints via the `selected` prop; disabled already
  // paints via the `disabled` prop driving the chip's `[disabled]` rules.
  const isForcedHover = stateVariant === 'hover';
  const isForcedNonFilterSelected = stateVariant === 'selected' && mode !== 'filter';
  const shouldForcePaint = isForcedHover || isForcedNonFilterSelected;
  const forcedStateStyle: CSSProperties = shouldForcePaint
    ? {
        backgroundColor: styles[`${mode}${stateVariant.charAt(0).toUpperCase()}${stateVariant.slice(1)}Bg`] as string,
        borderColor: styles[`${mode}${stateVariant.charAt(0).toUpperCase()}${stateVariant.slice(1)}Border`] as string,
        color: styles[`${mode}${stateVariant.charAt(0).toUpperCase()}${stateVariant.slice(1)}Text`] as string,
      }
    : {};
  const finalStyle: CSSProperties = { ...chipStyle, ...forcedStateStyle };

  const [selected, setSelected] = useState<Record<string, boolean>>({ Active: true, Draft: false, Archived: false });
  const [tags, setTags] = useState<string[]>(['JavaScript', 'TypeScript', 'React']);

  let content: ReactNode = null;

  if (mode === 'assist') {
    content = (
      <>
        <Chip mode="assist" iconLeft={<PlusIcon />} disabled={forceDisabled} onClick={() => {}} style={finalStyle} className={focusClass}>
          Add label
        </Chip>
        <Chip mode="assist" disabled={forceDisabled} onClick={() => {}} style={finalStyle} className={focusClass}>
          Run model
        </Chip>
      </>
    );
  } else if (mode === 'filter') {
    content = Object.keys(selected).map((label) => (
      <Chip
        key={label}
        mode="filter"
        selected={forceSelected ? true : selected[label]}
        disabled={forceDisabled}
        onClick={() => setSelected((s) => ({ ...s, [label]: !s[label] }))}
        style={finalStyle}
        className={focusClass}
      >
        {label}
      </Chip>
    ));
  } else if (mode === 'input') {
    content = (
      <>
        {tags.map((t) => (
          <Chip
            key={t}
            mode="input"
            disabled={forceDisabled}
            onRemove={() => setTags((curr) => curr.filter((x) => x !== t))}
            style={finalStyle}
            className={focusClass}
          >
            {t}
          </Chip>
        ))}
        {tags.length === 0 && (
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>(All removed)</span>
        )}
      </>
    );
  } else {
    content = (
      <>
        <Chip mode="suggestion" disabled={forceDisabled} onClick={() => {}} style={finalStyle} className={focusClass}>Try a template</Chip>
        <Chip mode="suggestion" disabled={forceDisabled} onClick={() => {}} style={finalStyle} className={focusClass}>Browse models</Chip>
        <Chip mode="suggestion" disabled={forceDisabled} onClick={() => {}} style={finalStyle} className={focusClass}>See examples</Chip>
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {content}
    </div>
  );
}
