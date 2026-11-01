import {
  Briefcase,
  CalendarDays,
  ExternalLink,
  FileText,
  Info,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  History,
  MessageSquareText,
} from "lucide-react";
import toast from "react-hot-toast";
import { useApplication } from "../hooks/useApplication";
import { useUpdateApplicationStatus } from "../hooks/useUpdateApplicationStatus";
import type { ApplicationStatus } from "../types/application.types";
import StatusBadge from "../../../shared/components/StatusBadge";
import Avatar from "../../../shared/components/Avatar";
import SectionCard from "../../../shared/components/SectionCard";
import DetailSkeleton from "../../../shared/components/DetailSkeleton";
import { fullName } from "../../../shared/utils/getFullname";
import { assetUrl } from "../../../shared/utils/assetUrl";
import relativeTime from "../../../shared/utils/relativeTime";
import {
  Chip,
  Count,
  DetailError,
  DetailHeader,
  EmptyState,
} from "../../users/components/detail";
import Button from "../../../components/ui/Button";

const LABEL: Record<ApplicationStatus, string> = {
  PENDING: "Pending",
  REVIEWING: "Reviewing",
  SHORTLISTED: "Shortlisted",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const ApplicationDetailView = ({ id }: { id: string }) => {
  const { data: app, isLoading, isError } = useApplication(id);
  const { mutate: updateStatus, isPending } = useUpdateApplicationStatus();

  if (isLoading) return <DetailSkeleton sections={3} />;
  if (isError || !app)
    return <DetailError message="Failed to load application." />;

  const name = fullName(app.user);
  const profile = app.user.candidateProfile;
  const resume = assetUrl(app.resumeUrl ?? profile?.resumeUrl ?? null);
  const skills = profile?.skills ?? [];
  const history = [...app.statusHistory].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const change = (next: ApplicationStatus) =>
    updateStatus(
      { applicationId: app.id, status: next },
      {
        onSuccess: () => toast.success(`Marked as ${LABEL[next]}`),
        onError: (e) =>
          toast.error(e instanceof Error ? e.message : "Failed to update"),
      },
    );

  const canAct = app.status !== "WITHDRAWN";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <DetailHeader
        avatar={
          <Avatar src={assetUrl(app.user.avatar)} name={name} size="xl" />
        }
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <h2 className="font-display text-xl font-bold leading-snug text-(--text-primary)">
            {name}
          </h2>
          <StatusBadge status={app.status} />
        </div>
        {profile?.title && (
          <p className="mt-1 text-sm text-(--text-secondary)">
            {profile.title}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Chip icon={Briefcase}>Applied for {app.job.title}</Chip>
          {profile?.location && <Chip icon={MapPin}>{profile.location}</Chip>}
          <Chip icon={CalendarDays}>Applied {relativeTime(app.appliedAt)}</Chip>
        </div>

        {/* Actions */}
        {canAct && (
          <div className="mt-4 flex flex-wrap gap-2">
            {app.status === "PENDING" && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => change("REVIEWING")}
                disabled={isPending}
              >
                Start reviewing
              </Button>
            )}
            {app.status === "REVIEWING" && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => change("SHORTLISTED")}
                disabled={isPending}
              >
                Shortlist
              </Button>
            )}
            {app.status === "SHORTLISTED" && (
              <Button
                size="sm"
                variant="accent"
                onClick={() => change("ACCEPTED")}
                disabled={isPending}
              >
                Accept
              </Button>
            )}
            {app.status !== "REJECTED" && app.status !== "ACCEPTED" && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => change("REJECTED")}
                disabled={isPending}
              >
                Reject
              </Button>
            )}
          </div>
        )}
      </DetailHeader>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
        {/* Left column: profile details */}
        <div className="flex flex-col gap-5">
          <SectionCard icon={Mail} title="Contact">
            <dl className="flex flex-col gap-4 text-sm">
              <div className="flex items-center gap-3">
                <Mail size={15} className="shrink-0 text-(--text-muted)" />
                <div className="min-w-0">
                  <dt className="text-xs text-(--text-muted)">Email</dt>
                  <dd className="truncate">
                    <a
                      href={`mailto:${app.user.email}`}
                      className="text-(--primary) hover:underline"
                    >
                      {app.user.email}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={15} className="shrink-0 text-(--text-muted)" />
                <div className="min-w-0">
                  <dt className="text-xs text-(--text-muted)">Phone</dt>
                  <dd className="truncate text-(--text-primary)">
                    {app.user.phone || (
                      <span className="text-(--text-muted)">Not provided</span>
                    )}
                  </dd>
                </div>
              </div>
            </dl>
          </SectionCard>

          <SectionCard icon={Info} title="About">
            {profile?.bio ? (
              <p className="whitespace-pre-line text-sm leading-relaxed text-(--text-secondary)">
                {profile.bio}
              </p>
            ) : (
              <EmptyState icon={Info} text="No bio added." />
            )}
          </SectionCard>

          <SectionCard
            icon={Sparkles}
            title="Skills"
            badge={<Count n={skills.length} />}
          >
            {skills.length === 0 ? (
              <EmptyState icon={Sparkles} text="No skills listed." />
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-(--primary)/10 px-3 py-1 text-xs font-medium text-(--primary)"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right column: application */}
        <div className="flex flex-col gap-5">
          <SectionCard icon={MessageSquareText} title="Cover letter">
            {app.coverLetter ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-(--text-secondary)">
                {app.coverLetter}
              </p>
            ) : (
              <EmptyState
                icon={MessageSquareText}
                text="No cover letter provided."
              />
            )}
          </SectionCard>

          <SectionCard icon={FileText} title="Resume">
            {resume ? (
              <Button
                size="sm"
                variant="ghost"
                icon={<FileText size={15} />}
                onClick={() =>
                  window.open(resume, "_blank", "noopener,noreferrer")
                }
              >
                View resume
                <ExternalLink size={12} />
              </Button>
            ) : (
              <EmptyState icon={FileText} text="No resume uploaded." />
            )}
          </SectionCard>

          <SectionCard
            icon={History}
            title="Application history"
            badge={<Count n={history.length} />}
          >
            {history.length === 0 ? (
              <EmptyState icon={History} text="No history yet." />
            ) : (
              <ul>
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
                      {LABEL[h.status]}
                    </p>
                    <p className="text-xs text-(--text-muted)">
                      {formatDateTime(h.createdAt)}
                    </p>
                    {h.note && (
                      <p className="mt-0.5 text-xs text-(--text-secondary)">
                        {h.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailView;
