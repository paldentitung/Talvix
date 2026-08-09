import { useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  MessageSquare,
  Calendar,
  Clock,
} from "lucide-react";

type Status = "Applied" | "In Review" | "Interview" | "Offer" | "Rejected";

interface Application {
  id: string;
  role: string;
  company: string;
  location: string;
  appliedOn: string;
  status: Status;
  timeline: {
    icon: "check" | "chat" | "calendar" | "clock";
    title: string;
    date: string;
    done: boolean;
  }[];
}

const applications: Application[] = [
  {
    id: "1",
    role: "Senior Product Designer",
    company: "Linear",
    location: "Remote · US",
    appliedOn: "Oct 12",
    status: "Interview",
    timeline: [
      {
        icon: "check",
        title: "Application submitted",
        date: "Oct 12",
        done: true,
      },
      {
        icon: "check",
        title: "Application reviewed",
        date: "Oct 14",
        done: true,
      },
      {
        icon: "chat",
        title: "Screening call scheduled",
        date: "Oct 18",
        done: true,
      },
      {
        icon: "calendar",
        title: "Onsite interview",
        date: "Oct 25",
        done: false,
      },
      { icon: "clock", title: "Offer decision", date: "Nov 1", done: false },
    ],
  },
  {
    id: "2",
    role: "Staff Software Engineer",
    company: "Vercel",
    location: "Remote · US",
    appliedOn: "Oct 10",
    status: "In Review",
    timeline: [
      {
        icon: "check",
        title: "Application submitted",
        date: "Oct 10",
        done: true,
      },
      {
        icon: "clock",
        title: "Application reviewed",
        date: "Pending",
        done: false,
      },
    ],
  },
  {
    id: "3",
    role: "Product Marketing Manager",
    company: "Notion",
    location: "Remote · US",
    appliedOn: "Oct 7",
    status: "Applied",
    timeline: [
      {
        icon: "check",
        title: "Application submitted",
        date: "Oct 7",
        done: true,
      },
      {
        icon: "clock",
        title: "Application reviewed",
        date: "Pending",
        done: false,
      },
    ],
  },
  {
    id: "4",
    role: "Frontend Engineer",
    company: "Stripe",
    location: "Remote · US",
    appliedOn: "Oct 3",
    status: "Offer",
    timeline: [
      {
        icon: "check",
        title: "Application submitted",
        date: "Oct 3",
        done: true,
      },
      {
        icon: "check",
        title: "Application reviewed",
        date: "Oct 5",
        done: true,
      },
      { icon: "check", title: "Onsite interview", date: "Oct 14", done: true },
      { icon: "check", title: "Offer extended", date: "Oct 20", done: true },
    ],
  },
  {
    id: "5",
    role: "Design Lead",
    company: "Figma",
    location: "Remote · US",
    appliedOn: "Sep 28",
    status: "Rejected",
    timeline: [
      {
        icon: "check",
        title: "Application submitted",
        date: "Sep 28",
        done: true,
      },
      {
        icon: "check",
        title: "Application reviewed",
        date: "Sep 30",
        done: true,
      },
      { icon: "check", title: "Application closed", date: "Oct 4", done: true },
    ],
  },
];

const filters: { label: string; count?: number }[] = [
  { label: "All", count: 24 },
  { label: "Applied" },
  { label: "In Review" },
  { label: "Interview" },
  { label: "Offer" },
  { label: "Rejected" },
];

const statusStyles: Record<Status, string> = {
  Applied: "text-[var(--text-secondary)] bg-slate-100",
  "In Review": "text-[var(--warning)] bg-[var(--warning-bg)]",
  Interview: "text-[var(--accent)] bg-[var(--accent-light)]",
  Offer: "text-[var(--success)] bg-[var(--success-bg)]",
  Rejected: "text-[var(--danger)] bg-[var(--danger-bg)]",
};

function TimelineIcon({
  icon,
  done,
}: {
  icon: "check" | "chat" | "calendar" | "clock";
  done: boolean;
}) {
  const color = done ? "var(--accent)" : "var(--text-muted)";
  const common = { size: 16, color, strokeWidth: 2.2 };
  switch (icon) {
    case "check":
      return <CheckCircle2 {...common} />;
    case "chat":
      return <MessageSquare {...common} />;
    case "calendar":
      return <Calendar {...common} />;
    case "clock":
      return <Clock {...common} />;
  }
}

export default function CandidateApplicationsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(applications[0].id);

  const selected =
    applications.find((a) => a.id === selectedId) ?? applications[0];

  const visible =
    activeFilter === "All"
      ? applications
      : applications.filter((a) => a.status === activeFilter);

  return (
    <div className="min-h-screen bg-[var(--bg)] ">
      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => {
          const isActive = activeFilter === f.label;
          const count =
            f.label === "All"
              ? f.count
              : applications.filter((a) => a.status === f.label).length;
          return (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                isActive
                  ? "bg-[var(--primary)] text-white shadow-[var(--shadow-sm)]"
                  : "bg-[var(--card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--primary)]"
              }`}
            >
              {f.label}
              {f.label === "All" && count !== undefined ? ` (${count})` : ""}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex gap-5 items-start">
        {/* List */}
        <div className="flex-1 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)] overflow-hidden">
          {visible.map((app, i) => {
            const isSelected = app.id === selectedId;
            return (
              <button
                key={app.id}
                onClick={() => setSelectedId(app.id)}
                className={`flex w-full items-center gap-4 px-6 py-5 text-left transition-colors ${
                  i !== visible.length - 1
                    ? "border-b border-[var(--border)]"
                    : ""
                } ${isSelected ? "bg-[var(--primary-light)]" : "hover:bg-slate-50"}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-slate-100">
                  <Briefcase size={18} color="var(--text-secondary)" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold text-[var(--text-primary)]">
                    {app.role}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
                    {app.company} · Applied {app.appliedOn}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-medium ${statusStyles[app.status]}`}
                >
                  {app.status}
                </span>

                <span className="shrink-0 text-[14px] font-medium text-[var(--primary)]">
                  View
                </span>
              </button>
            );
          })}
          {visible.length === 0 && (
            <div className="px-6 py-16 text-center text-[14px] text-[var(--text-muted)]">
              No applications in this stage yet.
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="w-[340px] shrink-0 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-slate-100">
              <Briefcase size={18} color="var(--text-secondary)" />
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-[var(--text-primary)]">
                {selected.role}
              </p>
              <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
                {selected.company} · {selected.location}
              </p>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-[12px] font-medium ${statusStyles[selected.status]}`}
              >
                {selected.status}
              </span>
            </div>
          </div>

          <div className="my-5 border-t border-[var(--border)]" />

          <p className="mb-4 text-[13px] font-semibold text-[var(--text-primary)]">
            Application timeline
          </p>

          <div className="relative">
            {selected.timeline.map((step, i) => (
              <div key={i} className="relative flex gap-3 pb-6 last:pb-0">
                {i !== selected.timeline.length - 1 && (
                  <span
                    className="absolute left-[7px] top-5 h-[calc(100%-8px)] w-px"
                    style={{
                      background: step.done ? "var(--accent)" : "var(--border)",
                    }}
                  />
                )}
                <div className="z-10 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                  <TimelineIcon icon={step.icon} done={step.done} />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-[14px] font-medium ${
                      step.done
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[12px] text-[var(--text-muted)]">
                    {step.date}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-2 w-full rounded-[var(--radius-md)] bg-[var(--primary)] py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--primary-dark)]">
            Message recruiter
          </button>
        </div>
      </div>
    </div>
  );
}
