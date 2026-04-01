import type { TextareaHTMLAttributes } from "react";
import clsx from "clsx";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const textareaId = id || `textarea-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="w-full">
      <label
        htmlFor={textareaId}
        className="mb-1 block text-sm font-medium text-text-secondary"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        className={clsx(
          "block w-full rounded-xl border border-border bg-surface text-text-primary px-4 py-2.5 text-base placeholder-text-muted shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary focus:shadow-md hover:border-primary-light",
          error
            ? "border-priority-high focus:ring-priority-high focus:border-priority-high"
            : "border-border",
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <span className="mt-1 block text-xs text-priority-high transition-opacity duration-200">{error}</span>
      )}
    </div>
  );
}
