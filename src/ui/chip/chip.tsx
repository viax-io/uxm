"use client";

import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { cn } from "./cn";
import { Icon } from "./icon";

export type ChipMode = "assist" | "filter" | "input" | "suggestion";

export interface ChipProps {
  children: ReactNode;
  /** Material Design Chip mode. Inferred from props when omitted: `onRemove` → input, otherwise → assist. */
  mode?: ChipMode;
  /** Toggle state for `mode="filter"`. Ignored on other modes. */
  selected?: boolean;
  disabled?: boolean;
  /** Optional leading icon. */
  iconLeft?: ReactNode;
  /** Click handler. When set (or mode="filter"), the chip renders as a `<button>`. */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  /** Removal handler. When set, mode defaults to "input" and a trailing × button appears. */
  onRemove?: () => void;
  className?: string;
  /**
   * Inline style on the rendered chip element. Used by the editor preview
   * to project draft `--uxm-chip-*` CSS variables directly onto the chip,
   * since inline styles take precedence over the saved-overrides CSS rule
   * on `.uxm-chip` (which would otherwise win the cascade).
   */
  style?: CSSProperties;
  "aria-label"?: string;
}

function inferMode(props: ChipProps): ChipMode {
  if (props.mode) return props.mode;
  if (props.onRemove) return "input";
  return "assist";
}

/**
 * Chip — Material Design's interactive label component. Four modes
 * (assist / filter / input / suggestion), four states (default / hover /
 * selected / disabled).
 *
 * Styled via `.uxm-chip` + `.uxm-chip--{mode}` CSS classes that read
 * `--uxm-chip-{mode}-{state}-{field}` custom properties — same private
 * namespace convention used across the rest of UXM (`--uxm-card-*`,
 * `--uxm-page-header-*`, etc.). Hover/selected/disabled states attach
 * to native pseudo-classes (`:hover`, `[aria-pressed="true"]`,
 * `:disabled`) so no JS state-tracking is needed.
 *
 * Renders as a `<button>` when interactive (onClick, mode=filter) and
 * a `<span>` otherwise.
 */
export function Chip(props: ChipProps) {
  const {
    children,
    selected = false,
    disabled = false,
    iconLeft,
    onClick,
    onRemove,
    className,
    style,
    "aria-label": ariaLabel,
  } = props;
  const mode = inferMode(props);

  const inner = (
    <>
      {iconLeft && (
        <span className="uxm-chip__icon-left" aria-hidden="true">
          {iconLeft}
        </span>
      )}
      <span className="uxm-chip__label">{children}</span>
      {onRemove && (
        <button
          type="button"
          className="uxm-chip__remove"
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onRemove();
          }}
          aria-label="Remove"
          tabIndex={disabled ? -1 : 0}
        >
          <Icon glyph="close" size={10} strokeWidth={2.5} aria-hidden="true" />
        </button>
      )}
    </>
  );

  const classes = cn("uxm-chip", `uxm-chip--${mode}`, className);
  const isInteractive = Boolean(onClick) || mode === "filter";

  if (isInteractive) {
    return (
      <button
        type="button"
        className={classes}
        style={style}
        disabled={disabled}
        aria-pressed={mode === "filter" ? selected : undefined}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {inner}
      </button>
    );
  }

  return (
    <span
      className={classes}
      style={style}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
    >
      {inner}
    </span>
  );
}
