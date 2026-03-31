import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  theme?: "dark" | "light";
};

export function Input({ label, error, className, id, theme = "light", ...props }: InputProps) {
  const inputId = id || `input-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <input
        id={inputId}
        className={clsx(
          "block w-full rounded-md border border-gray-300 bg-white text-gray-900 px-4 py-2.5 text-base placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-lg hover:border-blue-400",
          error
            ? "border-red-400 focus:ring-red-400 focus:border-red-500"
            : "border-gray-300",
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
