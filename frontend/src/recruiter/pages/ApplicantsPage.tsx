import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  Mail,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Flag,
  MapPin,
  Briefcase,
  CalendarDays,
  ExternalLink,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useJobApplications } from "../../features/applications/hooks/useJobApplications";
import type {
  Applicant,
  RawApplication,
  ApplicationStatus,
} from "../../features/applications/types/application.types";
import { useUpdateApplicationStatus } from "../../features/applications/hooks/useUpdateApplicationStatus";
import ReportModal from "../../features/reports/components/ReportModal";
import Avatar from "../../shared/components/Avatar";

const API_BASE_URL = import.meta.env.VITE_API_BACKEND_URL;

const getResumeUrl = (resumeUrl: string | null): string | null => {
  if (!resumeUrl) return null;
  if (resumeUrl.startsWith("http")) return resumeUrl;
  return `${API_BASE_URL}${resumeUrl}`;
};
const getInitials = (first: string, last: string): string => {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "?";
};
const getAvatarUrl = (avatar: string | null): string | null => {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;
  return `${API_BASE_URL}${avatar}`;
};
const toApplicant = (raw: RawApplication): Applicant => {
  return {
    id: raw.id,
    userId: raw.user.id,
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
    avatar: getAvatarUrl(raw.user.avatar),
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

const formatHistoryDate = (date: string): string => {
  return new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const ApplicantsPage = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [reportOpen, setReportOpen] = useState(false);
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
      <div className="flex items-center justify-center gap-3 rounded-xl border border-(--border) bg-(--card) px-6 py-16 text-sm text-(--text-secondary)">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--border) border-t-(--primary)" />
        Loading applicants…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-(--border) bg-(--card) px-6 py-16 text-center text-sm text-(--danger)">
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
        <div className="rounded-xl border border-(--border) bg-(--card) px-6 py-16 text-center text-sm text-(--text-secondary)">
          No applicants yet for this job.
        </div>
      </div>
    );
  }

  const selected: Applicant =
    applicants.find((a: Applicant) => a.id === selectedId) ?? applicants[0];
  const selectedStatus: ApplicationStatus =
    localStatus[selected.id] ?? selected.status;
  const history = [...(selected.statusHistory ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-semibold text-(--text-secondary) hover:text-(--text-primary)"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h1 className="font-display text-xl font-bold tracking-tight text-(--text-primary)">
          Applicants{" "}
          <span className="font-medium text-(--text-muted)">({total})</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        {/* Left: filters + table */}
        <div className="min-w-0">
          <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
              />
              <input
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search applicants"
                className="w-full rounded-[10px] border border-(--border) bg-(--card) py-2.5 pl-10 pr-3 text-sm text-(--text-primary) outline-none placeholder:text-(--text-muted) focus:border-(--primary)"
              />
            </div>

            <div className="relative sm:w-44">
              <select
                value={statusFilter}
                onChange={(e) =>
                  handleStatusFilterChange(
                    e.target.value as ApplicationStatus | "ALL",
                  )
                }
                className="w-full cursor-pointer appearance-none rounded-[10px] border border-(--border) bg-(--card) py-2.5 pl-3 pr-9 text-sm font-medium text-(--text-primary) outline-none focus:border-(--primary)"
              >
                {statusFilters.map((s) => (
                  <option key={s} value={s}>
                    {s === "ALL" ? "All statuses" : statusLabel(s)}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-[14px] border border-(--border) bg-(--card) shadow-(--shadow-sm)">
            {/* Column headings */}
            <div className="hidden h-10 grid-cols-[minmax(0,2.2fr)_1fr_1.1fr_40px] items-center gap-3.5 border-b border-(--border) bg-(--bg) px-4 text-[11px] font-bold uppercase tracking-wider text-(--text-muted) sm:grid">
              <span>Name</span>
              <span>Applied</span>
              <span>Status</span>
              <span />
            </div>

            {filtered.length === 0 && (
              <div className="p-10 text-center text-sm text-(--text-secondary)">
                No applicants match your search.
              </div>
            )}

            {filtered.map((a) => {
              const status: ApplicationStatus = localStatus[a.id] ?? a.status;
              const isActive = a.id === selected.id;
              return (
                <div
                  key={a.id}
                  className={`relative grid grid-cols-[minmax(0,1fr)_auto_40px] items-center gap-3.5 border-b border-(--border) px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,2.2fr)_1fr_1.1fr_40px] ${
                    isActive ? "bg-(--primary-light)" : "hover:bg-(--bg)"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-y-0 left-0 w-[3px] bg-(--primary)" />
                  )}
                  <button
                    onClick={() => setSelectedId(a.id)}
                    aria-label={`View ${a.name}`}
                    className="absolute inset-0 cursor-pointer"
                  />

                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar
                      src={a.avatar}
                      initials={a.initials}
                      name={a.name}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-(--text-primary)">
                        {a.name}
                      </p>
                      <p className="truncate text-xs text-(--text-secondary)">
                        {a.currentCompany}
                      </p>
                    </div>
                  </div>

                  <span className="hidden text-sm text-(--text-secondary) sm:block">
                    {formatAppliedAt(a.appliedAt)}
                  </span>

                  <span
                    className={`justify-self-start rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status]}`}
                  >
                    {statusLabel(status)}
                  </span>

                  <a
                    href={`mailto:${a.email}`}
                    aria-label={`Message ${a.name}`}
                    className="relative z-10 flex h-8 w-8 items-center justify-center justify-self-end rounded-lg border border-(--border) bg-(--card) text-(--text-secondary) hover:bg-(--bg) hover:text-(--text-primary)"
                  >
                    <Mail size={15} />
                  </a>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-(--border) px-4 py-3">
                <p className="text-xs text-(--text-secondary)">
                  Page {page} of {totalPages} · {total} total
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || isFetching}
                    aria-label="Previous page"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-(--border) text-(--text-secondary) hover:bg-(--bg) hover:text-(--text-primary) disabled:opacity-40 disabled:hover:bg-transparent"
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
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
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
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-(--border) text-(--text-secondary) hover:bg-(--bg) hover:text-(--text-primary) disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: detail panel */}
        <aside className="lg:sticky lg:top-4">
          <div className="rounded-[14px] border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) sm:p-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-(--primary) text-base font-bold text-white">
                <Avatar
                  src={selected.avatar}
                  initials={selected.initials}
                  className="h-13 w-13 bg-(--primary) text-base text-white"
                />
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-display text-lg font-bold tracking-tight text-(--text-primary)">
                  {selected.name}
                </h2>
                <p className="truncate text-sm text-(--text-secondary)">
                  {selected.jobTitle}
                </p>
                <span
                  className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[selectedStatus]}`}
                >
                  {statusLabel(selectedStatus)}
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-(--text-secondary)">
              <div className="flex items-center gap-2.5">
                <Briefcase size={15} className="shrink-0 text-(--text-muted)" />
                <span className="font-medium text-(--text-primary)">
                  {selected.currentCompany}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={15} className="shrink-0 text-(--text-muted)" />
                <span className="font-medium text-(--text-primary)">
                  {selected.location}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CalendarDays
                  size={15}
                  className="shrink-0 text-(--text-muted)"
                />
                <span>
                  Applied{" "}
                  <span className="font-medium text-(--text-primary)">
                    {formatAppliedAt(selected.appliedAt)}
                  </span>
                </span>
              </div>
            </div>

            {selected.resumeUrl && (
              <a
                href={selected.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center gap-2.5 rounded-[10px] border border-(--border) px-3 py-2.5 text-sm font-semibold text-(--primary) hover:bg-(--primary-light)"
              >
                <FileText size={16} />
                View resume
                <ExternalLink
                  size={14}
                  className="ml-auto text-(--text-muted)"
                />
              </a>
            )}

            <div className="mt-6">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-(--text-muted)">
                About
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">
                {selected.about}
              </p>
            </div>

            {selected.coverLetter && (
              <div className="mt-6">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-(--text-muted)">
                  Cover Letter
                </h3>
                <p className="mt-2 whitespace-pre-wrap rounded-r-[10px] border-l-[3px] border-(--primary) bg-(--bg) px-3.5 py-3 text-sm leading-relaxed text-(--text-secondary)">
                  {selected.coverLetter}
                </p>
              </div>
            )}

            {selected.skills.length > 0 && (
              <div className="mt-6">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-(--text-muted)">
                  Required Skills
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selected.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-(--border) bg-(--bg) px-2.5 py-0.5 text-xs font-medium text-(--text-secondary)"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {history.length > 0 && (
              <div className="mt-6">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-(--text-muted)">
                  Application History
                </h3>
                <ul className="mt-3">
                  {history.map((h, idx) => (
                    <li
                      key={`${h.status}-${h.createdAt}`}
                      className="relative pb-4 pl-5 text-sm last:pb-0"
                    >
                      <span
                        className={`absolute left-0 top-1.5 h-2 w-2 rounded-full ${
                          idx === 0 ? "bg-(--primary)" : "bg-(--text-muted)"
                        }`}
                      />
                      {idx < history.length - 1 && (
                        <span className="absolute bottom-0 left-[3.5px] top-4 w-px bg-(--border)" />
                      )}
                      <p className="font-medium text-(--text-primary)">
                        {statusLabel(h.status)}
                      </p>
                      <p className="text-xs text-(--text-muted)">
                        {formatHistoryDate(h.createdAt)}
                      </p>
                      {h.note && (
                        <p className="mt-0.5 text-xs text-(--text-secondary)">
                          {h.note}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-2 border-t border-(--border) pt-5">
              {selectedStatus === "PENDING" && (
                <button
                  onClick={() => setStatusFor(selected.id, "REVIEWING")}
                  disabled={updateStatusMutation.isPending}
                  className="rounded-[10px] bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:bg-(--primary-dark) disabled:opacity-50"
                >
                  Start reviewing
                </button>
              )}

              {selectedStatus === "REVIEWING" && (
                <button
                  onClick={() => setStatusFor(selected.id, "SHORTLISTED")}
                  disabled={updateStatusMutation.isPending}
                  className="rounded-[10px] bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:bg-(--primary-dark) disabled:opacity-50"
                >
                  Shortlist
                </button>
              )}

              {selectedStatus === "SHORTLISTED" && (
                <button
                  onClick={() => setStatusFor(selected.id, "ACCEPTED")}
                  disabled={updateStatusMutation.isPending}
                  className="rounded-[10px] bg-(--success) px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
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
                    className="rounded-[10px] border border-(--border) bg-(--card) px-4 py-2 text-sm font-semibold text-(--danger) hover:bg-(--danger-bg) disabled:opacity-50"
                  >
                    Reject
                  </button>
                )}

              <a
                href={`mailto:${selected.email}`}
                className="flex items-center gap-2 rounded-[10px] border border-(--border) bg-(--card) px-4 py-2 text-sm font-semibold text-(--text-secondary) hover:bg-(--bg)"
              >
                <Mail size={16} />
                Message
              </a>

              <button
                onClick={() => setReportOpen(true)}
                className="flex items-center gap-2 rounded-[10px] border border-(--border) bg-(--card) px-4 py-2 text-sm font-semibold text-(--danger) hover:bg-(--danger-bg) sm:ml-auto"
              >
                <Flag size={16} />
                Report
              </button>
            </div>

            {updateStatusMutation.isError && (
              <p className="mt-2 text-xs text-(--danger)">
                Couldn't update status. Please try again.
              </p>
            )}
          </div>
        </aside>
      </div>
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        target={{
          type: "user",
          reportedUserId: selected.userId,
          label: selected.name,
        }}
      />
    </div>
  );
};

export default ApplicantsPage;
