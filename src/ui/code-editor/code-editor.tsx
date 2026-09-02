import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  type TextareaHTMLAttributes,
  type UIEvent,
} from 'react';

import { cn, mergeDescribedBy, mergeRefs } from '@/helpers';

import { FieldError } from '../field-error';

/**
 * Code Editor — a plain-text code surface for developer tooling (query
 * consoles, payload editors, expression fields).
 *
 * Deliberately a real `<textarea>`, not a wrapper over CodeMirror/Monaco:
 * the library ships zero runtime dependencies and that is a constitutional
 * rule, not an accident. The consequence is the scope boundary — a
 * `<textarea>` renders one uniform text run, so there is NO syntax
 * highlighting here and there cannot be. What it does buy is everything
 * that comes free with a native control: IME composition, spellcheck
 * opt-out, autofill/undo/redo, form participation, mobile keyboards, and
 * a screen-reader contract that already works. If highlighting becomes a
 * real requirement, that is a different atom (a `<pre>` overlay behind
 * transparent text plus a tokenizer) — not a prop on this one.
 *
 * Why it is not `<Textarea variant="code">`:
 *   1. Studio theming is per-component-id. Every `styleProperty` maps to
 *      one `--uxm-<id>-*` var and `layoutVariants` are ephemeral display
 *      states, so a variant could not carry its own font size — the mono
 *      surface would drag every prose textarea in the app with it.
 *   2. Tab-to-indent is the point of a code field and a keyboard trap in
 *      a prose one. Gating it on a prop gives one component two keyboard
 *      contracts.
 *   3. The input family already splits by purpose — password, number,
 *      currency, date, time, phone are each their own atom.
 */

/** Start index of the line containing `pos`. */
function lineStart(text: string, pos: number): number {
  return text.lastIndexOf('\n', pos - 1) + 1;
}

/** End index of the line containing `pos` (exclusive of the newline). */
function lineEnd(text: string, pos: number): number {
  const next = text.indexOf('\n', pos);
  return next === -1 ? text.length : next;
}

/**
 * Add or remove one indent level on every line of `block`.
 *
 * Returns the rewritten block plus the caret arithmetic the caller needs:
 * `firstDelta` shifts `selectionStart` (it only moves by what happened to
 * ITS line) and `totalDelta` shifts `selectionEnd`. Computing both here is
 * what keeps a multi-line selection selected across a Tab press instead of
 * collapsing to a caret.
 */
function reindent(
  block: string,
  unit: string,
  outdent: boolean,
): { text: string; firstDelta: number; totalDelta: number } {
  // Matches one indent level's worth of leading whitespace: a single tab, or
  // up to `unit.length` spaces. Capped so outdenting a 1-space line removes
  // that one space rather than eating the first real character.
  const outdentRe = new RegExp(`^(?:\\t| {1,${unit.length}})`);
  const lines = block.split('\n');
  let firstDelta = 0;
  let totalDelta = 0;

  const next = lines.map((line, i) => {
    // A selection ending exactly at a line break splits into a trailing
    // empty string. Indenting it would push whitespace onto the NEXT line,
    // which the user did not select.
    if (!outdent && line.length === 0 && i === lines.length - 1 && lines.length > 1) {
      return line;
    }
    const match = outdent ? outdentRe.exec(line) : null;
    const delta = outdent ? -(match?.[0].length ?? 0) : unit.length;
    if (i === 0) firstDelta = delta;
    totalDelta += delta;
    return outdent ? line.slice(-delta) : unit + line;
  });

  return { text: next.join('\n'), firstDelta, totalDelta };
}

