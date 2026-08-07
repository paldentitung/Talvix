import { Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Clock,
  Bookmark,
  Building2,
  Loader2,
} from "lucide-react";
import type { Job } from "../../features/jobs/types/job.types";
import { useSavedJobs } from "../../features/jobs/hooks/useSavedJobs";
import { useToggleSaveJob } from "../../features/jobs/hooks/useToggleSaveJob";

const formatSalary = (job: Job) => {
  if (!job.salaryMin && !job.salaryMax) return "Salary not disclosed";
  if (job.salaryMin && job.salaryMax) {
    return `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
  }
  return `${job.currency} ${(job.salaryMin ?? job.salaryMax)?.toLocaleString()}`;
};

const formatEmploymentType = (type: Job["employmentType"]) =>
  type
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

const formatWorkMode = (mode: Job["workMode"]) =>
  mode[0] + mode.slice(1).toLowerCase();

const SavedJobCard = ({
  job,
  onUnsave,
  isUnsaving,
}: {
  job: Job;
  onUnsave: (jobId: string) => void;
  isUnsaving: boolean;
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-(--radius-md) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-(--radius-md) border border-(--border) bg-(--bg)">
            {job.recruiter.companyLogo ? (
              <img
                src={job.recruiter.companyLogo}
                alt={job.recruiter.companyName ?? "Company logo"}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 size={20} className="text-(--text-muted)" />
            )}
          </div>
          <div>
            <Link
              to={`/candidate/jobs/${job.id}`}
              className="text-base font-semibold text-(--text-primary) hover:text-(--primary)"
            >
              {job.title}
            </Link>
            <p className="text-sm text-(--text-secondary)">
              {job.recruiter.companyName ??
                `${job.recruiter.firstName} ${job.recruiter.lastName}`}
            </p>
          </div>
        </div>

        <button
          onClick={() => onUnsave(job.id)}
          disabled={isUnsaving}
          aria-label="Remove from saved jobs"
          className="shrink-0 rounded-(--radius-md) p-2 text-(--primary) transition-colors hover:bg-(--primary-light) disabled:opacity-50"
        >
          {isUnsaving ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Bookmark size={20} fill="currentColor" />
          )}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-(--text-secondary)">
        <span className="flex items-center gap-1.5">
          <MapPin size={15} className="text-(--text-muted)" />
          {job.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Briefcase size={15} className="text-(--text-muted)" />
          {formatEmploymentType(job.employmentType)} ·{" "}
          {formatWorkMode(job.workMode)}
        </span>
        {job.deadline && (
          <span className="flex items-center gap-1.5">
            <Clock size={15} className="text-(--text-muted)" />
            Apply by {new Date(job.deadline).toLocaleDateString()}
          </span>
        )}
      </div>

      {job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-(--bg) px-2.5 py-1 text-xs font-medium text-(--text-secondary)"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="rounded-full bg-(--bg) px-2.5 py-1 text-xs font-medium text-(--text-muted)">
              +{job.skills.length - 5} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-(--border) pt-4">
        <span className="text-sm font-semibold text-(--text-primary)">
          {formatSalary(job)}
        </span>
        <Link
          to={`/candidate/jobs/${job.id}`}
          className="rounded-(--radius-md) bg-(--primary) px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
        >
          View Job
        </Link>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-(--radius-md) border border-dashed border-(--border) bg-(--card) px-6 py-16 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-(--primary-light)">
      <Bookmark size={24} className="text-(--primary)" />
    </div>
    <h3 className="text-lg font-semibold text-(--text-primary)">
      No saved jobs yet
    </h3>
    <p className="max-w-sm text-sm text-(--text-secondary)">
      Jobs you save while browsing will show up here so you can come back to
      them later.
    </p>
    <Link
      to="/candidate/jobs"
      className="mt-2 rounded-(--radius-md) bg-(--primary) px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
    >
      Browse Jobs
    </Link>
  </div>
);

const ErrorState = () => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-(--radius-md) border border-(--border) bg-(--card) px-6 py-16 text-center">
    <h3 className="text-lg font-semibold text-(--text-primary)">
      Couldn't load your saved jobs
    </h3>
    <p className="max-w-sm text-sm text-(--text-secondary)">
      Something went wrong while fetching your saved jobs. Please try again.
    </p>
  </div>
);

const SavedJobs = () => {
  const { data: jobs = [], isLoading, isError } = useSavedJobs();
  const toggleSaveJobMutation = useToggleSaveJob();

  const handleUnsave = (jobId: string) => {
    toggleSaveJobMutation.mutate(jobId);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-(--text-primary)">
            Saved Jobs
          </h1>
          <p className="text-sm text-(--text-secondary)">
            {jobs?.length} {jobs?.length === 1 ? "job" : "jobs"} saved
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-(--primary)" />
        </div>
      ) : isError ? (
        <ErrorState />
      ) : jobs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {jobs.map((job: Job) => (
            <SavedJobCard
              key={job.id}
              job={job}
              onUnsave={handleUnsave}
              isUnsaving={
                toggleSaveJobMutation.isPending &&
                toggleSaveJobMutation.variables === job.id
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
