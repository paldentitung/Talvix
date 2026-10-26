import { Link } from "react-router-dom";
import {
  Briefcase,
  Building2,
  ShieldAlert,
  User as UserIcon,
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
import { ROLE_LABELS } from "../../shared/constants/roleLabels";
import { tintFor } from "../../shared/utils/avatarTint";
import { fullName } from "../../shared/utils/getFullname";
import initials from "../../shared/utils/getInitials";
import relativeTime from "../../shared/utils/relativeTime";
import { useAdminDashboard } from "../../features/dashboard/hooks/useAdminDashboard";

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

const ROLE_ORDER = ["CANDIDATE", "RECRUITER", "ADMIN"];

const ROLE_COLORS: Record<string, string> = {
  CANDIDATE: "var(--primary)",
  RECRUITER: "var(--accent)",
  ADMIN: "#94a3b8",
};

const ROLE_PILL: Record<string, { bg: string; fg: string }> = {
  CANDIDATE: { bg: "var(--primary-light)", fg: "var(--primary)" },
  RECRUITER: { bg: "var(--accent-light)", fg: "var(--accent)" },
  ADMIN: { bg: "#eef1f5", fg: "#64748b" },
};

const formatDay = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const cardClass =
  "rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm)";

const AdminDashboardPage = () => {
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading)
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="h-12 w-64 animate-pulse rounded-(--radius-lg) bg-(--border)" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

  const { overview, usersByRole, growth, newUsers, pendingReportsList } = data;

  const stats: Stat[] = [
    {
      label: "Total users",
      value: overview.totalUsers.toLocaleString(),
      hint: "Candidates, recruiters and admins",
      to: "/admin/users",
      icon: Users,
      iconBg: "bg-(--primary-light)",
      iconColor: "text-(--primary)",
    },
    {
      label: "Companies",
      value: overview.totalCompanies.toLocaleString(),
      hint: "Registered on the platform",
      to: "/admin/companies",
      icon: Building2,
      iconBg: "bg-(--accent-light)",
      iconColor: "text-(--accent)",
    },
    {
      label: "Active jobs",
      value: overview.activeJobs.toLocaleString(),
      hint: "Open for applications",
      to: "/admin/jobs",
      icon: Briefcase,
      iconBg: "bg-(--primary-light)",
      iconColor: "text-(--primary)",
    },
    {
      label: "Pending reports",
      value: overview.pendingReports.toLocaleString(),
      hint: "Awaiting your review",
      to: "/admin/reports",
      icon: ShieldAlert,
      iconBg: "bg-(--warning-bg)",
      iconColor: "text-(--warning)",
      highlight: overview.pendingReports > 0,
    },
  ];

  // Attention banner text
  const attention: string[] = [];
  if (overview.pendingReports > 0)
    attention.push(
      `${overview.pendingReports} ${overview.pendingReports === 1 ? "report is" : "reports are"} waiting for review`,
    );
  if (overview.unverifiedRecruiters > 0)
    attention.push(
      `${overview.unverifiedRecruiters} ${overview.unverifiedRecruiters === 1 ? "recruiter is" : "recruiters are"} still unverified`,
    );

  // Growth chart: show a dot only where the total changes, plus the last point
  const dotIndexes = new Set<number>();
  growth.forEach((p, i) => {
    if (i > 0 && p.total !== growth[i - 1].total) dotIndexes.add(i);
  });
  if (growth.length) dotIndexes.add(growth.length - 1);

  // Donut data in a fixed role order
  const roleRows = [...usersByRole].sort(
    (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role),
  );

  return (
    <div className="flex flex-col gap-5">
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
            to="/admin/reports"
            className="rounded-(--radius-md) bg-(--text-primary) px-3.5 py-2 text-xs font-semibold text-white"
          >
            Review reports
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Growth chart + role donut */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.8fr_1fr]">
        <div className={cardClass}>
          <h2 className="font-display text-base font-semibold text-(--text-primary)">
            Platform growth
          </h2>
          <p className="mb-4 text-sm text-(--text-secondary)">
            Total users over the last 30 days
          </p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={growth}
                margin={{ top: 8, right: 12, left: -20 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  interval={0}
                  ticks={[0, 7, 14, 21, growth.length - 1]
                    .filter((i) => growth[i])
                    .map((i) => growth[i].date)}
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
                  formatter={(v) => [v, "Total users"]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-md)",
                  }}
                />
                <Area
                  type="stepAfter"
                  dataKey="total"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="var(--primary-light)"
                  dot={(props) => {
                    const { cx, cy, index } = props;
                    if (!dotIndexes.has(index)) return <g key={index} />;
                    return (
                      <circle
                        key={index}
                        cx={cx}
                        cy={cy}
                        r={3.5}
                        fill={
                          index === growth.length - 1
                            ? "var(--primary)"
                            : "#fff"
                        }
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
            Users by role
          </h2>
          <p className="mb-4 text-sm text-(--text-secondary)">
            Who is on the platform
          </p>

          {roleRows.length === 0 ? (
            <p className="py-16 text-center text-sm text-(--text-muted)">
              No data yet.
            </p>
          ) : (
            <>
              <div className="relative mx-auto h-40 w-40">
                <PieChart width={160} height={160}>
                  <Pie
                    data={roleRows}
                    dataKey="count"
                    nameKey="role"
                    startAngle={90}
                    endAngle={-270}
                    innerRadius={52}
                    outerRadius={74}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {roleRows.map((r) => (
                      <Cell
                        key={r.role}
                        fill={ROLE_COLORS[r.role] ?? "#94a3b8"}
                      />
                    ))}
                  </Pie>
                </PieChart>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-2xl font-bold text-(--text-primary)">
                    {overview.totalUsers}
                  </span>
                  <span className="text-xs text-(--text-muted)">users</span>
                </div>
              </div>

              <ul className="mt-5 space-y-2 text-sm">
                {roleRows.map((r) => (
                  <li
                    key={r.role}
                    className="flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2 text-(--text-secondary)">
                      <i
                        className="h-2 w-2 rounded-sm"
                        style={{ background: ROLE_COLORS[r.role] ?? "#94a3b8" }}
                      />
                      {ROLE_LABELS[r.role]}
                    </span>
                    <b className="text-(--text-primary)">{r.count}</b>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* New users + pending reports */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.8fr_1fr]">
        <div className={cardClass}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-(--text-primary)">
              New users
            </h2>
            <Link
              to="/admin/users"
              className="text-sm font-medium text-(--primary) hover:text-(--primary-dark)"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left">
              <thead>
                <tr className="border-b border-(--border) text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
                  <th className="pb-3 pr-4 font-semibold">User</th>
                  <th className="pb-3 pr-4 font-semibold">Role</th>
                  <th className="pb-3 pr-4 font-semibold">Joined</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {newUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-sm text-(--text-muted)"
                    >
                      No users yet.
                    </td>
                  </tr>
                )}
                {newUsers.map((user) => {
                  const name = fullName(user);
                  const tint = tintFor(name);
                  const pill = ROLE_PILL[user.role] ?? ROLE_PILL.ADMIN;
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
                      <td className="py-3 pr-4">
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-semibold"
                          style={{ background: pill.bg, color: pill.fg }}
                        >
                          {ROLE_LABELS[user.role]}
                        </span>
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

        <div className={`${cardClass} flex flex-col`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-(--text-primary)">
              Pending reports
            </h2>
            <Link
              to="/admin/reports"
              className="text-sm font-medium text-(--primary) hover:text-(--primary-dark)"
            >
              View all
            </Link>
          </div>

          {pendingReportsList.length === 0 ? (
            <p className="py-10 text-center text-sm text-(--text-muted)">
              Nothing waiting for review.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingReportsList.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 rounded-(--radius-md) border border-(--border) p-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-(--radius-md) bg-(--warning-bg) text-(--warning)">
                    {r.type === "JOB" ? (
                      <Briefcase size={14} />
                    ) : (
                      <UserIcon size={14} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-(--text-primary)">
                      {r.type === "JOB" ? "Job post reported" : "User reported"}
                    </p>
                    <p className="truncate text-xs text-(--text-secondary)">
                      {r.reason}
                    </p>
                    <p className="text-xs text-(--text-muted)">
                      {relativeTime(r.createdAt)}
                    </p>
                  </div>
                  <Link
                    to={`/admin/reports/${r.id}`}
                    className="shrink-0 rounded-(--radius-md) border border-(--border) px-3 py-1.5 text-xs font-medium text-(--text-primary) hover:bg-(--primary-light)"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
