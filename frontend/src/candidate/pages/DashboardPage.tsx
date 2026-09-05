import { Link } from "react-router-dom";
import {
  Send,
  Bookmark,
  CalendarClock,
  UserRound,
  FileText,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import CandidateJobCard from "../components/CandidateJobCard";
import type {
  Application,
  ApplicationStatus,
} from "../../features/applications/types/application.types";
import { useJobSaveActions } from "../../features/jobs/hooks/useJobSaveActions";
import { useState } from "react";
import { useJobs } from "../../features/jobs/hooks/useJobs";
import { useCandidateApplication } from "../../features/applications/hooks/useCandidateApplication";

// ---------------------------------------------------------------------------
// Shared status mapping (should really live in a shared file, e.g.
// features/applications/utils/status.ts, and be imported by both
// DashboardPage and CandidateApplicationsPage instead of being duplicated).
// Logic/values unchanged from the previous version of this file.
// ---------------------------------------------------------------------------
type Status =
  | "Applied"
  | "In Review"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Withdrawn";

const statusLabelMap: Record<ApplicationStatus, Status> = {
  PENDING: "Applied",
  REVIEWING: "In Review",
  SHORTLISTED: "Interview",
  ACCEPTED: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

const statusStyles: Record<Status, string> = {
  Interview: "bg-(--accent-light) text-(--accent)",
  "In Review": "bg-(--warning-bg) text-(--warning)",
  Applied: "bg-(--bg) text-(--text-secondary)",
  Offer: "bg-(--success-bg) text-(--success)",
  Rejected: "bg-(--danger-bg) text-(--danger)",
  Withdrawn: "bg-slate-200 text-(--text-muted)",
};

// ---------------------------------------------------------------------------
// Static content that isn't backed by a real endpoint yet.
// TODO: replace with real data as soon as the relevant hooks/endpoints exist
// (saved-jobs count, profile completion). Unchanged from the previous
// version of this file — this is a UI/layout pass only.
// ---------------------------------------------------------------------------
const profileChecklist = [
  { label: "Add work experience", done: true },
  { label: "Upload resume", done: true },
  { label: "Add portfolio link", done: false },
  { label: "Set salary expectations", done: false },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const StatCard = ({
  stat,
}: {
  stat: {
    label: string;
    value: string;
    icon: typeof Send;
    iconBg: string;
    iconColor: string;
  };
}) => {
  const Icon = stat.icon;

  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-(--radius-md) ${stat.iconBg}`}
      >
        <Icon size={19} className={stat.iconColor} />
      </div>

      <div className="min-w-0">
        <p className="font-display text-2xl font-bold leading-tight text-(--text-primary)">
          {stat.value}
        </p>

        <p className="mt-0.5 truncate text-sm text-(--text-secondary)">
          {stat.label}
        </p>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const JOBS_PAGE_SIZE = 3;
  const APPLICATIONS_LIMIT = 5;

  // Separate pagination state for jobs vs. applications — they have
  // different page sizes and no shared pagination control, so sharing one
  // `page` variable would silently break one list if the other paginates.
  const [jobsPage] = useState(1);
  const [applicationsPage] = useState(1);

  const {
    data: jobsData,
    isLoading: isJobsLoading,
    isError: isJobsError,
  } = useJobs(jobsPage, JOBS_PAGE_SIZE, undefined);

  const jobs = jobsData?.jobs ?? [];

  const {
    data: applicationsData,
    isPending: isApplicationsPending,
    isError: isApplicationsError,
  } = useCandidateApplication(applicationsPage, APPLICATIONS_LIMIT);

  const applications: Application[] =
    applicationsData?.data?.applications ?? [];
  const totalApplications = applicationsData?.data?.pagination?.total ?? 0;

  const { isJobSaved, isSavingJob, toggleSave } = useJobSaveActions();

  const stats = [
    {
      label: "Jobs applied",
      value: String(totalApplications),
      icon: Send,
      iconBg: "bg-(--primary-light)",
      iconColor: "text-(--primary)",
    },
    {
      label: "Saved jobs",
      value: "—",
      icon: Bookmark,
      iconBg: "bg-(--accent-light)",
      iconColor: "text-(--accent)",
    },
    {
      label: "Interview invitations",
      value: String(
        applications.filter((a) => a.status === "SHORTLISTED").length,
      ),
      icon: CalendarClock,
      iconBg: "bg-(--warning-bg)",
      iconColor: "text-(--warning)",
    },
    {
      label: "Profile completion",
      value: "82%",
      icon: UserRound,
      iconBg: "bg-(--success-bg)",
      iconColor: "text-(--success)",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Statistics */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 rounded-(--radius-lg) border border-(--border) bg-(--card) p-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-0 lg:gap-y-0 lg:p-0">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={
              i !== stats.length - 1 ? "lg:border-r lg:border-(--border)" : ""
            }
          >
            <StatCard stat={stat} />
          </div>
        ))}
      </div>
      {/* Recent applications + Complete your profile */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) lg:col-span-2">
          <div className="flex items-center justify-between px-6 pt-5">
            <h2 className="font-display text-base font-semibold text-(--text-primary)">
              Recent applications
            </h2>
            <Link
              to="/candidate/applications"
              className="text-sm font-medium text-(--primary) hover:text-(--primary-dark)"
            >
              View all
            </Link>
          </div>

          {isApplicationsPending ? (
            <p className="px-6 py-10 text-sm text-(--text-muted)">
              Loading applications…
            </p>
          ) : isApplicationsError ? (
            <p className="px-6 py-10 text-sm text-(--danger)">
              Couldn't load your applications. Please try again.
            </p>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <p className="text-sm text-(--text-muted)">
                You haven't applied to any jobs yet.
              </p>
              <Link
                to="/candidate/jobs"
                className="rounded-(--radius-md) bg-(--primary) px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-(--primary-dark)"
              >
                Browse jobs
              </Link>
            </div>
          ) : (
            <div className="mt-2 flex flex-col divide-y divide-(--border)">
              {applications.map((app) => (
                <Link
                  key={app.id}
                  to="/candidate/applications"
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-(--bg)"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-(--radius-sm) bg-(--bg)">
                    <FileText size={16} className="text-(--text-muted)" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-(--text-primary)">
                      {app.job.title}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-(--text-secondary)">
                      {app.job.recruiter.companyName ?? "Unknown company"}
                      <span className="text-(--text-muted)">
                        {" "}
                        · Applied {formatDate(app.appliedAt)}
                      </span>
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[statusLabelMap[app.status]]
                    }`}
                  >
                    {statusLabelMap[app.status]}
                  </span>
                </Link>
              ))}
            </div>
          )}
          <div className="h-5" />
        </div>

        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5">
          <h2 className="text-sm font-semibold text-(--text-primary)">
            Complete your profile
          </h2>
          <p className="mt-1 text-sm text-(--text-secondary)">
            Better profiles get 4x more interviews.
          </p>

          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="font-semibold text-(--text-primary)">
              82% complete
            </span>
            <span className="text-(--text-muted)">2 items left</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-(--bg)">
            <div
              className="h-full rounded-full bg-(--primary)"
              style={{ width: "82%" }}
            />
          </div>

          <ul className="mt-5 flex flex-col gap-3">
            {profileChecklist.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2.5 text-sm"
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                    item.done
                      ? "bg-(--success) text-white"
                      : "border border-(--border) text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span
                  className={
                    item.done
                      ? "text-(--text-muted) line-through"
                      : "text-(--text-secondary)"
                  }
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          <Link
            to="/candidate/profile"
            className="mt-6 block rounded-(--radius-md) border border-(--border) py-2.5 text-center text-sm font-medium text-(--text-primary) transition-colors hover:bg-(--bg)"
          >
            Edit profile
          </Link>
        </div>
      </div>

      {/* Recommended jobs */}
      <div>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-(--text-primary)">
              Recommended for you
            </h2>
            <p className="mt-1 text-sm text-(--text-secondary)">
              Based on your profile and recent searches.
            </p>
          </div>
          <Link
            to="/candidate/jobs"
            className="text-sm font-medium text-(--primary) hover:text-(--primary-dark)"
          >
            Browse all →
          </Link>
        </div>

        {isJobsLoading ? (
          <p className="mt-5 text-sm text-(--text-muted)">Loading jobs…</p>
        ) : isJobsError ? (
          <p className="mt-5 text-sm text-(--danger)">
            Couldn't load recommended jobs. Please try again.
          </p>
        ) : jobs.length === 0 ? (
          <p className="mt-5 text-sm text-(--text-muted)">
            No recommendations yet — try browsing all jobs.
          </p>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {jobs.map((job) => (
              <CandidateJobCard
                job={job}
                isSaved={isJobSaved(job.id)}
                onToggleSave={toggleSave}
                isSaving={isSavingJob(job.id)}
                key={job.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
