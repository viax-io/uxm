import {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import { Popover } from '../popover';
import { Tooltip } from '../tooltip';

export interface HoverTooltipProps {
  /** What the tooltip shows — typically the full (un-truncated) value. */
  content: ReactNode;
  placement?: 'top' | 'bottom';
  truncatedOnly?: boolean;
  openDelay?: number;
  disabled?: boolean;
  children: ReactElement;
  showArrow?: boolean;
}

/**
 * Hover tooltip — behavior layer the `Tooltip` atom lacks. Pairs a hover
 * trigger (with an owned open-delay) and an optional truncation gate with
 * `Popover` for positioning + portal, then renders the existing `Tooltip`
 * inside. Non-interactive by design: closes when the pointer leaves the anchor.
 */
export function HoverTooltip({
  content,
  placement = 'top',
  truncatedOnly = true,
  openDelay = 300,
  disabled,
  children,
  showArrow,
}: HoverTooltipProps) {
  const anchorRef = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  // Clean up a pending timer if we unmount mid-delay.
  useEffect(() => clearTimer, [clearTimer]);

  const childProps = children.props as {
    onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
    onFocus?: (e: FocusEvent<HTMLElement>) => void;
    onBlur?: (e: FocusEvent<HTMLElement>) => void;
  };

  // Shared open/close timer logic — reused by both the pointer (hover) and
  // keyboard (focus) triggers so a keyboard-only user gets the exact same
  // reveal behavior a mouse user gets (WCAG 1.4.13).
  const scheduleOpen = useCallback(() => {
    if (disabled || content == null || content === '') return;
    const el = anchorRef.current;
    if (truncatedOnly && el && el.scrollWidth <= el.clientWidth) return;
    clearTimer();
    timer.current = setTimeout(() => setOpen(true), openDelay);
  }, [disabled, content, truncatedOnly, openDelay, clearTimer]);

  const closeNow = useCallback(() => {
    clearTimer();
    setOpen(false);
  }, [clearTimer]);

  const handleEnter = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      childProps.onMouseEnter?.(e);
      scheduleOpen();
    },
    [childProps, scheduleOpen],
  );

  const handleLeave = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      childProps.onMouseLeave?.(e);
      closeNow();
    },
    [childProps, closeNow],
  );

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLElement>) => {
      childProps.onFocus?.(e);
      scheduleOpen();
    },
    [childProps, scheduleOpen],
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLElement>) => {
      childProps.onBlur?.(e);
      closeNow();
    },
    [childProps, closeNow],
  );

  // eslint-disable-next-line react-hooks/refs -- cloneElement ref pattern is the React-blessed way to wire a ref onto a consumer-provided element; the ref is not read during render, only written at mount
  const trigger = cloneElement(children, {
    ref: anchorRef,
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
  } as Partial<typeof children.props> & { ref: typeof anchorRef });

  return (
    <>
      {trigger}
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchor={anchorRef}
        placement={placement === 'bottom' ? 'bottom-start' : 'top-start'}
        closeOnEscape={false}
        closeOnOutsideClick={false}
        restoreFocus={false}
        role="presentation"
        className="uxm-hover-tooltip"
      >
        <Tooltip placement={placement} showArrow={showArrow}>
          {content}
        </Tooltip>
      </Popover>
    </>
  );
}
