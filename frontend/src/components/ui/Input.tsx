import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  theme?: "dark" | "light";
};

export function Input({ label, error, className, id, theme = "light", ...props }: InputProps) {
  const inputId = id || `input-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const themedSurface =
    theme === "dark"
      ? "bg-background/80 text-text-primary"
      : "bg-surface text-text-primary";

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-1 block text-sm font-medium text-text-secondary"
      >
        {label}
      </label>

      <input
        id={inputId}
        className={clsx(
          "block w-full rounded-xl border border-border px-4 py-2.5 text-base placeholder-text-muted shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary focus:shadow-md hover:border-primary-light",
          themedSurface,
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
