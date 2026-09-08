import { type CSSProperties, type ReactNode } from 'react';

import { Icon } from '@/ui';
import { IconButton } from '@/ui';
import { InlineAction } from '@/ui';

import { ColorPicker } from '../../editors/color-picker';
import { NumberInput } from '../../editors/number-input';
import { SelectInput } from '../../editors/select-input';
import { SliderInput } from '../../editors/slider-input';
import { TextInput } from '../../editors/text-input';
import { ToggleInput } from '../../editors/toggle-input';

import type { ComponentDef } from '../../lib/types';

export function renderEditor(
  control: ComponentDef['styleProperties'][number]['control'],
  args: {
    label: string;
    value: string | number | boolean;
    onChange: (v: string | number | boolean) => void;
    prop: ComponentDef['styleProperties'][number];
  },
): ReactNode {
  const { label, value, onChange, prop } = args;
  switch (control) {
    case 'color':
      return <ColorPicker label={label} value={value as string} onChange={onChange} />;
    case 'number':
      return (
        <NumberInput
          label={label}
          value={value as number}
          onChange={onChange}
          min={prop.min}
          max={prop.max}
          step={prop.step}
          unit={prop.unit}
        />
      );
    case 'slider':
      return (
        <SliderInput
          label={label}
          value={value as number}
          onChange={onChange}
          min={prop.min ?? 0}
          max={prop.max ?? 100}
          step={prop.step ?? 1}
          unit={prop.unit}
        />
      );
    case 'select':
      return (
        <SelectInput
          label={label}
          value={value as string}
          onChange={onChange}
          options={(prop.options ?? []).map((o) => ({ value: o, label: o }))}
        />
      );
    case 'toggle':
      return <ToggleInput label={label} value={value as boolean} onChange={onChange} />;
    case 'text':
      return <TextInput label={label} value={value as string} onChange={onChange} />;
  }
}

export function PropertyRow({
  cascadeCount,
  onCascade,
  category,
  propLabel,
  synced,
  justMatched,
  isOverridden,
  onReset,
  children,
}: {
  cascadeCount: number;
  onCascade: () => void;
  category: string;
  propLabel: string;
  synced: boolean;
  justMatched: boolean;
  isOverridden: boolean;
  onReset: () => void;
  children: ReactNode;
}) {
  // 16×16 footprint matches the previous `h-4 w-4` chrome — IconButton's
  // default is 32×32, so we override via the size var. Absolute
  // positioning lives inline since this is a panel-specific placement
  // (centred to the field row), not part of the atom's API.
  const resetIconStyle: CSSProperties = {
    ['--uxm-icon-button-size' as string]: '16px',
    color: 'var(--color-text-subtle)',
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
  };
  const resetButton = isOverridden ? (
    <IconButton
      onClick={onReset}
      title={`Reset ${propLabel} to default`}
      aria-label={`Reset ${propLabel} to default`}
      style={resetIconStyle}
    >
      <Icon glyph="refresh" size={12} strokeWidth={2.25} aria-hidden />
    </IconButton>
  ) : null;

  if (cascadeCount === 0) {
    return (
      <div className="relative pr-5">
        {children}
        {resetButton}
      </div>
    );
  }

  // Show post-cascade confirmation briefly; once that fades, hide the link until the value diverges again.
  const hideLink = synced && !justMatched;

  return (
    <div className="pl-3 -ml-3 border-l-2 border-accent-bold/30">
      <div className="relative pr-5">
        {children}
        {resetButton}
      </div>
      {!hideLink && (
        justMatched ? (
          // The success-state confirmation is intentionally left as a plain
          // span — it's a one-off transient state ("just matched"), not a
          // tappable action, so it doesn't fit InlineAction's button shape.
          <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-accent-bold">
            <Icon glyph="check" size={10} strokeWidth={3} />
            Matched in {cascadeCount} other {category}
          </span>
        ) : (
          <div className="mt-1.5">
            <InlineAction
              onClick={onCascade}
              title={`Apply "${propLabel}" to ${cascadeCount} other ${category}`}
              icon={<Icon glyph="arrow-down" strokeWidth={2.5} />}
            >
              Match in {cascadeCount} other {category}
            </InlineAction>
          </div>
        )
      )}
    </div>
  );
}
