import { useState } from "react";
import { Search, Briefcase, ChevronDown } from "lucide-react";
import { useAdminJobs } from "../../features/jobs/hooks/useAdminJobs";
import Pagination from "../../shared/components/Pagination";
import RowMenu from "../../shared/components/RowMenu";
import { useUpdateJobStatus } from "../../features/jobs/hooks/useUpdateJobStatus";
import type { Job, JobStatus } from "../../features/jobs/types/job.types";

const FILTERS = ["All", "OPEN", "DRAFT", "CLOSED"] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_LABELS: Record<Filter, string> = {
  All: "All",
  OPEN: "Live",
  DRAFT: "Draft",
  CLOSED: "Closed",
};

function StatusBadge({ status }: { status: JobStatus }) {
  const styles: Record<JobStatus, { bg: string; fg: string; label: string }> = {
    OPEN: { bg: "var(--success-bg)", fg: "var(--success)", label: "Live" },
    DRAFT: { bg: "var(--danger-bg)", fg: "var(--danger)", label: "Draft" },
    CLOSED: { bg: "var(--warning-bg)", fg: "var(--warning)", label: "Closed" },
  };
  const s = styles[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}

const AdminJobsPage = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const size = 10;

  const { data, isLoading, isError } = useAdminJobs(
    page,
    size,
    query,
    filter !== "All" ? { status: filter as JobStatus } : undefined,
  );

  const { mutate: updateStatus, isPending } = useUpdateJobStatus();

  const jobs: Job[] = data?.data?.jobs ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;

  return (
    <div onClick={() => openMenuId && setOpenMenuId(null)}>
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
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
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
                  {FILTER_LABELS[f]}
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
                <th className="px-6 py-3.5 font-semibold">Status</th>
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
                    Loading jobs…
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
                    Failed to load jobs.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                jobs.map((j) => (
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
                      {j.recruiter?.companyName ?? "—"}
                    </td>
                    <td
                      className="px-6 py-3.5 text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {j.applicationsCount ?? 0}
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
                          id={j.id}
                          open={openMenuId === j.id}
                          onToggle={setOpenMenuId}
                          items={[
                            {
                              label: "View job",
                              onClick: () => console.log("view", j.id),
                            },
                            {
                              label: "View applicants",
                              onClick: () => console.log("applicants", j.id),
                            },
                            {
                              label: "Take down",
                              onClick: () =>
                                updateStatus({ jobId: j.id, status: "CLOSED" }),
                              danger: true,
                              disabled: isPending || j.status === "CLOSED",
                            },
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                ))}

              {!isLoading && !isError && jobs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
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

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          total={total}
          itemLabel="jobs"
          isFetching={isLoading}
        />
      </div>
    </div>
  );
};

export default AdminJobsPage;
