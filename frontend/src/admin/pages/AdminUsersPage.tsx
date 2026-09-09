"use client";

import { useMemo, useState } from "react";
import { Search, MoreHorizontal, UserPlus, ChevronDown } from "lucide-react";
import { useUsers } from "../../features/users/hooks/useUsers";
import Pagination from "../../shared/components/Pagination";
import type { UserRole, ApiUser } from "../../shared/types/user.types";
// ---------------------------------------------------------------------------
// Real API shape
// ---------------------------------------------------------------------------

const FILTERS = ["All", "Candidates", "Recruiters", "Admins"] as const;
type Filter = (typeof FILTERS)[number];

const ROLE_LABELS: Record<UserRole, string> = {
  CANDIDATE: "Candidate",
  RECRUITER: "Recruiter",
  ADMIN: "Admin",
};
const AVATAR_TINTS = [
  { bg: "#EEF2FF", fg: "#4F46E5" },
  { bg: "#F0FDFA", fg: "#0D9488" },
  { bg: "#FDF4FF", fg: "#A21CAF" },
  { bg: "#FFF7ED", fg: "#C2410C" },
  { bg: "#EFF6FF", fg: "#2563EB" },
];

function fullName(u: ApiUser) {
  return `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email;
}

function tintFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_TINTS[Math.abs(hash) % AVATAR_TINTS.length];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------

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

// NOTE: your User model has no status/suspension field yet — this just
// shows Verified/Unverified from `isVerified` as a placeholder. If you want
// Active/Pending/Suspended, that needs a real `status` column on the backend.
function VerifiedBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
      style={
        verified
          ? { background: "var(--success-bg)", color: "var(--success)" }
          : { background: "var(--warning-bg)", color: "var(--warning)" }
      }
    >
      {verified ? "Verified" : "Unverified"}
    </span>
  );
}

function RowMenu({
  userId,
  open,
  onToggle,
}: {
  userId: string;
  open: boolean;
  onToggle: (id: string | null) => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={() => onToggle(open ? null : userId)}
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
          <button className="block w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            View profile
          </button>
          <button className="block w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            Edit role
          </button>
          <button
            className="block w-full px-3.5 py-2 text-left text-sm hover:bg-red-50"
            style={{ color: "var(--danger)" }}
          >
            Suspend user
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const AdminUsersPage = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useUsers(page, limit);

  const users: ApiUser[] = data?.data?.users ?? [];
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
                            userId={u.id}
                            open={openMenuId === u.id}
                            onToggle={setOpenMenuId}
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
