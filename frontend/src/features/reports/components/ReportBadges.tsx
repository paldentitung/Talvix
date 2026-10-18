import type { ReportReason, ReportStatus } from "../types/report.types";

export const REASON_LABELS: Record<ReportReason, string> = {
  SCAM: "Scam",
  MISLEADING_INFORMATION: "Misleading information",
  INAPPROPRIATE_CONTENT: "Inappropriate content",
  SPAM: "Spam",
  OTHER: "Other",
};

const STATUS_STYLES: Record<
  ReportStatus,
  { bg: string; fg: string; label: string }
> = {
  PENDING: { bg: "var(--warning-bg)", fg: "var(--warning)", label: "Pending" },
  RESOLVED: {
    bg: "var(--success-bg)",
    fg: "var(--success)",
    label: "Resolved",
  },
  DISMISSED: { bg: "#F1F5F9", fg: "var(--text-secondary)", label: "Dismissed" },
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}

export function ReasonBadge({ reason }: { reason: ReportReason }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: "var(--danger-bg)", color: "var(--danger)" }}
    >
      {REASON_LABELS[reason]}
    </span>
  );
}
