import { cn } from '@/helpers';

import { Banner } from '../banner';
import { Calendar, type CalendarValue } from '../calendar';
import { FORMAT_SPEC, maskDate } from '../date-input';
import { HoverTooltip } from '../hover-tooltip';
import { Icon } from '../icon';
import { Popover } from '../popover';

import type { EditableCellViewProps } from './use-editable-cell';

/** `type="date"` — click-to-edit with a masked input plus a calendar popover. */
export function EditableCellDateView({ props, cell }: EditableCellViewProps) {
  const {
    value,
    format,
    disabled,
    placeholder,
    className,
    style,
    'aria-label': ariaLabel,
    type,
    dateFormat,
    clearable,
    align,
    size,
    clearDateLabel,
    openCalendarLabel,
    calendarDialogLabel,
    addDateLabel,
  } = props;
  const {
    setIsEditing,
    draft,
    setDraft,
    submitting,
    error,
    setError,
    open,
    setOpen,
    inputRef,
    wrapRef,
    parsedValue,
    displayFormatted,
    handleCommit,
    handlePick,
    handleClearDraft,
    handleKeyDown,
    editing,
    dateHint,
    isEmpty,
    display,
    titleText,
    shownError,
  } = cell;

  // Date type — click-to-edit like text/number, but the editing surface is a
  // DateInput-style masked field: type the date OR pick it from the calendar
  // that opens on focus. Committed values are ISO; the input shows the mask.
  if (type === 'date') {
    // `parsedValue` (memoized above) already parses ISO-first with a mask
    // fallback, so the calendar highlights the right day for every `dateFormat`.
    const calendarValue: CalendarValue = { start: parsedValue, end: parsedValue };
    const spec = FORMAT_SPEC[dateFormat];

    if (!editing) {
      const displayNode = isEmpty
        // Fall back to the format hint (MM/DD/YYYY etc.) so an empty date cell
        // shows the mask as a placeholder — same as the shared `display` and
        // the edit-mode input, rather than rendering blank.
        ? placeholder ?? dateHint
        : format
          ? format(value)
          : displayFormatted || value;

      // Single button root — same shape as the text/number display so the
      // value's left edge and padding match the editing input exactly (no
      // horizontal jump on enter-edit). A wrapper + inner trigger would
      // double the padding; the display has no popover to anchor, so the
      // wrapper span is only needed in edit mode (for the calendar/error
      // popovers).
      return (
        <button
          type="button"
          className={cn(
            'uxm-editable-cell',
            `uxm-editable-cell--${size}`,
            `uxm-editable-cell--align-${align}`,
            `uxm-editable-cell--type-date`,
            disabled && 'uxm-editable-cell--disabled',
            isEmpty && 'uxm-editable-cell--empty',
            className,
          )}
          style={style}
          onClick={() => {
            if (disabled) return;
            // Enter edit AND open the calendar in one deterministic step —
            // mirrors DateInput's "focus reveals the calendar". Opening here
            // (rather than on the input's onFocus) avoids the focus-after-
            // remount race: the display button and editing input are
            // different elements, so the auto-focus that mounts the input
            // doesn't reliably deliver a focus event the calendar can hook.
            setIsEditing(true);
            setOpen(true);
          }}
          disabled={disabled}
          // Empty cell has no value to edit — "Add date" reads better than the
          // trailing-space "Edit date " and signals the fill affordance.
          aria-label={ariaLabel ?? (isEmpty ? addDateLabel : `Edit date ${displayFormatted || String(value)}`)}
        >
          <HoverTooltip content={titleText} disabled={disabled}>
            <span className="uxm-editable-cell__value">{displayNode}</span>
          </HoverTooltip>
          {!disabled && (
            <span className="uxm-editable-cell__pencil" aria-hidden="true">
              <Icon glyph="calendar" size={14} />
            </span>
          )}
        </button>
      );
    }

    // Date editing — DateInput-style masked input plus a calendar popover.
    return (
      <span
        ref={wrapRef}
        className={cn(
          'uxm-editable-cell uxm-editable-cell--editing',
          `uxm-editable-cell--${size}`,
          `uxm-editable-cell--align-${align}`,
          `uxm-editable-cell--type-date`,
          clearable && 'uxm-editable-cell--clearable',
          shownError?.severity === 'error' && 'uxm-editable-cell--error',
          shownError?.severity === 'warning' && 'uxm-editable-cell--warning',
          className,
        )}
        style={style}
      >
        <span className="uxm-editable-cell__ghost" aria-hidden="true">
          {display}
        </span>
        <span className="uxm-editable-cell__ghost" aria-hidden="true">
          {draft || spec.placeholder}
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          className="uxm-editable-cell__input"
          value={draft}
          placeholder={spec.placeholder}
          onChange={(e) => {
            setDraft(maskDate(e.target.value, dateFormat));
            if (error) setError(null);
          }}
          onBlur={() => {
            if (!submitting) handleCommit();
          }}
          onKeyDown={handleKeyDown}
          disabled={submitting}
          aria-invalid={Boolean(shownError)}
          aria-describedby={shownError ? 'uxm-editable-cell__error' : undefined}
        />
        {/* ✕ sits inboard of the calendar toggle (mirrors DateInput's layout);
            hidden while the draft is empty — the reserved gutter stays, so
            typing never shifts the text. */}
        {clearable && !submitting && draft !== '' && (
          <button
            type="button"
            className="uxm-editable-cell__clear"
            // Out of the tab order (the in-field-clear convention). Tab must
            // keep moving to the next real control: the blur it fires commits
            // and leaves edit mode, which unmounts this button mid-focus-shift
            // and would drop focus to <body>. Pointer-only; select-all +
            // Delete is the keyboard path to the same result.
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClearDraft}
            aria-label={clearDateLabel}
          >
            <Icon glyph="close" size={12} />
          </button>
        )}
        <button
          type="button"
          className="uxm-editable-cell__date-icon"
          // Out of the tab order for the same reason as the ✕ above — Tab's
          // blur commits and unmounts this button. Keyboard users never need
          // it: entering edit mode on a date cell already opens the calendar.
          tabIndex={-1}
          // preventDefault keeps focus on the input — toggling the calendar
          // must not blur the field (a blur commits the in-flight draft).
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (submitting) return;
            // Clear any shown error as we open, so the calendar and the error
            // banner (both anchored here) are mutually exclusive — otherwise a
            // later `setError(null)` from typing would un-hide and reopen the
            // calendar the user had dismissed.
            setError(null);
            setOpen((o) => !o);
          }}
          disabled={submitting}
          aria-label={openCalendarLabel}
          // Match the popover's effective visibility (hidden while an error
          // shows) rather than raw `open`, so the two never disagree.
          aria-expanded={open && !shownError}
        >
          <Icon glyph="calendar" size={14} />
        </button>
        <Popover
          open={open && !shownError}
          onOpenChange={setOpen}
          anchor={wrapRef}
          placement="bottom-start"
          closeOnEscape
          closeOnOutsideClick
          restoreFocus={false}
          role="dialog"
          // A `role="dialog"` needs an accessible name. Non-modal by design
          // (no `aria-modal`): focus deliberately stays in the typed input
          // — `restoreFocus={false}` and the mousedown-preventDefault above
          // keep the field focused so the calendar augments typing rather
          // than trapping focus like a true modal.
          aria-label={calendarDialogLabel}
        >
          {/* Swallow mousedown so a calendar click never blurs the input:
              the pick commits explicitly via handlePick, and a blur-commit of
              the typed draft would race it. Purely focus management — the
              wrapper carries no semantics, so it stays a plain element. */}
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- focus-retention only; the interactive controls are the Calendar's own buttons */}
          <div onMouseDown={(e) => e.preventDefault()}>
            <Calendar value={calendarValue} onChange={handlePick} />
          </div>
        </Popover>
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
}
