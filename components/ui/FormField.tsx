"use client";

import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FieldWrapper({ label, error, required, className = "", children }: FieldWrapperProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-ud-dark">
          {label}
          {required && <span className="text-ud-burgundy ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-ud-burgundy">{error}</p>}
    </div>
  );
}

const inputBase =
  "w-full px-4 py-2.5 bg-white border border-ud-dark/20 rounded-[4px] text-sm text-ud-dark placeholder:text-ud-dark/40 focus:outline-none focus:border-ud-burgundy focus:ring-1 focus:ring-ud-burgundy transition-colors disabled:opacity-50 disabled:bg-ud-light-gray";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, wrapperClassName, className = "", required, ...props }, ref) => (
    <FieldWrapper label={label} error={error} required={required} className={wrapperClassName}>
      <input ref={ref} required={required} className={`${inputBase} ${className}`} {...props} />
    </FieldWrapper>
  )
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, wrapperClassName, className = "", required, ...props }, ref) => (
    <FieldWrapper label={label} error={error} required={required} className={wrapperClassName}>
      <textarea ref={ref} required={required} className={`${inputBase} resize-none ${className}`} {...props} />
    </FieldWrapper>
  )
);
Textarea.displayName = "Textarea";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, wrapperClassName, className = "", required, children, ...props }, ref) => (
    <FieldWrapper label={label} error={error} required={required} className={wrapperClassName}>
      <select ref={ref} required={required} className={`${inputBase} ${className}`} {...props}>
        {children}
      </select>
    </FieldWrapper>
  )
);
Select.displayName = "Select";
