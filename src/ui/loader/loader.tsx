import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/helpers';

import type { HTMLAttributes } from 'react';

export type LoaderVariant = 'spinner' | 'dots' | 'bar';
export type LoaderLayout = 'stacked' | 'inline';

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  variant?: LoaderVariant;
  layout?: LoaderLayout;
  /** Single message, or `|`-separated to cycle. */
  message?: string;
  /** Cycle interval in ms. */
  messageInterval?: number;
  /**
   * Accessible name for the `role="status"` element when no `message` is
   * showing. Default `"Loading"`. With a message, the message IS the name.
   */
  loadingLabel?: string;
}

export function Loader({
  variant = 'spinner',
  layout = 'stacked',
  message = '',
  messageInterval = 1500,
  loadingLabel = 'Loading',
  className,
  ...rest
}: LoaderProps) {
  const messages = useMemo(
    () => message.split('|').map((s) => s.trim()).filter(Boolean),
    [message],
  );
  const [idx, setIdx] = useState(0);
  // Restart the cycle from the first message whenever the `message` prop
  // changes — otherwise a swap mid-rotation would show some interior
  // message first. Render-phase reset (React's "storing information from
  // previous renders" pattern) instead of an effect so there's no extra
  // render after the swap.
  const [prevMessage, setPrevMessage] = useState(message);
  if (prevMessage !== message) {
    setPrevMessage(message);
    setIdx(0);
  }
  useEffect(() => {
    if (messages.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % messages.length), messageInterval);
    return () => clearInterval(id);
  }, [messages, messageInterval]);

  const currentMessage = messages.length === 0 ? '' : messages[idx % messages.length];

  return (
    <div className={cn('uxm-loader', `uxm-loader--${layout}`, className)} {...rest}>
      {variant === 'spinner' && (
        <div className="uxm-loader__spinner" role="status" aria-label={currentMessage || loadingLabel} />
      )}
      {variant === 'dots' && (
        <div className="uxm-loader__dots" role="status" aria-label={currentMessage || loadingLabel}>
          <span />
          <span />
          <span />
        </div>
      )}
      {variant === 'bar' && (
        <div className="uxm-loader__bar" role="status" aria-label={currentMessage || loadingLabel}>
          <span />
        </div>
      )}
      {currentMessage && (
        <span className="uxm-loader__message">
          {messages.length > 1 ? (
            <span key={idx} className="uxm-loader__message-fade">
              {currentMessage}
            </span>
          ) : (
            currentMessage
          )}
        </span>
      )}
    </div>
  );
}
