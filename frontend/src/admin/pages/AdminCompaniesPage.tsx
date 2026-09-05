"use client";

import { useMemo, useState } from "react";
import { Search, MoreHorizontal, Building2, ChevronDown } from "lucide-react";

// ---------------------------------------------------------------------------
// Types & mock data
// ---------------------------------------------------------------------------

type Plan = "Enterprise" | "Business" | "Starter";
type CompanyStatus = "Active" | "Trial" | "Suspended";

interface Company {
  id: string;
  name: string;
  plan: Plan;
  activeJobs: number;
  hiresYtd: number;
  status: CompanyStatus;
}

const COMPANIES: Company[] = [
  {
    id: "c1",
    name: "Linear",
    plan: "Enterprise",
    activeJobs: 12,
    hiresYtd: 34,
    status: "Active",
  },
  {
    id: "c2",
    name: "Vercel",
    plan: "Enterprise",
    activeJobs: 22,
    hiresYtd: 51,
    status: "Active",
  },
  {
    id: "c3",
    name: "Notion",
    plan: "Business",
    activeJobs: 8,
    hiresYtd: 19,
    status: "Active",
  },
  {
    id: "c4",
    name: "Stripe",
    plan: "Enterprise",
    activeJobs: 41,
    hiresYtd: 128,
    status: "Active",
  },
  {
    id: "c5",
    name: "Ashby",
    plan: "Business",
    activeJobs: 6,
    hiresYtd: 14,
    status: "Active",
  },
  {
    id: "c6",
    name: "Loom",
    plan: "Starter",
    activeJobs: 3,
    hiresYtd: 6,
    status: "Trial",
  },
];

const FILTERS = ["All", "Enterprise", "Business", "Starter", "Trial"] as const;
type Filter = (typeof FILTERS)[number];

// A small, stable palette of avatar tints, matching the Users page pattern.
const AVATAR_TINTS = [
  { bg: "#EEF2FF", fg: "#4F46E5" },
  { bg: "#F0FDFA", fg: "#0D9488" },
  { bg: "#FDF4FF", fg: "#A21CAF" },
  { bg: "#FFF7ED", fg: "#C2410C" },
  { bg: "#EFF6FF", fg: "#2563EB" },
];

function tintFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_TINTS[Math.abs(hash) % AVATAR_TINTS.length];
}

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------

function PlanBadge({ plan }: { plan: Plan }) {
  const styles: Record<Plan, { bg: string; fg: string }> = {
    Enterprise: { bg: "var(--primary-light)", fg: "var(--primary)" },
    Business: { bg: "var(--accent-light)", fg: "var(--accent)" },
    Starter: { bg: "#F1F5F9", fg: "var(--text-secondary)" },
  };
  const s = styles[plan];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      {plan}
    </span>
  );
}

function StatusBadge({ status }: { status: CompanyStatus }) {
  const styles: Record<CompanyStatus, { bg: string; fg: string }> = {
    Active: { bg: "var(--success-bg)", fg: "var(--success)" },
    Trial: { bg: "var(--warning-bg)", fg: "var(--warning)" },
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
  companyId,
  open,
  onToggle,
}: {
  companyId: string;
  open: boolean;
  onToggle: (id: string | null) => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={() => onToggle(open ? null : companyId)}
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
            View company
          </button>
          <button className="block w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            Change plan
          </button>
          <button
            className="block w-full px-3.5 py-2 text-left text-sm hover:bg-red-50"
            style={{ color: "var(--danger)" }}
          >
            Suspend company
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const AdminCompaniesPage = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return COMPANIES.filter((c) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Enterprise" && c.plan === "Enterprise") ||
        (filter === "Business" && c.plan === "Business") ||
        (filter === "Starter" && c.plan === "Starter") ||
        (filter === "Trial" && c.status === "Trial");

      const q = query.trim().toLowerCase();
      const matchesQuery = q === "" || c.name.toLowerCase().includes(q);

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
            Companies
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            9,238 companies actively hiring
          </p>
        </div>
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
              placeholder="Search companies..."
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
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                <th className="px-6 py-3.5 font-semibold">Company</th>
                <th className="px-6 py-3.5 font-semibold">Plan</th>
                <th className="px-6 py-3.5 font-semibold">Active jobs</th>
                <th className="px-6 py-3.5 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Hires (YTD)
                    <ChevronDown size={12} />
                  </span>
                </th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const tint = tintFor(c.name);
                return (
                  <tr
                    key={c.id}
                    className="border-t transition-colors hover:bg-slate-50/70"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                          style={{ background: tint.bg, color: tint.fg }}
                        >
                          <Building2 size={16} />
                        </div>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {c.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <PlanBadge plan={c.plan} />
                    </td>
                    <td
                      className="px-6 py-3.5 text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {c.activeJobs}
                    </td>
                    <td
                      className="px-6 py-3.5 text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {c.hiresYtd}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={c.status} />
                    </td>
                    <td
                      className="px-6 py-3.5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-end">
                        <RowMenu
                          companyId={c.id}
                          open={openMenuId === c.id}
                          onToggle={setOpenMenuId}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      No companies match your search
                    </p>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Try a different name or filter.
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

export default AdminCompaniesPage;
