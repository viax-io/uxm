import { useSyncExternalStore } from 'react';

import type { ToastVariant as ToastAtomVariant } from '../ui/toast/toast';

/** Re-exported here so consumers can grab the type from one place. */
export type ToastVariant = ToastAtomVariant;

/**
 * Inline action affordance — single button rendered between the message
 * and the dismiss X. Clicking it fires `onClick` AND auto-dismisses the
 * toast (convention: the user took the action, no reason to keep it).
 */
export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
  /** ms until auto-dismiss. `Infinity` for persistent (manual dismiss only). */
  duration: number;
  action?: ToastAction;
}

export interface ToastOptions {
  /** ms until auto-dismiss. Default `4000`. `Infinity` for persistent. */
  duration?: number;
  /** Stable id — pass to overwrite an existing toast (e.g. update progress). Generated if omitted. */
  id?: string;
  /** Inline action button (e.g. "Retry", "Undo"). Auto-dismisses on click. */
  action?: ToastAction;
}

type Listener = () => void;

/**
 * Module-level singleton store. The store survives across renders and
 * is shared by every consumer of `toast.*` and `<Toaster />`, so the
 * imperative API works from anywhere without a React context tree —
 * the same trick sonner uses.
 *
 * State is held in a frozen array so React's strict-equality bail-out
 * works correctly with `useSyncExternalStore`.
 */
class ToastStore {
  private toasts: ReadonlyArray<ToastItem> = Object.freeze([]);
  private listeners = new Set<Listener>();
  private idCounter = 0;

  private emit() {
    for (const l of this.listeners) l();
  }

  subscribe = (l: Listener) => {
    this.listeners.add(l);
    return () => {
      this.listeners.delete(l);
    };
  };

  getSnapshot = (): ReadonlyArray<ToastItem> => this.toasts;

  /** SSR snapshot — never any toasts on the server. */
  getServerSnapshot = (): ReadonlyArray<ToastItem> => EMPTY;

  add(variant: ToastVariant, message: string, options: ToastOptions = {}): string {
    const id = options.id ?? `uxm-toast-${++this.idCounter}`;
    const duration = options.duration ?? 4000;
    const next: ToastItem = { id, variant, message, duration, action: options.action };
    const existing = this.toasts.findIndex((t) => t.id === id);
    if (existing >= 0) {
      const copy = this.toasts.slice();
      copy[existing] = next;
      this.toasts = Object.freeze(copy);
    } else {
      this.toasts = Object.freeze([next, ...this.toasts]);
    }
    this.emit();
    return id;
  }

  dismiss(id: string) {
    const next = this.toasts.filter((t) => t.id !== id);
    if (next.length === this.toasts.length) return;
    this.toasts = Object.freeze(next);
    this.emit();
  }

  /** Cap the stack — drops the OLDEST entries past the limit. */
  trim(max: number) {
    if (this.toasts.length <= max) return;
    this.toasts = Object.freeze(this.toasts.slice(0, max));
    this.emit();
  }

  clear() {
    if (this.toasts.length === 0) return;
    this.toasts = EMPTY;
    this.emit();
  }
}

const EMPTY: ReadonlyArray<ToastItem> = Object.freeze([]);

/** The one true store. Imported by both the imperative API and the Toaster. */
export const toastStore = new ToastStore();

/** React hook — subscribes a component to the toast list. */
export function useToastStore(): ReadonlyArray<ToastItem> {
  return useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot,
  );
}
