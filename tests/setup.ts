import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom has no layout: the floating layers call these for positioning and
// keep-in-view, so give them inert stand-ins rather than throwing.
Element.prototype.scrollIntoView ??= () => {};
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

// jsdom never lays out, so `offsetParent` is null for every element — and
// useFocusTrap uses `offsetParent !== null` as its "visible" check, which
// would make every focusable invisible to the trap. Treat anything attached
// to the tree as laid out.
Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
  configurable: true,
  get() {
    return (this as HTMLElement).isConnected ? (this as HTMLElement).parentElement : null;
  },
});

afterEach(() => cleanup());
