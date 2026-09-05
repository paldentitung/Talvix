import { useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  MessageSquare,
  Calendar,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { ApplicationStatus } from "../../features/applications/types/application.types";
import { useCandidateApplication } from "../../features/applications/hooks/useCandidateApplication";
import Button from "../../components/ui/Button";
import { useWithdrawApplication } from "../../features/applications/hooks/useWithdrawApplication";
import Modal from "../../components/ui/Modal";
import { Link } from "react-router-dom";
import type { Application } from "../../features/applications/types/application.types";
type Status =
  | "Applied"
  | "In Review"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Withdrawn";

interface StatusHistoryEntry {
  status: ApplicationStatus;
  note: string | null;
  createdAt: string;
}

// Maps backend enum -> display label used by the UI
const statusLabelMap: Record<ApplicationStatus, Status> = {
  PENDING: "Applied",
  REVIEWING: "In Review",
  SHORTLISTED: "Interview",
  REJECTED: "Rejected",
  ACCEPTED: "Offer",
  WITHDRAWN: "Withdrawn",
};

const statusIconMap: Record<
  ApplicationStatus,
  "check" | "chat" | "calendar" | "clock" | "x"
> = {
  PENDING: "check",
  REVIEWING: "chat",
  SHORTLISTED: "calendar",
  ACCEPTED: "clock",
  REJECTED: "x",
  WITHDRAWN: "x",
};

const filters: { label: string }[] = [
  { label: "All" },
  { label: "Applied" },
  { label: "In Review" },
  { label: "Interview" },
  { label: "Offer" },
  { label: "Rejected" },
  { label: "Withdrawn" },
];

const statusStyles: Record<Status, string> = {
  Applied: "text-[var(--text-secondary)] bg-slate-100",
  "In Review": "text-[var(--warning)] bg-[var(--warning-bg)]",
  Interview: "text-[var(--accent)] bg-[var(--accent-light)]",
  Offer: "text-[var(--success)] bg-[var(--success-bg)]",
  Rejected: "text-[var(--danger)] bg-[var(--danger-bg)]",
  Withdrawn: "text-[var(--text-muted)] bg-slate-200",
};

function TimelineIcon({
  icon,
}: {
  icon: "check" | "chat" | "calendar" | "clock" | "x";
}) {
  const common = { size: 16, color: "var(--accent)", strokeWidth: 2.2 };
  switch (icon) {
    case "check":
      return <CheckCircle2 {...common} />;
    case "chat":
      return <MessageSquare {...common} />;
    case "calendar":
      return <Calendar {...common} />;
    case "clock":
      return <Clock {...common} />;
    case "x":
      return <XCircle {...common} color="var(--danger)" />;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Real timeline: derived directly from the backend's statusHistory records.
// Every entry here is a real, timestamped event — nothing is guessed.
function renderTimeline(history: StatusHistoryEntry[], appliedAt: string) {
  if (history.length === 0) {
    // Fallback only for pre-migration rows with no history rows yet.
    return [
      {
        title: "Applied",
        date: formatDate(appliedAt),
        icon: "check" as const,
      },
    ];
  }
  return history.map((entry) => ({
    title: statusLabelMap[entry.status],
    date: formatDate(entry.createdAt),
    icon: statusIconMap[entry.status],
  }));
}

export default function CandidateApplicationsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isError, isPending } = useCandidateApplication(page, limit);
  const applications: Application[] = data?.data?.applications ?? [];
  const totalApplications = data?.data?.pagination?.total ?? 0;
  const totalPages = data?.data?.pagination?.totalPages ?? 1;

  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const withdrawMutation = useWithdrawApplication();
  const [isOpen, setIsOpen] = useState(false);

  const visible =
    activeFilter === "All"
      ? applications
      : applications.filter((a) => statusLabelMap[a.status] === activeFilter);

  const selected =
    visible.find((a) => a.id === selectedId) ?? visible[0] ?? null;

  const handleWithdraw = () => {
    if (!selected) return;
    withdrawMutation.mutate(selected.id, {
      onSuccess: () => setIsOpen(false),
    });
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <p className="text-[14px] text-[var(--text-muted)]">
          Loading applications…
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <p className="text-[14px] text-[var(--danger)]">
          Something went wrong loading your applications.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => {
          const isActive = activeFilter === f.label;
          const count =
            f.label === "All"
              ? totalApplications
              : applications.filter((a) => statusLabelMap[a.status] === f.label)
                  .length;
          return (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                isActive
                  ? "bg-[var(--primary)] text-white shadow-[var(--shadow-sm)]"
                  : "bg-[var(--card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--primary)]"
              }`}
            >
              {f.label}
              {f.label === "All" ? ` (${count})` : ""}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex gap-5 items-start">
        {/* List */}
        <div className="flex-1 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)] overflow-hidden">
          {visible.map((app, i) => {
            const isSelected = selected?.id === app.id;
            const label = statusLabelMap[app.status];
            return (
              <button
                key={app.id}
                onClick={() => setSelectedId(app.id)}
                className={`flex w-full items-center gap-4 px-6 py-5 text-left transition-colors ${
                  i !== visible.length - 1
                    ? "border-b border-[var(--border)]"
                    : ""
                } ${isSelected ? "bg-[var(--primary-light)]" : "hover:bg-slate-50"}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-slate-100">
                  <Briefcase size={18} color="var(--text-secondary)" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold text-[var(--text-primary)]">
                    {app.job.title}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
                    {app.job.recruiter.companyName ?? "Unknown company"} ·
                    Applied {formatDate(app.appliedAt)}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-medium ${statusStyles[label]}`}
                >
                  {label}
                </span>
              </button>
            );
          })}
          {visible.length === 0 && (
            <div className="px-6 py-16 text-center text-[14px] text-[var(--text-muted)] flex justify-center items-center gap-2 flex-col">
              No applications in this stage yet.
              <Link
                to={"/candidate/jobs"}
                className="ml-1 text-[var(--primary)]"
              >
                <Button size="sm">Browse jobs</Button>
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[var(--border)] px-6 py-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 text-[13px] font-medium text-[var(--text-secondary)] disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Prev
              </button>
              <span className="text-[13px] text-[var(--text-muted)]">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex items-center gap-1 text-[13px] font-medium text-[var(--text-secondary)] disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="w-[340px] shrink-0 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]">
          {!selected ? (
            <p className="text-[14px] text-[var(--text-muted)]">
              Select an application to see details.
            </p>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-slate-100">
                  <Briefcase size={18} color="var(--text-secondary)" />
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-[var(--text-primary)]">
                    {selected.job.title}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
                    {selected.job.recruiter.companyName ?? "Unknown company"} ·{" "}
                    {selected.job.location}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-[12px] font-medium ${statusStyles[statusLabelMap[selected.status]]}`}
                  >
                    {statusLabelMap[selected.status]}
                  </span>
                </div>
              </div>
              <div className="my-5 border-t border-[var(--border)]" />
              <p className="mb-4 text-[13px] font-semibold text-[var(--text-primary)]">
                Application timeline
              </p>
              <div className="relative">
                {renderTimeline(selected.statusHistory, selected.appliedAt).map(
                  (step, i, arr) => (
                    <div key={i} className="relative flex gap-3 pb-6 last:pb-0">
                      {i !== arr.length - 1 && (
                        <span
                          className="absolute left-[7px] top-5 h-[calc(100%-8px)] w-px"
                          style={{ background: "var(--accent)" }}
                        />
                      )}
                      <div className="z-10 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                        <TimelineIcon icon={step.icon} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium text-[var(--text-primary)]">
                          {step.title}
                        </p>
                        <p className="text-[12px] text-[var(--text-muted)]">
                          {step.date}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
              <button className="mt-2 w-full rounded-[var(--radius-md)] bg-[var(--primary)] py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--primary-dark)]">
                Message recruiter
              </button>{" "}
              {selected.status === "PENDING" ||
              selected.status === "REVIEWING" ? (
                <Button
                  onClick={() => setIsOpen(true)}
                  disabled={withdrawMutation.isPending}
                  className="bg-red-500 hover:bg-red-600 w-full mt-2"
                >
                  Withdraw
                </Button>
              ) : null}
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Withdrawal"
        description="Are you sure you want to withdraw your application? This action cannot be undone."
        maxWidth="max-w-sm"
      >
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleWithdraw}
            disabled={withdrawMutation.isPending}
            className="bg-red-500 hover:bg-red-600"
          >
            {withdrawMutation.isPending ? "Withdrawing..." : "Withdraw"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
