import { MoreHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface RowMenuItem {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  danger?: boolean; // renders in --danger color with red hover, e.g. "Suspend", "Take down", "Delete"
  disabled?: boolean;
}

interface RowMenuProps {
  id: string;
  open: boolean;
  onToggle: (id: string | null) => void;
  items: RowMenuItem[];
}

export default function RowMenu({ id, open, onToggle, items }: RowMenuProps) {
  return (
    <div className="relative">
      <button
        onClick={() => onToggle(open ? null : id)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        aria-label="Row actions"
        aria-expanded={open}
      >
        <MoreHorizontal size={18} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-9 z-20 w-44 overflow-hidden rounded-xl border py-1"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-lg)",
          }}
          onMouseLeave={() => onToggle(null)}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => {
                  item.onClick();
                  onToggle(null);
                }}
                disabled={item.disabled}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm transition-colors disabled:opacity-50"
                style={
                  item.danger
                    ? { color: "var(--danger)" }
                    : { color: "var(--text-secondary)" }
                }
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = item.danger
                    ? "var(--danger-bg)"
                    : "#F8FAFC";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {Icon && <Icon size={14} />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
