/**
 * @viax.io/uxm/hooks — the behaviour hooks the atoms are built on, for hosts
 * that compose their own floating layers or keyboard widgets on top of the
 * library's primitives. Pure React; no atom or studio imports (enforced by the
 * layer rules in eslint.config.mjs).
 *
 * Client-only, and deliberately without `'use client'`: the directive marks a
 * module a server component may import across the boundary, and a hook can
 * only run inside a client component anyway. Call them from a module that
 * starts with the directive (every atom that uses them does).
 */
export { useDismiss } from './use-dismiss';
export type { UseDismissOptions } from './use-dismiss';
export { useFocusOnMount } from './use-focus-on-mount';
export type { UseFocusOnMountOptions } from './use-focus-on-mount';
export { useFocusTrap } from './use-focus-trap';
export type { UseFocusTrapOptions } from './use-focus-trap';
export { usePortal } from './use-portal';
export { useRovingTabIndex } from './use-roving-tab-index';
export type {
  RovingTabIndexOrientation,
  UseRovingTabIndexOptions,
  UseRovingTabIndexResult,
} from './use-roving-tab-index';
export { useScrollLock } from './use-scroll-lock';
export { toastStore, useToastStore } from './use-toast-store';
export type { ToastAction, ToastItem, ToastOptions, ToastVariant } from './use-toast-store';
