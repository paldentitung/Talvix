import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Send,
  Bookmark,
  CalendarClock,
  UserRound,
  FileText,
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  User,
  Wrench,
  AlignLeft,
  BadgeCheck,
  ChevronRight,
  Sparkles,
  PartyPopper,
  Search,
  Lightbulb,
  ClipboardList,
  Upload,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import CandidateJobCard from "../components/CandidateJobCard";
import type {
  Application,
  ApplicationStatus,
} from "../../features/applications/types/application.types";
import { useJobSaveActions } from "../../features/jobs/hooks/useJobSaveActions";
import { useJobs } from "../../features/jobs/hooks/useJobs";
import { useCandidateApplication } from "../../features/applications/hooks/useCandidateApplication";
import { getProfileCompleteness } from "../../features/users/utils/profileCompleteness";
import { useGetCurrentUser } from "../../features/users/hooks/useGetCurrentUser";
import { useSavedJobs } from "../../features/jobs/hooks/useSavedJobs";

/* ------------------------------------------------------------------ */
/*  Constants & helpers                                                */
/* ------------------------------------------------------------------ */

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

const STATIC_TIPS = [
  "Tailor your headline to the role you want, not the job you have now.",
  "Set aside a little time each week to review new jobs and apply to the best fits.",
  "Add measurable results to your experience, like numbers, scale and outcomes.",
  "Keep your skills list focused. Five relevant skills beat fifteen generic ones.",
  "Write a short cover letter that names the company and one thing you like about it.",
  "Follow up on applications that have sat in review for more than two weeks.",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

/* ------------------------------------------------------------------ */
/*  Stat card                                                          */
/* ------------------------------------------------------------------ */

type Stat = {
  label: string;
  value: string;
  hint?: string;
  icon: typeof Send;
  iconBg: string;
  iconColor: string;
};

const StatCard = ({ stat }: { stat: Stat }) => {
  const Icon = stat.icon;

  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-(--radius-md) ${stat.iconBg}`}
      >
        <Icon size={20} className={stat.iconColor} />
      </div>

      <div className="min-w-0">
        <p className="font-display text-3xl font-bold leading-none tracking-tight text-(--text-primary)">
          {stat.value}
        </p>
        <p className="mt-1.5 truncate text-sm font-medium text-(--text-secondary)">
          {stat.label}
        </p>
        {stat.hint && (
          <p className="mt-0.5 truncate text-xs text-(--text-muted)">
            {stat.hint}
          </p>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Profile next steps                                                 */
/* ------------------------------------------------------------------ */

type StepMeta = {
  href: string;
  icon: LucideIcon;
  hint: string;
  priority: number; // lower = shown first
};

// Anchors only work if the profile page has matching element ids.
const STEP_META: Record<string, StepMeta> = {
  Resume: {
    href: "/candidate/profile#resume",
    icon: FileText,
    hint: "Attach one so applying takes a single click.",
    priority: 1,
  },
  Skills: {
    href: "/candidate/profile#skills",
    icon: Wrench,
    hint: "List what you're good at so jobs can be matched to you.",
    priority: 2,
  },
  Experience: {
    href: "/candidate/profile#experience",
    icon: Briefcase,
    hint: "Show where you've worked and what you achieved.",
    priority: 3,
  },
  Headline: {
    href: "/candidate/profile#about",
    icon: BadgeCheck,
    hint: "One line that tells recruiters who you are.",
    priority: 4,
  },
  Bio: {
    href: "/candidate/profile#about",
    icon: AlignLeft,
    hint: "Two or three sentences on what you're looking for.",
    priority: 5,
  },
  Education: {
    href: "/candidate/profile#education",
    icon: GraduationCap,
    hint: "Add your degree, course or training.",
    priority: 6,
  },
  Location: {
    href: "/candidate/profile#about",
    icon: MapPin,
    hint: "Helps with location-based roles.",
    priority: 7,
  },
  Phone: {
    href: "/candidate/profile#personal",
    icon: Phone,
    hint: "Lets recruiters reach you directly.",
    priority: 8,
  },
  "First name": {
    href: "/candidate/profile#personal",
    icon: User,
    hint: "Shown on your applications.",
    priority: 9,
  },
  "Last name": {
    href: "/candidate/profile#personal",
    icon: User,
    hint: "Shown on your applications.",
    priority: 10,
  },
};

const FALLBACK_STEP: StepMeta = {
  href: "/candidate/profile",
  icon: UserRound,
  hint: "",
  priority: 99,
};

const getStepMeta = (label: string) => STEP_META[label] ?? FALLBACK_STEP;

const VISIBLE_EXTRA_STEPS = 3;

const ProfileNextSteps = ({
  checks,
  total,
}: {
  checks: { label: string; done: boolean }[];
  total: number;
}) => {
  const [expanded, setExpanded] = useState(false);

  const pending = checks
    .filter((c) => !c.done)
    .sort(
      (a, b) => getStepMeta(a.label).priority - getStepMeta(b.label).priority,
    );
  const gain = Math.round(100 / total);

  if (pending.length === 0) {
    return (
      <div className="flex items-center gap-2 border-t border-(--border) bg-(--success-bg) px-5 py-3 text-sm font-medium text-(--success)">
        <PartyPopper size={16} />
        You're all set. Keep it up to date.
      </div>
    );
  }

  const [next, ...rest] = pending;
  const nextMeta = getStepMeta(next.label);
  const NextIcon = nextMeta.icon;
  const visibleRest = expanded ? rest : rest.slice(0, VISIBLE_EXTRA_STEPS);
  const hiddenCount = rest.length - visibleRest.length;

  return (
    <div className="border-t border-(--border) px-5 pb-1 pt-4">
      {/* One segment per step */}
      <div
        className="flex gap-1"
        role="img"
        aria-label={`${total - pending.length} of ${total} steps completed`}
      >
        {checks.map((c) => (
          <span
            key={c.label}
            className={`h-1.5 flex-1 rounded-full ${
              c.done ? "bg-(--success)" : "bg-(--border)"
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-(--text-muted)">
        {total - pending.length} of {total} completed
      </p>

      {/* Up next */}
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-(--text-muted)">
        Up next
      </p>
      <Link
        to={nextMeta.href}
        className="group mt-2 flex items-start gap-3 rounded-(--radius-md) border border-(--primary)/30 bg-(--primary-light) p-3 transition-shadow hover:shadow-(--shadow-sm) focus-visible:outline-2 focus-visible:outline-(--primary)"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius-sm) bg-(--card) text-(--primary)">
          <NextIcon size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-(--text-primary)">
              {next.label}
            </span>
            <span className="shrink-0 rounded-full bg-(--card) px-2 py-0.5 text-xs font-semibold text-(--primary)">
              +{gain}%
            </span>
          </span>
          {nextMeta.hint && (
            <span className="mt-0.5 block text-xs leading-snug text-(--text-secondary)">
              {nextMeta.hint}
            </span>
          )}
        </span>
        <ChevronRight
          size={16}
          className="mt-2 shrink-0 text-(--primary) transition-transform group-hover:translate-x-0.5"
        />
      </Link>

      {/* Remaining steps */}
      {rest.length > 0 && (
        <>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-(--text-muted)">
            Then
          </p>
          <ul className="mt-1">
            {visibleRest.map((item) => {
              const meta = getStepMeta(item.label);
              const Icon = meta.icon;
              return (
                <li key={item.label}>
                  <Link
                    to={meta.href}
                    className="group -mx-2 flex items-center gap-3 rounded-(--radius-md) px-2 py-2 text-sm transition-colors hover:bg-(--primary-light) focus-visible:outline-2 focus-visible:outline-(--primary)"
                  >
                    <Icon
                      size={16}
                      className="shrink-0 text-(--text-muted) transition-colors group-hover:text-(--primary)"
                    />
                    <span className="flex-1 font-medium text-(--text-primary)">
                      {item.label}
                    </span>
                    <span className="text-xs text-(--text-muted)">
                      +{gain}%
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {(hiddenCount > 0 || expanded) &&
            rest.length > VISIBLE_EXTRA_STEPS && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-1 text-xs font-medium text-(--primary) hover:text-(--primary-dark)"
              >
                {expanded ? "Show less" : `Show ${hiddenCount} more`}
              </button>
            )}
        </>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const CandidateDashboardPage = () => {
  const JOBS_PAGE_SIZE = 4;
  const APPLICATIONS_DISPLAY_LIMIT = 5;
  // Fetch more than we display so status counts are accurate for most users.
  // Check that your API allows this limit; lower it if it is capped.
  const APPLICATIONS_FETCH_LIMIT = 50;

  /* ---------- data ---------- */

  const {
    data: jobsData,
    isLoading: isJobsLoading,
    isError: isJobsError,
  } = useJobs(1, JOBS_PAGE_SIZE, undefined, { sort: "newest" });
  const jobs = jobsData?.jobs ?? [];

  const { data: user, isLoading: isUserLoading } = useGetCurrentUser();
  const profileCompletion = user ? getProfileCompleteness(user) : null;

  const {
    data: applicationsData,
    isPending: isApplicationsPending,
    isError: isApplicationsError,
  } = useCandidateApplication(1, APPLICATIONS_FETCH_LIMIT);

  const allLoadedApplications: Application[] =
    applicationsData?.data?.applications ?? [];
  const totalApplications = applicationsData?.data?.pagination?.total ?? 0;
  const recentApplications = allLoadedApplications.slice(
    0,
    APPLICATIONS_DISPLAY_LIMIT,
  );

  // True when we hold every application, so derived counts are exact.
  const hasAllApplications = allLoadedApplications.length >= totalApplications;

  const { isJobSaved, isSavingJob, toggleSave } = useJobSaveActions();
  const { data: savedJobs, isPending: isSavedPending } = useSavedJobs();
  const savedCount = savedJobs?.length ?? 0;

  /* ---------- derived ---------- */

  const now = new Date();

  const interviewCount = allLoadedApplications.filter(
    (a) => a.status === "SHORTLISTED",
  ).length;
  const inReviewCount = allLoadedApplications.filter(
    (a) => a.status === "REVIEWING",
  ).length;

  const weekAgo = now.getTime() - 7 * 86_400_000;
  const appliedThisWeek = allLoadedApplications.filter(
    (a) => new Date(a.appliedAt).getTime() >= weekAgo,
  ).length;

  // Same ordering as the "Up next" card so the tip and the card agree.
  const nextStep = profileCompletion?.checks
    .filter((c) => !c.done)
    .sort(
      (a, b) => getStepMeta(a.label).priority - getStepMeta(b.label).priority,
    )[0];

  // Tip based on the user's real state, falling back to a daily rotating tip.
  const tip = (() => {
    if (nextStep) {
      return `Add your ${nextStep.label.toLowerCase()} to strengthen your profile.`;
    }
    if (!isApplicationsPending && totalApplications === 0) {
      return savedCount > 0
        ? `You've saved ${savedCount} ${savedCount === 1 ? "job" : "jobs"}. Pick one and send your first application.`
        : "Start by saving a few roles that interest you, then apply to your favourite.";
    }
    return STATIC_TIPS[getDayOfYear(now) % STATIC_TIPS.length];
  })();

  const stats: Stat[] = [
    {
      label: "Jobs applied",
      value: String(totalApplications),
      hint:
        hasAllApplications && totalApplications > 0
          ? `${appliedThisWeek} in the last 7 days`
          : undefined,
      icon: Send,
      iconBg: "bg-(--primary-light)",
      iconColor: "text-(--primary)",
    },
    {
      label: "Saved jobs",
      value: isSavedPending ? "—" : String(savedCount),
      hint: !isSavedPending && savedCount > 0 ? "Ready to apply" : undefined,
      icon: Bookmark,
      iconBg: "bg-(--accent-light)",
      iconColor: "text-(--accent)",
    },
    {
      label: "Interview invitations",
      value: `${interviewCount}${hasAllApplications ? "" : "+"}`,
      hint: inReviewCount > 0 ? `${inReviewCount} in review` : undefined,
      icon: CalendarClock,
      iconBg: "bg-(--warning-bg)",
      iconColor: "text-(--warning)",
    },
    {
      label: "Profile completion",
      value: profileCompletion ? `${profileCompletion.percentage}%` : "—",
      hint: profileCompletion
        ? profileCompletion.remaining === 0
          ? "All done"
          : `${profileCompletion.remaining} ${
              profileCompletion.remaining === 1 ? "step" : "steps"
            } left`
        : undefined,
      icon: UserRound,
      iconBg: "bg-(--success-bg)",
      iconColor: "text-(--success)",
    },
  ];

  const quickActions = [
    { label: "Browse jobs", to: "/candidate/jobs", icon: Search },
    {
      label: "My applications",
      to: "/candidate/applications",
      icon: ClipboardList,
    },
    { label: "Saved jobs", to: "/candidate/saved-jobs", icon: Bookmark },
    {
      label: user?.resumeUrl ? "Update resume" : "Upload resume",
      to: "/candidate/profile#resume",
      icon: Upload,
    },
  ];

  /* ---------- render ---------- */

  return (
    <div className="flex flex-col gap-6">
      {/* Tip */}
      <p className="flex items-start gap-2 text-sm text-(--text-secondary)">
        <Lightbulb size={16} className="mt-0.5 shrink-0 text-(--warning)" />
        <span>{tip}</span>
      </p>

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

      {/* Main column + sidebar. On mobile the sidebar stacks below. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ---------------- Main column ---------------- */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Recent applications */}
          <div className="rounded-(--radius-lg) border border-(--border) bg-(--card)">
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
            ) : recentApplications.length === 0 ? (
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
                {recentApplications.map((app) => (
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
                        {app.job.recruiter.companyName ??
                          app.job.recruiter.recruiterProfile?.companyName ??
                          "Unknown company"}
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

          {/* Latest jobs (relabelled until real recommendations exist) */}
          <div>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold text-(--text-primary)">
                  Latest jobs
                </h2>
                <p className="mt-1 text-sm text-(--text-secondary)">
                  The newest openings you can apply to.
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
                Couldn't load jobs. Please try again.
              </p>
            ) : jobs.length === 0 ? (
              <p className="mt-5 text-sm text-(--text-muted)">
                No jobs yet. Check back soon.
              </p>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
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

        {/* ---------------- Sidebar ---------------- */}
        <aside className="flex flex-col gap-6">
          {/* Quick actions */}
          <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-2">
            <h2 className="px-3 pb-1 pt-3 font-display text-base font-semibold text-(--text-primary)">
              Quick actions
            </h2>
            <ul>
              {quickActions.map(({ label, to, icon: Icon }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="group flex items-center gap-3 rounded-(--radius-md) px-3 py-2.5 text-sm font-medium text-(--text-primary) transition-colors hover:bg-(--primary-light) focus-visible:outline-2 focus-visible:outline-(--primary)"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-(--radius-sm) bg-(--bg) text-(--text-secondary) transition-colors group-hover:bg-(--card) group-hover:text-(--primary)">
                      <Icon size={16} />
                    </span>
                    <span className="flex-1">{label}</span>
                    <ChevronRight
                      size={16}
                      className="text-(--text-muted) transition-transform group-hover:translate-x-0.5 group-hover:text-(--primary)"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Complete your profile */}
          <div className="overflow-hidden rounded-(--radius-lg) border border-(--border) bg-(--card) shadow-(--shadow-sm)">
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
                    <svg
                      viewBox="0 0 80 80"
                      className="h-full w-full -rotate-90"
                    >
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
                          } left. A complete profile helps recruiters find you.`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Next steps */}
            {profileCompletion && (
              <ProfileNextSteps
                checks={profileCompletion.checks}
                total={profileCompletion.total}
              />
            )}

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
        </aside>
      </div>
    </div>
  );
};

export default CandidateDashboardPage;
