import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star, Users, Calendar } from "lucide-react";

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

  const { data: jobs = [] } = useRecruiterJobs();
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs"
            className="w-full rounded-(--radius-md) border border-(--border) bg-(--card) py-2 pl-9 pr-3 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredJobs.length === 0 && (
          <div className="col-span-full rounded-(--radius-lg) border border-(--border) bg-(--card) p-8 text-center text-sm text-(--text-secondary)">
            No jobs match your search.
          </div>
        )}

        {filteredJobs.map((job: Job) => (
          <div
            key={job.id}
            className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-4 shadow-(--shadow-sm) sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-(--text-primary) sm:text-base">
                    {job.title}
                  </h3>
                  {job.featured && (
                    <Star
                      size={14}
                      className="shrink-0 fill-(--warning) text-(--warning)"
                    />
                  )}
                </div>
                {/* <p className="mt-1 text-xs text-(--text-secondary) sm:text-sm">
                  {job.location} · {workModeLabels[job.workMode]} ·{" "}
                  {employmentLabels[job.employmentType]}
                </p> */}
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[job.status]}`}
              >
                {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-(--text-secondary) sm:text-sm">
              <span>{formatSalary(job)}</span>
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                {/* {job.applicationsCount} applicants */}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDeadline(job.deadline)}
              </span>
              {job.openings !== null && (
                <span>
                  {job.openings} opening{job.openings === 1 ? "" : "s"}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center gap-3 border-t border-(--border) pt-3">
              <Link
                to={`${job.id}`}
                className="text-sm font-semibold text-(--primary) hover:text-(--primary-dark)"
              >
                Manage
              </Link>
              <Link
                to={`/recruiter/applicants/${job.id}`}
                className="text-sm font-semibold text-(--text-secondary) hover:text-(--text-primary)"
              >
                View applicants
              </Link>
              {statusActions[job.status] && (
                <button
                  disabled={isPending}
                  onClick={() =>
                    updateStatus({
                      jobId: job.id,
                      status: statusActions[job.status]!.next,
                    })
                  }
                  className="text-sm font-semibold text-(--text-secondary) hover:text-(--text-primary) disabled:opacity-50"
                >
                  {statusActions[job.status]!.label}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageJobsPage;
