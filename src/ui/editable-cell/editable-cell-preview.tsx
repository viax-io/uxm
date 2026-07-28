import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import {
  EditableCell,
  type EditableCellAlign,
  type EditableCellOption,
  type EditableCellSize,
  type EditableCellType,
  type EditableCellValue,
} from '@/ui';

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
    '--uxm-editable-cell-max-width': `${styles.maxWidth ?? 320}px`,
    '--uxm-editable-cell-radius': `${styles.radius}px`,
    // Symmetric per-size dimension knobs — each set is read only by its own
    // size modifier, so writing both alongside each other is harmless.
    '--uxm-editable-cell-small-padding-x': `${styles.smallPaddingX ?? 8}px`,
    '--uxm-editable-cell-small-padding-y': `${styles.smallPaddingY ?? 4}px`,
    // Passed through verbatim, not suffixed with px: the knob is a select whose
    // default is the literal `inherit`, matching the CSS fallback (`1em`). The
    // canvas gets its table scale from the `fontSize` context below instead of
    // by pinning this var — so an untouched knob previews the real inheriting
    // behaviour rather than a hardcoded 13px the CSS never applies.
    '--uxm-editable-cell-small-font-size': (styles.smallFontSize as string) ?? 'inherit',
    '--uxm-editable-cell-medium-padding-x': `${styles.mediumPaddingX ?? 12}px`,
    '--uxm-editable-cell-medium-padding-y': `${styles.mediumPaddingY ?? 6}px`,
    '--uxm-editable-cell-medium-font-size': `${styles.mediumFontSize ?? 14}px`,
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
    '--uxm-editable-cell-clear-color': styles.clearColor as string,
    '--uxm-editable-cell-clear-hover-bg': styles.clearHoverBg as string,
    '--uxm-editable-cell-warning-border': styles.warningBorder as string,
    '--uxm-editable-cell-error-border': styles.errorBorder as string,
    width: 280,
    // The canvas' own font is larger than a table's, which would make a `small`
    // cell read as oversized. Setting the surrounding CONTEXT to DataTable's
    // 13px cell font — rather than pinning the cell's font-size var — previews
    // the dense table scale while keeping `small`'s documented inherit
    // behaviour intact. `medium` pins 14px itself, so it's unaffected.
    fontSize: 13,
  } as CSSProperties;
}

// Sample options for the select / multiselect showcase branches. Kept small
// so the dropdown renders without a search box by default (auto threshold).
const SAMPLE_OPTIONS: EditableCellOption[] = [
  { value: 'growth', label: 'Growth' },
  { value: 'retention', label: 'Retention' },
  { value: 'expansion', label: 'Expansion' },
  { value: 'winback', label: 'Win-back' },
];

const commitDelay = () => new Promise((r) => setTimeout(r, 400));

// One independent bundle of per-type state + async commit handlers. Called
// once for the showcase cell and once for the Interactive cell so editing one
// never leaks into the other (each call is its own hook instance).
function useCellState() {
  const [text, setText] = useState('Revenue Motion');
  // number | '' — an emptied number cell commits '' (the uniform "cleared"
  // value), and the preview must round-trip it to show the placeholder.
  const [num, setNum] = useState<number | ''>(42);
  const [date, setDate] = useState('2026-03-14');
  const [select, setSelect] = useState('growth');
  const [multi, setMulti] = useState<string[]>(['growth', 'expansion']);
  return {
    text,
    num,
    date,
    select,
    multi,
    commitText: async (n: EditableCellValue) => {
      await commitDelay();
      setText(String(Array.isArray(n) ? n.join(', ') : n));
    },
    commitNumber: async (n: EditableCellValue) => {
      await commitDelay();
      setNum(n === '' ? '' : Number(n));
    },
    commitDate: async (n: EditableCellValue) => {
      await commitDelay();
      setDate(String(n));
    },
    commitSelect: async (n: EditableCellValue) => {
      await commitDelay();
      setSelect(String(n));
    },
    commitMulti: async (n: EditableCellValue) => {
      await commitDelay();
      // multiselect commits a string[]; clearable commits [] (empty).
      setMulti(Array.isArray(n) ? n : n === '' ? [] : [String(n)]);
    },
  };
}
type CellState = ReturnType<typeof useCellState>;

export function EditableCellPreview({ styles, variants }: PreviewProps & { componentId: string }) {
  const type = (variants.type as EditableCellType) ?? 'text';
  const align = (variants.align as EditableCellAlign) ?? 'left';
  const size = (variants.size as EditableCellSize) ?? 'small';
  const dateFormat = (variants.dateFormat as 'ymd' | 'dmy' | 'mdy') ?? 'ymd';
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

  // Two independent state bundles — the showcase cell and the Interactive cell
  // never share a value, so editing one leaves the other untouched.
  const showcase = useCellState();
  const interactive = useCellState();

  const vars = buildVars(styles);

  // Chrome shared by every showcase branch so switching Type in the editor
  // re-renders the matching editor while keeping the forced state / align.
  const showcaseChrome = {
    align,
    size,
    forceMode,
    disabled: state === 'disabled',
    className: forcedClass || undefined,
  };

  // Render an editor for the type currently picked in the editor — the whole
  // point of this preview: changing Type must swap the rendered editor, not
  // fall back to a text input. `chrome` is the per-context wrapper: the
  // showcase passes forced state / disabled; the Interactive row passes just
  // `align` so it stays a real, clickable editor.
  type Chrome = {
    align: EditableCellAlign;
    size?: EditableCellSize;
    forceMode?: 'editing' | 'warning' | 'error';
    disabled?: boolean;
    className?: string;
  };
  const renderCell = (chrome: Chrome, c: CellState) => {
    switch (type) {
      case 'number':
        return (
          <EditableCell
            {...chrome}
            type="number"
            value={c.num}
            onCommit={c.commitNumber}
            placeholder="Enter a number…"
            validate={(v) => (typeof v === 'number' && v < 0 ? 'Must be ≥ 0' : null)}
          />
        );
      case 'date':
        return (
          <EditableCell
            {...chrome}
            type="date"
            value={c.date}
            dateFormat={dateFormat}
            onCommit={c.commitDate}
          />
        );
      case 'select':
        return (
          <EditableCell
            {...chrome}
            type="select"
            value={c.select}
            options={SAMPLE_OPTIONS}
            onCommit={c.commitSelect}
            placeholder="Pick a motion…"
          />
        );
      case 'multiselect':
        return (
          <EditableCell
            {...chrome}
            type="multiselect"
            value={c.multi}
            options={SAMPLE_OPTIONS}
            onCommit={c.commitMulti}
            placeholder="Pick motions…"
          />
        );
      default:
        return (
          <EditableCell
            {...chrome}
            type="text"
            value={c.text}
            onCommit={c.commitText}
            placeholder="Enter a name…"
          />
        );
    }
  };
  const showcaseCell = renderCell(showcaseChrome, showcase);
  // Interactive: same type, but unforced (real click-to-edit) — only `align`,
  // and its OWN state bundle so edits here don't touch the showcase value.
  const interactiveCell = renderCell({ align, size }, interactive);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <div style={sectionLabel}>{type} cell ({size}, {align}) — {state}</div>
        <div style={vars}>{showcaseCell}</div>
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Interactive — {type}</div>
        {/* Mirrors the Type knob: a real, click-to-edit cell of the SAME type
            as the showcase (no forced state), so designers can exercise the
            selected editor. */}
        <div style={vars}>{interactiveCell}</div>
      </div>
    </div>
  );
}
