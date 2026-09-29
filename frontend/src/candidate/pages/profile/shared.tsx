import { Pencil } from "lucide-react";

export type Entry = {
  id: string;
  title: string;
  org: string;
  start: string; // "YYYY-MM"
  end: string | null; // null = current
  description?: string;
};
export type Tab = "overview" | "basic" | "experience" | "education" | "resume";
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const fmt = (v: string) =>
  `${MONTHS[Number(v.slice(5, 7)) - 1]} ${v.slice(0, 4)}`;
export const range = (s: string, e: string | null) =>
  `${fmt(s)} — ${e ? fmt(e) : "Present"}`;

export const cardCls =
  "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-sm)]";
export const inputCls =
  "w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--primary)] focus:bg-[var(--card)] focus:ring-2 focus:ring-[var(--primary-light)]";
export const outlineBtn =
  "flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]";
export const iconBtn =
  "rounded-full p-2 text-[var(--text-secondary)] transition hover:bg-[var(--primary-light)] hover:text-[var(--primary)]";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </label>
      {children}
    </div>
  );
}

export function Title({
  children,
  onEdit,
}: {
  children: React.ReactNode;
  onEdit?: () => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
        {children}
      </h3>
      {onEdit && (
        <button aria-label="Edit" onClick={onEdit} className={iconBtn}>
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
