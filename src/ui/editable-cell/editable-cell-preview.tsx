import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { EditableCell, type EditableCellAlign, type EditableCellType, type EditableCellValue } from '@/ui';

type Styles = PreviewProps['styles'];

const sectionLabel = {
  fontSize: 11,
  color: 'var(--color-text-muted)',
  marginBottom: 12,
  letterSpacing: 0.5,
  textTransform: 'uppercase' as const,
};

function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-editable-cell-min-height': `${styles.minHeight}px`,
    '--uxm-editable-cell-max-width': `${styles.maxWidth ?? 320}px`,
    '--uxm-editable-cell-padding-x': `${styles.paddingX}px`,
    '--uxm-editable-cell-padding-y': `${styles.paddingY}px`,
    '--uxm-editable-cell-radius': `${styles.radius}px`,
    '--uxm-editable-cell-hover-bg': styles.hoverBg as string,
    '--uxm-editable-cell-pencil-color': styles.pencilColor as string,
    '--uxm-editable-cell-focus-border': styles.focusBorder as string,
    '--uxm-editable-cell-focus-ring': styles.focusRing as string,
    '--uxm-editable-cell-placeholder-color': styles.placeholderColor as string,
    '--uxm-editable-cell-disabled-opacity': String(styles.disabledOpacity ?? 0.55),
    '--uxm-editable-cell-input-bg': styles.inputBg as string,
    '--uxm-editable-cell-input-color': styles.inputColor as string,
    '--uxm-editable-cell-input-border': styles.inputBorder as string,
    '--uxm-editable-cell-input-focus-border': styles.inputFocusBorder as string,
    '--uxm-editable-cell-warning-border': styles.warningBorder as string,
    '--uxm-editable-cell-error-border': styles.errorBorder as string,
    width: 280,
  } as CSSProperties;
}

export function EditableCellPreview({ styles, variants }: PreviewProps & { componentId: string }) {
  const type = (variants.type as EditableCellType) ?? 'text';
  const align = (variants.align as EditableCellAlign) ?? 'left';
  // `state` forces the showcase cell into each peer state so only the
  // matching knobs are shown and they paint without interaction. hover /
  // focus ride on forced modifier classes, disabled on the `disabled` prop,
  // editing / error on `forceMode` — mirroring the rest of the input family.
  // Editing / error also force the input's focus halo via a class (in real
  // use the editing input is always focused; the canvas must not steal real
  // focus, so it mirrors the visuals instead). The Interactive row below
  // stays unforced for exercising the real click-to-edit flow.
  const state = (variants.state as string) ?? 'default';
  const inputStates = ['editing', 'warning', 'error'];
  const forcedClass = cn(
    state === 'hover' && 'uxm-editable-cell--state-hover',
    state === 'focus' && 'uxm-editable-cell--state-focus',
    inputStates.includes(state) && 'uxm-editable-cell--force-input-focus',
  );
  const forceMode = inputStates.includes(state)
    ? (state as 'editing' | 'warning' | 'error')
    : undefined;

  // Independent state per editor type so toggling Type in the editor
  // doesn't throw away the user's current value.
  const [textValue, setTextValue] = useState('Revenue Motion');
  const [numberValue, setNumberValue] = useState(42);

  const vars = buildVars(styles);

  // Async commit simulator — half-second delay, occasional reject for
  // the showcase row to demonstrate the inline-error path. The
  // Interactive row commits cleanly so designers can exercise the
  // happy path.
  const handleTextCommit = async (next: EditableCellValue) => {
    await new Promise((r) => setTimeout(r, 400));
    setTextValue(String(Array.isArray(next) ? next.join(', ') : next));
  };
  const handleNumberCommit = async (next: EditableCellValue) => {
    await new Promise((r) => setTimeout(r, 400));
    setNumberValue(Number(next));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <div style={sectionLabel}>{type} cell ({align}) — {state}</div>
        <div style={vars}>
          {type === 'number' ? (
            <EditableCell
              value={numberValue}
              onCommit={handleNumberCommit}
              type="number"
              align={align}
              forceMode={forceMode}
              disabled={state === 'disabled'}
              className={forcedClass || undefined}
              validate={(v) => (typeof v === 'number' && v < 0 ? 'Must be ≥ 0' : null)}
            />
          ) : (
            <EditableCell
              value={textValue}
              onCommit={handleTextCommit}
              type="text"
              align={align}
              forceMode={forceMode}
              disabled={state === 'disabled'}
              className={forcedClass || undefined}
              placeholder="Enter a name…"
            />
          )}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Interactive</div>
        <div
          style={{
            ...vars,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            width: 380,
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: 'var(--color-text-subtle)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Name (text)
            </div>
            <EditableCell
              value={textValue}
              onCommit={handleTextCommit}
              type="text"
              placeholder="Enter a name…"
            />
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--color-text-subtle)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Count (number, ≥ 0)
            </div>
            <EditableCell
              value={numberValue}
              onCommit={handleNumberCommit}
              type="number"
              align="right"
              validate={(v) => (typeof v === 'number' && v < 0 ? 'Must be ≥ 0' : null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
