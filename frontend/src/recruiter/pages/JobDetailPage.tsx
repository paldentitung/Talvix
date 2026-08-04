import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Users,
  Building2,
  Trash2,
} from "lucide-react";

import type { Job, JobFormValues } from "../../features/jobs/types/job.types";
import { useJob } from "../../features/jobs/hooks/useJob";
import Button from "../../components/ui/Button";
import { useDeleteJob } from "../../features/jobs/hooks/useDeleteJob";
import { toast } from "react-hot-toast";
import { useState } from "react";
import PostJobModal from "../components/JobPostingModal";
import { useUpdateJob } from "../../features/jobs/hooks/useUpdateJob";
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

const JobDetailPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const { data: job, isLoading, isError } = useJob(jobId);
  const deleteJobMutation = useDeleteJob();
  const updateJobMutation = useUpdateJob();

  const [isEditOpen, setIsEditOpen] = useState(false);
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
  const handleDeleteJob = async () => {
    if (!jobId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this job? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await deleteJobMutation.mutateAsync(jobId);
      toast.success("Job deleted successfully");
      navigate("/recruiter/jobs");
    } catch (error) {
      console.error("Failed to delete job:", error);
      alert("Failed to delete job. Please try again.");
    }
  };

  const handleUpdateJob = async (values: JobFormValues) => {
    if (!jobId) return;

    try {
      await updateJobMutation.mutateAsync({
        jobId,
        jobData: {
          ...values,
          deadline: values.deadline || null,
        },
      });
      toast.success("Job updated successfully");
      setIsEditOpen(false);
    } catch (error) {
      console.error("Failed to update job:", error);
      alert("Failed to update job. Please try again.");
    }
  };
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

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-medium text-(--text-secondary) hover:text-(--text-primary)"
      >
        <ArrowLeft size={16} />
        Back to jobs
      </button>

      <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-(--text-primary) sm:text-xl">
                {job.title}
              </h1>
              {job.featured && (
                <Star
                  size={16}
                  className="shrink-0 fill-(--warning) text-(--warning)"
                />
              )}
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-(--text-secondary)">
              <Building2 size={14} />
              {job.recruiter.companyName ??
                `${job.recruiter.firstName} ${job.recruiter.lastName}`}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[job.status]}`}
          >
            {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-(--border) pt-4 text-sm sm:grid-cols-4">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-xs text-(--text-muted)">
              <MapPin size={13} />
              Location
            </span>
            <span className="font-medium text-(--text-primary)">
              {job.location} · {workModeLabels[job.workMode]}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-xs text-(--text-muted)">
              <Briefcase size={13} />
              Type
            </span>
            <span className="font-medium text-(--text-primary)">
              {employmentLabels[job.employmentType]} ·{" "}
              {experienceLabels[job.experienceLevel]}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-xs text-(--text-muted)">
              <DollarSign size={13} />
              Salary
            </span>
            <span className="font-medium text-(--text-primary)">
              {formatSalary(job)}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-xs text-(--text-muted)">
              <Calendar size={13} />
              Deadline
            </span>
            <span className="font-medium text-(--text-primary)">
              {formatDate(job.deadline)}
            </span>
          </div>
        </div>

        {job.openings !== null && (
          <div className="mt-3 flex items-center gap-1.5 text-sm text-(--text-secondary)">
            <Users size={14} />
            {job.openings} opening{job.openings === 1 ? "" : "s"}
          </div>
        )}
      </div>

      <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) sm:p-6">
        <h2 className="text-sm font-semibold text-(--text-primary)">
          Job description
        </h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-(--text-secondary)">
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

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setIsEditOpen(true)}
          className="rounded-(--radius-md) bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:bg-(--primary-dark)"
        >
          Edit job
        </button>
        <Link
          to={`/recruiter/applicants?job=${job.id}`}
          className="rounded-(--radius-md) border border-(--border) px-4 py-2 text-sm font-semibold text-(--text-primary) hover:bg-(--bg)"
        >
          View applicants
        </Link>

        <Button
          size="sm"
          className="bg-red-400 hover:bg-red-500"
          onClick={handleDeleteJob}
        >
          <Trash2 size={14} />
          Delete Job
        </Button>
      </div>
      <PostJobModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleUpdateJob}
        initialValues={toFormValues(job)}
        mode="edit"
      />
    </div>
  );
};

export default JobDetailPage;
