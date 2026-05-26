import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { cn } from "@/helpers";
import { IconTile } from "@/ui/icon-tile";

// ConfigComponentRow's icon registry knobs (`iconTileSize` / `iconTileRadius`)
// project onto IconTile's own CSS-variable surface. No bg/color knobs in
// the registry, so default IconTile colors apply (surface-alt + text-muted).
const ICON_TILE_STYLE: CSSProperties = {
  ["--uxm-icon-tile-size" as string]: "var(--uxm-config-component-row-icon-tile-size, 28px)",
  ["--uxm-icon-tile-radius" as string]: "var(--uxm-config-component-row-icon-tile-radius, 6px)",
};

// Drop two native button attributes from the props surface:
//   - `type`: we always render `<button type="button">`; the visual-type
//     prop below (the field's value type — TEXT/EMAIL/etc.) is what consumers
//     mean when they say "type" here.
//   - `name`: HTML form-control name; consumers mean the field's display
//     name (ReactNode) when they say "name".
export interface ConfigComponentRowProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "name"> {
  /** Icon shown in the leading tile — typically <Icon glyph="..." />. */
  icon?: ReactNode;
  /** Component display name (primary text). */
  name: ReactNode;
  /**
   * Type label shown beneath the name (e.g. "TEXT", "BOOLEAN", "OPTIONS"). The
   * registry of value types is owned by the consumer; this just renders
   * whatever is passed.
   */
  type?: ReactNode;
  /**
   * Trailing slot — caller-supplied. Typical content is a `<Tag type="accent">Required</Tag>`
   * or similar tag. Kept generic so the consumer decides which flags of a
   * configuration component surface here (required, deprecated, etc.).
   */
  trailing?: ReactNode;
  /** Render the active (selected) state. Adds an accent border. */
  active?: boolean;
}

/**
 * Middle-pane row in a Configuration model's components list. Each row is a
 * clickable card describing one component (a field) within the currently
 * selected segment. Selecting it swaps the right-pane editor.
 *
 * Renders as a `<button>` because click is "select for edit", not navigate.
 */
export function ConfigComponentRow({
  icon,
  name,
  type,
  trailing,
  active,
  className,
  ...rest
}: ConfigComponentRowProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "uxm-config-component-row",
        active && "uxm-config-component-row--active",
        className,
      )}
      {...rest}
    >
      {icon && <IconTile style={ICON_TILE_STYLE}>{icon}</IconTile>}
      <span className="uxm-config-component-row__body">
        <span className="uxm-config-component-row__name">{name}</span>
        {type && <span className="uxm-config-component-row__type">{type}</span>}
      </span>
      {trailing && (
        <span className="uxm-config-component-row__trailing">{trailing}</span>
      )}
    </button>
  );
}
