import type { AccountStatus } from "../../features/users/types/user.types";
import type { JobStatus } from "../../features/jobs/types/job.types";

type Status = AccountStatus | JobStatus;

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
