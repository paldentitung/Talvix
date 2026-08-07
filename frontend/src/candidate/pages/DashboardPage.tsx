import { Link } from "react-router-dom";
import {
  Send,
  Bookmark,
  CalendarClock,
  UserRound,
  ArrowRight,
  MessageSquare,
  Eye,
  FileText,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const stats = [
  {
    label: "Jobs applied",
    value: "24",
    delta: "+4 this week",
    icon: Send,
    iconBg: "bg-(--primary-light)",
    iconColor: "text-(--primary)",
  },
  {
    label: "Saved jobs",
    value: "12",
    delta: "+2",
    icon: Bookmark,
    iconBg: "bg-(--accent-light)",
    iconColor: "text-(--accent)",
  },
  {
    label: "Interview invitations",
    value: "3",
    delta: "+1",
    icon: CalendarClock,
    iconBg: "bg-(--warning-bg)",
    iconColor: "text-(--warning)",
  },
  {
    label: "Profile completion",
    value: "82%",
    delta: "+8%",
    icon: UserRound,
    iconBg: "bg-(--success-bg)",
    iconColor: "text-(--success)",
  },
];

type ApplicationStatus = "Interview" | "In Review" | "Applied" | "Offer";

const statusStyles: Record<ApplicationStatus, string> = {
  Interview: "bg-(--accent-light) text-(--accent)",
  "In Review": "bg-(--warning-bg) text-(--warning)",
  Applied: "bg-(--bg) text-(--text-secondary)",
  Offer: "bg-(--success-bg) text-(--success)",
};

const recentApplications: {
  title: string;
  company: string;
  status: ApplicationStatus;
  time: string;
}[] = [
  {
    title: "Senior Product Designer",
    company: "Linear",
    status: "Interview",
    time: "2h ago",
  },
  {
    title: "Staff Software Engineer",
    company: "Vercel",
    status: "In Review",
    time: "1d ago",
  },
  {
    title: "Product Marketing Manager",
    company: "Notion",
    status: "Applied",
    time: "3d ago",
  },
  {
    title: "Frontend Engineer",
    company: "Stripe",
    status: "Offer",
    time: "5d ago",
  },
];

const profileChecklist = [
  { label: "Add work experience", done: true },
  { label: "Upload resume", done: true },
  { label: "Add portfolio link", done: false },
  { label: "Set salary expectations", done: false },
];

const activityData = [
  { day: "Mon", applications: 2 },
  { day: "Tue", applications: 4 },
  { day: "Wed", applications: 3 },
  { day: "Thu", applications: 6 },
  { day: "Fri", applications: 5 },
  { day: "Sat", applications: 8 },
  { day: "Sun", applications: 7 },
];

const activityFeed = [
  {
    icon: MessageSquare,
    iconColor: "text-(--accent)",
    iconBg: "bg-(--accent-light)",
    text: "New message from Linear",
    time: "10m ago",
  },
  {
    icon: CalendarClock,
    iconColor: "text-(--warning)",
    iconBg: "bg-(--warning-bg)",
    text: "Interview scheduled at Vercel",
    time: "2h ago",
  },
  {
    icon: Eye,
    iconColor: "text-(--primary)",
    iconBg: "bg-(--primary-light)",
    text: "Stripe viewed your profile",
    time: "5h ago",
  },
  {
    icon: FileText,
    iconColor: "text-(--text-secondary)",
    iconBg: "bg-(--bg)",
    text: "Applied to Notion — PMM role",
    time: "1d ago",
  },
];

const recommendedJobs = [
  {
    title: "Senior Product Designer",
    company: "Linear",
    location: "Remote · US",
    type: "Full-time",
    salary: "$140k – $180k",
    tags: ["Figma", "Design Systems", "SaaS"],
    posted: "Posted 2h ago",
    featured: true,
  },
  {
    title: "Staff Software Engineer, Platform",
    company: "Vercel",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$210k – $260k",
    tags: ["TypeScript", "Node", "Edge"],
    posted: "Posted 5h ago",
    featured: true,
  },
  {
    title: "Product Marketing Manager",
    company: "Notion",
    location: "New York, NY",
    type: "Full-time",
    salary: "$130k – $160k",
    tags: ["B2B", "Growth", "Content"],
    posted: "Posted 1d ago",
    featured: false,
  },
];

const StatCard = ({ stat }: { stat: (typeof stats)[number] }) => {
  const Icon = stat.icon;
  return (
    <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm)">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-(--radius-md) ${stat.iconBg}`}
        >
          <Icon size={18} className={stat.iconColor} />
        </div>
        <span className="rounded-full bg-(--success-bg) px-2 py-0.5 text-xs font-medium text-(--success)">
          {stat.delta}
        </span>
      </div>
      <p className="mt-4 font-display text-2xl font-bold text-(--text-primary)">
        {stat.value}
      </p>
      <p className="mt-1 text-sm text-(--text-secondary)">{stat.label}</p>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-(--text-primary)">
            Good afternoon, Alex
          </h1>
          <p className="mt-1 text-sm text-(--text-secondary)">
            Here's what's happening with your job search this week.
          </p>
        </div>
        <Link
          to="/candidate/jobs"
          className="inline-flex items-center gap-2 rounded-(--radius-md) bg-(--primary) px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-(--primary-dark)"
        >
          Find new jobs
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Recent applications + Complete your profile */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) lg:col-span-2">
          <div className="flex items-center justify-between">
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
          <div className="mt-3 flex flex-col divide-y divide-(--border)">
            {recentApplications.map((app) => (
              <div
                key={app.title}
                className="flex items-center justify-between gap-3 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-(--radius-md) bg-(--bg)">
                    <FileText size={16} className="text-(--text-muted)" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-(--text-primary)">
                      {app.title}
                    </p>
                    <p className="text-sm text-(--text-secondary)">
                      {app.company}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[app.status]}`}
                  >
                    {app.status}
                  </span>
                  <span className="text-xs text-(--text-muted)">
                    {app.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm)">
          <h2 className="font-display text-base font-semibold text-(--text-primary)">
            Complete your profile
          </h2>
          <p className="mt-1 text-sm text-(--text-secondary)">
            Better profiles get 4x more interviews.
          </p>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="font-semibold text-(--text-primary)">
              82% complete
            </span>
            <span className="text-(--text-muted)">2 items left</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-(--bg)">
            <div
              className="h-full rounded-full bg-(--primary)"
              style={{ width: "82%" }}
            />
          </div>

          <ul className="mt-4 flex flex-col gap-2.5">
            {profileChecklist.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
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
            className="mt-5 block rounded-(--radius-md) border border-(--border) py-2.5 text-center text-sm font-medium text-(--text-primary) transition-colors hover:bg-(--bg)"
          >
            Edit profile
          </Link>
        </div>
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-(--text-primary)">
                Application activity
              </h2>
              <p className="text-sm text-(--text-secondary)">Last 7 days</p>
            </div>
            <div className="flex items-center gap-1 rounded-(--radius-md) bg-(--bg) p-1 text-xs font-medium">
              <button className="rounded-(--radius-sm) bg-(--primary) px-3 py-1.5 text-white">
                7d
              </button>
              <button className="rounded-(--radius-sm) px-3 py-1.5 text-(--text-secondary) hover:text-(--text-primary)">
                30d
              </button>
              <button className="rounded-(--radius-sm) px-3 py-1.5 text-(--text-secondary) hover:text-(--text-primary)">
                90d
              </button>
            </div>
          </div>

          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activityData}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="applicationsFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    fontSize: 13,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="url(#applicationsFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm)">
          <h2 className="font-display text-base font-semibold text-(--text-primary)">
            Activity
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            {activityFeed.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.iconBg}`}
                  >
                    <Icon size={14} className={item.iconColor} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-(--text-primary)">
                      {item.text}
                    </p>
                    <p className="text-xs text-(--text-muted)">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommended jobs */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-(--text-primary)">
              Recommended for you
            </h2>
            <p className="text-sm text-(--text-secondary)">
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

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {recommendedJobs.map((job) => (
            <div
              key={job.title}
              className="flex flex-col gap-4 rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm)"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-(--radius-md) bg-(--primary-light) text-sm font-semibold text-(--primary)">
                    {job.company[0]}
                  </div>
                  <div>
                    {job.featured && (
                      <span className="mb-1 inline-block rounded-full bg-(--primary) px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        Featured
                      </span>
                    )}
                    <p className="text-sm font-semibold text-(--text-primary)">
                      {job.title}
                    </p>
                    <p className="text-sm text-(--text-secondary)">
                      {job.company}
                    </p>
                  </div>
                </div>
                <button
                  aria-label="Save job"
                  className="shrink-0 text-(--text-muted) transition-colors hover:text-(--primary)"
                >
                  <Bookmark size={18} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-(--text-secondary)">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-(--text-muted)" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-(--text-muted)" />
                  {job.type}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={13} className="text-(--text-muted)" />
                  {job.salary}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-(--bg) px-2.5 py-1 text-xs font-medium text-(--text-secondary)"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-(--border) pt-4">
                <span className="text-xs text-(--text-muted)">
                  {job.posted}
                </span>
                <button className="rounded-(--radius-md) bg-(--primary) px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-(--primary-dark)">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
