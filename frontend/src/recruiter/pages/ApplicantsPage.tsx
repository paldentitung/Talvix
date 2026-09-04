import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  Mail,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useJobApplications } from "../../features/applications/hooks/useJobApplications";
import type {
  Applicant,
  RawApplication,
  ApplicationStatus,
} from "../../features/applications/types/application.types";
import { useUpdateApplicationStatus } from "../../features/applications/hooks/useUpdateApplicationStatus";

const API_BASE_URL = import.meta.env.VITE_API_BACKEND_URL;

const getResumeUrl = (resumeUrl: string | null): string | null => {
  if (!resumeUrl) return null;
  if (resumeUrl.startsWith("http")) return resumeUrl; // already absolute
  return `${API_BASE_URL}${resumeUrl}`;
};
const getInitials = (first: string, last: string): string => {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "?";
};

const toApplicant = (raw: RawApplication): Applicant => {
  return {
    id: raw.id,
    initials: getInitials(raw.user.firstName, raw.user.lastName),
    name: `${raw.user.firstName} ${raw.user.lastName}`.trim(),
    jobTitle: raw.job.title,
    status: raw.status,
    statusHistory: raw.statusHistory,
    appliedAt: raw.appliedAt,
    about: raw.user.bio ?? "No bio provided.",
    currentCompany: raw.user.title ?? "Not specified",
    location: raw.user.location ?? raw.job.location,
    skills: raw.job.skills ?? [],
    resumeUrl: getResumeUrl(raw.resumeUrl),
    coverLetter: raw.coverLetter,
    email: raw.user.email,
  };
};

const statusStyles: Record<ApplicationStatus, string> = {
  PENDING: "bg-(--border) text-(--text-secondary)",
  REVIEWING: "bg-(--primary-light) text-(--primary)",
  SHORTLISTED: "bg-(--success-bg) text-(--success)",
  REJECTED: "bg-(--danger-bg) text-(--danger)",
  ACCEPTED: "bg-(--accent-light) text-(--accent)",
  WITHDRAWN: "bg-(--warning-bg) text-(--warning)",
};

const statusLabel = (status: ApplicationStatus): string => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

const statusFilters: (ApplicationStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "ACCEPTED",
  "WITHDRAWN",
];

