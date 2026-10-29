import type { AccountStatus } from "../../features/users/types/user.types";

const STYLES: Record<
  AccountStatus,
  { label: string; bg: string; fg: string; dot: string }
> = {
  ACTIVE: { label: "Active", bg: "#ECFDF5", fg: "#047857", dot: "#10B981" },
  SUSPENDED: {
    label: "Suspended",
    bg: "#FEF2F2",
    fg: "#B91C1C",
    dot: "#EF4444",
  },
};

const StatusBadge = ({ status }: { status: AccountStatus }) => {
  const s = STYLES[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: s.bg, color: s.fg }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: s.dot }}
      />
      {s.label}
    </span>
  );
};

export default StatusBadge;
