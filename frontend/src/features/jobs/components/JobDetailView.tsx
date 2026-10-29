import {
  Briefcase,
  Building2,
  CalendarDays,
  CalendarClock,
  Clock,
  ExternalLink,
  Globe,
  Info,
  MapPin,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { useJob } from "../hooks/useJob";
import SectionCard from "../../../shared/components/SectionCard";
import DetailSkeleton from "../../../shared/components/DetailSkeleton";
import relativeTime from "../../../shared/utils/relativeTime";
import { tintFor } from "../../../shared/utils/avatarTint";
import {
  EmptyState,
  DetailError,
  DetailHeader,
  Chip,
} from "../../users/components/detail";
import type { JobStatus } from "../types/job.types";
import { assetUrl } from "../../../shared/utils/assetUrl";
import initials from "../../../shared/utils/getInitials";
import formatSalary from "../../../shared/utils/formatSalary";
import { formatLabel as label } from "../../../shared/utils/formatLabel";

const STATUS_TONE: Record<JobStatus, string> = {
  OPEN: "bg-(--success-bg) text-(--success)",
  DRAFT: "bg-(--warning-bg) text-(--warning)",
  CLOSED: "bg-(--danger-bg) text-(--danger)",
};

const STATUS_LABEL: Record<JobStatus, string> = {
  OPEN: "Live",
  DRAFT: "Draft",
  CLOSED: "Closed",
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const JobDetailView = ({ id }: { id: string }) => {
  const { data: j, isLoading, isError } = useJob(id);

  if (isLoading) return <DetailSkeleton squareAvatar sections={2} />;

  if (isError || !j) {
    return <DetailError message="Failed to load job." />;
  }

  const profile = j.recruiter?.recruiterProfile;
  const company = profile?.companyName ?? "Unknown company";
  const tint = tintFor(company);
  const postedDate = formatDate(j.createdAt);
  const updatedDate = formatDate(j.updatedAt);
  const deadline = formatDate(j.deadline);
  const recruiterAvatar = assetUrl(j.recruiter?.avatar);
  const companylogo = assetUrl(profile?.companyLogo);
  const recruiterName = j.recruiter
    ? `${j.recruiter.firstName} ${j.recruiter.lastName}`
    : "Recruiter unavailable";
  const salary = formatSalary(j);

  const deadlinePassed =
    j.deadline != null &&
    !Number.isNaN(new Date(j.deadline).getTime()) &&
    new Date(j.deadline).getTime() < Date.now();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      {/* Job header */}
      <DetailHeader
        squareAvatar
        avatar={
          companylogo ? (
            <img
              src={companylogo}
              alt={`${company} logo`}
              className="h-20 w-20 rounded-xl object-contain"
            />
          ) : (
            <div
              className="flex h-20 w-20 items-center justify-center rounded-xl"
              style={{ background: tint.bg, color: tint.fg }}
            >
              <Briefcase size={30} />
            </div>
          )
        }
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <h2 className="font-display text-xl font-bold leading-snug text-(--text-primary)">
            {j.title}
          </h2>

          <Chip className={STATUS_TONE[j.status]}>
            {STATUS_LABEL[j.status]}
          </Chip>

          {j.featured && (
            <Chip className="bg-(--warning-bg) text-(--warning)">
              <Star size={13} />
              Featured
            </Chip>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Chip icon={Building2}>{company}</Chip>

          {j.location && <Chip icon={MapPin}>{j.location}</Chip>}

          <Chip icon={Users}>{j.applicationsCount ?? 0} applicants</Chip>

          {postedDate && <Chip icon={CalendarDays}>Posted {postedDate}</Chip>}
        </div>

        {profile?.companyWebsite && (
          <a
            href={profile.companyWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-(--text-secondary) transition-colors hover:text-(--text-primary)"
          >
            <Globe size={15} />
            Company website
            <ExternalLink size={13} />
          </a>
        )}
      </DetailHeader>

      {/* Compensation */}
      <SectionCard icon={Wallet} title="Compensation">
        <p className="text-lg font-semibold text-(--text-primary)">{salary}</p>

        <p className="mt-1 text-sm text-(--text-secondary)">
          {j.salaryMin != null && j.salaryMax != null
            ? "Salary range"
            : j.salaryMin != null
              ? "Minimum salary specified"
              : j.salaryMax != null
                ? "Maximum salary specified"
                : "The recruiter has not disclosed the salary."}
        </p>
      </SectionCard>

      {/* Job details */}
      <SectionCard icon={Briefcase} title="Job details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DetailItem label="Work arrangement" value={label(j.workMode)} />

          <DetailItem label="Employment type" value={label(j.employmentType)} />

          <DetailItem
            label="Experience level"
            value={label(j.experienceLevel)}
          />

          <DetailItem
            label="Open positions"
            value={j.openings != null ? String(j.openings) : "Not specified"}
          />
        </div>
      </SectionCard>

      {/* Skills */}
      <SectionCard icon={Star} title="Required skills">
        {j.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {j.skills.map((skill) => (
              <Chip key={skill}>{skill}</Chip>
            ))}
          </div>
        ) : (
          <EmptyState icon={Star} text="No specific skills listed." />
        )}
      </SectionCard>

      {/* Description */}
      <SectionCard icon={Info} title="Job description">
        {j.description ? (
          <p className="whitespace-pre-line text-sm leading-relaxed text-(--text-secondary)">
            {j.description}
          </p>
        ) : (
          <EmptyState icon={Info} text="No description added." />
        )}
      </SectionCard>

      {/* Application deadline */}
      <SectionCard icon={CalendarClock} title="Application timeline">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DetailItem
            label="Application deadline"
            value={deadline ?? "No deadline specified"}
          />

          <DetailItem
            label="Deadline status"
            value={
              !deadline
                ? "No deadline"
                : deadlinePassed
                  ? "Deadline passed"
                  : "Not yet passed"
            }
            valueClassName={
              deadlinePassed ? "text-(--danger)" : "text-(--text-primary)"
            }
          />

          <DetailItem label="Created" value={postedDate ?? "Unavailable"} />

          <DetailItem
            label="Last updated"
            value={updatedDate ?? "Unavailable"}
          />
        </div>

        {postedDate && (
          <p className="mt-4 flex items-center gap-2 border-t border-(--border) pt-3 text-xs text-(--text-secondary)">
            <Clock size={14} />
            Posted {relativeTime(j.createdAt)}
          </p>
        )}
      </SectionCard>

      {/* Recruiter */}
      <SectionCard icon={Building2} title="Recruiter information">
        <div className="flex items-center gap-3">
          {recruiterAvatar ? (
            <img
              src={recruiterAvatar}
              alt={recruiterAvatar || "Avatar"}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold"
              style={{ background: tint.bg, color: tint.fg }}
            >
              {initials(recruiterName)}
            </div>
          )}

          <div className="min-w-0">
            <p className="font-medium text-(--text-primary)">
              {j.recruiter
                ? `${j.recruiter.firstName} ${j.recruiter.lastName}`
                : "Recruiter unavailable"}
            </p>

            <p className="text-sm text-(--text-secondary)">{company}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

const DetailItem = ({
  label,
  value,
  valueClassName = "text-(--text-primary)",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) => (
  <div className="min-w-0">
    <p className="mb-1 text-xs font-medium text-(--text-secondary)">{label}</p>
    <p className={`break-words text-sm font-medium ${valueClassName}`}>
      {value}
    </p>
  </div>
);

export default JobDetailView;
