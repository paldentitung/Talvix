"use client";

import { useMemo, useState } from "react";
import { Search, MoreHorizontal, UserPlus, ChevronDown } from "lucide-react";
import type { UserRole } from "../../shared/types/user.types";
// ---------------------------------------------------------------------------
// Types & mock data
// ---------------------------------------------------------------------------

type Role = "Seeker" | "Employer" | "Admin";
type Status = "Active" | "Pending" | "Suspended";

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  joined: string; // relative label, e.g. "2h ago"
  joinedSort: number; // ms, for sorting if ever needed
  highlight?: boolean; // e.g. newly promoted / just-changed row
}

const USERS: PlatformUser[] = [
  {
    id: "u1",
    name: "Alex Morgan",
    email: "alex@hirely.com",
    role: "Seeker",
    status: "Active",
    joined: "2h ago",
    joinedSort: 2,
  },
  {
    id: "u2",
    name: "Priya Shah",
    email: "priya@hirely.com",
    role: "Employer",
    status: "Active",
    joined: "5h ago",
    joinedSort: 5,
  },
  {
    id: "u3",
    name: "Marcus Lee",
    email: "marcus@hirely.com",
    role: "Employer",
    status: "Active",
    joined: "1d ago",
    joinedSort: 24,
    highlight: true,
  },
  {
    id: "u4",
    name: "Ana García",
    email: "ana@hirely.com",
    role: "Seeker",
    status: "Pending",
    joined: "2d ago",
    joinedSort: 48,
  },
  {
    id: "u5",
    name: "Jordan Kim",
    email: "jordan@hirely.com",
    role: "Seeker",
    status: "Active",
    joined: "3d ago",
    joinedSort: 72,
  },
  {
    id: "u6",
    name: "Sofia Rossi",
    email: "sofia@hirely.com",
    role: "Admin",
    status: "Active",
    joined: "1w ago",
    joinedSort: 168,
  },
  {
    id: "u7",
    name: "Chen Wei",
    email: "chen@hirely.com",
    role: "Employer",
    status: "Suspended",
    joined: "2w ago",
    joinedSort: 336,
  },
  {
    id: "u8",
    name: "Léa Dubois",
    email: "lea@hirely.com",
    role: "Seeker",
    status: "Active",
    joined: "1mo ago",
    joinedSort: 720,
  },
];

const FILTERS = ["All", "Seekers", "Employers", "Admins", "Suspended"] as const;
type Filter = (typeof FILTERS)[number];

// A small, stable palette of avatar tints so initials never look monotonous
// but never clash with the status/role palette either.
const AVATAR_TINTS = [
  { bg: "#EEF2FF", fg: "#4F46E5" }, // indigo
  { bg: "#F0FDFA", fg: "#0D9488" }, // teal
  { bg: "#FDF4FF", fg: "#A21CAF" }, // fuchsia
  { bg: "#FFF7ED", fg: "#C2410C" }, // orange
  { bg: "#EFF6FF", fg: "#2563EB" }, // blue
];

function tintFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_TINTS[Math.abs(hash) % AVATAR_TINTS.length];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------

function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: "#F1F5F9", color: "var(--text-secondary)" }}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, { bg: string; fg: string }> = {
    Active: { bg: "var(--success-bg)", fg: "var(--success)" },
    Pending: { bg: "var(--warning-bg)", fg: "var(--warning)" },
    Suspended: { bg: "var(--danger-bg)", fg: "var(--danger)" },
  };
  const s = styles[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      {status}
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

  const filtered = useMemo(() => {
    return USERS.filter((u) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Seekers" && u.role === "Seeker") ||
        (filter === "Employers" && u.role === "Employer") ||
        (filter === "Admins" && u.role === "Admin") ||
        (filter === "Suspended" && u.status === "Suspended");

      const q = query.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);

      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <div onClick={() => openMenuId && setOpenMenuId(null)}>
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            className="font-display text-3xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Users
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {USERS.length === 8 ? "128,412" : USERS.length} total users on the
            platform
          </p>
        </div>

        <button
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors"
          style={{
            background: "var(--primary)",
            boxShadow: "var(--shadow-sm)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--primary-dark)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--primary)")
          }
        >
          <UserPlus size={16} />
          Invite admin
        </button>
      </div>

      {/* Card */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Toolbar */}
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
              onChange={(e) => setQuery(e.target.value)}
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
                  onClick={() => setFilter(f)}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                <th className="px-6 py-3.5 font-semibold">User</th>
                <th className="px-6 py-3.5 font-semibold">Role</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
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
              {filtered.map((u) => {
                const tint = tintFor(u.name);
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
                          {initials(u.name)}
                        </div>
                        <div className="min-w-0">
                          <p
                            className="truncate text-sm font-semibold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {u.name}
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
                      <StatusBadge status={u.status} />
                    </td>
                    <td
                      className="px-6 py-3.5 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {u.joined}
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

              {filtered.length === 0 && (
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
      </div>
    </div>
  );
};

export default AdminUsersPage;
