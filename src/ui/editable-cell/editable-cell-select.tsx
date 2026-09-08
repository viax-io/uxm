import { cn } from '@/helpers';

import { Banner } from '../banner';
import { ButtonGhost } from '../button';
import { HoverTooltip } from '../hover-tooltip';
import { Icon } from '../icon';
import { Listbox, MultiListbox, type ListboxRenderTriggerState } from '../listbox';
import { Popover } from '../popover';

import type { EditableCellOption } from './editable-cell.types';
import type { EditableCellViewProps } from './use-editable-cell';

/** `type="select"` / `"multiselect"` — a Listbox-driven trigger; no display/edit split. */
export function EditableCellSelectView({ props, cell }: EditableCellViewProps) {
  const {
    value,
    options,
    requiredMessage,
    disabled,
    className,
    style,
    'aria-label': ariaLabel,
    type,
    searchable,
    clearable,
    align,
    size,
    required,
    clearSelectionLabel,
  } = props;
  const {
    submitting,
    setError,
    open,
    setOpen,
    wrapRef,
    commitValue,
    isEmpty,
    display,
    titleText,
    shownError,
  } = cell;

  // For select/multiselect in open state, we render a Listbox-driven UI
  if (type === 'select' || type === 'multiselect') {
    const optionItems = options ?? [];
    const getKey = (o: EditableCellOption) => o.value;
    const getLabel = (o: EditableCellOption) => o.label;

    if (type === 'select') {
      const selectedItem = Array.isArray(value)
        ? null
        : optionItems.find((o) => o.value === String(value ?? '')) ?? null;

      return (
        <span
          ref={wrapRef}
          className={cn(
            'uxm-editable-cell',
            `uxm-editable-cell--${size}`,
            `uxm-editable-cell--align-${align}`,
            `uxm-editable-cell--type-${type}`,
            clearable && 'uxm-editable-cell--clearable',
            disabled && 'uxm-editable-cell--disabled',
            isEmpty && 'uxm-editable-cell--empty',
            open && 'uxm-editable-cell--open',
            className,
          )}
          style={style}
        >
          <Listbox<EditableCellOption>
            items={optionItems}
            getKey={getKey}
            getLabel={getLabel}
            value={selectedItem}
            onChange={async (next) => {
              if (next) await commitValue(next.value);
            }}
            disabled={disabled}
            searchable={searchable}
            matchAnchorWidth
            onOpenChange={setOpen}
            renderTrigger={({ open: isOpen, triggerProps }: ListboxRenderTriggerState<EditableCellOption>) => (
              <button
                type="button"
                {...triggerProps}
                className={cn(
                  'uxm-editable-cell__select-trigger',
                  isOpen && 'uxm-editable-cell__select-trigger--open',
                )}
                aria-label={ariaLabel ?? `Edit ${String(value ?? '')}`}
              >
                <HoverTooltip content={titleText} disabled={disabled}>
                  <span className="uxm-editable-cell__value uxm-editable-cell__option-label">
                    {display}
                  </span>
                </HoverTooltip>
                <span className="uxm-editable-cell__chevron" aria-hidden="true">
                  <Icon glyph="chevron-down" size={12} />
                </span>
              </button>
            )}
            renderItem={(o) => (
              <span className="uxm-editable-cell__option-label">{o.label}</span>
            )}
            footer={clearable && selectedItem ? ({ close }: { close: () => void }) => (
              <ButtonGhost
                className="uxm-listbox__footer-clear-option"
                onClick={() => {
                  commitValue('');
                  close();
                }}
              >
                <Icon glyph="close" size={12} />
                Clear
              </ButtonGhost>
            ) : undefined}
          />
          {clearable && !disabled && !submitting && !isEmpty && (
            /* Trigger ✕ — clear from the field itself (the input-family
               convention), on every size: commits the empty value directly,
               complementing the panel-footer Clear. Sibling of the trigger (a
               button can't nest a button), absolutely positioned into the
               reserved second gutter slot. Revealed only while the panel is
               open (see the `--open` gate in the stylesheet) — unlike the
               chevron, which also shows on hover. */
            <button
              type="button"
              className="uxm-editable-cell__trigger-clear"
              // Out of the tab order, same as every in-field clear here.
              tabIndex={-1}
              // This button is a SIBLING of the Listbox trigger, so it sits
              // outside the refs `useDismiss` treats as "inside" — and dismiss
              // runs on mousedown, i.e. BEFORE this click. Left alone, pressing
              // ✕ would first dismiss the panel and only then clear. Stop the
              // mousedown here so the clear below is the single thing that acts.
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => void commitValue('')}
              aria-label={clearSelectionLabel}
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

    // multiselect. A cell is a commit boundary, so this branch opts into
    // MultiListbox's staged mode (`commitMode="close"`: draft while open, one
    // commit on close) — a required cell then survives "clear all → pick one"
    // and N picks are one `onCommit`. It just hands over the committed
    // selection and commits the final array back.
    const selectedItems = Array.isArray(value)
      ? optionItems.filter((o) => value.includes(o.value))
      : [];

    return (
      <span
        ref={wrapRef}
        className={cn(
          'uxm-editable-cell',
          `uxm-editable-cell--${size}`,
          `uxm-editable-cell--align-${align}`,
          `uxm-editable-cell--type-${type}`,
          clearable && 'uxm-editable-cell--clearable',
          disabled && 'uxm-editable-cell--disabled',
          isEmpty && 'uxm-editable-cell--empty',
          open && 'uxm-editable-cell--open',
          className,
        )}
        style={style}
      >
        <MultiListbox<EditableCellOption>
          items={optionItems}
          getKey={getKey}
          getLabel={getLabel}
          value={selectedItems}
          onChange={(items) => void commitValue(items.map((o) => o.value))}
          // Commit on close, not per toggle — see the note above.
          commitMode="close"
          required={required}
          requiredMessage={requiredMessage}
          // MultiListbox owns the empty rule for multi (shared with every
          // picker); route its violation into this cell's error Banner.
          onRequiredViolation={(message) => setError({ message, severity: 'warning' })}
          disabled={disabled}
          searchable={searchable}
          matchAnchorWidth
          // Clear a stale required warning when the panel reopens for a fresh edit.
          onOpenChange={(next) => {
            setOpen(next);
            if (next) setError(null);
          }}
          renderTrigger={({ open: isOpen, triggerProps }: ListboxRenderTriggerState<EditableCellOption>) => (
            <button
              type="button"
              {...triggerProps}
              className={cn(
                'uxm-editable-cell__select-trigger',
                isOpen && 'uxm-editable-cell__select-trigger--open',
              )}
              aria-label={ariaLabel ?? `Edit ${String(value ?? '')}`}
            >
              <HoverTooltip content={titleText} disabled={disabled}>
                <span className="uxm-editable-cell__value uxm-editable-cell__option-label">
                  {display}
                </span>
              </HoverTooltip>
              <span className="uxm-editable-cell__chevron" aria-hidden="true">
                <Icon glyph="chevron-down" size={12} />
              </span>
            </button>
          )}
          renderItem={(o) => (
            <span className="uxm-editable-cell__option-label">{o.label}</span>
          )}
          footer={clearable ? ({ clear, selected }: { clear: () => void; selected: EditableCellOption[] }) =>
            selected.length > 0 ? (
              <ButtonGhost
                className="uxm-listbox__footer-clear-option"
                // `clear` (from MultiListbox) empties the draft and keeps the
                // panel open, so "clear all then pick one" works even on a
                // required cell — the empty state is transient and never
                // reaches `validate` / `onCommit`. `selected` is the live
                // draft, so the button hides itself once nothing is picked.
                onClick={clear}
              >
                <Icon glyph="close" size={12} />
                Clear all
              </ButtonGhost>
            ) : null
          : undefined}
        />
        {clearable && !disabled && !submitting && !isEmpty && (
          /* Trigger ✕ — clear from the field itself (the input-family
             convention), on every size: commits the empty value directly,
             complementing the panel-footer Clear. Sibling of the trigger (a
             button can't nest a button), absolutely positioned into the
             reserved second gutter slot. Revealed only while the panel is
             open (see the `--open` gate in the stylesheet) — unlike the
             chevron, which also shows on hover. */
          <button
            type="button"
            className="uxm-editable-cell__trigger-clear"
            // Out of the tab order, same as every in-field clear here.
            tabIndex={-1}
            // Same sibling-of-the-trigger problem as the select ✕ above, but
            // costlier here: `useDismiss` fires on mousedown, and this panel
            // runs `commitMode="close"`, so an unswallowed mousedown would
            // commit the STAGED DRAFT first and only then clear — two commits
            // for one press, and if the first is still in flight the
            // re-entrancy guard in `commitValue` drops the clear entirely.
            // Stopping it leaves the panel open, which is deliberate and
            // matches the footer's "Clear all": clear, then pick afresh.
            // MultiListbox re-seeds its draft from `value` under an open panel,
            // so the later close commits the cleared set, not the stale draft.
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => void commitValue([])}
            aria-label={clearSelectionLabel}
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
}
