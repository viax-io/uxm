import type { StudioPersistence, StudioState } from './types';

/**
 * Read-only persistence for the static portal (S3/CloudFront).
 *
 * Live-preview works fully — editor changes flow through in-memory context —
 * but nothing is saved and uploads are disabled. Save / Quick Save / Publish
 * / brand-upload controls are hidden via `capabilities`. Pass an optional
 * `seed` to open the portal with a demo brand/overrides state.
 */
export function createReadOnlyPersistence(
  seed?: Partial<StudioState>,
): StudioPersistence {
  return {
    load: async () => seed ?? null,
    save: async () => {
      /* no-op — read-only */
    },
    uploadAsset: async () => {
      throw new Error('Asset upload is disabled in read-only mode');
    },
    capabilities: { persist: false, upload: false },
  };
}
