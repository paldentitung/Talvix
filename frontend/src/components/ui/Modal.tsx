import { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
};

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "max-w-lg",
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[90vh] w-full ${maxWidth} flex-col rounded-(--radius-lg) bg-(--card) shadow-(--shadow-lg)`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-(--border) px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id="modal-title"
              className="font-display text-lg font-bold text-(--text-primary)"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 text-sm text-(--text-secondary)">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-(--radius-md) text-(--text-secondary) hover:bg-(--bg) hover:text-(--text-primary)"
          >
            <X size={18} />
          </button>
        </div>

        {children && (
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {children}
          </div>
        )}

        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-(--border) px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
