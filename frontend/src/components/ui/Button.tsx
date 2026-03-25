import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary";
};

export function Button({
  children,
  loading = false,
  disabled,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex h-11 items-center justify-center rounded-xl px-6 text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md",
        variant === "primary"
          ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300"
          : "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-100",
        "disabled:cursor-not-allowed",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span
            className={clsx(
              "h-5 w-5 animate-spin rounded-full border-2 border-t-transparent",
              variant === "primary" ? "border-white" : "border-gray-500"
            )}
          />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
