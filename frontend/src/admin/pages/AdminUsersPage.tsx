import { useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useUsers } from "../../features/users/hooks/useUsers";
import Pagination from "../../shared/components/Pagination";
import type { UserRole } from "../../shared/types/user.types";
import relativeTime from "../../shared/utils/relativeTime";
import VerifiedBadge from "../../features/company/components/VerifiedBadge";
import { tintFor } from "../../shared/utils/avatarTint";
import initials from "../../shared/utils/getInitials";
import { fullName } from "../../shared/utils/getFullname";
import RowMenu from "../../shared/components/RowMenu";
import type {
  AdminUser,
  AccountStatus,
} from "../../features/users/types/user.types";
import { useUpdateUserStatus } from "../../features/users/hooks/useUpdateUserStatus";
import { useDebouncedValue } from "../../shared/hooks/useDebouncedValue";
import Button from "../../components/ui/Button";
import BottomSheet from "../../components/ui/BottomSheet";
import CandidateDetailView from "../../features/users/components/CandidateDetailView";
import CompanyDetailView from "../../features/users/components/CompanyDetailView";
import AdminDetailView from "../../features/users/components/AdminDetailView";
const FILTERS = ["All", "Candidates", "Recruiters", "Admins"] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_TO_ROLE: Record<Filter, UserRole | ""> = {
  All: "",
  Candidates: "CANDIDATE",
  Recruiters: "RECRUITER",
  Admins: "ADMIN",
};

const STATUS_STYLES: Record<
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
const ROLE_LABELS: Record<UserRole, string> = {
  CANDIDATE: "Candidate",
  RECRUITER: "Recruiter",
  ADMIN: "Admin",
};
function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: "#F1F5F9", color: "var(--text-secondary)" }}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

function StatusBadge({ status }: { status: AccountStatus }) {
  const s = STATUS_STYLES[status];
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
}

const COLUMN_COUNT = 6;

const AdminUsersPage = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const debouncedQuery = useDebouncedValue(query, 350);
  const [viewUser, setViewUser] = useState<AdminUser | null>(null);
  const { data, isLoading, isError } = useUsers(
    page,
    limit,
    debouncedQuery.trim(),
    FILTER_TO_ROLE[filter],
  );

  const users: AdminUser[] = data?.data?.users ?? [];
  const totalUsers = data?.data?.pagination?.totalUsers ?? 0;
  const totalPages = data?.data?.pagination?.totalPages ?? 1;

  const updateStatusMutation = useUpdateUserStatus();

  const handleUpdateStatus = (user: AdminUser) => {
    if (updateStatusMutation.isPending) return;

    const nextStatus: AccountStatus =
      user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    const action = nextStatus === "SUSPENDED" ? "suspend" : "reactivate";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${fullName(user)} (${user.email})?`,
    );
    if (!confirmed) return;

    updateStatusMutation.mutate({ userId: user.id, status: nextStatus });
    setOpenMenuId(null);
  };

  return (
    <div onClick={() => openMenuId && setOpenMenuId(null)}>
      <div
        className="overflow-hidden rounded-2xl border"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b p-5"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="relative w-full max-w-xs">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search users..."
              className="w-full rounded-full border py-2.5 pl-10 pr-4 text-sm outline-none transition-shadow focus:ring-2"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => {
                    setFilter(f);
                    setPage(1);
                  }}
                  className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
                  style={
                    active
                      ? { background: "var(--primary)", color: "#fff" }
                      : {
                          background: "var(--bg)",
                          color: "var(--text-secondary)",
                        }
                  }
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                <th className="px-6 py-3.5 font-semibold">User</th>
                <th className="px-6 py-3.5 font-semibold">Role</th>
                <th className="px-6 py-3.5 font-semibold">Verified</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Joined
                    <ChevronDown size={12} />
                  </span>
                </th>
                <th className="px-6 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={COLUMN_COUNT}
                    className="px-6 py-16 text-center text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Loading users…
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td
                    colSpan={COLUMN_COUNT}
                    className="px-6 py-16 text-center text-sm"
                    style={{ color: "var(--danger)" }}
                  >
                    Failed to load users.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                users.map((u) => {
                  const name = fullName(u);
                  const tint = tintFor(name);
                  return (
                    <tr
                      key={u.id}
                      className="border-t transition-colors hover:bg-slate-50/70"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                            style={{ background: tint.bg, color: tint.fg }}
                          >
                            {initials(name)}
                          </div>
                          <div className="min-w-0">
                            <p
                              className="truncate text-sm font-semibold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {name}
                            </p>
                            <p
                              className="truncate text-xs"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-6 py-3.5">
                        <VerifiedBadge verified={u.isVerified} />
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={u.status} />
                      </td>
                      <td
                        className="px-6 py-3.5 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {relativeTime(u.createdAt)}
                      </td>
                      <td
                        className="px-6 py-3.5 "
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            onClick={() => handleUpdateStatus(u)}
                            disabled={updateStatusMutation.isPending}
                            size="sm"
                            className="rounded-full border text-xs  disabled:cursor-not-allowed disabled:opacity-50"
                            style={
                              u.status === "ACTIVE"
                                ? {
                                    background: "#FEF2F2",
                                    color: "#B91C1C",
                                    borderColor: "#FECACA",
                                  }
                                : {
                                    background: "#ECFDF5",
                                    color: "#047857",
                                    borderColor: "#A7F3D0",
                                  }
                            }
                          >
                            {u.status === "ACTIVE" ? "Suspend" : "Reactivate"}
                          </Button>

                          <RowMenu
                            id={u.id}
                            open={openMenuId === u.id}
                            onToggle={setOpenMenuId}
                            items={[
                              {
                                label: "View profile",
                                onClick: () => setViewUser(u),
                              },
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {!isLoading && !isError && users.length === 0 && (
                <tr>
                  <td colSpan={COLUMN_COUNT} className="px-6 py-16 text-center">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      No users match your search
                    </p>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Try a different name, email, or filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          total={totalUsers}
          itemLabel="users"
          isFetching={isLoading}
        />
        <BottomSheet
          isOpen={!!viewUser}
          onClose={() => setViewUser(null)}
          title="User profile"
        >
          {viewUser?.role === "CANDIDATE" && (
            <CandidateDetailView key={viewUser.id} id={viewUser.id} />
          )}
          {viewUser?.role === "RECRUITER" && (
            <CompanyDetailView key={viewUser.id} id={viewUser.id} />
          )}
          {viewUser?.role === "ADMIN" && (
            <AdminDetailView key={viewUser.id} id={viewUser.id} />
          )}
        </BottomSheet>
      </div>
    </div>
  );
};

export default AdminUsersPage;
