import type { AccountStatus } from "../../users/types/user.types";

const StatusBadge = ({ status }: { status: AccountStatus }) =>
  status === "SUSPENDED" ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      Suspended
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  );

export default StatusBadge;
