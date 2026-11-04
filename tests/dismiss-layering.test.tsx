import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useDismiss } from '@/hooks';
import { Dialog, Popover } from '@/ui';

/**
 * Escape must close one layer — the topmost.
 *
 * Before this, every enabled `useDismiss` added its own `keydown` listener to
 * `document`, so a Popover inside a Dialog fired both and one Escape threw away
 * the dialog as well. `stopPropagation()` could not prevent that: it stops an
 * event reaching the next NODE, and both listeners were on the same one.
 */

/** A bare layer, so the ordering tests don't depend on any atom's internals. */
function Layer({
  name,
  enabled = true,
  closeOnEscape,
  onDismiss,
  children,
}: {
  name: string;
  enabled?: boolean;
  closeOnEscape?: boolean;
  onDismiss: () => void;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const refs = useMemo(() => [ref], []);
  // Escape-only: these tests are about which layer the KEY reaches. Left on,
  // the outside-click path would dismiss every layer the moment a test clicks
  // a button, and the Escape assertion below it would be measuring that.
  useDismiss({ enabled, onDismiss, refs, closeOnEscape, closeOnOutsideClick: false });
  return (
    <div ref={ref} data-testid={name}>
      {children}
    </div>
  );
}

/** Two refs, like `Popover`'s [anchor, panel], pointed at existing nodes. */
function MultiRefLayer({
  anchorId,
  panelId,
  onDismiss,
}: {
  anchorId: string;
  panelId: string;
  onDismiss: () => void;
}) {
  const anchor = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    anchor.current = document.getElementById(anchorId);
    panel.current = document.getElementById(panelId);
  }, [anchorId, panelId]);
  const refs = useMemo(() => [anchor, panel], []);
  useDismiss({ enabled: true, onDismiss, refs, closeOnOutsideClick: false });
  return null;
}

/**
 * A layer whose `refs` ARRAY is rebuilt when its target changes — the shape
 * `Popover` has (`useMemo(() => [anchor, panelRef], [anchor])`).
 */
function MovingLayer({ targetId, onDismiss }: { targetId: string; onDismiss: () => void }) {
  // TWO ref objects, and the array swaps which one it carries. Mutating a
  // single ref's `.current` would not test anything: ref objects are stable, so
  // a stale array still sees the new `.current`. What a push-time capture
  // actually loses is a changed SET of refs — which is what `Popover` hands over
  // when its `anchor` prop is swapped for a different ref.
  const outside = useRef<HTMLElement | null>(null);
  const inside = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    outside.current = document.getElementById('outside');
    inside.current = document.getElementById('inside');
  });
  const refs = useMemo(() => (targetId === 'inside' ? [inside] : [outside]), [targetId]);
  useDismiss({ enabled: true, onDismiss, refs, closeOnOutsideClick: false });
  return null;
}

/** A layer whose ref never points at anything. */
function DetachedLayer({ onDismiss }: { onDismiss: () => void }) {
  const ref = useRef<HTMLElement | null>(null);
  const refs = useMemo(() => [ref], []);
  useDismiss({ enabled: true, onDismiss, refs, closeOnOutsideClick: false });
  return null;
}

