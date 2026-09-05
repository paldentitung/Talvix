"use client";

import { useMemo, useState } from "react";
import { Search, MoreHorizontal, Briefcase, ChevronDown } from "lucide-react";

// ---------------------------------------------------------------------------
// Types & mock data
// ---------------------------------------------------------------------------

type JobStatus = "Live" | "Under review" | "Closed";

interface Job {
  id: string;
  title: string;
  company: string;
  applicants: number;
  flagged: number;
  status: JobStatus;
}

const JOBS: Job[] = [
  {
    id: "j1",
    title: "Senior Product Designer",
    company: "Linear",
    applicants: 128,
    flagged: 0,
    status: "Live",
  },
  {
    id: "j2",
    title: "Staff Software Engineer",
    company: "Vercel",
    applicants: 96,
    flagged: 0,
    status: "Live",
  },
  {
    id: "j3",
    title: "Growth Marketer — Crypto",
    company: "Anon Corp",
    applicants: 12,
    flagged: 3,
    status: "Under review",
  },
  {
    id: "j4",
    title: "Sales Development Rep",
    company: "Stripe",
    applicants: 68,
    flagged: 0,
    status: "Live",
  },
  {
    id: "j5",
    title: "Data Analyst",
    company: "Ashby",
    applicants: 41,
    flagged: 0,
    status: "Live",
  },
];

const FILTERS = ["All", "Live", "Under review", "Flagged", "Closed"] as const;
type Filter = (typeof FILTERS)[number];

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: JobStatus }) {
  const styles: Record<JobStatus, { bg: string; fg: string }> = {
    Live: { bg: "var(--success-bg)", fg: "var(--success)" },
    "Under review": { bg: "var(--warning-bg)", fg: "var(--warning)" },
    Closed: { bg: "#F1F5F9", fg: "var(--text-secondary)" },
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

function FlaggedBadge({ count }: { count: number }) {
  if (count === 0) {
    return (
      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
        0
      </span>
    );
  }
  return (
    <span
      className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-2 py-1 text-xs font-bold"
      style={{ background: "var(--danger-bg)", color: "var(--danger)" }}
    >
      {count}
    </span>
  );
}

function RowMenu({
  jobId,
  open,
  onToggle,
}: {
  jobId: string;
  open: boolean;
  onToggle: (id: string | null) => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={() => onToggle(open ? null : jobId)}
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
            View job
          </button>
          <button className="block w-full px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
            View applicants
          </button>
          <button
            className="block w-full px-3.5 py-2 text-left text-sm hover:bg-red-50"
            style={{ color: "var(--danger)" }}
          >
            Take down
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const AdminJobsPage = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return JOBS.filter((j) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Live" && j.status === "Live") ||
        (filter === "Under review" && j.status === "Under review") ||
        (filter === "Closed" && j.status === "Closed") ||
        (filter === "Flagged" && j.flagged > 0);

      const q = query.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q);

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
            Jobs
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            48,190 active job listings
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
              placeholder="Search jobs..."
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
                <th className="px-6 py-3.5 font-semibold">Job</th>
                <th className="px-6 py-3.5 font-semibold">Company</th>
                <th className="px-6 py-3.5 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Applicants
                    <ChevronDown size={12} />
                  </span>
                </th>
                <th className="px-6 py-3.5 font-semibold">Flagged</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((j) => (
                <tr
                  key={j.id}
                  className="border-t transition-colors hover:bg-slate-50/70"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                        style={{
                          background: "var(--primary-light)",
                          color: "var(--primary)",
                        }}
                      >
                        <Briefcase size={16} />
                      </div>
                      <p
                        className="truncate text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {j.title}
                      </p>
                    </div>
                  </td>
                  <td
                    className="px-6 py-3.5 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {j.company}
                  </td>
                  <td
                    className="px-6 py-3.5 text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {j.applicants}
                  </td>
                  <td className="px-6 py-3.5">
                    <FlaggedBadge count={j.flagged} />
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={j.status} />
                  </td>
                  <td
                    className="px-6 py-3.5 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-end">
                      <RowMenu
                        jobId={j.id}
                        open={openMenuId === j.id}
                        onToggle={setOpenMenuId}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      No jobs match your search
                    </p>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Try a different title, company, or filter.
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

export default AdminJobsPage;
