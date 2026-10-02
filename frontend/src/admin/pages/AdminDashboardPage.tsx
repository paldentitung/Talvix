import {
  Users,
  Building2,
  Briefcase,
  ShieldAlert,
  TrendingUp,
  CreditCard,
  MessageSquare,
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
import { useUsers } from "../../features/users/hooks/useUsers";
import { ROLE_LABELS } from "../../shared/constants/roleLabels";
import { Link } from "react-router-dom";
import { useAdminJobs } from "../../features/jobs/hooks/useAdminJobs";
import { tintFor } from "../../shared/utils/avatarTint";
import { fullName } from "../../shared/utils/getFullname";
import initials from "../../shared/utils/getInitials";
import relativeTime from "../../shared/utils/relativeTime";
import { useCompanies } from "../../features/company/hooks/useCompanies";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { AdminUser } from "../../features/users/types/user.types";
const growthData = [
  { month: "Jan", users: 1200 },
  { month: "Feb", users: 1900 },
  { month: "Mar", users: 2600 },
  { month: "Apr", users: 3500 },
  { month: "May", users: 4400 },
  { month: "Jun", users: 5300 },
  { month: "Jul", users: 6100 },
  { month: "Aug", users: 6900 },
  { month: "Sep", users: 7800 },
  { month: "Oct", users: 9000 },
  { month: "Nov", users: 10100 },
  { month: "Dec", users: 11400 },
];

type Activity = {
  icon: typeof Users;
  iconBg: string;
  iconColor: string;
  title: string;
  time: string;
};

const activity: Activity[] = [
  {
    icon: Users,
    iconBg: "bg-(--primary-light)",
    iconColor: "text-(--primary)",
    title: "247 new users this hour",
    time: "Just now",
  },
  {
    icon: CreditCard,
    iconBg: "bg-(--accent-light)",
    iconColor: "text-(--accent)",
    title: "Stripe upgraded to Enterprise",
    time: "12m ago",
  },
  {
    icon: ShieldAlert,
    iconBg: "bg-(--warning-bg)",
    iconColor: "text-(--warning)",
    title: "Report flagged for review",
    time: "1h ago",
  },
  {
    icon: MessageSquare,
    iconBg: "bg-(--accent-light)",
    iconColor: "text-(--accent)",
    title: "Support ticket resolved",
    time: "2h ago",
  },
];
type Stat = {
  label: string;
  value: string;
  change: string;
  changeTone: "up" | "down";
  icon: typeof Users;
  iconBg: string;
  iconColor: string;
};

const StatCard = ({ stat }: { stat: Stat }) => {
  const Icon = stat.icon;
  const TrendIcon = stat.changeTone === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="group rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-md)">
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

      <div className="mt-4 flex items-end justify-between">
        <p className="font-display text-3xl font-bold tracking-tight text-(--text-primary)">
          {stat.value}
        </p>
        <span
          className={`mb-0.5 inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-semibold ${
            stat.changeTone === "up"
              ? "bg-(--success-bg) text-(--success)"
              : "bg-(--danger-bg) text-(--danger)"
          }`}
        >
          <TrendIcon size={12} strokeWidth={2.5} />
          {stat.change}
        </span>
      </div>
    </div>
  );
};
const AdminDashboardPage = () => {
  const { data: usersData } = useUsers(1, 5);
  const { data: companiesData } = useCompanies(1, 1);
  const { data: jobsData } = useAdminJobs(1, 1, undefined, undefined);

  const users: AdminUser[] = usersData?.data?.users ?? [];
  const totalUsers = usersData?.data?.pagination?.totalUsers ?? 0;
  const totalCompanies = companiesData?.data?.total ?? 0;
  const totalJobs = jobsData?.data?.total ?? 0;

  const stats: Stat[] = [
    {
      label: "Total users",
      value: totalUsers.toLocaleString(),
      change: "+2.4%",
      changeTone: "up",
      icon: Users,
      iconBg: "bg-(--primary-light)",
      iconColor: "text-(--primary)",
    },
    {
      label: "Companies",
      value: totalCompanies.toLocaleString(),
      change: "+1.1%",
      changeTone: "up",
      icon: Building2,
      iconBg: "bg-(--accent-light)",
      iconColor: "text-(--accent)",
    },
    {
      label: "Active jobs",
      value: totalJobs.toLocaleString(),
      change: "+3.8%",
      changeTone: "up",
      icon: Briefcase,
      iconBg: "bg-(--accent-light)",
      iconColor: "text-(--accent)",
    },
    {
      label: "Reports open",
      value: "12", // TODO: no reports/moderation model exists yet
      change: "-4",
      changeTone: "down",
      icon: ShieldAlert,
      iconBg: "bg-(--warning-bg)",
      iconColor: "text-(--warning)",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Chart + activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) lg:col-span-2">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-(--text-primary)">
                User growth
              </h2>
              <p className="text-sm text-(--text-secondary)">
                Cumulative sign-ups by month
              </p>
            </div>
            <TrendingUp size={18} className="text-(--accent)" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={growthData}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="userGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--accent)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--accent)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-md)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  fill="url(#userGrowth)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm)">
          <h2 className="mb-4 font-display text-base font-semibold text-(--text-primary)">
            Recent activity
          </h2>
          <ul className="flex flex-col gap-4">
            {activity.map((item, i) => {
              const Icon = item.icon;
              return (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.iconBg} ${item.iconColor}`}
                  >
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-(--text-primary)">
                      {item.title}
                    </p>
                    <p className="text-xs text-(--text-muted)">{item.time}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* New users table */}
      <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm)">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-(--text-primary)">
            New users
          </h2>
          <Link
            to={"/admin/users"}
            className="text-sm font-medium text-(--primary) hover:text-(--primary-dark)"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-(--border) text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
                <th className="pb-3 pr-4 font-semibold">User</th>
                <th className="pb-3 pr-4 font-semibold">Role</th>
                <th className="pb-3 pr-4 font-semibold">Company</th>
                <th className="pb-3 pr-4 font-semibold">Joined</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const name = fullName(user);
                const tint = tintFor(name);
                return (
                  <tr
                    key={user.id}
                    className="border-b border-(--border) last:border-0"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
                          style={{ background: tint.bg, color: tint.fg }}
                        >
                          {initials(name)}
                        </span>
                        <span className="text-sm font-medium text-(--text-primary)">
                          {name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-sm text-(--text-secondary)">
                      {ROLE_LABELS[user.role]}
                    </td>
                    <td className="py-3 pr-4 text-sm text-(--text-secondary)">
                      {user.companyName ?? "—"}
                    </td>
                    <td className="py-3 pr-4 text-sm text-(--text-secondary)">
                      {relativeTime(user.createdAt)}
                    </td>
                    <td className="py-3">
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={
                          user.isVerified
                            ? {
                                background: "var(--success-bg)",
                                color: "var(--success)",
                              }
                            : {
                                background: "var(--warning-bg)",
                                color: "var(--warning)",
                              }
                        }
                      >
                        {user.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
