import { cn } from '@/helpers';

import { Icon } from '../icon';

import type { HTMLAttributes, ReactNode } from 'react';

export type StepperStepState = 'done' | 'current' | 'ahead' | 'off';

export interface StepperStep {
  label: ReactNode;
  /** `done` (passed), `current` (where the record is), `ahead` (not reached) or `off` (skipped). */
  state: StepperStepState;
  /** A second line under the label: a date, an owner. */
  meta?: ReactNode;
  /** React key; defaults to the index. */
  key?: string;
}

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  steps: StepperStep[];
  /**
   * The word a screen reader hears after a `done` or `off` step's label (the
   * marker shows it only as a shape). The current step is announced through
   * `aria-current="step"`, and a step not yet reached needs no word. Pass your
   * own copy to translate them.
   */
  stateLabels?: Partial<Record<'done' | 'off', string>>;
}

const DEFAULT_STATE_LABELS: Record<'done' | 'off', string> = { done: 'Done', off: 'Skipped' };

/**
 * A record's progress through its lifecycle, left to right: done steps with a
 * check, the current step ringed, steps ahead hollow, skipped steps dashed. An
 * ordered list, so its order is the meaning; it scrolls sideways when the
 * steps don't fit. For a vertical history, use `TimelineEntry`.
 */
export function Stepper({ steps, stateLabels, className, ...rest }: StepperProps) {
  const words = { ...DEFAULT_STATE_LABELS, ...stateLabels };
  return (
    // A Tab stop because the list scrolls sideways when the steps don't fit,
    // and a scroller has to be reachable from the keyboard (as DataTable's).
    // Pass `tabIndex={-1}` where the steps always fit.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scroll container must be focusable to scroll by keyboard (WCAG 2.1.1)
    <ol tabIndex={0} className={cn('uxm-stepper', className)} {...rest}>
      {steps.map((step, i) => (
        <li
          key={step.key ?? i}
          className={cn('uxm-stepper__step', `uxm-stepper__step--${step.state}`)}
          aria-current={step.state === 'current' ? 'step' : undefined}
        >
          <span className="uxm-stepper__marker" aria-hidden="true">
            {step.state === 'done' && <Icon glyph="check" size={12} strokeWidth={2.5} />}
          </span>
          <span className="uxm-stepper__label">
            {step.label}
            {(step.state === 'done' || step.state === 'off') && (
              <span className="uxm-stepper__status">, {words[step.state]}</span>
            )}
          </span>
          {step.meta != null && <span className="uxm-stepper__meta">{step.meta}</span>}
        </li>
      ))}
    </ol>
  );
}
