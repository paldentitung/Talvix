// recruiter/pages/JobDetailPage.tsx  (rename/move to a shared pages folder if you like)
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Users,
  Building2,
} from "lucide-react";
import type { Job } from "../features/jobs/types/job.types";
import { useJob } from "../features/jobs/hooks/useJob";
import JobActionsSidebar from "../components/jobs/JobActionsSidebar";

type JobStatus = Job["status"];

const statusStyles: Record<JobStatus, string> = {
  OPEN: "bg-(--success-bg) text-(--success)",
  DRAFT: "bg-(--border) text-(--text-secondary)",
  CLOSED: "bg-(--danger-bg) text-(--danger)",
};

const employmentLabels: Record<Job["employmentType"], string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const workModeLabels: Record<Job["workMode"], string> = {
  REMOTE: "Remote",
  ONSITE: "Onsite",
  HYBRID: "Hybrid",
};

const experienceLabels: Record<Job["experienceLevel"], string> = {
  ENTRY: "Entry level",
  MID: "Mid level",
  SENIOR: "Senior",
  LEAD: "Lead",
};

const formatSalary = (job: Job) => {
  if (!job.salaryMin && !job.salaryMax) return "Not disclosed";
  const fmt = (n: number) => `${job.currency} ${(n / 1000).toFixed(0)}k`;
  if (job.salaryMin && job.salaryMax)
    return `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)}`;
  return fmt(job.salaryMin ?? job.salaryMax ?? 0);
};

const formatDate = (date: string | null) => {
  if (!date) return "No deadline";
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const FactRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between gap-3 py-2.5">
    <span className="flex items-center gap-2 text-xs text-(--text-muted)">
      <Icon size={13} />
      {label}
    </span>
    <span className="text-right text-sm font-medium text-(--text-primary)">
      {value}
    </span>
  </div>
);

type JobVariant = "public" | "candidate" | "recruiter";

const getVariant = (pathname: string): JobVariant => {
  if (pathname.startsWith("/recruiter")) return "recruiter";
  if (pathname.startsWith("/candidate")) return "candidate";
  return "public";
};

const JobDetailPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const variant = getVariant(pathname);

  const { data: job, isLoading, isError } = useJob(jobId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-(--text-secondary)">
        Loading job…
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-sm text-(--text-secondary)">
          We couldn't find that job.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-semibold text-(--primary) hover:text-(--primary-dark)"
        >
          Go back
        </button>
      </div>
    );
  }

  const companyName =
    job.recruiter.companyName ??
    `${job.recruiter.firstName} ${job.recruiter.lastName}`;

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate(-1)}
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-(--text-secondary) hover:text-(--text-primary)"
      >
        <ArrowLeft size={16} />
        Back to jobs
      </button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-(--text-primary) sm:text-2xl">
              {job.title}
            </h1>
            {job.featured && (
              <Star
                size={17}
                className="shrink-0 fill-(--warning) text-(--warning)"
              />
            )}
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-(--text-secondary)">
            <Building2 size={14} />
            {companyName}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[job.status]}`}
        >
          {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-4">
          <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) sm:p-6">
            <h2 className="text-sm font-semibold text-(--text-primary)">
              Job description
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-(--text-secondary)">
              {job.description}
            </p>
          </div>

          {job.skills.length > 0 && (
            <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) sm:p-6">
              <h2 className="text-sm font-semibold text-(--text-primary)">
                Skills
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
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

        <div className="flex flex-col gap-4 lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm)">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-(--text-muted)">
              At a glance
            </h2>
            <div className="mt-1 divide-y divide-(--border)">
              <FactRow
                icon={MapPin}
                label="Location"
                value={`${job.location} · ${workModeLabels[job.workMode]}`}
              />
              <FactRow
                icon={Briefcase}
                label="Type"
                value={employmentLabels[job.employmentType]}
              />
              <FactRow
                icon={Users}
                label="Level"
                value={experienceLabels[job.experienceLevel]}
              />
              <FactRow
                icon={DollarSign}
                label="Salary"
                value={formatSalary(job)}
              />
              <FactRow
                icon={Calendar}
                label="Deadline"
                value={formatDate(job.deadline)}
              />
              {job.openings !== null && (
                <FactRow
                  icon={Users}
                  label="Openings"
                  value={String(job.openings)}
                />
              )}
            </div>
          </div>

          <JobActionsSidebar variant={variant} job={job} />
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
