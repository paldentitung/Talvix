import type { AccountStatus } from "../../features/users/types/user.types";
import type { JobStatus } from "../../features/jobs/types/job.types";
import type { ApplicationStatus } from "../../features/applications/types/application.types";

type Status = AccountStatus | JobStatus | ApplicationStatus;

const STATUS_STYLES: Record<Status, { bg: string; fg: string; label: string }> =
  {
    // Account statuses
    ACTIVE: {
      bg: "var(--success-bg)",
      fg: "var(--success)",
      label: "Active",
    },
    SUSPENDED: {
      bg: "var(--danger-bg)",
      fg: "var(--danger)",
      label: "Suspended",
    },

    // Job statuses
    OPEN: {
      bg: "var(--success-bg)",
      fg: "var(--success)",
      label: "Live",
    },
    DRAFT: {
      bg: "var(--warning-bg)",
      fg: "var(--warning)",
      label: "Draft",
    },
    CLOSED: {
      bg: "var(--danger-bg)",
      fg: "var(--danger)",
      label: "Closed",
    },

    PENDING: {
      bg: "var(--warning-bg)",
      fg: "var(--warning)",
      label: "Pending",
    },
    REVIEWING: {
      bg: "var(--primary-light)",
      fg: "var(--primary)",
      label: "Reviewing",
    },
    SHORTLISTED: {
      bg: "var(--accent-light)",
      fg: "var(--accent)",
      label: "Shortlisted",
    },
    ACCEPTED: {
      bg: "var(--success-bg)",
      fg: "var(--success)",
      label: "Accepted",
    },
    REJECTED: {
      bg: "var(--danger-bg)",
      fg: "var(--danger)",
      label: "Rejected",
    },
    WITHDRAWN: {
      bg: "var(--bg)",
      fg: "var(--text-muted)",
      label: "Withdrawn",
    },
  };

function StatusBadge({ status }: { status: Status }) {
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

export default StatusBadge;
