import {
  useCallback,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '@/helpers';

import { Icon } from '../icon';
import { IconButton } from '../icon-button';

export interface SideFlexpaneProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Small uppercase label above the title. */
  eyebrow?: ReactNode;
  /** Primary heading. */
  title: ReactNode;
  /** Secondary line under the title (e.g. a type / path). */
  subtitle?: ReactNode;
  /**
   * Leading header visual, left of the title block — typically a tinted
   * `<IconTile><Icon …/></IconTile>`. Kept a generic slot so the tint stays
   * with the consumer (no baked-in category).
   */
  icon?: ReactNode;
  /** Close (×) handler — renders the close button in the header. */
  onClose?: () => void;
  /**
   * Back handler — when set, renders a top back-link bar (`← {backLabel}`)
   * above the header. Distinct from `onClose`.
   */
  onBack?: () => void;
  /** Label for the back-link bar. Defaults to `"Back"`. */
  backLabel?: ReactNode;
  /**
   * Header action controls (typically `IconButton`s, e.g. a delete), placed in
   * the trailing cluster before the expand/close controls.
   */
  actions?: ReactNode;
  /** Show an expand/collapse toggle that widens the pane to `expandedWidth`. */
  expandable?: boolean;
  /** Initial expanded state for uncontrolled usage. Ignored when `expanded` is set. */
  defaultExpanded?: boolean;
  /** Controlled expanded state — pair with `onExpandedChange`. */
  expanded?: boolean;
  /** Fires with the next expanded state whenever the toggle is clicked. */
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Width in px while expanded. Defaults to 960 — deliberately above the
   * `maxWidth` resize ceiling so "Expand" always grows the pane. Expanding
   * never shrinks below the current width.
   */
  expandedWidth?: number;
  footer?: ReactNode;
  children?: ReactNode;
  /** Initial width in px. Defaults to 380. */
  defaultWidth?: number;
  /** Min width in px when resizing. Defaults to 280. */
  minWidth?: number;
  /** Max width in px when resizing. Defaults to 720. */
  maxWidth?: number;
  /** Whether the drag handle is shown. Defaults to true. */
  resizable?: boolean;
}

