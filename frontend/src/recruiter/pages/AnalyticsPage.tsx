import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Stat = {
  label: string;
  value: string;
  delta: string;
};

const stats: Stat[] = [
  { label: "Avg. time to hire", value: "24 days", delta: "-3d" },
  { label: "Cost per hire", value: "$3,142", delta: "-8%" },
  { label: "Offer acceptance", value: "78%", delta: "+4%" },
  { label: "Pipeline velocity", value: "1.4×", delta: "+0.2×" },
];

const viewsVsApplications = Array.from({ length: 14 }, (_, i) => {
  const day = i + 1;
  const views = Math.round(500 + Math.sin(day / 2) * 150 + day * 20);
  const applications = Math.round(views * 0.28 + Math.cos(day / 3) * 20);
  return { day, views, applications };
});

const timeToHireByTeam = [
  { team: "Engineering", days: 22 },
  { team: "Design", days: 18 },
  { team: "Product", days: 24 },
  { team: "Sales", days: 14 },
  { team: "Marketing", days: 20 },
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

const AnalyticsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) sm:p-6">
          <h2 className="font-display text-base font-bold text-(--text-primary)">
            Views vs applications
          </h2>
          <p className="mt-0.5 text-sm text-(--text-secondary)">Last 14 days</p>

          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={viewsVsApplications}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 1000]}
                  ticks={[0, 250, 500, 750, 1000]}
                  tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  wrapperStyle={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  name="Views"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="applications"
                  name="Applications"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) sm:p-6">
          <h2 className="font-display text-base font-bold text-(--text-primary)">
            Time to hire by team
          </h2>
          <p className="mt-0.5 text-sm text-(--text-secondary)">
            Days, average of last 30 days
          </p>

          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={timeToHireByTeam}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="team"
                  tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 24]}
                  ticks={[0, 8, 16, 24]}
                  tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--primary-light)" }}
                  contentStyle={tooltipStyle}
                />
                <Bar
                  dataKey="days"
                  fill="var(--accent)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
