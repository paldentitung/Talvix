import { Link, useOutletContext } from "react-router-dom";
import {
  BriefcaseBusiness,
  CheckCheck,
  Clock,
  Plus,
  ShieldAlert,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Button from "../../components/ui/Button";
import { tintFor } from "../../shared/utils/avatarTint";
import initials from "../../shared/utils/getInitials";
import relativeTime from "../../shared/utils/relativeTime";
import { useRecruiterDashboard } from "../../features/dashboard/hooks/useRecruiterDashboard";
import type { JobStatus } from "../../features/jobs/types/job.types";
import type {
  EmploymentType,
  PipelineStage,
} from "../../features/dashboard/types/dashboard.types";

type RecruiterOutletContext = {
  openJobPostingModal: () => void;
};

type Stat = {
  label: string;
  value: string;
  hint: string;
  to: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  highlight?: boolean;
};

const STAGE_LABELS: Record<PipelineStage, string> = {
  PENDING: "Pending",
  REVIEWING: "Reviewing",
  SHORTLISTED: "Shortlisted",
  ACCEPTED: "Accepted",
};

const STAGE_COLORS: Record<PipelineStage, string> = {
  PENDING: "var(--primary)",
  REVIEWING: "var(--accent)",
  SHORTLISTED: "var(--warning)",
  ACCEPTED: "var(--success)",
};

const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const STATUS_LABELS: Record<JobStatus, string> = {
  OPEN: "Open",
  DRAFT: "Draft",
  CLOSED: "Closed",
};

const statusStyles: Record<JobStatus, string> = {
  OPEN: "bg-(--success-bg) text-(--success)",
  DRAFT: "bg-(--border) text-(--text-secondary)",
  CLOSED: "bg-(--danger-bg) text-(--danger)",
};

const formatDay = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

const cardClass =
  "rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm)";

const RecruiterDashboardPage = () => {
  const { data, isLoading, isError } = useRecruiterDashboard();
  const { openJobPostingModal } = useOutletContext<RecruiterOutletContext>();

  if (isLoading)
    return (
      <div className="flex flex-col gap-6">
        <div className="h-12 animate-pulse rounded-(--radius-lg) bg-(--border)" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-(--radius-lg) bg-(--border)"
            />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-(--radius-lg) bg-(--border)" />
      </div>
    );

  if (isError || !data)
    return (
      <div className="p-6 text-sm text-(--danger)">
        Failed to load dashboard. Refresh the page to try again.
      </div>
    );

  const { overview, trend, pipeline, jobs, needsReview } = data;

  const stats: Stat[] = [
    {
      label: "Active jobs",
      value: overview.activeJobs.toLocaleString(),
      hint: "Open for applications",
      to: "/recruiter/jobs",
      icon: BriefcaseBusiness,
      iconBg: "bg-(--primary-light)",
      iconColor: "text-(--primary)",
    },
    {
      label: "Total applicants",
      value: overview.totalApplicants.toLocaleString(),
      hint: `${overview.newApplicantsThisWeek} new this week`,
      to: "/recruiter/jobs",
      icon: Users,
      iconBg: "bg-(--accent-light)",
      iconColor: "text-(--accent)",
    },
    {
      label: "Awaiting review",
      value: overview.awaitingReview.toLocaleString(),
      hint: "Applicants not yet reviewed",
      to: "/recruiter/jobs",
      icon: Clock,
      iconBg: "bg-(--warning-bg)",
      iconColor: "text-(--warning)",
      highlight: overview.awaitingReview > 0,
    },
    {
      label: "Hired this month",
      value: overview.hiredThisMonth.toLocaleString(),
      hint: "Across all roles",
      to: "/recruiter/jobs",
      icon: CheckCheck,
      iconBg: "bg-(--primary-light)",
      iconColor: "text-(--primary)",
    },
  ];

  // Attention banner text
  const attention: string[] = [];
  if (overview.awaitingReview > 0)
    attention.push(
      `${plural(overview.awaitingReview, "applicant is", "applicants are")} waiting for review`,
    );
  if (overview.jobsClosingSoon > 0)
    attention.push(
      `${plural(overview.jobsClosingSoon, "job closes", "jobs close")} in 3 days`,
    );

  // Chart: x-axis ticks on the first day, every 7th day and the last day
  const ticks = [0, 7, 14, 21, trend.length - 1]
    .filter((i) => trend[i])
    .map((i) => trend[i].date);

  // Donut
  const pipelineTotal = pipeline.reduce((sum, p) => sum + p.count, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Attention banner */}
      {attention.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-(--radius-lg) border border-(--warning)/30 bg-(--warning-bg) px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--warning)/15 text-(--warning)">
              <ShieldAlert size={14} />
            </span>
            <p className="text-sm text-(--text-primary)">
              <span className="font-semibold">Needs attention:</span>{" "}
              {attention.join(" and ")}.
            </p>
          </div>
          <Link
            to="/recruiter/jobs"
            className="rounded-(--radius-md) bg-(--text-primary) px-3.5 py-2 text-xs font-semibold text-white"
          >
            Review applicants
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.to}
              className={`rounded-(--radius-lg) border bg-(--card) p-5 shadow-(--shadow-sm) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-md) ${
                stat.highlight ? "border-(--warning)/40" : "border-(--border)"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-(--radius-md) ${stat.iconBg} ${stat.iconColor}`}
                >
                  <Icon size={16} strokeWidth={2.25} />
                </span>
                <p className="text-sm font-medium text-(--text-secondary)">
                  {stat.label}
                </p>
              </div>
              <p className="mt-4 font-display text-3xl font-bold tracking-tight text-(--text-primary)">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-(--text-muted)">{stat.hint}</p>
            </Link>
          );
        })}
      </div>

      {/* Applications chart + pipeline donut */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.8fr_1fr]">
        <div className={cardClass}>
          <h2 className="font-display text-base font-semibold text-(--text-primary)">
            Applications over time
          </h2>
          <p className="mb-4 text-sm text-(--text-secondary)">
            New applications in the last 30 days
          </p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 8, right: 12, left: -20 }}>
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  interval={0}
                  ticks={ticks}
                  tickFormatter={formatDay}
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  domain={[0, "auto"]}
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  labelFormatter={(d) => formatDay(String(d))}
                  formatter={(v) => [v, "Applications"]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-md)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="var(--primary-light)"
                  dot={(props) => {
                    const { cx, cy, index, payload } = props;
                    if (!payload || payload.count === 0)
                      return <g key={index} />;
                    return (
                      <circle
                        key={index}
                        cx={cx}
                        cy={cy}
                        r={3.5}
                        fill="#fff"
                        stroke="var(--primary)"
                        strokeWidth={2}
                      />
                    );
                  }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="font-display text-base font-semibold text-(--text-primary)">
            Pipeline by stage
          </h2>
          <p className="mb-4 text-sm text-(--text-secondary)">
            Where applicants are right now
          </p>

          {pipelineTotal === 0 ? (
            <p className="py-16 text-center text-sm text-(--text-muted)">
              No applicants yet.
            </p>
          ) : (
            <>
              <div className="relative mx-auto h-40 w-40">
                <PieChart width={160} height={160}>
                  <Pie
                    data={pipeline}
                    dataKey="count"
                    nameKey="stage"
                    startAngle={90}
                    endAngle={-270}
                    innerRadius={52}
                    outerRadius={74}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {pipeline.map((p) => (
                      <Cell key={p.stage} fill={STAGE_COLORS[p.stage]} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-2xl font-bold text-(--text-primary)">
                    {pipelineTotal}
                  </span>
                  <span className="text-xs text-(--text-muted)">
                    in pipeline
                  </span>
                </div>
              </div>

              <ul className="mt-5 space-y-2 text-sm">
                {pipeline.map((p) => (
                  <li
                    key={p.stage}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2 text-(--text-secondary)">
                      <i
                        className="h-2 w-2 rounded-sm"
                        style={{ background: STAGE_COLORS[p.stage] }}
                      />
                      {STAGE_LABELS[p.stage]}
                    </span>
                    <b className="text-(--text-primary)">{p.count}</b>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Active jobs + needs review */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.8fr_1fr]">
        <div className={cardClass}>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-(--text-primary)">
              Active jobs
            </h2>
            <Link
              to="/recruiter/jobs"
              className="text-sm font-medium text-(--primary) hover:text-(--primary-dark)"
            >
              Manage all
            </Link>
          </div>

          {jobs.length > 0 ? (
            <div className="flex flex-col divide-y divide-(--border)">
              {jobs.map((job) => (
                <Link
                  to={`/recruiter/jobs/${job.id}`}
                  key={job.id}
                  className="group -mx-2 flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-(--surface-hover)"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-(--text-primary)">
                      {job.title}
                    </p>
                    <p className="text-xs text-(--text-secondary)">
                      {job.location} · {EMPLOYMENT_LABELS[job.employmentType]}
                    </p>
                  </div>

                  <div className="hidden shrink-0 items-center text-xs text-(--text-secondary) sm:flex">
                    <span className="mr-1 font-semibold text-(--text-primary)">
                      {job.applicantsCount}
                    </span>
                    applicants
                    {job.newApplicantsCount > 0 && (
                      <span className="ml-1.5 rounded-full bg-(--primary-light) px-2 py-0.5 text-[11px] font-semibold text-(--primary)">
                        +{job.newApplicantsCount} new
                      </span>
                    )}
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[job.status]}`}
                  >
                    {STATUS_LABELS[job.status]}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-(--border) px-6 py-10 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-(--surface-hover)">
                <BriefcaseBusiness
                  size={24}
                  className="text-(--text-secondary)"
                />
              </div>
              <h3 className="text-sm font-semibold text-(--text-primary)">
                No job postings yet
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-(--text-secondary)">
                Create your first job posting to start attracting candidates.
                Your published jobs will appear here.
              </p>
              <Button onClick={openJobPostingModal} className="mt-5">
                <Plus size={16} />
                Create a job
              </Button>
            </div>
          )}
        </div>

        <div className={cardClass}>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-(--text-primary)">
              Needs review
            </h2>
            <Link
              to="/recruiter/jobs"
              className="text-sm font-medium text-(--primary) hover:text-(--primary-dark)"
            >
              View all
            </Link>
          </div>

          {needsReview.length === 0 ? (
            <p className="py-10 text-center text-sm text-(--text-muted)">
              All caught up. No applicants are waiting for review.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-(--border)">
              {needsReview.map((a) => {
                const tint = tintFor(a.candidateName);
                return (
                  <Link
                    key={a.id}
                    to={`/recruiter/applicants/${a.jobId}`}
                    className="flex items-center gap-3 py-3"
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                      style={{ background: tint.bg, color: tint.fg }}
                    >
                      {initials(a.candidateName)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-(--text-primary)">
                        {a.candidateName}
                      </p>
                      <p className="truncate text-xs text-(--text-secondary)">
                        {a.jobTitle}
                      </p>
                      <p className="text-[11px] text-(--text-muted)">
                        {relativeTime(a.appliedAt)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-(--radius-md) border border-(--border) px-3 py-1.5 text-xs font-medium text-(--text-primary) hover:bg-(--primary-light)">
                      Review
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboardPage;
