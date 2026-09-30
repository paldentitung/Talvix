import { Link } from "react-router-dom";
import {
  Send,
  Bookmark,
  CalendarClock,
  UserRound,
  FileText,
  Check,
  ChevronRight,
  Sparkles,
  PartyPopper,
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
import { getProfileCompleteness } from "../../features/users/utils/profileCompleteness";
import { useGetCurrentUser } from "../../features/users/hooks/useGetCurrentUser";
import { useSavedJobs } from "../../features/jobs/hooks/useSavedJobs";

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

const CandidateDashboardPage = () => {
  const JOBS_PAGE_SIZE = 3;
  const APPLICATIONS_LIMIT = 5;

  const [jobsPage] = useState(1);
  const [applicationsPage] = useState(1);
  const {
    data: jobsData,
    isLoading: isJobsLoading,
    isError: isJobsError,
  } = useJobs(jobsPage, JOBS_PAGE_SIZE, undefined);

  const jobs = jobsData?.jobs ?? [];
  const { data: user, isLoading: isUserLoading } = useGetCurrentUser();

  const profileCompletion = user ? getProfileCompleteness(user) : null;

  // Incomplete items first so the most useful actions show up on top
  const checklistItems = profileCompletion
    ? [...profileCompletion.checks]
        .sort((a, b) => Number(a.done) - Number(b.done))
        .slice(0, 5)
    : [];

  const {
    data: applicationsData,
    isPending: isApplicationsPending,
    isError: isApplicationsError,
  } = useCandidateApplication(applicationsPage, APPLICATIONS_LIMIT);

  const applications: Application[] =
    applicationsData?.data?.applications ?? [];
  const totalApplications = applicationsData?.data?.pagination?.total ?? 0;

  const { isJobSaved, isSavingJob, toggleSave } = useJobSaveActions();
  const { data: savedJobs, isPending: isSavedPending } = useSavedJobs();

  const savedCount = savedJobs?.length ?? 0;
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
      value: isSavedPending ? "—" : String(savedCount),
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
      value: profileCompletion ? `${profileCompletion.percentage}%` : "—",
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

        {/* Complete your profile */}
        <div className="overflow-hidden rounded-(--radius-lg) border border-(--border) bg-(--card) shadow-(--shadow-sm)">
          {/* Header with ring */}
          <div className="bg-linear-to-br from-(--primary-light) via-(--card) to-(--card) p-5">
            {isUserLoading || !profileCompletion ? (
              <div className="flex animate-pulse items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-(--border)" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-(--border)" />
                  <div className="h-3 w-1/2 rounded bg-(--border)" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0">
                  <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="7"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      stroke={
                        profileCompletion.remaining === 0
                          ? "var(--success)"
                          : "var(--primary)"
                      }
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 34}
                      strokeDashoffset={
                        2 *
                        Math.PI *
                        34 *
                        (1 - profileCompletion.percentage / 100)
                      }
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div
                    role="progressbar"
                    aria-valuenow={profileCompletion.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Profile completion"
                    className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold text-(--text-primary)"
                  >
                    {profileCompletion.percentage}%
                  </div>
                </div>

                <div className="min-w-0">
                  <h2 className="font-display text-base font-semibold text-(--text-primary)">
                    {profileCompletion.remaining === 0
                      ? "Your profile is complete"
                      : "Complete your profile"}
                  </h2>
                  <p className="mt-1 text-sm leading-snug text-(--text-secondary)">
                    {profileCompletion.remaining === 0
                      ? "Nice work. Recruiters can see your full profile."
                      : `${profileCompletion.remaining} ${
                          profileCompletion.remaining === 1 ? "step" : "steps"
                        } left. Better profiles get 4x more interviews.`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Checklist */}
          {profileCompletion && (
            <>
              {profileCompletion.remaining === 0 ? (
                <div className="flex items-center gap-2 border-t border-(--border) bg-(--success-bg) px-5 py-3 text-sm font-medium text-(--success)">
                  <PartyPopper size={16} />
                  You're all set. Keep it up to date.
                </div>
              ) : (
                <ul className="border-t border-(--border) p-2">
                  {checklistItems.map((item) =>
                    item.done ? (
                      <li
                        key={item.label}
                        className="flex items-center gap-3 rounded-(--radius-md) px-3 py-2.5 text-sm"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-(--success-bg) text-(--success)">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span className="text-(--text-muted)">
                          {item.label}
                        </span>
                      </li>
                    ) : (
                      <li key={item.label}>
                        <Link
                          to="/candidate/profile"
                          className="group flex items-center gap-3 rounded-(--radius-md) px-3 py-2.5 text-sm transition-colors hover:bg-(--primary-light) focus-visible:outline-2 focus-visible:outline-(--primary)"
                        >
                          <span className="h-5 w-5 shrink-0 rounded-full border-2 border-dashed border-(--text-muted) transition-colors group-hover:border-(--primary)" />
                          <span className="flex-1 font-medium text-(--text-primary)">
                            {item.label}
                          </span>
                          <ChevronRight
                            size={16}
                            className="text-(--text-muted) transition-transform group-hover:translate-x-0.5 group-hover:text-(--primary)"
                          />
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </>
          )}

          {/* CTA */}
          <div className="p-5 pt-3">
            <Link
              to="/candidate/profile"
              className="flex items-center justify-center gap-2 rounded-(--radius-md) bg-(--primary) py-2.5 text-sm font-medium text-white shadow-(--shadow-sm) transition-all hover:bg-(--primary-dark) hover:shadow-(--shadow-md) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)"
            >
              <Sparkles size={15} />
              {profileCompletion?.remaining === 0
                ? "View profile"
                : "Continue setup"}
            </Link>
          </div>
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

export default CandidateDashboardPage;
