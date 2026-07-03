import { Icon } from '../icon';

import type { ReactNode } from 'react';

export interface FieldErrorProps {
  /**
   * The atom's OWN per-atom message class — `uxm-{atom}__error-message`.
   * This stays per-atom on purpose: it carries the themable
   * `--uxm-{atom}-error-color` / `-error-message-size` vars and preserves
   * the editor's "Match in N other Inputs" sync. This helper does NOT
   * introduce a shared `.uxm-field-error` class — it only DRYs the
   * icon + text structure so every atom's error message is identical to
   * the others (and to Banner / Toast).
   */
  className: string;
  /**
   * Stable id so the owning control can point at this message via
   * `aria-describedby` — `aria-invalid` alone says the field is wrong,
   * not why.
   */
  id?: string;
  children: ReactNode;
}

/**
 * Shared error-message renderer for the whole input family. Leads with an
 * `exclamation-circle` icon — the same glyph Banner and Toast use for their
 * error variant — so the error reads as an error even without color
 * (colorblind users) and gives a consistent, stronger signal across every
 * field.
 *
 * The icon is sized in `em` and colored via `currentColor`, so it inherits
 * the per-atom message's `font-size` (the `errorMessageSize` knob) and
 * `color` (the `errorColor` knob) automatically — no extra CSS, no shared
 * class. It's `aria-hidden` because the message text already conveys the
 * error to assistive tech (and `aria-invalid` lives on the control).
 */
export function FieldError({ className, id, children }: FieldErrorProps) {
  return (
    <span className={className} id={id}>
      <Icon
        glyph="exclamation-circle"
        aria-hidden="true"
        style={{
          width: '1em',
          height: '1em',
          marginInlineEnd: '0.4em',
          verticalAlign: '-0.15em',
        }}
      />
      {children}
    </span>
  );
}
