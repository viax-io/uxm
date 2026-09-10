import { afterEach, describe, expect, it, vi } from 'vitest';

import { createClientPersistence, createHttpPersistence, createReadOnlyPersistence } from '@/studio/persistence';
import type { StudioState } from '@/studio/persistence';

// The StudioPersistence contract is how a host swaps the workbench's backend.
// Each adapter is pinned on what the shell relies on: what `load` returns,
// what `save` / `uploadAsset` do, and the `capabilities` that hide controls.

const STATE: StudioState = {
  overrides: { button: { backgroundColor: '#123456' } },
  brand: {} as StudioState['brand'],
};

const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' }, ...init });

describe('createReadOnlyPersistence', () => {
  it('serves the seed, ignores saves, rejects uploads and hides both controls', async () => {
    const seed = { overrides: STATE.overrides };
    const p = createReadOnlyPersistence(seed);
    expect(await p.load()).toBe(seed);
    await expect(p.save(STATE)).resolves.toBeUndefined();
    await expect(p.uploadAsset(new File(['x'], 'logo.svg'), 'logo')).rejects.toThrow(/read-only/);
    expect(p.capabilities).toEqual({ persist: false, upload: false });
    expect(await createReadOnlyPersistence().load()).toBeNull();
  });
});

describe('createClientPersistence', () => {
  it('serves the seed, ignores saves, and turns an uploaded file into a data: URL', async () => {
    const p = createClientPersistence();
    expect(await p.load()).toBeNull();
    await expect(p.save(STATE)).resolves.toBeUndefined();
    expect(p.capabilities).toEqual({ persist: false, upload: true });

    const { url } = await p.uploadAsset(new File(['<svg/>'], 'logo.svg', { type: 'image/svg+xml' }), 'logo');
    expect(url).toMatch(/^data:image\/svg\+xml;base64,/);
    expect(atob(url.split(',')[1])).toBe('<svg/>');
  });
});

describe('createHttpPersistence', () => {
  const fetchMock = vi.fn<typeof fetch>();
  vi.stubGlobal('fetch', fetchMock);
  afterEach(() => fetchMock.mockReset());

  it('loads from <base>/load and returns null on a non-2xx', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(STATE));
    const p = createHttpPersistence();
    expect(await p.load()).toEqual(STATE);
    expect(fetchMock).toHaveBeenCalledWith('/api/uxm/load');
    expect(p.capabilities).toEqual({ persist: true, upload: true });

    fetchMock.mockResolvedValueOnce(new Response('nope', { status: 404 }));
    expect(await p.load()).toBeNull();
  });

  it('saves the full state as JSON to <base>/save and throws on failure', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
    const p = createHttpPersistence('/custom');
    await p.save(STATE);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/custom/save');
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(init.body as string)).toEqual(STATE);

    fetchMock.mockResolvedValueOnce(new Response(null, { status: 500 }));
    await expect(p.save(STATE)).rejects.toThrow('Save failed (500)');
  });

  it('uploads as multipart with file + kind and surfaces the server error message', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ url: '/assets/logo.svg' }));
    const p = createHttpPersistence();
    const file = new File(['x'], 'logo.svg');
    expect(await p.uploadAsset(file, 'logo')).toEqual({ url: '/assets/logo.svg' });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/uxm/upload');
    expect(init.method).toBe('POST');
    const body = init.body as FormData;
    expect(body.get('file')).toBeInstanceOf(File);
    expect(body.get('kind')).toBe('logo');

    fetchMock.mockResolvedValueOnce(jsonResponse({ error: 'too large' }, { status: 413 }));
    await expect(p.uploadAsset(file, 'logo')).rejects.toThrow('too large');

    fetchMock.mockResolvedValueOnce(new Response('<html>Bad Gateway</html>', { status: 502 }));
    await expect(p.uploadAsset(file, 'logo')).rejects.toThrow('Upload failed (502)');
  });
});
