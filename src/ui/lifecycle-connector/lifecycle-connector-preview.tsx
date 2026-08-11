import type { PreviewProps } from '@/previews/types';
import {
  LifecycleConnector,
  type LifecycleConnectorArrowhead,
  type LifecycleConnectorRouting,
  type LifecycleConnectorState,
} from '@/ui';

import type { CSSProperties } from 'react';

export function LifecycleConnectorPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as LifecycleConnectorState) ?? 'idle';
  const routing = (variants.routing as LifecycleConnectorRouting) ?? 'auto';
  const startDot = (variants.startDot ?? 'on') !== 'off';
  const arrowhead = (variants.arrowhead as LifecycleConnectorArrowhead) ?? 'triangle';
  const W = 260;
  const H = 120;

  // Map the editor knobs onto the connector's own CSS custom properties +
  // pass-through props so the preview reflects "what would this look like
  // with these settings." Dash Pattern rides the var rather than the
  // `dashPattern` prop — the prop writes the same var, so passing both would
  // just set it twice.
  const cssVars = {
    '--uxm-lifecycle-connector-idle-color': styles.connectorIdleColor as string,
    '--uxm-lifecycle-connector-active-color': styles.connectorActiveColor as string,
    '--uxm-lifecycle-connector-idle-stroke-width': styles.connectorIdleStrokeWidth as number,
    '--uxm-lifecycle-connector-active-stroke-width': styles.connectorActiveStrokeWidth as number,
    '--uxm-lifecycle-connector-dashed-color': styles.connectorDashedColor as string,
    '--uxm-lifecycle-connector-dashed-stroke-width': styles.connectorDashedStrokeWidth as number,
    '--uxm-lifecycle-connector-dash-pattern': styles.connectorDashPattern as string,
  } as CSSProperties;

  // `straight` reads as a plain line on aligned anchors, so the anchors only
  // spread on the routes whose whole point is getting from one column to
  // another — otherwise Bezier and Elbow would both render as a flat rule and
  // the picker would look broken.
  const spread = routing === 'bezier' || routing === 'orthogonal';
  const from = { x: spread ? 40 : 24, y: 20 };
  const to = spread ? { x: W - 40, y: H - 20 } : { x: W - 24, y: 20 };

  return (
    <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
      {/* Apply CSS variables on the connector's own root <g> (it spreads
          {...rest} including style onto its element). Wrapper-cascade
          would lose to saved overrides on `.uxm-lifecycle-connector`
          via the inline > class specificity rule for custom properties. */}
      <LifecycleConnector
        style={cssVars}
        from={from}
        to={to}
        state={state}
        routing={routing}
        startDot={startDot}
        arrowSize={styles.connectorArrowSize as number}
        arrowhead={arrowhead}
      />
    </svg>
  );
}
