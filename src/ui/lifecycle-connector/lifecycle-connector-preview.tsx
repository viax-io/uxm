import type { PreviewProps } from '@/previews/types';
import {
  LifecycleConnector,
  type LifecycleConnectorState,
} from '@/ui';

import type { CSSProperties } from 'react';

export function LifecycleConnectorPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as LifecycleConnectorState) ?? 'idle';
  const W = 260;
  const H = 72;

  // Map the editor knobs onto the connector's own CSS custom properties +
  // pass-through props so the preview reflects "what would this look like
  // with these settings."
  const cssVars = {
    '--uxm-lifecycle-connector-color':
      state === 'active'
        ? (styles.connectorActiveColor as string)
        : (styles.connectorIdleColor as string),
    '--uxm-lifecycle-connector-width':
      state === 'active'
        ? (styles.connectorActiveStrokeWidth as number)
        : (styles.connectorIdleStrokeWidth as number),
  } as CSSProperties;

  return (
    <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
      {/* Apply CSS variables on the connector's own root <g> (it spreads
          {...rest} including style onto its element). Wrapper-cascade
          would lose to saved overrides on `.uxm-lifecycle-connector`
          via the inline > class specificity rule for custom properties. */}
      <LifecycleConnector
        style={cssVars}
        from={{ x: 20, y: H / 2 }}
        to={{ x: W - 20, y: H / 2 }}
        state={state}
        arrowSize={styles.connectorArrowSize as number}
        dashPattern={styles.connectorDashPattern as string}
      />
    </svg>
  );
}
