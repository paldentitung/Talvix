import { useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Clock,
  Mail,
  User as UserIcon,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { fullName } from "../../shared/utils/getFullname";
import { tintFor } from "../../shared/utils/avatarTint";
import initials from "../../shared/utils/getInitials";
import {
  ReasonBadge,
  StatusBadge,
} from "../../features/reports/components/ReportBadges";
import { useUpdateReportStatus } from "../../features/reports/hooks/useUpdateReportStatus";
import { useReportById } from "../../features/reports/hooks/useReportById";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import ReportStatusConfirmModal, {
  type PendingStatus,
} from "../../features/reports/components/ReportStatusConfirmModal";
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      className="rounded-2xl border"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div
        className="border-b px-6 py-4"
        style={{ borderColor: "var(--border)" }}
      >
        <h3
          className="font-display text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function PersonRow({
  user,
}: {
  user: { firstName: string; lastName: string; email: string };
}) {
  const name = fullName(user);
  const tint = tintFor(name);
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
        style={{ background: tint.bg, color: tint.fg }}
      >
        {initials(name)}
      </div>
      <div className="min-w-0">
        <p
          className="truncate text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {name}
        </p>
        <p
          className="flex items-center gap-1 truncate text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <Mail size={12} />
          {user.email}
        </p>
      </div>
    </div>
  );
}

function TimelineItem({
  icon,
  title,
  time,
  tone,
}: {
  icon: ReactNode;
  title: string;
  time: string;
  tone: { bg: string; fg: string };
}) {
  return (
    <li className="flex items-start gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ background: tone.bg, color: tone.fg }}
      >
        {icon}
      </div>
      <div>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {time}
        </p>
      </div>
    </li>
  );
}

const AdminReportDetailPage = () => {
  const { reportId } = useParams();
  const { data: report, isLoading, isError } = useReportById(reportId);

  const { mutate: updateStatus, isPending } = useUpdateReportStatus();
  const [pendingStatus, setPendingStatus] = useState<PendingStatus | null>(
    null,
  );

  const handleConfirm = () => {
    if (!report || !pendingStatus) return;
    updateStatus(
      { reportId: report.id, status: pendingStatus },
      {
        onSuccess: () => {
          setPendingStatus(null);
          toast.success("Report updated");
        },
        onError: () =>
          toast.error("Failed to update report. Please try again."),
      },
    );
  };
  const handleCloseConfirm = () => {
    if (isPending) return;
    setPendingStatus(null);
  };

  if (isLoading) return <p>Loading report...</p>;

  if (isError) return <p>Failed to load report.</p>;

  if (!report) return <p>Report not found.</p>;
  return (
    <div className="space-y-5">
      {/* Back link */}
      <Link
        to="/admin/reports"
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:underline"
        style={{ color: "var(--text-secondary)" }}
      >
        <ArrowLeft size={16} />
        Back to reports
      </Link>

      {/* Header */}
      <div
        className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border p-6"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className="font-display text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Report #{report?.id.slice(0, 8)}
            </h2>
            <StatusBadge status={report?.status} />
            <ReasonBadge reason={report?.reason} />
          </div>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Submitted {formatDate(report.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {report.status === "PENDING" ? (
            <>
              <button
                onClick={() => setPendingStatus("DISMISSED")}
                className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--card)",
                  color: "var(--danger)",
                }}
              >
                <XCircle size={16} />
                Dismiss
              </button>

              <button
                onClick={() => setPendingStatus("RESOLVED")}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                style={{ background: "var(--primary)", color: "#fff" }}
              >
                <CheckCircle2 size={16} />
                Resolve
              </button>
            </>
          ) : (
            <Button onClick={() => setPendingStatus("PENDING")}>
              <RotateCcw size={14} />
              Reopen report
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-5 lg:col-span-2">
          <Card title="Description">
            {report.description ? (
              <p
                className="whitespace-pre-line text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {report.description}
              </p>
            ) : (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                The reporter didn't add a description.
              </p>
            )}
          </Card>

          <Card title="Activity">
            <ol className="space-y-5">
              <TimelineItem
                icon={<Clock size={16} />}
                title="Report submitted"
                time={formatDate(report.createdAt)}
                tone={{ bg: "var(--primary-light)", fg: "var(--primary)" }}
              />
              {report.reviewedAt && report.status === "RESOLVED" && (
                <TimelineItem
                  icon={<CheckCircle2 size={16} />}
                  title="Marked as resolved"
                  time={formatDate(report.reviewedAt)}
                  tone={{ bg: "var(--success-bg)", fg: "var(--success)" }}
                />
              )}
              {report.reviewedAt && report.status === "DISMISSED" && (
                <TimelineItem
                  icon={<XCircle size={16} />}
                  title="Dismissed"
                  time={formatDate(report.reviewedAt)}
                  tone={{ bg: "#F1F5F9", fg: "var(--text-secondary)" }}
                />
              )}
              {!report.reviewedAt && (
                <TimelineItem
                  icon={<Clock size={16} />}
                  title="Awaiting review"
                  time="No action taken yet"
                  tone={{ bg: "var(--warning-bg)", fg: "var(--warning)" }}
                />
              )}
            </ol>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-5">
          <Card title="Reported">
            {report.job ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: "var(--primary-light)",
                      color: "var(--primary)",
                    }}
                  >
                    <Briefcase size={18} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {report.job.title}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Job listing
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => console.log("view job", report.job?.id)}
                  className="w-full rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  View job
                </button>
              </div>
            ) : report.reportedUser ? (
              <div className="space-y-3">
                <PersonRow user={report.reportedUser} />
                <button
                  onClick={() =>
                    console.log("view user", report.reportedUser?.id)
                  }
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <UserIcon size={14} />
                  View profile
                </button>
              </div>
            ) : (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                The reported job or user has been deleted.
              </p>
            )}
          </Card>

          <Card title="Reporter">
            <PersonRow user={report.reporter} />
          </Card>
        </div>
      </div>
      <ReportStatusConfirmModal
        status={pendingStatus}
        isPending={isPending}
        onConfirm={handleConfirm}
        onClose={handleCloseConfirm}
      />
    </div>
  );
};

export default AdminReportDetailPage;
