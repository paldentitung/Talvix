import React from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  Clock,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";

import type {
  Job,
  WorkMode,
  EmploymentType,
} from "../../features/jobs/types/job.types";

const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const WORK_MODE_LABELS: Record<WorkMode, string> = {
  ONSITE: "On-site",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
};

function formatEmploymentType(employmentType: EmploymentType): string {
  return EMPLOYMENT_TYPE_LABELS[employmentType] ?? employmentType;
}

function formatWorkMode(workMode: WorkMode): string {
  return WORK_MODE_LABELS[workMode] ?? workMode;
}

function formatCurrencyAmount(amount: number, currency: string): string {
  // Falls back gracefully if the currency code isn't recognized by Intl.
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      notation: amount >= 100000 ? "compact" : "standard",
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function formatSalary(
  job: Pick<Job, "salaryMin" | "salaryMax" | "currency">,
): string {
  const { salaryMin, salaryMax, currency } = job;

  if (!salaryMin && !salaryMax) return "Salary not disclosed";

  if (salaryMin && salaryMax) {
    return `${formatCurrencyAmount(salaryMin, currency)} - ${formatCurrencyAmount(salaryMax, currency)}`;
  }

  const single = salaryMin ?? salaryMax ?? 0;
  return `Up to ${formatCurrencyAmount(single, currency)}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const CandidateJobCard = ({
  job,
  isSaved,
  onToggleSave,
  isSaving,
}: {
  job: Job;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  isSaving: boolean;
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-(--radius-md) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-(--radius-md) border border-(--border) bg-(--bg)">
            {`${import.meta.env.VITE_API_BACKEND_URL}${job.recruiter?.recruiterProfile?.companyLogo}` ? (
              <img
                src={`${import.meta.env.VITE_API_BACKEND_URL}${job.recruiter?.recruiterProfile?.companyLogo}`}
                alt={
                  job.recruiter?.recruiterProfile?.companyName ?? "Company logo"
                }
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 size={20} className="text-(--text-muted)" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={`/candidate/jobs/${job.id}`}
                className="text-base font-semibold text-(--text-primary) hover:text-(--primary)"
              >
                {job.title}
              </Link>
              {job.featured && (
                <span className="flex items-center gap-1 rounded-full bg-(--accent-light) px-2 py-0.5 text-xs font-medium text-(--accent)">
                  <Sparkles size={12} />
                  Featured
                </span>
              )}
            </div>
            <p className="text-sm text-(--text-secondary)">
              {job.recruiter?.recruiterProfile?.companyName ??
                `${job.recruiter?.firstName} ${job.recruiter?.lastName}`}
            </p>
          </div>
        </div>

        <button
          onClick={() => onToggleSave(job.id)}
          disabled={isSaving}
          aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
          className="shrink-0 rounded-(--radius-md) p-2 text-(--primary) transition-colors hover:bg-(--primary-light) disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 size={20} className="animate-spin" />
          ) : isSaved ? (
            <BookmarkCheck size={20} />
          ) : (
            <Bookmark size={20} />
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

export default CandidateJobCard;
