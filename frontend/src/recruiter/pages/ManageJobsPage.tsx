import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Star,
  Lock,
  Unlock,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { Job, JobStatus } from "../../features/jobs/types/job.types";
import { useRecruiterJobs } from "../../features/jobs/hooks/useRecruiterJobs";
import { useUpdateJobStatus } from "../../features/jobs/hooks/useUpdateJobStatus";

const statusStyles: Record<JobStatus, string> = {
  OPEN: "bg-(--success-bg) text-(--success)",
  DRAFT: "bg-(--border) text-(--text-secondary)",
  CLOSED: "bg-(--danger-bg) text-(--danger)",
};
const statusActions: Record<
  JobStatus,
  { label: string; next: JobStatus } | null
> = {
  DRAFT: { label: "Publish", next: "OPEN" },
  OPEN: { label: "Close", next: "CLOSED" },
  CLOSED: { label: "Reopen", next: "OPEN" },
};
const statusActionIcons: Record<JobStatus, typeof Lock> = {
  DRAFT: Unlock,
  OPEN: Lock,
  CLOSED: RotateCcw,
};

const formatSalary = (job: Job) => {
  if (!job.salaryMin && !job.salaryMax) return "Not disclosed";
  const fmt = (n: number) => `${job.currency} ${(n / 1000).toFixed(0)}k`;
  if (job.salaryMin && job.salaryMax)
    return `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)}`;
  return fmt(job.salaryMin ?? job.salaryMax ?? 0);
};

