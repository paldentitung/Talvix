import { useMemo, useState } from "react";
import { Search, MoreHorizontal, UserPlus, ChevronDown } from "lucide-react";
import { useUsers } from "../../features/users/hooks/useUsers";
import Pagination from "../../shared/components/Pagination";
import type { UserRole } from "../../shared/types/user.types";
import relativeTime from "../../shared/utils/relativeTime";
import VerifiedBadge from "../../features/company/components/VerifiedBadge";
import { tintFor } from "../../shared/utils/avatarTint";
import initials from "../../shared/utils/getInitials";
import { fullName } from "../../shared/utils/getFullname";
import RowMenu from "../../shared/components/RowMenu";
import type { AdminUser } from "../../features/users/types/user.types";

const FILTERS = ["All", "Candidates", "Recruiters", "Admins"] as const;
type Filter = (typeof FILTERS)[number];

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
// TODO: add a proper status/suspension field to the User model and show that here instead of isVerified
// NOTE: your User model has no status/suspension field yet — this just
// shows Verified/Unverified from `isVerified` as a placeholder. If you want
// Active/Pending/Suspended, that needs a real `status` column on the backend.

const AdminUsersPage = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useUsers(page, limit);

  const users: AdminUser[] = data?.data?.users ?? [];
  const totalUsers = data?.data?.pagination?.totalUsers ?? 0;
  const totalPages = data?.data?.pagination?.totalPages ?? 1;

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Candidates" && u.role === "CANDIDATE") ||
        (filter === "Recruiters" && u.role === "RECRUITER") ||
        (filter === "Admins" && u.role === "ADMIN");

      const q = query.trim().toLowerCase();
      const name = fullName(u).toLowerCase();
      const matchesQuery =
        q === "" || name.includes(q) || u.email.toLowerCase().includes(q);

      return matchesFilter && matchesQuery;
    });
  }, [users, query, filter]);

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
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                <th className="px-6 py-3.5 font-semibold">User</th>
                <th className="px-6 py-3.5 font-semibold">Role</th>
                <th className="px-6 py-3.5 font-semibold">Verified</th>
                <th className="px-6 py-3.5 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Joined
                    <ChevronDown size={12} />
                  </span>
                </th>
                <th className="px-6 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={5}
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
                    colSpan={5}
                    className="px-6 py-16 text-center text-sm"
                    style={{ color: "var(--danger)" }}
                  >
                    Failed to load users.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                filtered.map((u) => {
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
                      <td
                        className="px-6 py-3.5 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {relativeTime(u.createdAt)}
                      </td>
                      <td
                        className="px-6 py-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end">
                          <RowMenu
                            id={u.id}
                            open={openMenuId === u.id}
                            onToggle={setOpenMenuId}
                            items={[
                              {
                                label: "View profile",
                                onClick: () => console.log("view", u.id),
                              },
                              {
                                label: "Edit role",
                                onClick: () => console.log("edit role", u.id),
                              },
                              {
                                label: "Suspend user",
                                onClick: () => console.log("suspend", u.id),
                                danger: true,
                              },
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {!isLoading && !isError && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
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
      </div>
    </div>
  );
};

export default AdminUsersPage;
