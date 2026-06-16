import { useState, useCallback, useRef, useEffect } from 'react';

import { BrandTokenStyles } from './brand-token-styles';
import { FaviconSync } from './favicon-sync';
import { UxmProvider, useUxm } from './lib/context';
import { getComponentDef } from './lib/registry';
import { MobileGallery } from './mobile-gallery';
import { Canvas } from './shell/canvas';
import { PropertiesPanel } from './shell/properties-panel';
import { Sidebar } from './shell/sidebar';

import type { StudioPersistence } from './persistence/types';

const DESKTOP_QUERY = '(min-width: 1024px)';

export interface UxmAppProps {
  /** Renders the workbench in embedded mode (no full-page chrome). */
  embed?: boolean;
  /**
   * Persistence backend. Defaults (via UxmProvider) to a read-only adapter
   * suitable for the static portal — inject `createHttpPersistence()` to
   * enable Save/Upload against a backend.
   */
  persistence?: StudioPersistence;
  /**
   * Sync the document `<link rel="icon">` to the brand favicon. Off by
   * default so a host that owns its own favicon (e.g. a Next app) isn't
   * double-driven; the static portal opts in.
   */
  syncFavicon?: boolean;
}

export function UxmApp({ embed = false, persistence, syncFavicon = false }: UxmAppProps) {
  return (
    <UxmProvider persistence={persistence}>
      <BrandTokenStyles />
      {syncFavicon && <FaviconSync />}
      {/* Flex column so the read-only DemoNotice banner takes its own height and
          the h-full shell fills the rest instead of overflowing the viewport. */}
      <div className="flex flex-col h-full">
        <DemoNotice />
        <div className="flex-1 min-h-0">
          <UxmAppShell embed={embed} />
        </div>
      </div>
    </UxmProvider>
  );
}

/**
 * Read-only banner shown when persistence is disabled (static portal). Makes
 * it clear that live edits are preview-only and won't be saved (R2).
 */
function DemoNotice() {
  const { capabilities } = useUxm();
  if (capabilities.persist) return null;
  return (
    <div
      role="status"
      className="bg-accent-subtle text-accent-bold text-xs text-center px-4 py-1.5 border-b border-border"
    >
      Demo mode — changes are preview-only and won&apos;t be saved.
    </div>
  );
}

function UxmAppShell({ embed }: { embed: boolean }) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(DESKTOP_QUERY);
    const apply = (matches: boolean) => setIsDesktop(matches);
    apply(mql.matches);
    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  if (!isDesktop) {
    return <MobileGallery />;
  }

  return <DesktopShell embed={embed} />;
}

type Orientation = 'horizontal' | 'vertical';

function DesktopShell({ embed }: { embed: boolean }) {
  const { selectedId } = useUxm();
  const [orientation, setOrientation] = useState<Orientation>('horizontal');
  const [panelWidth, setPanelWidth] = useState(320);
  const [panelHeight, setPanelHeight] = useState(280);
  const def = getComponentDef(selectedId);
  const showPropertiesPanel = !!def && (def.styleProperties.length > 0 || def.layoutVariants.length > 0);
  const dragging = useRef(false);
  const startPos = useRef(0);
  const startSize = useRef(0);

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    const isHorizontal = orientation === 'horizontal';
    startPos.current = isHorizontal ? e.clientX : e.clientY;
    startSize.current = isHorizontal ? panelWidth : panelHeight;

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      if (isHorizontal) {
        const delta = startPos.current - ev.clientX;
        setPanelWidth(Math.min(600, Math.max(240, startSize.current + delta)));
      } else {
        const delta = startPos.current - ev.clientY;
        setPanelHeight(Math.min(560, Math.max(160, startSize.current + delta)));
      }
    };

    const onMouseUp = () => {
      dragging.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  }, [orientation, panelWidth, panelHeight]);

  const toggleOrientation = useCallback(
    () => setOrientation((o) => (o === 'horizontal' ? 'vertical' : 'horizontal')),
    [],
  );

  return (
    <div
      className={`grid h-full text-text ${embed ? 'bg-card' : ''}`}
      style={{ gridTemplateColumns: '260px 1fr' }}
    >
      <Sidebar embed={embed} />
      <div
        className={`flex min-w-0 min-h-0 ${
          orientation === 'horizontal' ? 'flex-row' : 'flex-col'
        }`}
      >
        <div className="flex-1 min-w-0 min-h-0">
          <Canvas />
        </div>
        {showPropertiesPanel && (
          <div
            className="relative flex shrink-0"
            style={
              orientation === 'horizontal'
                ? { width: panelWidth }
                : { height: panelHeight }
            }
          >
            {/* Resize handle */}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- pointer-driven splitter handle; keyboard resize is out of scope */}
            <div
              onMouseDown={onResizeStart}
              className={`absolute z-20 group ${
                orientation === 'horizontal'
                  ? 'left-0 top-0 bottom-0 w-1.5 cursor-col-resize'
                  : 'left-0 right-0 top-0 h-1.5 cursor-row-resize'
              }`}
              style={
                orientation === 'horizontal'
                  ? { marginLeft: -3 }
                  : { marginTop: -3 }
              }
            >
              <div className="h-full w-full transition-colors group-hover:bg-accent/30 group-active:bg-accent/50" />
            </div>
            <PropertiesPanel
              embed={embed}
              orientation={orientation}
              onToggleOrientation={toggleOrientation}
            />
          </div>
        )}
      </div>
    </div>
  );
}
