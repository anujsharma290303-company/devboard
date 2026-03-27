import React, { useEffect, useRef } from "react";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showCloseButton?: boolean;
  id?: string;
};

/**
 * Modal — Base reusable overlay with backdrop, close logic, and accessibility.
 *
 * @param isOpen Whether the modal is open
 * @param onClose Close handler (ESC, backdrop, close button)
 * @param title Optional modal title
 * @param children Modal content
 * @param className Optional extra className
 * @param style Optional inline style
 * @param showCloseButton Show close button (default true)
 * @param id Optional id for accessibility
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  style,
  showCloseButton = true,
  id,
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Backdrop click closes modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className={[
        "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-200",
        className,
      ].join(" ")}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-labelledby={id ? `${id}-title` : undefined}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg mx-4 p-6 sm:p-8 animate-[fadeIn_0.2s_ease] overflow-hidden"
        style={{ maxHeight: "80vh" }}
      >
        <header className="flex items-start justify-between mb-4">
          {title && (
            <h2
              id={id ? `${id}-title` : undefined}
              className="text-lg font-semibold text-slate-900"
            >
              {title}
            </h2>
          )}
          {showCloseButton && (
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="ml-4 text-slate-400 hover:text-slate-700 transition-colors text-2xl leading-none focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full"
            >
              ×
            </button>
          )}
        </header>
        <div className="overflow-y-auto" style={{ maxHeight: "calc(80vh - 3rem)" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
