import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { CodeBlock, CodeEditor } from '@/ui';

type Styles = PreviewProps['styles'];

const SAMPLE = `query OrdersByAccount($account: ID!) {
  orders(where: { accountId: { eq: $account } }) {
    id
    status
    total { amount currency }
  }
}`;

const SAMPLE_RESULT = `{
  "data": {
    "orders": [
      { "id": "ord_8842", "status": "OPEN" }
    ]
  }
}`;

/**
 * Project the knobs onto the wrapper. The cascade has to start ABOVE the
 * atom's root, not on it — the gutter, the textarea and the CodeBlock all
 * read the same `--uxm-code-editor-*` vars, and the alignment between the
 * gutter and the code only holds while they resolve to the same values.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-code-editor-bg': styles.backgroundColor as string,
    '--uxm-code-editor-border-color': styles.borderColor as string,
    '--uxm-code-editor-color': styles.color as string,
    '--uxm-code-editor-border-radius': `${styles.borderRadius}px`,
    '--uxm-code-editor-padding-x': `${styles.paddingX}px`,
    '--uxm-code-editor-padding-y': `${styles.paddingY}px`,
    '--uxm-code-editor-font-size': `${styles.fontSize}px`,
    '--uxm-code-editor-line-height':
      styles.lineHeight != null ? String(styles.lineHeight) : undefined,
    '--uxm-code-editor-min-height': `${styles.minHeight}px`,
    '--uxm-code-editor-gutter-color': styles.gutterColor as string,
    '--uxm-code-editor-gutter-bg': styles.gutterBg as string,
    '--uxm-code-editor-gutter-border': styles.gutterBorder as string,
    '--uxm-code-editor-gutter-gap': `${styles.gutterGap}px`,
    '--uxm-code-editor-hover-border': styles.hoverBorder as string,
    '--uxm-code-editor-focus-border': styles.focusBorder as string,
    '--uxm-code-editor-focus-ring': styles.focusRing as string,
    '--uxm-code-editor-disabled-bg': styles.disabledBg as string,
    '--uxm-code-editor-disabled-border': styles.disabledBorder as string,
    '--uxm-code-editor-disabled-color': styles.disabledColor as string,
    '--uxm-code-editor-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-code-editor-error-border': styles.errorBorder as string,
    '--uxm-code-editor-error-color': styles.errorColor as string,
    '--uxm-code-editor-error-message-size':
      styles.errorMessageSize != null ? `${styles.errorMessageSize}px` : undefined,
  } as CSSProperties;
}

export function CodeEditorPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  // Keyed by state so the State knob remounts the demo and `useState`
  // re-seeds — no effect needed to sync.
  return <CodeEditorDemo key={state} state={state} styles={styles} />;
}

function CodeEditorDemo({ state, styles }: { state: string; styles: Styles }) {
  const isError = state === 'error';
  const [code, setCode] = useState(isError ? `${SAMPLE.slice(0, 62)}\n` : SAMPLE);

  return (
    <div style={{ width: 460, ...buildVars(styles) } as CSSProperties}>
      <CodeEditor
        value={code}
        onChange={(e) => setCode(e.target.value)}
        lineNumbers
        disabled={state === 'disabled'}
        error={isError ? 'Syntax error on line 2: expected "}".' : undefined}
        className={
          cn(
            state === 'hover' && 'uxm-code-editor--state-hover',
            state === 'focus' && 'uxm-code-editor--state-focus',
          ) || undefined
        }
        aria-label="GraphQL query"
      />
      {/* The read-only half, under the same knobs. CodeBlock has no registry
          entry of its own on purpose — it IS this surface, so it renders here
          to prove a knob change reaches both. An output panel that drifted
          from the query above it would be the bug. */}
      <div style={{ marginTop: 12 }}>
        <CodeBlock lineNumbers>{SAMPLE_RESULT}</CodeBlock>
      </div>
    </div>
  );
}