export function SideFlexpane({
  eyebrow,
  title,
  subtitle,
  icon,
  onClose,
  onBack,
  backLabel = 'Back',
  actions,
  expandable = false,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onExpandedChange,
  expandedWidth = 960,
  footer,
  children,
  className,
  defaultWidth: _defaultWidth = 380,
  minWidth = 280,
  maxWidth = 720,
  resizable = true,
  style,
  ...rest
}: SideFlexpaneProps) {
  // `width === null` means "no inline override" — the rendered width comes
  // from CSS (the atom's own `width: 380px` rule, or any saved `width:`
  // override the editor wrote to components.css from the `Width` knob).
  // Once the user drags, we switch to an inline value that wins over CSS
  // for the rest of the session; a page reload resets it back to null so
  // the saved knob value wins again. The `_defaultWidth` prop is kept on
  // the public API for forward compatibility but isn't read here — the
  // CSS rule supplies the visual default.
  const [width, setWidth] = useState<number | null>(null);
  const paneRef = useRef<HTMLElement | null>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);

  // Expanded is a distinct "maximized" mode: it pins the pane to
  // `expandedWidth` and hides the resize handle (so the two width mechanisms
  // don't fight). Collapsing reverts to the prior dragged width / CSS
  // default. Controlled/uncontrolled pair, like Disclosure.
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded);
  const isExpandedControlled = controlledExpanded !== undefined;
  const expanded = isExpandedControlled ? controlledExpanded : uncontrolledExpanded;
  const toggleExpanded = () => {
    const next = !expanded;
    // When expanding before any drag (`width === null`), snapshot the pane's
    // current rendered width into state so the "Expand grows, never shrinks"
    // guard in `inlineWidth` has a real baseline — otherwise it would compare
    // against 0 and a small `expandedWidth` (or a saved width override above it)
    // could shrink the pane. Reading the ref is safe here (event handler, not
    // render). Snapshotting to the current width also keeps the collapse visual
    // unchanged, since it equals what CSS was already resolving to.
    if (next && width === null) {
      const current = paneRef.current?.offsetWidth;
      if (current) setWidth(current);
    }
    onExpandedChange?.(next);
    if (!isExpandedControlled) setUncontrolledExpanded(next);
  };

  // Same drag pattern as PropertiesPanel: pin the start position, then
  // compute deltas inside a document-level mousemove. The handle sits on
  // the left edge — the panel docks to the right, so a leftward drag
  // (decreasing clientX) grows the panel. We snapshot the current width
  // from `offsetWidth` so the drag starts from whatever CSS resolved to
  // (the saved knob value, the atom default, etc.) rather than the JS
  // `defaultWidth` constant.
  const onResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      startW.current =
        paneRef.current?.offsetWidth ?? width ?? _defaultWidth;

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const delta = startX.current - ev.clientX;
        setWidth(Math.min(maxWidth, Math.max(minWidth, startW.current + delta)));
      };

      const onMouseUp = () => {
        dragging.current = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    [width, minWidth, maxWidth, _defaultWidth],
  );

  // Keyboard resize so the handle is operable without a mouse — Arrow
  // keys step the width, Shift accelerates. This both honours the
  // WAI-ARIA `separator` pattern (a resize separator must be focusable
  // and respond to arrows) and satisfies eslint-plugin-jsx-a11y's
  // `no-noninteractive-element-interactions` rule.
  const onHandleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const step = e.shiftKey ? 50 : 10;
      const base = paneRef.current?.offsetWidth ?? width ?? _defaultWidth;
      // Pane docks to the right: ArrowLeft grows, ArrowRight shrinks.
      const next = e.key === 'ArrowLeft' ? base + step : base - step;
      setWidth(Math.min(maxWidth, Math.max(minWidth, next)));
    },
    [width, minWidth, maxWidth, _defaultWidth],
  );

  // Expanded pins to `expandedWidth`, but never below the current width —
  // "Expand" must grow, never shrink. `toggleExpanded` snapshots the pane's
  // rendered width into `width` before this runs (even on the first, un-dragged
  // expand), so the guard here has a real baseline instead of comparing to 0.
  const inlineWidth = expanded
    ? Math.max(expandedWidth, width ?? 0)
    : resizable && width !== null
      ? width
      : undefined;
  const showHandle = resizable && !expanded;
  const hasTrailing = Boolean(actions) || expandable || Boolean(onClose);

  return (
    <aside
      ref={paneRef}
      className={cn('uxm-side-flexpane', className)}
      // Consumer-provided `style` wins over the width we compute — that
      // matches existing usage (user-panel / create-panel pass borderRadius
      // and height overrides) and gives consumers a way to lock width if
      // they don't want resize behaviour without flipping the flag.
      style={{
        ...(inlineWidth !== undefined ? { width: `${inlineWidth}px` } : undefined),
        ...style,
      }}
      {...rest}
    >
      {showHandle && (
        // Handle sits flush with the inside-left edge — the pane root
        // keeps `overflow: hidden` so it can't extend past the rounded
        // corner anyway. 6px (`w-1.5`) is the same grab target as
        // PropertiesPanel's resizer.
        // WAI-ARIA windowsplitter pattern: `separator` IS interactive when
        // it acts as a resize handle, with arrow-key support and a tab
        // stop. eslint-plugin-jsx-a11y still treats `separator` as
        // non-interactive across the board, so disable the two rules
        // that fire on this otherwise-correct shape.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <div
          onMouseDown={onResizeStart}
          onKeyDown={onHandleKeyDown}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          aria-label="Resize panel"
          role="separator"
          aria-orientation="vertical"
          className="uxm-side-flexpane__resize-handle"
        >
          <div className="uxm-side-flexpane__resize-handle-bar" />
        </div>
      )}
      {onBack && (
        // A `<button>`, not the `BackLink` atom: `BackLink` is an `<a href>`
        // for navigation, whereas this fires an `onBack` action callback. The
        // icon+label chrome is themed the same way (`--uxm-side-flexpane-back-*`
        // mirrors BackLink's `--uxm-back-link-*`).
        <button type="button" className="uxm-side-flexpane__back" onClick={onBack}>
          <Icon glyph="arrow-left" size={14} strokeWidth={2} aria-hidden="true" />
          <span>{backLabel}</span>
        </button>
      )}
      <header className="uxm-side-flexpane__header">
        {icon && <span className="uxm-side-flexpane__icon">{icon}</span>}
        <div className="uxm-side-flexpane__heading">
          {eyebrow && <p className="uxm-side-flexpane__eyebrow">{eyebrow}</p>}
          <h3 className="uxm-side-flexpane__title">{title}</h3>
          {subtitle && <p className="uxm-side-flexpane__subtitle">{subtitle}</p>}
        </div>
        {hasTrailing && (
          <div className="uxm-side-flexpane__actions">
            {actions}
            {actions && (expandable || onClose) && (
              <span className="uxm-side-flexpane__actions-divider" aria-hidden="true" />
            )}
            {expandable && (
              <IconButton
                aria-label={expanded ? 'Collapse panel' : 'Expand panel'}
                aria-pressed={expanded}
                onClick={toggleExpanded}
              >
                <Icon glyph={expanded ? 'chevron-right' : 'chevron-left'} size={16} />
              </IconButton>
            )}
            {onClose && (
              <IconButton aria-label="Close" onClick={onClose}>
                <Icon glyph="close" />
              </IconButton>
            )}
          </div>
        )}
      </header>
      <div className="uxm-side-flexpane__body">{children}</div>
      {footer && <footer className="uxm-side-flexpane__footer">{footer}</footer>}
    </aside>
  );
}