describe('Escape goes to the topmost layer only', () => {
  it('a Popover inside a Dialog closes the popover, not the dialog', async () => {
    function Nested() {
      const [dialogOpen, setDialogOpen] = useState(true);
      const [popOpen, setPopOpen] = useState(true);
      const anchor = useRef<HTMLButtonElement | null>(null);
      return (
        <>
          <div data-testid="state">{`dialog=${dialogOpen} popover=${popOpen}`}</div>
          {dialogOpen && (
            <Dialog open onOpenChange={setDialogOpen}>
              <button ref={anchor}>anchor</button>
              <Popover open={popOpen} onOpenChange={setPopOpen} anchor={anchor}>
                <div>panel</div>
              </Popover>
            </Dialog>
          )}
        </>
      );
    }

    render(<Nested />);
    expect(screen.getByTestId('state')).toHaveTextContent('dialog=true popover=true');

    await userEvent.keyboard('{Escape}');
    expect(screen.getByTestId('state')).toHaveTextContent('dialog=true popover=false');

    // And the next Escape, with only the dialog left, closes that.
    await userEvent.keyboard('{Escape}');
    expect(screen.getByTestId('state')).toHaveTextContent('dialog=false popover=false');
  });

  it('a single layer still dismisses, exactly as before', async () => {
    const onDismiss = vi.fn();
    render(<Layer name="only" onDismiss={onDismiss} />);
    await userEvent.keyboard('{Escape}');
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('gives the key to the inner of two nested layers, and only to it', async () => {
    const outer = vi.fn();
    const inner = vi.fn();
    render(
      <Layer name="outer" onDismiss={outer}>
        <Layer name="inner" onDismiss={inner} />
      </Layer>,
    );
    await userEvent.keyboard('{Escape}');
    expect(inner).toHaveBeenCalledTimes(1);
    expect(outer).not.toHaveBeenCalled();
  });

  it('skips a closeOnEscape:false layer, so the one under it still gets the key', async () => {
    const outer = vi.fn();
    const inner = vi.fn();
    render(
      <Layer name="outer" onDismiss={outer}>
        <Layer name="inner" closeOnEscape={false} onDismiss={inner} />
      </Layer>,
    );
    await userEvent.keyboard('{Escape}');
    // HoverTooltip's popover is the real case: it must not swallow Escape.
    expect(inner).not.toHaveBeenCalled();
    expect(outer).toHaveBeenCalledTimes(1);
  });

  it('does not re-seat a nested layer when its parent re-renders', async () => {
    const outer = vi.fn();
    const inner = vi.fn();
    const tree = (n: number) => (
      <Layer name="outer" onDismiss={() => outer(n)}>
        <Layer name="inner" onDismiss={inner} />
      </Layer>
    );
    const { rerender } = render(tree(0));
    // Each re-render hands the outer layer a fresh `onDismiss` identity.
    rerender(tree(1));
    rerender(tree(2));
    await userEvent.keyboard('{Escape}');
    expect(inner).toHaveBeenCalledTimes(1);
    expect(outer).not.toHaveBeenCalled();
  });

  it('calls the dismiss the layer has now, not the one it was pushed with', async () => {
    // The ref's other half: reading `onDismiss` at push time would freeze a
    // stale closure for the whole time the layer stays enabled.
    const calls: number[] = [];
    const tree = (n: number) => <Layer name="only" onDismiss={() => calls.push(n)} />;
    const { rerender } = render(tree(0));
    rerender(tree(1));
    await userEvent.keyboard('{Escape}');
    expect(calls).toEqual([1]);
  });

  // ── Siblings ───────────────────────────────────────────────────────────────
  // Nested layers are settled by containment, so push order can be corrupted
  // without a nested test noticing — `pop()` instead of remove-by-identity, and
  // `onDismiss` back in the effect deps, both passed every nested test here.
  // For siblings — two portaled panels, which is what `Dialog` and `Popover`
  // actually are in the DOM — push order is the only signal, so these are the
  // tests that hold it honest.

  it('gives the key to the last of several siblings', async () => {
    const a = vi.fn();
    const b = vi.fn();
    const c = vi.fn();
    render(
      <>
        <Layer name="a" onDismiss={a} />
        <Layer name="b" onDismiss={b} />
        <Layer name="c" onDismiss={c} />
      </>,
    );
    await userEvent.keyboard('{Escape}');
    expect(c).toHaveBeenCalledTimes(1);
    expect(a).not.toHaveBeenCalled();
    expect(b).not.toHaveBeenCalled();
  });

  it('removes the sibling that was disabled, not whichever is last', async () => {
    const a = vi.fn();
    const b = vi.fn();
    const c = vi.fn();
    const tree = (bOn: boolean) => (
      <>
        <Layer name="a" onDismiss={a} />
        <Layer name="b" enabled={bOn} onDismiss={b} />
        <Layer name="c" onDismiss={c} />
      </>
    );
    const { rerender } = render(tree(true));
    rerender(tree(false));
    await userEvent.keyboard('{Escape}');
    // `pop()` here would take C off and leave the disabled B on top.
    expect(c).toHaveBeenCalledTimes(1);
    expect(b).not.toHaveBeenCalled();
    expect(a).not.toHaveBeenCalled();
  });

  it('does not re-seat a sibling when it re-renders', async () => {
    // The regression a deps-on-`onDismiss` effect would have: the earlier
    // sibling re-subscribes, lands last, and takes a key aimed at the later
    // one. Nothing contains anything here, so only push order can get it right.
    const first = vi.fn();
    const second = vi.fn();
    const tree = (n: number) => (
      <>
        <Layer name="first" onDismiss={() => first(n)} />
        <Layer name="second" onDismiss={second} />
      </>
    );
    const { rerender } = render(tree(0));
    rerender(tree(1));
    rerender(tree(2));
    await userEvent.keyboard('{Escape}');
    expect(second).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
  });

  // ── Shapes the atoms actually have ─────────────────────────────────────────

  it('picks the innermost layer when containment is not transitive', async () => {
    // A `Popover`'s refs are [anchor, panel] and the PANEL is portaled to body.
    // So a popover Q anchored inside popover P's panel gives Q ⊂ P and P ⊂ D
    // but NOT Q ⊂ D. A single containment pass that found P would stop there
    // and hand Escape to the middle layer — measured, before this was a loop.
    const d = vi.fn();
    const p = vi.fn();
    const q = vi.fn();
    document.body.innerHTML = `
      <div id="d-panel"><span id="p-anchor"></span></div>
      <div id="p-panel"><span id="q-anchor"></span></div>
      <div id="q-panel"></div>
      <div id="mount"></div>`;
    // Mounted inner-first, which is the order React gives a same-commit nest.
    render(
      <>
        <MultiRefLayer anchorId="q-anchor" panelId="q-panel" onDismiss={q} />
        <MultiRefLayer anchorId="p-anchor" panelId="p-panel" onDismiss={p} />
        <MultiRefLayer anchorId="d-panel" panelId="d-panel" onDismiss={d} />
      </>,
      { container: document.getElementById('mount')! },
    );
    await userEvent.keyboard('{Escape}');
    expect({ d: d.mock.calls.length, p: p.mock.calls.length, q: q.mock.calls.length }).toEqual({
      d: 0,
      p: 0,
      q: 1,
    });
  });

  it('follows a layer whose refs array is rebuilt', async () => {
    // Capturing `refs` at push time would pin the layer to wherever it pointed
    // when it was enabled. `Popover` rebuilds its array whenever its anchor
    // changes, so the stack has to read the current one at press time.
    const outer = vi.fn();
    const mover = vi.fn();
    document.body.innerHTML = `
      <div id="outer-box"><span id="inside"></span></div>
      <span id="outside"></span>
      <div id="mount"></div>`;
    const tree = (targetId: string) => (
      <>
        <MovingLayer targetId={targetId} onDismiss={mover} />
        <MultiRefLayer anchorId="outer-box" panelId="outer-box" onDismiss={outer} />
      </>
    );
    // `outer` is pushed last, so push order gives it the key while the mover
    // sits outside it.
    const { rerender } = render(tree('outside'), {
      container: document.getElementById('mount')!,
    });
    await userEvent.keyboard('{Escape}');
    expect(outer).toHaveBeenCalledTimes(1);
    expect(mover).not.toHaveBeenCalled();

    // Move it inside: containment now puts it on top.
    rerender(tree('inside'));
    await userEvent.keyboard('{Escape}');
    expect(mover).toHaveBeenCalledTimes(1);
    expect(outer).toHaveBeenCalledTimes(1);
  });

  it('survives StrictMode double-invoked effects', async () => {
    // Dev double-invokes mount → unmount → mount. Push/remove has to balance,
    // or a layer is left in the stack and takes a key aimed at another.
    const outer = vi.fn();
    const inner = vi.fn();
    render(
      <StrictMode>
        <Layer name="outer" onDismiss={outer}>
          <Layer name="inner" onDismiss={inner} />
        </Layer>
      </StrictMode>,
    );
    await userEvent.keyboard('{Escape}');
    expect(inner).toHaveBeenCalledTimes(1);
    expect(outer).not.toHaveBeenCalled();
  });

  it('ignores a layer whose refs are all unmounted', async () => {
    const withRefs = vi.fn();
    const detached = vi.fn();
    render(
      <>
        <Layer name="with-refs" onDismiss={withRefs} />
        <DetachedLayer onDismiss={detached} />
      </>,
    );
    // The detached layer is last, so push order gives it the key; it just must
    // not throw on a null element while being compared.
    await userEvent.keyboard('{Escape}');
    expect(detached).toHaveBeenCalledTimes(1);
    expect(withRefs).not.toHaveBeenCalled();
  });

  it('leaves the stack alone for any other key', async () => {
    const onDismiss = vi.fn();
    render(<Layer name="only" onDismiss={onDismiss} />);
    await userEvent.keyboard('{Enter}{Tab}a ');
    expect(onDismiss).not.toHaveBeenCalled();
    await userEvent.keyboard('{Escape}');
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  // ── Listener bookkeeping ───────────────────────────────────────────────────

  it('removes its document listener once the last layer goes', () => {
    const add = vi.spyOn(document, 'addEventListener');
    const remove = vi.spyOn(document, 'removeEventListener');
    const keydowns = (spy: typeof add) => spy.mock.calls.filter(([t]) => t === 'keydown').length;

    const { unmount } = render(<Layer name="only" onDismiss={() => {}} />);
    expect(keydowns(add)).toBe(1);
    unmount();
    expect(keydowns(remove)).toBe(1);

    add.mockRestore();
    remove.mockRestore();
  });

  it('keeps the consumed Escape from travelling on to window', async () => {
    // Unchanged from before the stack, and pinned so a later refactor has to
    // mean it: the listener sits on `document`, so only a window-level handler
    // is downstream of it.
    const onWindow = vi.fn();
    window.addEventListener('keydown', onWindow);
    const onDismiss = vi.fn();
    render(<Layer name="only" onDismiss={onDismiss} />);

    await userEvent.keyboard('{Escape}');
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onWindow).not.toHaveBeenCalled();

    window.removeEventListener('keydown', onWindow);
  });

  it('adds one listener for the whole stack, not one per layer', () => {
    const add = vi.spyOn(document, 'addEventListener');
    render(
      <Layer name="outer" onDismiss={() => {}}>
        <Layer name="inner" onDismiss={() => {}} />
      </Layer>,
    );
    expect(add.mock.calls.filter(([t]) => t === 'keydown')).toHaveLength(1);
    add.mockRestore();
  });
});
