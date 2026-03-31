import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
};

export function Button({
  children,
  loading = false,
  variant = "primary",
  className,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none select-none shadow-sm";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 border border-blue-600",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-2 focus:ring-blue-300 border border-gray-300",
    danger:
      "bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-400 border border-red-500",
  };

  return (
    <button
      type={type}
      className={clsx(
        base,
        variants[variant],
        "px-6 py-2.5 rounded-lg text-base min-h-[44px] min-w-[44px]",
        loading && "cursor-wait opacity-70",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className={clsx(
          "mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent",
          variant === "secondary" ? "border-gray-400 border-t-transparent" : "border-white/70 border-t-transparent"
        )}></span>
      ) : null}
      {children}
    </button>
  );
}
