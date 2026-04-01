import React from "react";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export type AvatarProps = {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  tabIndex?: number;
  role?: string;
};

/**
 * Avatar — User profile image or initials fallback.
 *
 * @param src Image URL (optional)
 * @param alt Alt text (optional)
 * @param initials Fallback initials (optional)
 * @param size Avatar size (sm, md, lg, xl)
 * @param className Optional extra className
 * @param style Optional inline style
 * @param onClick Optional click handler
 * @param tabIndex Optional tab index for accessibility
 * @param role Optional ARIA role
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "",
  initials,
  size = "md",
  // size is intentionally not used in structure-only implementation
  className = "",
  style,
  onClick,
  tabIndex,
  role,
}) => {
  // Only structure, no Tailwind or visual classes here
  // Minimalist, bold, and modern Tailwind styling for Avatar
  const sizeMap: Record<string, string> = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };
  const clickable = !!onClick;
  return (
    <span
      className={[
        "inline-flex items-center justify-center rounded-full bg-surface ring-2 ring-primary/40 overflow-hidden select-none",
        sizeMap[size || "md"],
        clickable ? "cursor-pointer hover:scale-105 transition-transform duration-150" : "",
        className,
      ].join(" ")}
      style={style}
      onClick={onClick}
      tabIndex={tabIndex}
      role={role}
      aria-label={alt || initials}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <span className="w-full h-full flex items-center justify-center rainbow-pill text-[#081022] font-semibold uppercase">
          {initials}
        </span>
      )}
    </span>
  );
};

export default Avatar;
