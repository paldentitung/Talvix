import { useState } from "react";
import { Bookmark, Building2 } from "lucide-react";
import type { Job } from "../../types/job.type";
import Badge from "../ui/Badge";

interface JobCardProps {
  job: Job;
  initiallySaved?: boolean;
  onToggleSave?: (jobId: string, saved: boolean) => void;
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

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-1 hover:border-[#d8dcf0] transition-all flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div
          className="w-[46px] h-[46px] rounded-xl flex items-center justify-center font-extrabold text-white text-base"
          style={{ backgroundColor: job.companyColor }}
        >
          {job.companyInitial}
        </div>
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
          <Building2 className="w-3.5 h-3.5" /> {job.company} · {job.location}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge>{job.employmentType}</Badge>
        {job.workMode && <Badge>{job.workMode}</Badge>}
        {job.isActivelyHiring ? (
          <Badge variant="success">Actively hiring</Badge>
        ) : (
          job.level && <Badge>{job.level}</Badge>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
        <span className="font-bold text-[14.5px] text-[var(--text-primary)]">
          {job.salaryRange}
        </span>
        <span className="text-xs text-[var(--text-muted)]">
          Posted {job.postedAt}
        </span>
      </div>
    </div>
  );
}
