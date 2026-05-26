"use client";

import { useEffect, useMemo, useState } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/helpers";

export type LoaderVariant = "spinner" | "dots" | "bar";
export type LoaderLayout = "stacked" | "inline";

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  variant?: LoaderVariant;
  layout?: LoaderLayout;
  /** Single message, or `|`-separated to cycle. */
  message?: string;
  /** Cycle interval in ms. */
  messageInterval?: number;
}

export function Loader({
  variant = "spinner",
  layout = "stacked",
  message = "",
  messageInterval = 1500,
  className,
  ...rest
}: LoaderProps) {
  const messages = useMemo(
    () => message.split("|").map((s) => s.trim()).filter(Boolean),
    [message],
  );
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    setIdx(0);
    if (messages.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % messages.length), messageInterval);
    return () => clearInterval(id);
  }, [messages, messageInterval]);

  const currentMessage = messages.length === 0 ? "" : messages[idx % messages.length];

  return (
    <div className={cn("uxm-loader", `uxm-loader--${layout}`, className)} {...rest}>
      {variant === "spinner" && (
        <div className="uxm-loader__spinner" role="status" aria-label={currentMessage || "Loading"} />
      )}
      {variant === "dots" && (
        <div className="uxm-loader__dots" role="status" aria-label={currentMessage || "Loading"}>
          <span />
          <span />
          <span />
        </div>
      )}
      {variant === "bar" && (
        <div className="uxm-loader__bar" role="status" aria-label={currentMessage || "Loading"}>
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
