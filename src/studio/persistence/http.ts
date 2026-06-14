import type { StudioPersistence, StudioState } from './types';

/**
 * HTTP persistence backed by the modo Hono API (`/api/uxm/*`).
 *
 * Full read/write: `load` reads saved overrides + brand, `save` regenerates
 * `components.css`/`.json` server-side, `uploadAsset` stores brand assets.
 * Used by `@modo/app` when mounting Studio behind its backend.
 */
export function createHttpPersistence(baseUrl = '/api/uxm'): StudioPersistence {
  return {
    load: async () => {
      const res = await fetch(`${baseUrl}/load`);
      if (!res.ok) return null;
      return res.json();
    },
    save: async (state: StudioState) => {
      const res = await fetch(`${baseUrl}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
    },
    uploadAsset: async (file: File, kind: string) => {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('kind', kind);
      const res = await fetch(`${baseUrl}/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Upload failed');
      return data;
    },
    capabilities: { persist: true, upload: true },
  };
}
