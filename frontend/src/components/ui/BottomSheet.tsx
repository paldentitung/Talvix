import { useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

const BottomSheet = ({ isOpen, onClose, title, children }: Props) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className="sheet-slide-up absolute inset-x-0 bottom-0 flex h-[90vh] flex-col overflow-hidden rounded-t-2xl bg-(--bg) shadow-(--shadow-md)"
      >
        <div className="flex items-center justify-between border-b border-(--border) bg-(--card) px-6 py-4">
          <h2 className="font-display text-base font-bold text-(--text-primary)">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-(--text-muted) hover:bg-(--bg)"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 md:p-6">{children}</div>
      </div>
    </div>
  );
};

export default BottomSheet;