const formatAppliedAt = (date: string): string => {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const ApplicantsPage = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, error, isLoading, isFetching } = useJobApplications(
    id,
    page,
    limit,
  );
  const applicants = useMemo(
    () => (data?.applications ?? []).map(toApplicant),
    [data?.applications],
  );
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const navigate = useNavigate();

  const [query, setQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">(
    "ALL",
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState<
    Record<string, ApplicationStatus>
  >({});
  const updateStatusMutation = useUpdateApplicationStatus();

  const filtered: Applicant[] = useMemo(() => {
    return applicants.filter((a: Applicant) => {
      const status: ApplicationStatus = localStatus[a.id] ?? a.status;
      const matchesStatus = statusFilter === "ALL" || status === statusFilter;
      const matchesQuery = a.name.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [applicants, query, statusFilter, localStatus]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: ApplicationStatus | "ALL") => {
    setStatusFilter(value);
    setPage(1);
  };

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).filter(
      (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
    );
  }, [totalPages, page]);

  const setStatusFor = (
    applicantId: string,
    status: ApplicationStatus,
  ): void => {
    updateStatusMutation.mutate(
      { applicationId: applicantId, status },
      {
        onSuccess: () => {
          setLocalStatus((prev) => ({ ...prev, [applicantId]: status }));
        },
        onError: (error) => {
          console.error("Failed to update status:", error);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-(--border) bg-(--card) p-6 text-center text-sm text-(--text-secondary)">
        Loading applicants…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-(--border) bg-(--card) p-6 text-center text-sm text-(--danger)">
        Couldn't load applicants. Please try again.
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-(--text-secondary) hover:text-(--text-primary)"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="rounded-lg border border-(--border) bg-(--card) p-6 text-center text-sm text-(--text-secondary)">
          No applicants yet for this job.
        </div>
      </div>
    );
  }

  const selected: Applicant =
    applicants.find((a: Applicant) => a.id === selectedId) ?? applicants[0];
  const selectedStatus: ApplicationStatus =
    localStatus[selected.id] ?? selected.status;

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm font-semibold text-(--text-secondary) hover:text-(--text-primary)"
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-1">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
            />
            <input
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search applicants"
              className="w-full rounded-md border border-(--border) bg-(--card) py-2 pl-9 pr-3 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusFilterChange(s)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  statusFilter === s
                    ? "bg-(--primary) text-white"
                    : "border border-(--border) bg-(--card) text-(--text-secondary) hover:bg-(--bg)"
                }`}
              >
                {s === "ALL" ? "All" : statusLabel(s)}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {filtered.length === 0 && (
              <div className="rounded-lg border border-(--border) bg-(--card) p-6 text-center text-sm text-(--text-secondary)">
                No applicants match your search.
              </div>
            )}

            {filtered.map((a) => {
              const status: ApplicationStatus = localStatus[a.id] ?? a.status;
              const isActive = a.id === selected.id;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedId(a.id)}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                    isActive
                      ? "border-(--primary) bg-(--primary-light)"
                      : "border-(--border) bg-(--card) hover:bg-(--bg)"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--primary-light) text-xs font-semibold text-(--primary)">
                    {a.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-(--text-primary)">
                      {a.name}
                    </p>
                    <p className="truncate text-xs text-(--text-secondary)">
                      {a.jobTitle}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyles[status]}`}
                  >
                    {statusLabel(status)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-(--border) pt-3">
              <p className="text-xs text-(--text-secondary)">
                Page {page} of {totalPages} · {total} total
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  aria-label="Previous page"
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-(--border) text-(--text-secondary) hover:bg-(--bg) hover:text-(--text-primary) disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronLeft size={14} />
                </button>

                {pageNumbers.map((p, idx) => (
                  <span key={p} className="flex items-center">
                    {idx > 0 && pageNumbers[idx - 1] !== p - 1 && (
                      <span className="px-1 text-xs text-(--text-muted)">
                        …
                      </span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      disabled={isFetching}
                      className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold transition-colors ${
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
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-(--border) text-(--text-secondary) hover:bg-(--bg) hover:text-(--text-primary) disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-lg border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-(--primary-light) text-lg font-semibold text-(--primary)">
                  {selected.initials}
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-(--text-primary)">
                    {selected.name}
                  </h2>
                  <p className="text-sm text-(--text-secondary)">
                    {selected.jobTitle}
                  </p>
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedStatus]}`}
              >
                {statusLabel(selectedStatus)}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {selectedStatus === "PENDING" && (
                <button
                  onClick={() => setStatusFor(selected.id, "REVIEWING")}
                  disabled={updateStatusMutation.isPending}
                  className="rounded-md bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:bg-(--primary-dark) disabled:opacity-50"
                >
                  Start reviewing
                </button>
              )}

              {selectedStatus === "REVIEWING" && (
                <button
                  onClick={() => setStatusFor(selected.id, "SHORTLISTED")}
                  disabled={updateStatusMutation.isPending}
                  className="rounded-md bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:bg-(--primary-dark) disabled:opacity-50"
                >
                  Shortlist
                </button>
              )}

              {selectedStatus === "SHORTLISTED" && (
                <button
                  onClick={() => setStatusFor(selected.id, "ACCEPTED")}
                  disabled={updateStatusMutation.isPending}
                  className="rounded-md bg-(--success) px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                >
                  Accept
                </button>
              )}

              {selectedStatus !== "REJECTED" &&
                selectedStatus !== "ACCEPTED" &&
                selectedStatus !== "WITHDRAWN" && (
                  <button
                    onClick={() => setStatusFor(selected.id, "REJECTED")}
                    disabled={updateStatusMutation.isPending}
                    className="rounded-md border border-(--border) bg-(--card) px-4 py-2 text-sm font-semibold text-(--danger) hover:bg-(--danger-bg) disabled:opacity-50"
                  >
                    Reject
                  </button>
                )}

              <a
                href={`mailto:${selected.email}`}
                className="flex items-center gap-2 rounded-md border border-(--border) bg-(--card) px-4 py-2 text-sm font-semibold text-(--text-secondary) hover:bg-(--bg)"
              >
                <Mail size={16} />
                Message candidate
              </a>

              {selected.resumeUrl && (
                <a
                  href={selected.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto flex items-center gap-2 text-sm font-semibold text-(--primary) hover:text-(--primary-dark)"
                >
                  <FileText size={16} />
                  View resume
                </a>
              )}
            </div>

            {updateStatusMutation.isError && (
              <p className="mt-2 text-xs text-(--danger)">
                Couldn't update status. Please try again.
              </p>
            )}

            <div className="mt-6 border-t border-(--border) pt-5">
              <h3 className="text-sm font-semibold text-(--text-primary)">
                About
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">
                {selected.about}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-(--text-secondary)">
                <span>
                  Title:{" "}
                  <span className="font-medium text-(--text-primary)">
                    {selected.currentCompany}
                  </span>
                </span>
                <span>{selected.location}</span>
                <span>Applied {formatAppliedAt(selected.appliedAt)}</span>
              </div>
            </div>

            {selected.coverLetter && (
              <div className="mt-6 border-t border-(--border) pt-5">
                <h3 className="text-sm font-semibold text-(--text-primary)">
                  Cover Letter
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-(--text-secondary)">
                  {selected.coverLetter}
                </p>
              </div>
            )}

            {selected.skills.length > 0 && (
              <div className="mt-6 border-t border-(--border) pt-5">
                <h3 className="text-sm font-semibold text-(--text-primary)">
                  Required Skills
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-(--bg) px-3 py-1 text-xs font-medium text-(--text-secondary)"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsPage;
