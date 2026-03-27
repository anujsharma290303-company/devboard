import React from "react";

export type SkeletonVariant = "text" | "card" | "avatar" | "button";

export type SkeletonProps = {
  variant?: SkeletonVariant;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Skeleton — Animated loading placeholder for UI primitives.
 *
 * @param variant Shape/size variant (text, card, avatar, button)
 * @param className Optional extra className
 * @param style Optional inline style
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  className = "",
  style,
}) => {
  // Minimalist, bold, and modern Tailwind styling for each variant
  const base =
    "bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-pulse shadow-sm";
  let shapeClass = "";
  switch (variant) {
    case "avatar":
      shapeClass = "rounded-full w-9 h-9";
      break;
    case "card":
      shapeClass = "rounded-2xl w-full h-36";
      break;
    case "button":
      shapeClass = "rounded-lg w-28 h-11";
      break;
    case "text":
    default:
      shapeClass = "rounded-md h-4 w-3/4";
      break;
  }
  return (
    <div
      className={[
        base,
        shapeClass,
        "transition-all duration-300 ease-in-out",
        className,
      ].join(" ")}
      style={style}
    />
  );
};

export default Skeleton;
