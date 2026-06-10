'use client';

import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '../../helpers/cn';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';

export type ModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';

interface ModalContextValue {
  titleId: string;
  onClose?: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error('Modal.Header / Modal.Body / Modal.Footer must be used inside <Modal>.');
  }
  return ctx;
}

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Sizing preset for the panel width. `fullscreen` lets the panel grow to viewport edges. Default `md`. */
  size?: ModalSize;
  /**
   * Optional close handler — when provided, `Modal.Header` renders an X
   * icon-button that calls it. Omit for forms that should only close via
   * an explicit Cancel/Submit action (use `Dialog`'s `closeOnEscape`/
   * `closeOnOutsideClick` to disable backdrop dismissal in that case).
   */
  onClose?: () => void;
  children: ReactNode;
}

/**
 * Standard modal panel surface — header / body / footer slots. Renders
 * inside a `<Dialog>`.
 *
 *   <Dialog open={open} onOpenChange={setOpen}>
 *     <Modal size="md" onClose={() => setOpen(false)}>
 *       <Modal.Header>Add step</Modal.Header>
 *       <Modal.Body>…</Modal.Body>
 *       <Modal.Footer>
 *         <ButtonTertiary>Cancel</ButtonTertiary>
 *         <ButtonPrimary>Save</ButtonPrimary>
 *       </Modal.Footer>
 *     </Modal>
 *   </Dialog>
 *
 * Compound slots (rather than a `title`/`actions` props pair) let
 * consumers compose freely — a confirmation skips body, a wizard puts a
 * stepper in the header, etc.
 *
 * The header's title automatically wires its id to `Dialog`'s
 * `aria-labelledby` via the surrounding Modal context. Consumers don't
 * touch ids manually.
 */
function ModalRoot({
  size = 'md',
  onClose,
  children,
  className,
  ...rest
}: ModalProps) {
  const titleId = useId();
  return (
    <ModalContext.Provider value={{ titleId, onClose }}>
      <div
        className={cn('uxm-modal', `uxm-modal--${size}`, className)}
        // Forward titleId to Dialog via aria-labelledby propagation: the
        // Dialog panel reads aria-labelledby on itself, so the consumer
        // typically passes `aria-labelledby` to Dialog. We expose it
        // here on the Modal wrapper too for cases where a consumer uses
        // Modal without Dialog (rare; styling-only previews).
        aria-labelledby={titleId}
        {...rest}
      >
        {children}
      </div>
    </ModalContext.Provider>
  );
}

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Visible heading. Receives the auto-generated title id. */
  children: ReactNode;
  /** Hide the close X even when Modal received `onClose`. */
  hideClose?: boolean;
}

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, hideClose, className, ...rest }, ref) => {
    const { titleId, onClose } = useModalContext();
    return (
      <div ref={ref} className={cn('uxm-modal__header', className)} {...rest}>
        <h2 id={titleId} className="uxm-modal__title">
          {children}
        </h2>
        {onClose && !hideClose && (
          <IconButton aria-label="Close" onClick={onClose} className="uxm-modal__close">
            <Icon glyph="close" size={14} strokeWidth={2} />
          </IconButton>
        )}
      </div>
    );
  },
);
ModalHeader.displayName = 'Modal.Header';

const ModalBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn('uxm-modal__body', className)} {...rest} />
  ),
);
ModalBody.displayName = 'Modal.Body';

const ModalFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div ref={ref} className={cn('uxm-modal__footer', className)} {...rest} />
  ),
);
ModalFooter.displayName = 'Modal.Footer';

export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});