const formatDeadline = (deadline: string | null) => {
  if (!deadline) return "No deadline";
  return new Date(deadline).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const statusFilters: (JobStatus | "ALL")[] = ["ALL", "OPEN", "DRAFT", "CLOSED"];

const ManageJobsPage = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<JobStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isFetching } = useRecruiterJobs(page, limit);

  const jobs = data?.jobs ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 1;
  const { mutate: updateStatus, isPending } = useUpdateJobStatus();

  const filteredJobs = useMemo(() => {
    return jobs.filter((job: Job) => {
      const matchesStatus = status === "ALL" || job.status === status;
      const matchesQuery = job.title
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [jobs, query, status]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleStatusChange = (value: JobStatus | "ALL") => {
    setStatus(value);
    setPage(1);
  };

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).filter(
      (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
    );
  }, [totalPages, page]);

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
          />
          <input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search jobs"
            className="w-full rounded-(--radius-md) border border-(--border) bg-(--card) py-2 pl-9 pr-3 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                status === s
                  ? "bg-(--primary) text-white"
                  : "bg-(--card) text-(--text-secondary) border border-(--border) hover:bg-(--bg)"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {filteredJobs.length === 0 && (
        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-8 text-center text-sm text-(--text-secondary)">
          No jobs match your search.
        </div>
      )}

      {/* Table — desktop / tablet */}
      {filteredJobs.length > 0 && (
        <div className="hidden overflow-hidden rounded-(--radius-lg) border border-(--border) bg-(--card) shadow-(--shadow-sm) sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--border) bg-(--bg)">
                <th className="px-4 py-3 text-left font-medium text-(--text-secondary)">
                  Job
                </th>
                <th className="px-4 py-3 text-left font-medium text-(--text-secondary)">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-(--text-secondary)">
                  Applicants
                </th>
                <th className="px-4 py-3 text-left font-medium text-(--text-secondary)">
                  Deadline
                </th>
                <th className="px-4 py-3 text-left font-medium text-(--text-secondary)">
                  Salary
                </th>
                <th className="px-4 py-3 text-left font-medium text-(--text-secondary)">
                  Openings
                </th>
                <th className="px-4 py-3 text-right font-medium text-(--text-secondary)">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border)">
              {filteredJobs.map((job: Job) => {
                const action = statusActions[job.status];
                const ActionIcon = statusActionIcons[job.status];

                return (
                  <tr
                    key={job.id}
                    className="transition-colors hover:bg-(--bg)"
                  >
                    <td className="max-w-[220px] px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-semibold text-(--text-primary)">
                          {job.title}
                        </span>
                        {job.featured && (
                          <Star
                            size={13}
                            className="shrink-0 fill-(--warning) text-(--warning)"
                          />
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[job.status]}`}
                      >
                        {job.status.charAt(0) +
                          job.status.slice(1).toLowerCase()}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-(--text-primary)">
                      {job.applicationsCount ?? 0}
                    </td>

                    <td className="px-4 py-3 text-(--text-secondary)">
                      {formatDeadline(job.deadline)}
                    </td>

                    <td className="px-4 py-3 text-(--text-secondary)">
                      {formatSalary(job)}
                    </td>

                    <td className="px-4 py-3 text-(--text-secondary)">
                      {job.openings ?? "—"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`${job.id}`}
                          className="rounded-(--radius-md) bg-(--primary) px-3 py-1.5 text-xs font-semibold text-white hover:bg-(--primary-dark)"
                        >
                          Manage
                        </Link>
                        <Link
                          to={`/recruiter/applicants/${job.id}`}
                          className="rounded-(--radius-md) border border-(--border) px-3 py-1.5 text-xs font-semibold text-(--text-secondary) hover:bg-(--bg) hover:text-(--text-primary)"
                        >
                          Applicants
                        </Link>
                        {action && (
                          <button
                            disabled={isPending}
                            onClick={() =>
                              updateStatus({
                                jobId: job.id,
                                status: action.next,
                              })
                            }
                            aria-label={action.label}
                            title={action.label}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-(--radius-md) border border-(--border) text-(--text-secondary) hover:bg-(--bg) hover:text-(--text-primary) disabled:opacity-50"
                          >
                            <ActionIcon size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Stacked cards — mobile only */}
      {filteredJobs.length > 0 && (
        <div className="flex flex-col gap-3 sm:hidden">
          {filteredJobs.map((job: Job) => {
            const action = statusActions[job.status];
            const ActionIcon = statusActionIcons[job.status];

            return (
              <div
                key={job.id}
                className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-4 shadow-(--shadow-sm)"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <h3 className="truncate text-sm font-semibold text-(--text-primary)">
                      {job.title}
                    </h3>
                    {job.featured && (
                      <Star
                        size={14}
                        className="shrink-0 fill-(--warning) text-(--warning)"
                      />
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[job.status]}`}
                  >
                    {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-(--text-secondary)">
                  <div>
                    <span className="font-medium text-(--text-primary)">
                      {job.applicationsCount ?? 0}
                    </span>{" "}
                    applicants
                  </div>
                  <div>{formatDeadline(job.deadline)}</div>
                  <div>{formatSalary(job)}</div>
                  <div>{job.openings ?? "—"} openings</div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Link
                    to={`${job.id}`}
                    className="flex-1 rounded-(--radius-md) bg-(--primary) py-2 text-center text-sm font-semibold text-white hover:bg-(--primary-dark)"
                  >
                    Manage
                  </Link>
                  <Link
                    to={`/recruiter/applicants/${job.id}`}
                    className="flex-1 rounded-(--radius-md) border border-(--border) py-2 text-center text-sm font-semibold text-(--text-secondary) hover:bg-(--bg) hover:text-(--text-primary)"
                  >
                    View applicants
                  </Link>
                  {action && (
                    <button
                      disabled={isPending}
                      onClick={() =>
                        updateStatus({ jobId: job.id, status: action.next })
                      }
                      aria-label={action.label}
                      title={action.label}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius-md) border border-(--border) text-(--text-secondary) hover:bg-(--bg) hover:text-(--text-primary) disabled:opacity-50"
                    >
                      <ActionIcon size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-2 flex flex-col gap-3 border-t border-(--border) pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-(--text-secondary)">
            Page {page} of {totalPages} · {total} total jobs
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isFetching}
              aria-label="Previous page"
              className="flex h-8 w-8 items-center justify-center rounded-(--radius-md) border border-(--border) text-(--text-secondary) hover:bg-(--bg) hover:text-(--text-primary) disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={16} />
            </button>

            {pageNumbers.map((p, idx) => (
              <span key={p} className="flex items-center">
                {idx > 0 && pageNumbers[idx - 1] !== p - 1 && (
                  <span className="px-1 text-xs text-(--text-muted)">…</span>
                )}
                <button
                  onClick={() => setPage(p)}
                  disabled={isFetching}
                  className={`flex h-8 w-8 items-center justify-center rounded-(--radius-md) text-xs font-semibold transition-colors ${
                    p === page
                      ? "bg-(--primary) text-white"
                      : "text-(--text-secondary) hover:bg-(--bg) hover:text-(--text-primary)"
                  }`}
                >
                  {p}
                </button>
              </span>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isFetching}
              aria-label="Next page"
              className="flex h-8 w-8 items-center justify-center rounded-(--radius-md) border border-(--border) text-(--text-secondary) hover:bg-(--bg) hover:text-(--text-primary) disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobsPage;
