import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/helpers";

export type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ className, type = "text", ...rest }: TextInputProps) {
  return <input type={type} className={cn("uxm-input-text", className)} {...rest} />;
}

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...rest }: TextareaProps) {
  return <textarea className={cn("uxm-textarea", className)} {...rest} />;
}

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...rest }: SelectProps) {
  return (
    <select className={cn("uxm-select-dropdown", className)} {...rest}>
      {children}
    </select>
  );
}
