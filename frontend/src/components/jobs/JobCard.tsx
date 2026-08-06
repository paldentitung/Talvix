import { useState } from "react";
import { Bookmark, Building2, Link } from "lucide-react";
import type { Job } from "../../types/job.type";
import Badge from "../ui/Badge";

interface JobCardProps {
  job: Job;
  initiallySaved?: boolean;
  onToggleSave?: (jobId: string, saved: boolean) => void;
}

const EMPLOYMENT_LABELS: Record<Job["employmentType"], string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const WORK_MODE_LABELS: Record<Job["workMode"], string> = {
  ONSITE: "Onsite",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
};

const LEVEL_LABELS: Record<Job["experienceLevel"], string> = {
  ENTRY: "Entry",
  MID: "Mid",
  SENIOR: "Senior",
  LEAD: "Lead",
};

// Deterministic color from company name so the same company always gets the same avatar color
const AVATAR_COLORS = [
  "#4f46e5",
  "#0891b2",
  "#c026d3",
  "#ea580c",
  "#16a34a",
  "#dc2626",
  "#2563eb",
];
function colorForName(name: string) {
  const hash = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function formatSalary(job: Job) {
  const { salaryMin, salaryMax, currency } = job;
  if (salaryMin == null && salaryMax == null) return "Salary not disclosed";
  const fmt = (n: number) => `${currency} ${n.toLocaleString()}`;
  if (salaryMin != null && salaryMax != null)
    return `${fmt(salaryMin)} - ${fmt(salaryMax)}`;
  if (salaryMin != null) return `From ${fmt(salaryMin)}`;
  return `Up to ${fmt(salaryMax as number)}`;
}

function formatPostedAt(createdAt: string) {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

/**
 * Reusable job card. Used on: Home (Featured Jobs), Job Search results,
 * Saved Jobs page, and Related Jobs on the Job Details page.
 */
export default function JobCard({
  job,
  initiallySaved = false,
  onToggleSave,
}: JobCardProps) {
  const [saved, setSaved] = useState(initiallySaved);

  const handleToggleSave = () => {
    const next = !saved;
    setSaved(next);
    onToggleSave?.(job.id, next);
  };

  const companyName =
    job.recruiter?.companyName ??
    (job.recruiter
      ? `${job.recruiter.firstName} ${job.recruiter.lastName}`
      : "Company");
  const companyInitial = companyName.charAt(0).toUpperCase();
  const companyColor = colorForName(companyName);
  const isActivelyHiring = job.status === "OPEN" && (job.openings ?? 0) > 0;

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-1 hover:border-[#d8dcf0] transition-all flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        {job.recruiter?.companyLogo ? (
          <img
            src={job?.recruiter?.companyLogo}
            alt={companyName}
            loading="lazy"
            className="w-[46px] h-[46px] rounded-xl object-cover"
          />
        ) : (
          <div
            className="w-[46px] h-[46px] rounded-xl flex items-center justify-center font-extrabold text-white text-base"
            style={{ backgroundColor: companyColor }}
          >
            {companyInitial}
          </div>
        )}
        <button
          onClick={handleToggleSave}
          aria-label={saved ? "Remove from saved jobs" : "Save job"}
          aria-pressed={saved}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            saved
              ? "text-[var(--danger)] bg-[var(--danger-bg)]"
              : "text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-bg)]"
          }`}
        >
          <Bookmark
            className="w-[17px] h-[17px]"
            fill={saved ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div>
        <div className="text-[16.5px] font-bold text-[var(--text-primary)]">
          {job.title}
        </div>
        <div className="text-[13.5px] text-[var(--text-secondary)] flex items-center gap-1.5 mt-1">
          <Building2 className="w-3.5 h-3.5" /> {companyName} · {job.location}
        </div>
      </div>

      {job.description && (
        <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">
          {job.description}
        </p>
      )}

      <div className="flex gap-2 flex-wrap">
        <Badge>{EMPLOYMENT_LABELS[job.employmentType]}</Badge>
        <Badge>{WORK_MODE_LABELS[job.workMode]}</Badge>
        {isActivelyHiring ? (
          <Badge variant="success">Actively hiring</Badge>
        ) : (
          <Badge>{LEVEL_LABELS[job.experienceLevel]}</Badge>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
        <span className="font-bold text-[14.5px] text-[var(--text-primary)]">
          {formatSalary(job)}
        </span>
        <span className="text-xs text-[var(--text-muted)]">
          Posted {formatPostedAt(job.createdAt)}
        </span>
      </div>
    </Link>
  );
}