/**
 * Replace `[from, to)` with `text`, then place the caret.
 *
 * Uses `document.execCommand('insertText')` on purpose despite its
 * deprecation: it is the only API that writes into a `<textarea>` while
 * keeping the browser's native undo stack intact, so ⌘Z after an auto-indent
 * still works. It also emits a real `input` event, which is what React's
 * controlled-value tracking listens to — assigning `el.value` directly would
 * update the DOM and leave React's state stale.
 *
 * The fallback covers engines that refuse the command: React 19 tracks the
 * last value on the DOM node, so going through the native `value` setter and
 * dispatching `input` by hand is what makes a controlled consumer re-render.
 * Undo history is lost on that path — correctness over polish.
 */
function replaceRange(
  el: HTMLTextAreaElement,
  from: number,
  to: number,
  text: string,
  selStart: number,
  selEnd: number,
): void {
  el.focus();
  el.setSelectionRange(from, to);

  let inserted = false;
  try {
    inserted = document.execCommand('insertText', false, text);
  } catch {
    inserted = false;
  }

  if (!inserted) {
    const setValue = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      'value',
    )?.set;
    const next = el.value.slice(0, from) + text + el.value.slice(to);
    setValue?.call(el, next);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  el.setSelectionRange(selStart, selEnd);
}

/**
 * Keep a line-number gutter locked to its code.
 *
 * The numbers are TRANSLATED, not scrolled. Two reasons: the gutter is a
 * clipped box with no scrollable overflow of its own (see the stylesheet —
 * the numbers are absolutely positioned so they contribute no intrinsic
 * height, which is what stops the gutter from dictating the editor's height),
 * and a transform is composited rather than triggering layout on every
 * scroll frame.
 */
function useGutterSync() {
  const linesRef = useRef<HTMLDivElement>(null);
  const syncGutter = useCallback((el: HTMLElement) => {
    const lines = linesRef.current;
    if (lines) lines.style.transform = `translateY(${-el.scrollTop}px)`;
  }, []);
  return { linesRef, syncGutter };
}

/**
 * Width the gutter needs for `count` lines, in `ch` of its own monospace
 * font. Explicit because the numbers are out of flow and so cannot size
 * their own column — without this a jump from line 99 to 100 would clip.
 */
function gutterWidth(count: number): string {
  return `${Math.max(2, String(Math.max(count, 1)).length)}ch`;
}

export interface CodeEditorProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'wrap'> {
  /** Controlled source text. */
  value?: string;
  /** Initial source text when uncontrolled. */
  defaultValue?: string;
  /**
   * Spaces inserted per indent level, and the maximum stripped per outdent.
   * Only affects what the editor TYPES — rendering of literal tab characters
   * is `--uxm-code-editor-tab-size`. Default `2`.
   */
  indentSize?: number;
  /**
   * Tab / Shift+Tab indent and outdent instead of moving focus. Default
   * `true`.
   *
   * The field is never a keyboard trap: pressing Escape releases the next
   * Tab to move focus normally (CodeMirror's convention), and any other
   * keystroke re-arms indenting. Set `false` to opt out entirely — worth
   * doing when the editor sits in a form whose primary interaction is
   * tabbing between fields.
   */
  indentWithTab?: boolean;
  /**
   * Enter carries the current line's leading whitespace onto the new line,
   * adding one level after an opening `{`, `[` or `(`. Default `true`.
   */
  autoIndent?: boolean;
  /** Line-number gutter down the left edge. Default `false`. */
  lineNumbers?: boolean;
  /**
   * Soft-wrap long lines. Default `false` — code scrolls horizontally, so a
   * long line stays one line and the gutter keeps counting truthfully.
   */
  wrap?: boolean;
  /**
   * Validation message shown beneath the field; also sets `aria-invalid` and
   * the `--error` visual. Same contract as the rest of the input family.
   */
  error?: string;
  /**
   * Handle to the underlying `<textarea>`, merged with the atom's own
   * internal ref. Use it to focus, select, or insert at the caret. A plain
   * React `ref` on `<CodeEditor>` does NOT reach the element.
   */
  textareaRef?: Ref<HTMLTextAreaElement>;
}

