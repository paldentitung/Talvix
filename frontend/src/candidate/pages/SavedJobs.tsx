import { Link } from "react-router-dom";
import { Bookmark, Loader2 } from "lucide-react";
import type { Job } from "../../features/jobs/types/job.types";
import { useSavedJobs } from "../../features/jobs/hooks/useSavedJobs";
import CandidateJobCard from "../components/CandidateJobCard";
import { useJobSaveActions } from "../../features/jobs/hooks/useJobSaveActions";

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
  const { isSavingJob, toggleSave } = useJobSaveActions();
  return (
    <div className="flex flex-col gap-6 p-6">
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
            <CandidateJobCard
              job={job}
              isSaved={true}
              onToggleSave={toggleSave}
              isSaving={isSavingJob(job.id)}
              key={job.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
