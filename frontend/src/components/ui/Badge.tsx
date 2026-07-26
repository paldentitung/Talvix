import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantClasses: Record<Required<BadgeProps>["variant"], string> = {
  default: "bg-[var(--bg)] text-[var(--text-secondary)] border-[var(--border)]",
  success: "bg-[var(--success-bg)] text-[var(--success)] border-transparent",
  warning: "bg-[var(--warning-bg)] text-[var(--warning)] border-transparent",
  danger: "bg-[var(--danger-bg)] text-[var(--danger)] border-transparent",
};

/**
 * Reusable across job cards, application status, tables — anywhere a status
 * or tag chip is needed.
 */
export default function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-md border ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
