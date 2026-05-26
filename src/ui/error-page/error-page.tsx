import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export interface ErrorPageProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Big numeric/textual code rendered above the title (e.g. "404"). */
  code?: ReactNode;
  /** Optional icon rendered in a tile above the code. */
  icon?: ReactNode;
  /** Required heading (e.g. "Page not found"). */
  title: ReactNode;
  /** Supporting copy under the title. */
  message?: ReactNode;
  /** Primary call-to-action node — typically a ButtonPrimary. */
  primaryAction?: ReactNode;
  /** Optional secondary action — typically a ButtonGhost or ButtonSecondary. */
  secondaryAction?: ReactNode;
}

export function ErrorPage({
  code,
  icon,
  title,
  message,
  primaryAction,
  secondaryAction,
  className,
  ...rest
}: ErrorPageProps) {
  return (
    <div className={cn("uxm-error-page", className)} {...rest}>
      {icon && (
        <div className="uxm-error-page__icon" aria-hidden="true">
          {icon}
        </div>
      )}
      {code && <p className="uxm-error-page__code">{code}</p>}
      <h1 className="uxm-error-page__title">{title}</h1>
      {message && <p className="uxm-error-page__message">{message}</p>}
      {(primaryAction || secondaryAction) && (
        <div className="uxm-error-page__actions">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
