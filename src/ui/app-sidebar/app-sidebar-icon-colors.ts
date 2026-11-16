/* Kept out of the component module on purpose: that module is 'use client',
   and a server component importing a value from one gets a client reference,
   not the value. Here, it stays a plain value on the server too. */

import type { AppSidebarIconColor } from './app-sidebar';

/**
 * Default palette for `autoIconColors` — four design-system hue pairs (tile bg +
 * readable foreground: warm / cool / accent / indigo), cycled by item position.
 * Exported so a consumer can extend, reorder, or replace it.
 *
 * Every pair clears the 3:1 non-text-contrast floor in **both** themes — the
 * lowest is warm at 3.64:1 light / 4.10:1 dark. That "both themes" part is the
 * real constraint: a tile and its ink are separate tokens that flip
 * independently, so a pair can be comfortable in one theme and fail in the
 * other. `--color-category-composite` on `--color-text-inverse` is exactly that
 * case — 10.85:1 dark but **2.65:1 light**, because the pink tile is mid-tone
 * while the ink turns white. It is deliberately NOT in this palette. If you
 * replace these, measure both themes, not just the one you are looking at.
 */
export const DEFAULT_SIDEBAR_ICON_COLORS: AppSidebarIconColor[] = [
  { bg: 'var(--color-highlight-warm)', color: 'var(--color-on-highlight-warm)' },  // 3.64 / 4.10
  { bg: 'var(--color-highlight-cool)', color: 'var(--color-on-highlight-cool)' },  // 3.74 / 4.62
  { bg: 'var(--color-accent-subtle)', color: 'var(--color-accent-bold)' },         // 5.16 / 6.83
  { bg: 'var(--color-category-diagram)', color: 'var(--color-text-inverse)' },     // 4.47 / 6.60
];