export function CodeEditor({
  className,
  value,
  defaultValue,
  onChange,
  onKeyDown,
  onScroll,
  onBlur,
  indentSize = 2,
  indentWithTab = true,
  autoIndent = true,
  lineNumbers = false,
  wrap = false,
  error,
  disabled,
  readOnly,
  textareaRef,
  spellCheck = false,
  ...rest
}: CodeEditorProps) {
  const errorId = useId();
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const { linesRef, syncGutter } = useGutterSync();
  // Escape "unlocks" the next Tab so the field can always be left by
  // keyboard. Kept in a ref, not state — it must not cause a render, and
  // every read happens inside the same keydown that writes it.
  const tabEscapedRef = useRef(false);

  const isControlled = value !== undefined;
  const unit = ' '.repeat(Math.max(1, indentSize));

  // Only tracked when the gutter needs a line count — otherwise every
  // keystroke would re-render the atom for a number nothing displays.
  const [uncontrolledText, setUncontrolledText] = useState(() => defaultValue ?? '');
  const sourceText = isControlled ? (value ?? '') : uncontrolledText;
  const lineCount = useMemo(
    () => (lineNumbers ? sourceText.split('\n').length : 0),
    [lineNumbers, sourceText],
  );

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled && lineNumbers) setUncontrolledText(e.target.value);
    onChange?.(e);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(e);
    // A consumer that handled the key owns it — e.g. ⌘Enter to run a query.
    if (e.defaultPrevented) return;

    const el = e.currentTarget;
    if (readOnly || disabled) return;

    if (e.key === 'Escape') {
      // Not prevented: Escape must still reach an enclosing Modal/Popover.
      // Arming the flag and letting it bubble does both jobs.
      tabEscapedRef.current = true;
      return;
    }

    if (e.key === 'Tab') {
      if (!indentWithTab || tabEscapedRef.current || e.altKey || e.ctrlKey || e.metaKey) {
        tabEscapedRef.current = false;
        return; // native focus move
      }
      e.preventDefault();

      const text = el.value;
      const start = el.selectionStart;
      const end = el.selectionEnd;

      // Plain Tab with nothing selected types an indent at the caret, the
      // way every code editor does — it does not re-indent the line.
      if (start === end && !e.shiftKey) {
        replaceRange(el, start, end, unit, start + unit.length, start + unit.length);
        return;
      }

      const from = lineStart(text, start);
      const to = lineEnd(text, end);
      const { text: block, firstDelta, totalDelta } = reindent(
        text.slice(from, to),
        unit,
        e.shiftKey,
      );
      replaceRange(
        el,
        from,
        to,
        block,
        Math.max(from, start + firstDelta),
        Math.max(from, end + totalDelta),
      );
      return;
    }

    if (e.key === 'Enter' && autoIndent && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
      tabEscapedRef.current = false;
      const el2 = el;
      const start = el2.selectionStart;
      const end = el2.selectionEnd;
      const head = el2.value.slice(lineStart(el2.value, start), start);
      const indent = /^[ \t]*/.exec(head)?.[0] ?? '';
      const opensBlock = /[{[(]\s*$/.test(head);
      // Nothing to carry — let the browser insert the newline itself so the
      // native undo stack stays granular.
      if (!indent && !opensBlock) return;

      e.preventDefault();
      const insert = `\n${indent}${opensBlock ? unit : ''}`;
      const caret = start + insert.length;
      replaceRange(el2, start, end, insert, caret, caret);
      return;
    }

    tabEscapedRef.current = false;
  };

  // Only the vertical offset is mirrored — the gutter stays put while the
  // code scrolls sideways under it, which is what makes long lines readable
  // without the numbers sliding out of view.
  const handleScroll = (e: UIEvent<HTMLTextAreaElement>) => {
    syncGutter(e.currentTarget);
    onScroll?.(e);
  };

  const setTextareaRef = useMemo(() => mergeRefs(innerRef, textareaRef), [textareaRef]);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      tabEscapedRef.current = false;
      onBlur?.(e);
    },
    [onBlur],
  );

  return (
    <>
      <div
        className={cn(
          'uxm-code-editor',
          error && 'uxm-code-editor--error',
          disabled && 'uxm-code-editor--disabled',
          wrap && 'uxm-code-editor--wrap',
          className,
        )}
      >
        {lineNumbers && (
          // aria-hidden: the numbers are a visual ruler. A screen reader
          // reading "1 2 3 4" before the code would be noise, and the
          // textarea already exposes the text itself.
          <div
            className="uxm-code-editor__gutter"
            aria-hidden="true"
            style={{ width: gutterWidth(lineCount) }}
          >
            <div ref={linesRef} className="uxm-code-editor__gutter-lines">
              {Array.from({ length: lineCount }, (_, i) => (
                <span key={i} className="uxm-code-editor__line-number">
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* `{...rest}` first so managed props win — the sanctioned element
            handle is `textareaRef`. `defaultValue` only when uncontrolled. */}
        <textarea
          {...rest}
          ref={setTextareaRef}
          className="uxm-code-editor__input"
          value={value}
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          onBlur={handleBlur}
          disabled={disabled}
          readOnly={readOnly}
          // Code is not prose: browser text assistance corrupts it silently
          // (autocapitalising an identifier, smart-quoting a string literal).
          spellCheck={spellCheck}
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
          wrap={wrap ? 'soft' : 'off'}
          aria-invalid={error ? true : undefined}
          aria-describedby={mergeDescribedBy(
            rest['aria-describedby'],
            error ? errorId : undefined,
          )}
        />
      </div>
      {error && (
        <FieldError id={errorId} className="uxm-code-editor__error-message">
          {error}
        </FieldError>
      )}
    </>
  );
}
CodeEditor.hasError = true;

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  /** Source text. Rendered verbatim — whitespace and line breaks preserved. */
  children?: ReactNode;
  /** Line-number gutter down the left edge. Default `false`. */
  lineNumbers?: boolean;
  /** Soft-wrap long lines. Default `false` (horizontal scroll). */
  wrap?: boolean;
}

/**
 * Code Block — the read-only half of the code surface: query output, a
 * generated payload, an SDL dump.
 *
 * Split from `CodeEditor` rather than folded in behind `readOnly` because
 * the two want different DOM. This is a `<pre><code>`, which is what the
 * content actually IS — it sizes to its content, it is selectable and
 * copyable without a focusable form control in the tab order, and assistive
 * tech announces it as code rather than as an editable field the user
 * cannot edit.
 */
export function CodeBlock({
  className,
  children,
  lineNumbers = false,
  wrap = false,
  ...rest
}: CodeBlockProps) {
  const { linesRef, syncGutter } = useGutterSync();

  // Counting needs the raw text; anything non-string (an element, a
  // fragment) can't be counted, so the gutter degrades to off rather than
  // rendering a wrong count.
  const text = typeof children === 'string' ? children : null;
  const lineCount = lineNumbers && text ? text.replace(/\n$/, '').split('\n').length : 0;

  return (
    <div
      {...rest}
      className={cn('uxm-code-block', wrap && 'uxm-code-block--wrap', className)}
    >
      {lineCount > 0 && (
        <div
          className="uxm-code-block__gutter"
          aria-hidden="true"
          style={{ width: gutterWidth(lineCount) }}
        >
          <div ref={linesRef} className="uxm-code-block__gutter-lines">
            {Array.from({ length: lineCount }, (_, i) => (
              <span key={i} className="uxm-code-block__line-number">
                {i + 1}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* `max-height` makes this a scroll container, so it needs the same
          gutter sync the editor has — a capped result dump that scrolled
          away from its own line numbers would be worse than none. */}
      <pre className="uxm-code-block__content" onScroll={(e) => syncGutter(e.currentTarget)}>
        <code>{children}</code>
      </pre>
    </div>
  );
}
