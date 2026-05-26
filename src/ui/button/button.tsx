import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/helpers";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function ButtonPrimary({ className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={cn("uxm-button-primary", className)} {...rest} />;
}

export function ButtonSecondary({ className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={cn("uxm-button-secondary", className)} {...rest} />;
}

export function ButtonTertiary({ className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={cn("uxm-button-tertiary", className)} {...rest} />;
}

export function ButtonGhost({ className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={cn("uxm-button-ghost", className)} {...rest} />;
}
