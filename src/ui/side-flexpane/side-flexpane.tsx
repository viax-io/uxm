"use client";

import {
  useCallback,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "./cn";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";

export interface SideFlexpaneProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: ReactNode;
  title: ReactNode;
  onClose?: () => void;
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
  onClose,
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
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [width, minWidth, maxWidth, _defaultWidth],
  );

  return (
    <aside
      ref={paneRef}
      className={cn("uxm-side-flexpane", className)}
      // Consumer-provided `style` wins over the resize-driven width — that
      // matches existing usage (user-panel / create-panel pass borderRadius
      // and height overrides) and gives consumers a way to lock width if
      // they don't want resize behaviour without flipping the flag. We
      // only emit an inline width AFTER the user has dragged (width !==
      // null); before that the CSS rule (and any saved editor override)
      // governs the rendered width.
      style={{
        ...(resizable && width !== null ? { width: `${width}px` } : undefined),
        ...style,
      }}
      {...rest}
    >
      {resizable && (
        // Handle sits flush with the inside-left edge — the pane root
        // keeps `overflow: hidden` so it can't extend past the rounded
        // corner anyway. 6px (`w-1.5`) is the same grab target as
        // PropertiesPanel's resizer.
        <div
          onMouseDown={onResizeStart}
          aria-label="Resize panel"
          role="separator"
          aria-orientation="vertical"
          className="uxm-side-flexpane__resize-handle group absolute z-20 left-0 top-0 bottom-0 w-1.5 cursor-col-resize"
        >
          <div className="h-full w-full transition-colors group-hover:bg-accent/30 group-active:bg-accent/50" />
        </div>
      )}
      <header className="uxm-side-flexpane__header">
        <div className="uxm-side-flexpane__heading">
          {eyebrow && <p className="uxm-side-flexpane__eyebrow">{eyebrow}</p>}
          <h3 className="uxm-side-flexpane__title">{title}</h3>
        </div>
        {onClose && (
          <IconButton aria-label="Close" onClick={onClose}>
            <Icon glyph="close" />
          </IconButton>
        )}
      </header>
      <div className="uxm-side-flexpane__body">{children}</div>
      {footer && <footer className="uxm-side-flexpane__footer">{footer}</footer>}
    </aside>
  );
}
