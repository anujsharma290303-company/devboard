import React, { useRef } from "react";

export type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: "top" | "bottom";
  className?: string;
  style?: React.CSSProperties;
  id?: string;
};

/**
 * Tooltip — Hover/focus label for icon buttons and elements.
 *
 * @param content Tooltip text or node
 * @param children Trigger element (must be a single React element)
 * @param position Tooltip position (top, bottom)
 * @param className Optional extra className
 * @param style Optional inline style
 * @param id Optional id for accessibility
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  className = "",
  style,
  id,
}) => {
  // Minimalist, bold, and modern Tailwind styling for Tooltip
  const triggerRef = useRef<HTMLSpanElement>(null);
  // Use group for hover/focus
  return (
    <span
      className={["relative inline-flex group", className].join(" ")}
      style={style}
      ref={triggerRef}
      tabIndex={0}
      aria-describedby={id}
    >
      {children}
      <span
        role="tooltip"
        id={id}
        data-position={position}
        className={[
          "absolute z-50 px-2.5 py-1 rounded-lg rainbow-panel text-text-primary text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-150",
          position === "top"
            ? "bottom-full left-1/2 -translate-x-1/2 mb-2"
            : "top-full left-1/2 -translate-x-1/2 mt-2",
        ].join(" ")}
      >
        {content}
      </span>
    </span>
  );
};

export default Tooltip;
