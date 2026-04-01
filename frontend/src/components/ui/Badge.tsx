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
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none transition-colors duration-200 font-sans border border-transparent";
  const variantMap: Record<string, string> = {
    default: "bg-surface/80 text-text-secondary border-border",
    blue: "bg-[#57b2ff1f] text-[#8ed0ff] border-[#57b2ff66]",
    green: "bg-[#4df7c81a] text-[#7cf9d8] border-[#4df7c866]",
    yellow: "bg-[#ffe45e1f] text-[#ffe98c] border-[#ffe45e66]",
    red: "bg-[#ff4d8d1f] text-[#ff80aa] border-[#ff4d8d66]",
    purple: "bg-[#b06bff1f] text-[#c996ff] border-[#b06bff66]",
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
