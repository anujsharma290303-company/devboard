import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  size?: "xs" | "sm" | "md";
};

export function Button({
  children,
  loading = false,
  variant = "primary",
  size = "md",
  className,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none select-none shadow-sm font-sans";

  const variants = {
    primary:
      "rainbow-pill hover:saturate-125 hover:brightness-105 focus:ring-2 focus:ring-primary-light border border-white/10 rainbow-glow",
    secondary:
      "bg-surface/90 text-text-secondary hover:bg-surface focus:ring-2 focus:ring-primary-light border border-border shadow-sm",
    danger:
      "bg-priority-high text-background hover:brightness-110 focus:ring-2 focus:ring-[#fb718599] border border-priority-high shadow-md",
  };

  const sizes = {
    xs: "px-2.5 py-1.5 rounded-lg text-xs min-h-[32px]",
    sm: "px-4 py-2 rounded-lg text-sm min-h-[38px]",
    md: "px-6 py-2.5 rounded-xl text-base min-h-[44px] min-w-[44px]",
  };

  return (
    <button
      type={type}
      className={clsx(
        base,
        variants[variant],
        sizes[size],
        loading && "cursor-wait opacity-70",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className={clsx(
          "mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent",
          variant === "secondary"
            ? "border-text-muted border-t-transparent"
            : "border-white/70 border-t-transparent"
        )}></span>
      ) : null}
      {children}
    </button>
  );
}
