import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useRecruiterJobs } from "../../features/jobs/hooks/useRecruiterJobs";
import type { Job, JobStatus } from "../../features/jobs/types/job.types";

type Stat = {
  label: string;
  value: string;
  delta: string;
};

const stats: Stat[] = [
  { label: "Active jobs", value: "18", delta: "+2" },
  { label: "Total applicants", value: "1,428", delta: "+124" },
  { label: "Job views", value: "24,318", delta: "+18%" },
  { label: "Offer rate", value: "14.2%", delta: "+1.4%" },
];

const funnel = [
  { stage: "Applied", value: 580 },
  { stage: "Screened", value: 410 },
  { stage: "Interview", value: 260 },
  { stage: "Offer", value: 150 },
  { stage: "Hired", value: 92 },
];

const sources = [
  { label: "Direct", value: 34, color: "var(--primary)" },
  { label: "LinkedIn", value: 28, color: "var(--accent)" },
  { label: "Referral", value: 22, color: "var(--warning)" },
  { label: "Other", value: 16, color: "var(--text-muted)" },
];

const statusStyles: Record<JobStatus, string> = {
  OPEN: "bg-(--success-bg) text-(--success)",
  DRAFT: "bg-(--border) text-(--text-secondary)",
  CLOSED: "bg-(--danger-bg) text-(--danger)",
};

const candidates = [
  { initials: "PS", name: "Priya Shah", role: "Designer", match: 96 },
  { initials: "ML", name: "Marcus Lee", role: "Engineer", match: 93 },
  { initials: "AG", name: "Ana García", role: "PM", match: 91 },
  { initials: "JK", name: "Jordan Kim", role: "Designer", match: 89 },
];

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  fontSize: "12px",
  color: "var(--text-primary)",
};

const StatCard = ({ label, value, delta }: Stat) => (
  <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm)">
    <div className="flex items-center justify-between">
      <p className="text-sm text-(--text-secondary)">{label}</p>
      <span className="rounded-full bg-(--success-bg) px-2 py-0.5 text-xs font-semibold text-(--success)">
        {delta}
      </span>
    </div>
    <p className="mt-2 font-display text-2xl font-bold text-(--text-primary)">
      {value}
    </p>
  </div>
);

const DashboardPage = () => {
  const { data: jobs = [] } = useRecruiterJobs();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) lg:col-span-2">
          <h2 className="font-display text-base font-bold text-(--text-primary)">
            Hiring funnel
          </h2>
          <p className="mt-0.5 text-sm text-(--text-secondary)">
            Last 30 days across all open roles
          </p>

          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnel}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="stage"
                  tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 600]}
                  ticks={[0, 150, 300, 450, 600]}
                  tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--primary-light)" }}
                  contentStyle={tooltipStyle}
                />
                <Bar
                  dataKey="value"
                  fill="var(--primary)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm)">
          <h2 className="font-display text-base font-bold text-(--text-primary)">
            Applicant sources
          </h2>

          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sources}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={2}
                  stroke="none"
                >
                  {sources.map((s) => (
                    <Cell key={s.label} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {sources.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2 text-(--text-secondary)">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.label}
                </span>
                <span className="font-semibold text-(--text-primary)">
                  {s.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-(--text-primary)">
              Active jobs
            </h2>
            <Link
              to="/recruiter/jobs"
              className="text-sm font-semibold text-(--primary) hover:text-(--primary-dark)"
            >
              Manage all
            </Link>
          </div>

          <div className="mt-4 flex flex-col divide-y divide-(--border)">
            {jobs.slice(0, Math.ceil(jobs.length * 0.4)).map((job: Job) => (
              <Link
                to={`/recruiter/jobs/${job.id}`}
                key={job.title}
                className="group flex items-center justify-between gap-4 py-4 px-2 -mx-2 rounded-lg transition-colors hover:bg-(--surface-hover)"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-(--text-primary)">
                    {job.title}
                  </p>
                  <p className="mt-0.5 text-xs text-(--text-secondary)">
                    {job.location}
                  </p>
                </div>

                <div className="hidden shrink-0 items-baseline gap-1 text-xs text-(--text-secondary) sm:flex">
                  <span className="font-medium text-(--text-primary)">
                    {job.applicationsCount ?? 0}
                  </span>
                  <span>applicants</span>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-transform group-hover:scale-105 ${statusStyles[job.status]}`}
                >
                  {job.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm)">
          <h2 className="font-display text-base font-bold text-(--text-primary)">
            Top candidates
          </h2>
          <p className="mt-0.5 text-sm text-(--text-secondary)">
            This week's highest matches
          </p>

          <div className="mt-4 flex flex-col gap-4">
            {candidates.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--primary-light) text-xs font-semibold text-(--primary)">
                  {c.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-(--text-primary)">
                    {c.name}
                  </p>
                  <p className="text-xs text-(--text-secondary)">
                    {c.role} · {c.match}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
