import type { StudioPersistence, StudioState } from './types';

/**
 * Client-only persistence for the static portal (S3/CloudFront) when working
 * brand-asset "upload" is still wanted. Live-preview works fully; nothing is
 * saved server-side. `uploadAsset` produces a base64 `data:` URL in the
 * browser via `FileReader`, so picking a file — or pasting any remote URL —
 * updates the in-memory brand immediately, with no backend.
 *
 * Pass `seed` to open the portal with a default brand / overrides state.
 */
export function createClientPersistence(
  seed?: Partial<StudioState>,
): StudioPersistence {
  return {
    load: async () => seed ?? null,
    save: async () => {
      /* no-op — nothing is persisted in the static portal */
    },
    uploadAsset: (file: File) =>
      new Promise<{ url: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ url: String(reader.result) });
        reader.onerror = () =>
          reject(reader.error ?? new Error('Failed to read file'));
        reader.readAsDataURL(file);
      }),
    capabilities: { persist: false, upload: true },
  };
}