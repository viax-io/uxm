import type { BrandConfig, StyleOverrides } from '../lib/types';

/** Map of componentId → its style-override bag. */
export type AllOverrides = Record<string, StyleOverrides>;

/** The full persisted workbench state: per-component overrides + brand config. */
export interface StudioState {
  overrides: AllOverrides;
  brand: BrandConfig;
}

/**
 * Persistence contract for the UXM Studio workbench.
 *
 * Every server touchpoint the shell needs goes through this interface so the
 * shell never talks to a concrete backend directly (no `fetch("/api/...")`
 * inside components). Hosts inject an implementation:
 *
 *  - `createHttpPersistence()`  — app behind a Hono backend (full read/write).
 *  - `createReadOnlyPersistence()` — static portal on S3 (live-preview only).
 *
 * UI affordances (Save / Quick Save / Upload) render only when the matching
 * `capabilities` flag is true.
 */
export interface StudioPersistence {
  /** Load saved overrides + brand. Returns `null` when nothing is stored. */
  load(): Promise<Partial<StudioState> | null>;
  /** Persist the full workbench state. No-op in read-only mode. */
  save(state: StudioState): Promise<void>;
  /** Upload a brand asset (logo/icon/favicon) and return its public URL. */
  uploadAsset(file: File, kind: string): Promise<{ url: string }>;
  capabilities: {
    /** When false, Save / Quick Save / Publish are hidden. */
    persist: boolean;
    /** When false, brand-asset upload controls are hidden. */
    upload: boolean;
  };
}
