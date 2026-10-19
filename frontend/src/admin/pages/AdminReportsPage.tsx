import { useEffect, useState } from "react";
import { Briefcase, User as UserIcon } from "lucide-react";
import Pagination from "../../shared/components/Pagination";
import RowMenu from "../../shared/components/RowMenu";
import relativeTime from "../../shared/utils/relativeTime";
import { fullName } from "../../shared/utils/getFullname";
import type { Report } from "../../features/reports/types/report.types";
import {
  ReasonBadge,
  StatusBadge,
} from "../../features/reports/components/ReportBadges";
import { useNavigate } from "react-router-dom";
import { useReports } from "../../features/reports/hooks/useReports";
import { useUpdateReportStatus } from "../../features/reports/hooks/useUpdateReportStatus";
import ReportStatusConfirmModal, {
  type PendingStatus,
} from "../../features/reports/components/ReportStatusConfirmModal";
import toast from "react-hot-toast";
const FILTERS = ["All", "PENDING", "RESOLVED", "DISMISSED"] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_LABELS: Record<Filter, string> = {
  All: "All",
  PENDING: "Pending",
  RESOLVED: "Resolved",
  DISMISSED: "Dismissed",
};

const COLUMN_COUNT = 6;
const PAGE_SIZE = 10;

function TargetCell({ report }: { report: Report }) {
  if (report.job) {
    return (
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
        <div className="min-w-0">
          <p
            className="truncate text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {report.job.title}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Job
          </p>
        </div>
      </div>
    );
  }

  if (report.reportedUser) {
    return (
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--accent-light)", color: "var(--accent)" }}
        >
          <UserIcon size={16} />
        </div>
        <div className="min-w-0">
          <p
            className="truncate text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {fullName(report.reportedUser)}
          </p>
          <p
            className="truncate text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            {report.reportedUser.email}
          </p>
        </div>
      </div>
    );
  }

  return (
    <span className="text-sm" style={{ color: "var(--text-muted)" }}>
      Target unavailable
    </span>
  );
}

const AdminReportsPage = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState<Filter>("All");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [pending, setPending] = useState<{
    reportId: string;
    status: PendingStatus;
  } | null>(null);

  const { data, isLoading, isFetching, isError, error } = useReports(
    page,
    PAGE_SIZE,
    filter === "All" ? undefined : filter,
  );
  const { mutate: updateStatus, isPending } = useUpdateReportStatus();

  const reports: Report[] = data?.reports ?? [];
  const total = data?.pagination?.totalReports ?? 0;
  const totalPages = Math.max(1, data?.pagination?.totalPages ?? 1);

  const requestStatusChange = (reportId: string, status: PendingStatus) => {
    setPending({ reportId, status });
    setOpenMenuId(null);
  };

  const handleConfirm = () => {
    if (!pending) return;
    updateStatus(pending, {
      onSuccess: () => {
        setPending(null);
        toast.success("Report updated");
      },
      onError: () => toast.error("Failed to update report. Please try again."),
    });
  };

  // If the last item on a page is actioned under a filter, step back.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

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
        {/* Toolbar */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b p-5"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h2
              className="font-display text-base font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Reports
            </h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Review jobs and users flagged by the community.
            </p>
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
                  aria-pressed={active}
                  className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer"
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
          <table className="w-full min-w-[920px] border-collapse text-left">
            <thead>
              <tr
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                <th className="px-6 py-3.5 font-semibold">Reported</th>
                <th className="px-6 py-3.5 font-semibold">Reason</th>
                <th className="px-6 py-3.5 font-semibold">Reporter</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold">Date</th>
                <th className="px-6 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={COLUMN_COUNT}
                    className="px-6 py-16 text-center text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Loading reports…
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td
                    colSpan={COLUMN_COUNT}
                    className="px-6 py-16 text-center text-sm"
                    style={{ color: "var(--danger)" }}
                  >
                    {error?.message ??
                      "Couldn't load reports. Please try again."}
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                reports.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t transition-colors hover:bg-slate-50/70 cursor-pointer"
                    style={{ borderColor: "var(--border)" }}
                    onClick={() => navigate(`/admin/reports/${r.id}`)}
                  >
                    <td className="px-6 py-3.5">
                      <TargetCell report={r} />
                    </td>
                    <td className="max-w-[260px] px-6 py-3.5">
                      <ReasonBadge reason={r.reason} />
                      {r.description && (
                        <p
                          className="mt-1.5 line-clamp-2 text-xs"
                          style={{ color: "var(--text-secondary)" }}
                          title={r.description}
                        >
                          {r.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <p
                        className="truncate text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {r.reporter ? fullName(r.reporter) : "Unknown reporter"}
                      </p>
                      <p
                        className="truncate text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {r.reporter?.email || ""}
                      </p>
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={r.status} />
                    </td>
                    <td
                      className="px-6 py-3.5 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {relativeTime(r.createdAt)}
                    </td>
                    <td
                      className="px-6 py-3.5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-end">
                        <RowMenu
                          id={r.id}
                          open={openMenuId === r.id}
                          onToggle={setOpenMenuId}
                          items={[
                            {
                              label: "View details",
                              onClick: () => navigate(`/admin/reports/${r.id}`),
                            },
                            ...(r.status === "PENDING"
                              ? [
                                  {
                                    label: "Resolve",
                                    onClick: () =>
                                      requestStatusChange(r.id, "RESOLVED"),
                                  },
                                  {
                                    label: "Dismiss",
                                    onClick: () =>
                                      requestStatusChange(r.id, "DISMISSED"),
                                    danger: true,
                                  },
                                ]
                              : [
                                  {
                                    label: "Reopen",
                                    onClick: () =>
                                      requestStatusChange(r.id, "PENDING"),
                                  },
                                ]),
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                ))}

              {!isLoading && !isError && reports.length === 0 && (
                <tr>
                  <td colSpan={COLUMN_COUNT} className="px-6 py-16 text-center">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      No reports found
                    </p>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Try a different status filter.
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
          itemLabel="reports"
          isFetching={isFetching}
        />
      </div>
      <ReportStatusConfirmModal
        status={pending?.status ?? null}
        isPending={isPending}
        onConfirm={handleConfirm}
        onClose={() => setPending(null)}
      />
    </div>
  );
};

export default AdminReportsPage;
