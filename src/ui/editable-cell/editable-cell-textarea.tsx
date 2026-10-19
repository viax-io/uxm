import { cn } from '@/helpers';

import { Banner } from '../banner';
import { ExpandableTextToggle } from '../expandable-text/expandable-text-toggle';
import { Icon } from '../icon';
import { Textarea } from '../input';
import { Popover } from '../popover';

import type { EditableCellViewProps } from './use-editable-cell';

/**
 * `type="textarea"` — the multi-line sibling of `text`. Display wraps in full
 * and clamps to `lines` behind a Show more toggle; edit mode is the library's
 * own `Textarea`, sized to its content within fixed bounds.
 *
 * Unlike the single-line display, the root here is a WRAPPER holding two
 * siblings — the click-to-edit button and the toggle — because a button cannot
 * nest inside a button. The clamp sits on a span INSIDE the edit button: Chrome
 * will not `-webkit-line-clamp` a `<button>` itself.
 */
export function EditableCellTextareaView({ props, cell }: EditableCellViewProps) {
  const {
    value,
    disabled,
    placeholder,
    className,
    style,
    'aria-label': ariaLabel,
    clearable,
    align,
    size,
    clearValueLabel,
    moreLabel,
    lessLabel,
  } = props;
  const {
    setIsEditing,
    draft,
    setDraft,
    submitting,
    error,
    setError,
    textareaRef,
    expandable,
    wrapRef,
    triggerRef,
    returnFocusRef,
    handleCommit,
    handleClearDraft,
    handleKeyDown,
    editing,
    isEmpty,
    display,
    shownError,
  } = cell;
  // Destructured (rather than read as `expandable.x` in JSX): the clamp's
  // callback ref makes the React-compiler lint treat the whole object as a ref.
  const { expanded, toggle, contentId, contentRef, clamped, clampStyle, showToggle } = expandable;

  if (!editing) {
    return (
      <span
        className={cn(
          'uxm-editable-cell',
          'uxm-editable-cell--type-textarea',
          `uxm-editable-cell--${size}`,
          `uxm-editable-cell--align-${align}`,
          disabled && 'uxm-editable-cell--disabled',
          isEmpty && 'uxm-editable-cell--empty',
          className,
        )}
        style={style}
      >
        <button
          ref={triggerRef}
          type="button"
          className="uxm-editable-cell__textarea-trigger"
          onClick={() => {
            if (!disabled) setIsEditing(true);
          }}
          disabled={disabled}
          aria-label={ariaLabel ?? `Edit ${String(value ?? '')}`}
        >
          {/* Wrapped in full, not ellipsised — and no HoverTooltip: the toggle
              is how the rest is read, where a single-line cell reveals it on
              hover. `contentId` makes the toggle's aria-controls resolve. */}
          <span
            ref={contentRef}
            id={contentId}
            className={cn(
              'uxm-editable-cell__textarea-text',
              clamped && 'uxm-editable-cell__textarea-text--clamped',
            )}
            style={clampStyle}
          >
            {display}
          </span>
          {!disabled && (
            <span className="uxm-editable-cell__pencil" aria-hidden="true">
              <Icon glyph="pencil" size={16} strokeWidth={1.75} />
            </span>
          )}
        </button>
        {showToggle && (
          <ExpandableTextToggle
            className="uxm-editable-cell__toggle"
            expanded={expanded}
            contentId={contentId}
            moreLabel={moreLabel}
            lessLabel={lessLabel}
            onToggle={toggle}
          />
        )}
      </span>
    );
  }

  return (
    <span
      ref={wrapRef}
      className={cn(
        'uxm-editable-cell uxm-editable-cell--editing uxm-editable-cell--type-textarea',
        `uxm-editable-cell--${size}`,
        `uxm-editable-cell--align-${align}`,
        clearable && 'uxm-editable-cell--clearable',
        shownError?.severity === 'error' && 'uxm-editable-cell--error',
        shownError?.severity === 'warning' && 'uxm-editable-cell--warning',
        className,
      )}
      style={style}
    >
      {/* Invisible auto-sizer: same grid cell as the textarea, so the track —
          and the textarea stretched to it — is as tall as the draft wraps to,
          clamped by the min / max line bounds in the stylesheet. Pure CSS
          (the grid-autosize trick): no height is measured or written from JS.
          The trailing zero-width space gives a draft that ENDS in a newline
          its extra empty line — a bare trailing "\n" adds none. */}
      <span className="uxm-editable-cell__ghost uxm-editable-cell__ghost--textarea" aria-hidden="true">
        {draft}
        {'​'}
      </span>
      <Textarea
        textareaRef={textareaRef}
        // The cell owns its ✕ (see below) so it can swallow the mousedown and
        // keep focus — the atom's own ✕ would blur the textarea first, and blur
        // commits.
        clearable={false}
        rows={1}
        className="uxm-editable-cell__input"
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          // Clear stale validation error as the user types — they'll see a new
          // one on the next commit attempt if it still fails.
          if (error) setError(null);
        }}
        onBlur={(e) => {
          // Focus moved somewhere real (Tab, a click on another control): that
          // is where it belongs, so don't pull it back to the cell afterwards.
          if (e.relatedTarget) returnFocusRef.current = false;
          // Don't double-commit while a previous commit is still pending.
          if (!submitting) handleCommit();
        }}
        onKeyDown={handleKeyDown}
        disabled={submitting}
        placeholder={placeholder}
        // The display button's name, carried into edit mode: without it the
        // textbox is announced by its placeholder at best, and often by nothing.
        aria-label={ariaLabel}
        aria-invalid={Boolean(shownError)}
        aria-describedby={shownError ? 'uxm-editable-cell__error' : undefined}
      />
      {clearable && !submitting && draft !== '' && (
        <button
          type="button"
          className="uxm-editable-cell__clear"
          // Out of the tab order and mousedown-swallowing, same as the
          // single-line editor's ✕: the blur a click would cause commits and
          // unmounts the button before the click lands.
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClearDraft}
          aria-label={clearValueLabel}
        >
          <Icon glyph="close" size={12} />
        </button>
      )}
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
