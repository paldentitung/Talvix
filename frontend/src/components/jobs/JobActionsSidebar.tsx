// components/JobActionsSidebar.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bookmark, BookmarkCheck, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import type { Job, JobFormValues } from "../../features/jobs/types/job.types";
import Button from "../../components/ui/Button";
import { useDeleteJob } from "../../features/jobs/hooks/useDeleteJob";
import { useUpdateJob } from "../../features/jobs/hooks/useUpdateJob";
import PostJobModal from "../../recruiter/components/JobPostingModal";
import { useApplyJob } from "../../features/applications/hooks/useApplyJob";
import ApplyJobModal from "../../features/applications/components/ApplyJobModal";
import Modal from "../ui/Modal";
import { useSavedJobs } from "../../features/jobs/hooks/useSavedJobs";
import { useJobSaveActions } from "../../features/jobs/hooks/useJobSaveActions";
// TODO: swap these in once you confirm the hook names for candidate actions
// import { useSaveJob } from "../../features/jobs/hooks/useSaveJob";
// import { useApplyToJob } from "../../features/jobs/hooks/useApplyToJob";

type Props = {
  variant: "public" | "candidate" | "recruiter";
  job: Job;
};

const toFormValues = (job: Job): JobFormValues => ({
  title: job.title,
  description: job.description,
  salaryMin: job.salaryMin,
  salaryMax: job.salaryMax,
  currency: job.currency,
  location: job.location,
  workMode: job.workMode,
  employmentType: job.employmentType,
  experienceLevel: job.experienceLevel,
  skills: job.skills,
  deadline: job.deadline ?? "",
  openings: job.openings,
  featured: job.featured,
});

const RecruiterActions = ({ job }: { job: Job }) => {
  const navigate = useNavigate();

  const deleteJobMutation = useDeleteJob();
  const updateJobMutation = useUpdateJob();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDeleteJob = async () => {
    try {
      await deleteJobMutation.mutateAsync(job.id);
      setIsDeleteOpen(false);
      toast.success("Job deleted successfully");
      navigate("/recruiter/jobs");
    } catch (error) {
      console.error("Failed to delete job:", error);
      toast.error("Failed to delete job. Please try again.");
    }
  };

  const handleUpdateJob = async (values: JobFormValues) => {
    try {
      await updateJobMutation.mutateAsync({
        jobId: job.id,
        jobData: {
          ...values,
          deadline: values.deadline || null,
        },
      });

      toast.success("Job updated successfully");
      setIsEditOpen(false);
    } catch (error) {
      console.error("Failed to update job:", error);
      toast.error("Failed to update job. Please try again.");
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          onClick={() => setIsEditOpen(true)}
          disabled={updateJobMutation.isPending}
        >
          <Pencil size={14} />
          Edit job
        </Button>

        <Link
          to={`/recruiter/applicants/${job.id}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-(--radius-md) border border-(--border) px-4 py-2 text-sm font-semibold text-(--text-primary) hover:bg-(--bg)"
        >
          View applicants
        </Link>

        <Button
          size="sm"
          className="bg-red-500 hover:bg-red-700"
          onClick={handleDeleteClick}
          disabled={deleteJobMutation.isPending}
        >
          <Trash2 size={14} />
          Delete job
        </Button>
      </div>

      <PostJobModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleUpdateJob}
        initialValues={toFormValues(job)}
        mode="edit"
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Delete"
        description="Are you sure you want to delete this job? This action cannot be undone."
        footer={
          <>
            <Button
              size="sm"
              onClick={() => setIsDeleteOpen(false)}
              disabled={deleteJobMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-700"
              onClick={handleDeleteJob}
              disabled={deleteJobMutation.isPending}
            >
              {deleteJobMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      />
    </>
  );
};

const CandidateActions = ({ job }: { job: Job }) => {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const applyJobMutation = useApplyJob();
  const { isJobSaved, isSavingJob, toggleSave } = useJobSaveActions();

  const handleApply = async ({
    coverLetter,
    resume,
  }: {
    coverLetter: string;
    resume: File;
  }) => {
    await applyJobMutation.mutateAsync({
      jobId: job.id,
      coverLetter,
      resume,
    });

    toast.success("Application submitted successfully");
    setIsApplyOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button size="sm" onClick={() => setIsApplyOpen(true)}>
        Apply now
      </Button>
      <Button
        size="sm"
        variant="accent"
        onClick={() => toggleSave(job.id)}
        disabled={isSavingJob(job.id)}
        aria-label={isJobSaved(job.id) ? "Remove from saved jobs" : "Save job"}
      >
        {isSavingJob(job.id) ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Saving...
          </>
        ) : isJobSaved(job.id) ? (
          <>
            <BookmarkCheck size={18} />
            Saved
          </>
        ) : (
          <>
            <Bookmark size={18} />
            Save Job
          </>
        )}
      </Button>
      <ApplyJobModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        jobTitle={job.title}
        onSubmit={handleApply}
      />
    </div>
  );
};

const PublicActions = ({ job }: { job: Job }) => (
  <div className="flex flex-col gap-2">
    <Link
      to="/login"
      state={{ from: `/jobs/${job.id}` }}
      className="inline-flex items-center justify-center rounded-(--radius-md) bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:bg-(--primary-dark)"
    >
      Log in to apply
    </Link>
  </div>
);

const JobActionsSidebar = ({ variant, job }: Props) => {
  switch (variant) {
    case "recruiter":
      return <RecruiterActions job={job} />;
    case "candidate":
      return <CandidateActions job={job} />;
    default:
      return <PublicActions job={job} />;
  }
};

export default JobActionsSidebar;
