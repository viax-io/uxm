import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

// Drop the native `name` attribute (a form-control name string) — our
// `name` prop is the row's display label (ReactNode).
export interface ExplorerListItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "name"> {
  /** Primary label text. */
  name: ReactNode;
  /** Optional trailing slot — typically a category meta or count. */
  trailing?: ReactNode;
  /** Render the active (selected) state — adds a left rail indicator. */
  active?: boolean;
}

/**
 * Component-explorer style list row — label-first, with a left rail
 * indicator on the active state. Distinct from `SidebarNavItem` (which
 * is icon-tile-first for app-level navigation); use this for code/file/
 * component browsers where the row's primary affordance is the label
 * and the active state is communicated by an accent rail rather than
 * a filled background tile.
 *
 * Renders as a `<button>` because the click is "select this entry,"
 * not navigate. Theming flows through the `explorer-list-item`
 * registry — the rail's colour, width, height, and radius are
 * separately editable from the row's own bg/text.
 */
export function ExplorerListItem({
  name,
  trailing,
  active,
  className,
  type = "button",
  ...rest
}: ExplorerListItemProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        "uxm-explorer-list-item",
        active && "uxm-explorer-list-item--active",
        className,
      )}
      {...rest}
    >
      {active && (
        <span className="uxm-explorer-list-item__rail" aria-hidden="true" />
      )}
      <span className="uxm-explorer-list-item__label">{name}</span>
      {trailing && (
        <span className="uxm-explorer-list-item__trailing">{trailing}</span>
      )}
    </button>
  );
}
