import { cn } from '@/helpers';

import { Banner } from '../banner';
import { HoverTooltip } from '../hover-tooltip';
import { Icon } from '../icon';
import { maskNumeric } from '../number-input';
import { Popover } from '../popover';

import type { EditableCellViewProps } from './use-editable-cell';

/** `type="text"` / `"number"` — a button in display mode, an input in edit mode. */
export function EditableCellTextView({ props, cell }: EditableCellViewProps) {
  const {
    value,
    disabled,
    placeholder,
    className,
    style,
    'aria-label': ariaLabel,
    type,
    clearable,
    align,
    size,
    clearValueLabel,
  } = props;
  const {
    setIsEditing,
    draft,
    setDraft,
    submitting,
    error,
    setError,
    inputRef,
    wrapRef,
    handleCommit,
    handleClearDraft,
    handleKeyDown,
    editing,
    isEmpty,
    display,
    titleText,
    shownError,
  } = cell;

  // Text / number types
  if (!editing) {
    return (
      <button
        type="button"
        className={cn(
          'uxm-editable-cell',
          `uxm-editable-cell--${size}`,
          `uxm-editable-cell--align-${align}`,
          disabled && 'uxm-editable-cell--disabled',
          isEmpty && 'uxm-editable-cell--empty',
          className,
        )}
        style={style}
        onClick={() => {
          if (!disabled) setIsEditing(true);
        }}
        disabled={disabled}
        aria-label={ariaLabel ?? `Edit ${String(value ?? '')}`}
      >
        {/* The value needs its own element for ellipsis — text-overflow
            doesn't apply to a flex container's anonymous text. Values wider
            than the cell's max-width truncate instead of growing the column
            unboundedly; the hidden text surfaces in a hover tooltip (only
            when actually clipped) and stays editable by entering edit mode. */}
        <HoverTooltip content={titleText} disabled={disabled}>
          <span className="uxm-editable-cell__value">{display}</span>
        </HoverTooltip>
        {/* Hover affordance — a pencil glyph fades in on hover / keyboard
            focus. The background tint alone can't signal editability inside
            a DataTable, where the row's own hover tint coincides with it.
            Absolute overlay in a reserved gutter (see editable-cell.scss) so
            it never shifts or collides with the value. Hidden when disabled. */}
        {!disabled && (
          <span className="uxm-editable-cell__pencil" aria-hidden="true">
            <Icon glyph="pencil" size={16} strokeWidth={1.75} />
          </span>
        )}
      </button>
    );
  }

  return (
    <span
      ref={wrapRef}
      className={cn(
        'uxm-editable-cell uxm-editable-cell--editing',
        `uxm-editable-cell--${size}`,
        `uxm-editable-cell--align-${align}`,
        clearable && 'uxm-editable-cell--clearable',
        shownError?.severity === 'error' && 'uxm-editable-cell--error',
        shownError?.severity === 'warning' && 'uxm-editable-cell--warning',
        className,
      )}
      style={style}
    >
      {/* Invisible width-keepers, stacked in the same grid cell as the
          input. The display content ghost preserves the exact min-content
          width this cell contributed before entering edit mode — without
          it, editing the column's WIDEST row would drop its contribution
          from auto table-column sizing and the column would visibly
          shrink. The draft ghost grows the cell naturally as the user
          types past the original width. */}
      <span className="uxm-editable-cell__ghost" aria-hidden="true">
        {display}
      </span>
      <span className="uxm-editable-cell__ghost" aria-hidden="true">
        {draft}
      </span>
      <input
        ref={inputRef}
        // `type="text"` + `inputMode` — the input-family convention (see
        // NumberInput): native number inputs ship browser spinner UI, trigger
        // autofill, and disagree across browsers on accepted characters.
        // `maskNumeric` replaces the native filtering per keystroke (same as
        // the date editor's `maskDate`); without it, `Number()`'s loose
        // coercion would let e.g. "0x1A" commit as 26.
        type="text"
        inputMode={type === 'number' ? 'decimal' : undefined}
        autoComplete="off"
        className="uxm-editable-cell__input"
        value={draft}
        onChange={(e) => {
          setDraft(
            type === 'number'
              ? maskNumeric(e.target.value, true, true, Number.POSITIVE_INFINITY)
              : e.target.value,
          );
          // Clear stale validation error as the user types — they'll
          // see a new one on the next commit attempt if it still fails.
          if (error) setError(null);
        }}
        onBlur={() => {
          // Don't double-commit while a previous commit is still pending.
          if (!submitting) handleCommit();
        }}
        onKeyDown={handleKeyDown}
        disabled={submitting}
        placeholder={placeholder}
        aria-invalid={Boolean(shownError)}
        aria-describedby={shownError ? 'uxm-editable-cell__error' : undefined}
      />
      {/* One-click ✕ (mirrors TextInput/NumberInput): empties the draft and
          keeps focus; hidden while the draft is already empty. The gutter is
          reserved via `--clearable` so its appearance never shifts text. */}
      {clearable && !submitting && draft !== '' && (
        <button
          type="button"
          className="uxm-editable-cell__clear"
          // Out of the tab order — see the date branch's note: the blur Tab
          // fires commits and unmounts this button, so leaving it focusable
          // would strand focus on a removed node instead of advancing to the
          // next cell.
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClearDraft}
          aria-label={clearValueLabel}
        >
          <Icon glyph="close" size={12} />
        </button>
      )}
      {/* Problems hang under the cell in a portal'd popover so the table
          row never changes height. The popover must not manage focus —
          the input keeps it for in-place correction / retry. Escape and
          outside clicks already have edit-mode semantics (cancel / blur-
          commit), so the popover's own close triggers are disabled; it
          opens and closes purely with the error state. */}
      <Popover
        open={Boolean(shownError)}
        onOpenChange={(next) => {
          if (!next) setError(null);
        }}
        anchor={wrapRef}
        placement="bottom-start"
        closeOnEscape={false}
        closeOnOutsideClick={false}
        restoreFocus={false}
        role="presentation"
      >
        {shownError && (
          <Banner
            variant={shownError.severity}
            id="uxm-editable-cell__error"
            className="uxm-editable-cell__error-banner"
          >
            {shownError.message}
          </Banner>
        )}
      </Popover>
    </span>
  );
}
