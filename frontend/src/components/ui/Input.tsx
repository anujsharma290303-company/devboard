import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || `input-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-1 block text-sm font-medium text-slate-200 drop-shadow-sm"
      >
        {label}
      </label>

      <input
        id={inputId}
        className={clsx(
          "block w-full rounded-xl border bg-white/10 text-white px-4 py-2.5 text-base placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:shadow-sm",
          error
            ? "border-red-400 focus:ring-red-400 focus:border-red-500"
            : "border-slate-200 focus:border-blue-500",
          className
        )}
        aria-invalid={!!error}
        {...props}
      />

      {error && (
        <span className="mt-1 block text-xs text-red-600 transition-opacity duration-200">{error}</span>
      )}
    </div>
  );
}
