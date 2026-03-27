import React from "react";

export type BadgeVariant =
  | "default"
  | "blue"
  | "green"
  | "yellow"
  | "red"
  | "purple";

export type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Badge — Pill label for roles, priorities, statuses.
 *
 * @param children Badge content
 * @param variant Color variant (default, blue, green, yellow, red, purple)
 * @param className Optional extra className
 * @param style Optional inline style
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
  style,
}) => {
  // Minimalist, bold, and modern Tailwind styling for all variants
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none transition-colors duration-200";
  const variantMap: Record<string, string> = {
    default: "bg-slate-100 text-slate-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    yellow: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
  };
  const variantClass = variantMap[variant] || variantMap.default;
  return (
    <span
      className={[base, variantClass, className].join(" ")}
      style={style}
      data-variant={variant}
    >
      {children}
    </span>
  );
};

export default Badge;
