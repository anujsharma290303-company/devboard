import React, { useRef } from "react";

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

  // Close modal when clicking on the backdrop only
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className={["fixed inset-0 z-50 flex items-center justify-center bg-background/75 backdrop-blur-sm transition-all duration-200", className].join(" ")}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-labelledby={id ? `${id}-title` : undefined}
      onClick={handleBackdropClick}
    >
        <div
          className="rainbow-panel rainbow-glow rounded-2xl w-full min-w-[350px] max-w-2xl mx-4 p-6 sm:p-10 animate-[fadeIn_0.2s_ease] overflow-y-auto"
          style={{ maxHeight: "90vh" }}
        >
          <header className="flex items-start justify-between mb-4">
            {title && (
              <h2
                id={id ? `${id}-title` : undefined}
                className="text-lg font-semibold text-text-primary"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="ml-2 rounded-full p-2 text-text-secondary hover:bg-primary/15 focus:outline-none focus:ring-2 focus:ring-primary-light"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </header>
          {children}
        </div>
      </div>
    );
};
