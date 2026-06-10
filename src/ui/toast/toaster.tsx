'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../helpers/cn';
import { usePortal } from '../../hooks/use-portal';
import {
  toastStore,
  useToastStore,
  type ToastItem,
  type ToastOptions,
} from '../../hooks/use-toast-store';

import { Toast } from './toast';

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface ToasterProps {
  /** Where the toast stack sits. Default `"top-right"`. */
  position?: ToastPosition;
  /** Maximum concurrent toasts. Oldest drops when exceeded. Default `5`. */
  max?: number;
}

/**
 * Toaster — provides the floating-notification mechanics (portal, queue,
 * per-item timer, position). No visual chrome of its own; renders each
 * toast as a `<Toast>` atom.
 *
 * Mount once at the app root (typically inside `<body>` in the root
 * layout). The imperative API exported from this file (`toast.*`) pushes
 * into the same store this component reads from — no React context
 * required.
 *
 * Mirrors Dialog: this component owns the mechanics (portal, position,
 * timing, queue); the rendered child (`Toast`) owns the look.
 */
export function Toaster({ position = 'top-right', max = 5 }: ToasterProps) {
  const mounted = usePortal();
  const toasts = useToastStore();

  // Trim to max when new toasts arrive — drops the OLDEST entries
  // (which are at the end of the array; newest are prepended). Done
  // here rather than in `add()` so `max` is a Toaster-mount concern,
  // not store-config.
  useEffect(() => {
    if (toasts.length > max) toastStore.trim(max);
  }, [toasts.length, max]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        'uxm-toast-container',
        `uxm-toast-container--${position}`,
      )}
      // Live-region announcement for screen readers. `polite` means the
      // SR finishes the current utterance before announcing — toasts
      // don't interrupt. `role="status"` per-Toast provides redundancy
      // across SR implementations.
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => (
        <ToastItemView key={t.id} toast={t} />
      ))}
    </div>,
    document.body,
  );
}

function ToastItemView({ toast: t }: { toast: ToastItem }) {
  // Auto-dismiss timer. `Infinity` opts out (persistent toast — caller
  // must dismiss programmatically or the user must click the X).
  useEffect(() => {
    if (!Number.isFinite(t.duration)) return;
    const handle = window.setTimeout(() => {
      toastStore.dismiss(t.id);
    }, t.duration);
    return () => window.clearTimeout(handle);
  }, [t.id, t.duration]);

  return (
    <Toast
      variant={t.variant}
      message={t.message}
      action={t.action}
      onDismiss={() => toastStore.dismiss(t.id)}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Imperative API
//
//  Co-located with the Toaster component because they're two halves of
//  one feature — splitting them into separate files (the old
//  lib/toast.ts layout) added friction with no benefit. Same shape
//  sonner uses.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Imperative toast API. Call from anywhere — buttons, async handlers,
 * effects, network callbacks. No React context required; the call
 * pushes into the shared module-level store that `<Toaster />`
 * subscribes to.
 *
 *   toast.success("Saved")
 *   toast.error("Network error", { duration: 6000 })
 *   const id = toast.info("Uploading…", { duration: Infinity })
 *   // …later…
 *   toast.dismiss(id)
 *
 * The four variants mirror `ToastVariant` (declared on the `<Toast>` atom).
 */
export const toast = {
  success: (message: string, options?: ToastOptions) =>
    toastStore.add('success', message, options),
  info: (message: string, options?: ToastOptions) =>
    toastStore.add('info', message, options),
  warning: (message: string, options?: ToastOptions) =>
    toastStore.add('warning', message, options),
  error: (message: string, options?: ToastOptions) =>
    toastStore.add('error', message, options),
  /** Remove a specific toast by id (returned from any of the above). */
  dismiss: (id: string) => toastStore.dismiss(id),
  /** Remove every toast at once. */
  clear: () => toastStore.clear(),
};
