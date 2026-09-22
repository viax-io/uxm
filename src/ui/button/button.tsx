import { cn } from '@/helpers';

import type { ComponentPropsWithRef } from 'react';

/**
 * Native `<button>` attributes **including `ref`**, shared by every variant.
 *
 * `ComponentPropsWithRef<'button'>` rather than `ButtonHTMLAttributes`: React 19
 * passes `ref` as an ordinary prop, so it already reached the element through
 * the rest spread — but `ButtonHTMLAttributes` does not declare it, so
 * `<ButtonPrimary ref={…}>` was a type error for every TypeScript consumer even
 * though it worked at runtime. That is what blocked the buttons from being
 * `HoverTooltip` / `Popover` anchors without a wrapper element around them.
 *
 * Not `forwardRef`: 4.39 deliberately moved `Modal`'s sub-components the other
 * way, off `forwardRef` and onto React 19 ref props.
 */
export type ButtonProps = ComponentPropsWithRef<'button'>;

export function ButtonPrimary({ className, type = 'button', ref, ...rest }: ButtonProps) {
  return <button ref={ref} type={type} className={cn('uxm-button-primary', className)} {...rest} />;
}

export function ButtonSecondary({ className, type = 'button', ref, ...rest }: ButtonProps) {
  return <button ref={ref} type={type} className={cn('uxm-button-secondary', className)} {...rest} />;
}

export function ButtonTertiary({ className, type = 'button', ref, ...rest }: ButtonProps) {
  return <button ref={ref} type={type} className={cn('uxm-button-tertiary', className)} {...rest} />;
}

export function ButtonGhost({ className, type = 'button', ref, ...rest }: ButtonProps) {
  return <button ref={ref} type={type} className={cn('uxm-button-ghost', className)} {...rest} />;
}

export function ButtonDanger({ className, type = 'button', ref, ...rest }: ButtonProps) {
  return <button ref={ref} type={type} className={cn('uxm-button-danger', className)} {...rest} />;
}
