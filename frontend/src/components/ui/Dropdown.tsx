import React, { useRef, useEffect } from "react";

export type DropdownItem = {
  label: React.ReactNode;
  value: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  id?: string;
};

export type DropdownProps = {
  isOpen: boolean;
  onClose: () => void;
  items: DropdownItem[];
  trigger: React.ReactElement;
  className?: string;
  style?: React.CSSProperties;
  menuId?: string;
  align?: "left" | "right";
};

/**
 * Dropdown — Floating menu overlay with keyboard/outside click support.
 *
 * @param isOpen Whether the dropdown is open
 * @param onClose Close handler (ESC, outside click)
 * @param items Array of menu items
 * @param trigger Trigger element (button, etc.)
 * @param className Optional extra className
 * @param style Optional inline style
 * @param menuId Optional id for accessibility
 * @param align Menu alignment (left, right)
 */
export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  items,
  trigger,
  className = "",
  style,
  menuId,
  align = "left",
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // ESC key closes dropdown
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Outside click closes dropdown
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return trigger;

  return (
    <span className={["relative inline-block", className].join(" ")} style={style}>
      {trigger}
      <div
        ref={menuRef}
        role="menu"
        id={menuId}
        data-align={align}
        tabIndex={-1}
        className={[
          "absolute z-50 mt-1 min-w-[160px] rounded-xl border border-slate-200 bg-white shadow-lg transition-all duration-150 ease-in-out overflow-hidden",
          align === "right" ? "right-0" : "left-0",
        ].join(" ")}
      >
        {items.map((item, idx) => (
          <button
            key={item.id || item.value || idx}
            type="button"
            role="menuitem"
            onClick={item.onClick}
            disabled={item.disabled}
            className={[
              "w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:bg-blue-50 focus:text-blue-700",
              item.className || "",
            ].join(" ")}
            tabIndex={0}
          >
            {item.label}
          </button>
        ))}
      </div>
    </span>
  );
};

export default Dropdown;
