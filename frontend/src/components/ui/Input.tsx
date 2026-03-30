import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  theme?: "dark" | "light";
};

export function Input({ label, error, className, id, theme = "dark", ...props }: InputProps) {
  const inputId = id || `input-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className={
          theme === "light"
            ? "mb-1 block text-sm font-medium text-slate-700"
            : "mb-1 block text-[15px] font-bold text-[#00eaff] drop-shadow-[0_0_6px_#00eaff] tracking-wide"
        }
      >
        {label}
      </label>

      <input
        id={inputId}
        className={clsx(
          "block w-full rounded-xl border bg-white/80 text-slate-900 dark:bg-slate-800/90 dark:text-white px-4 py-2.5 text-base placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-md hover:border-blue-400 dark:hover:border-blue-400",
          error
            ? "border-red-400 focus:ring-red-400 focus:border-red-500"
            : "border-slate-200 dark:border-slate-600",
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
