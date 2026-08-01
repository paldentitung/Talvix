import { useMemo, useState } from "react";
import { Search, Mail, FileText } from "lucide-react";

type ApplicationStatus =
  | "PENDING"
  | "REVIEWED"
  | "ADVANCED"
  | "REJECTED"
  | "HIRED";

type Applicant = {
  id: string;
  initials: string;
  name: string;
  jobTitle: string;
  experienceYears: number;
  match: number;
  source: string;
  status: ApplicationStatus;
  appliedAt: string;
  about: string;
  currentCompany: string;
  location: string;
  skills: string[];
  resumeUrl?: string;
};

const applicants: Applicant[] = [
  {
    id: "1",
    initials: "PS",
    name: "Priya Shah",
    jobTitle: "Senior Product Designer",
    experienceYears: 6,
    match: 96,
    source: "Referred",
    status: "REVIEWED",
    appliedAt: "2026-07-24",
    about:
      "Product designer with 6 years shipping polished B2B software. Previously at Airbnb and Loom.",
    currentCompany: "Loom",
    location: "Remote · US",
    skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
    resumeUrl: "#",
  },
  {
    id: "2",
    initials: "ML",
    name: "Marcus Lee",
    jobTitle: "Staff Software Engineer",
    experienceYears: 8,
    match: 93,
    source: "LinkedIn",
    status: "PENDING",
    appliedAt: "2026-07-22",
    about:
      "Backend-leaning full-stack engineer who has led platform rewrites at two Series C startups.",
    currentCompany: "Stripe",
    location: "San Francisco, CA",
    skills: ["Node.js", "PostgreSQL", "AWS", "System Design"],
    resumeUrl: "#",
  },
  {
    id: "3",
    initials: "AG",
    name: "Ana García",
    jobTitle: "Product Marketing Manager",
    experienceYears: 5,
    match: 91,
    source: "Direct",
    status: "ADVANCED",
    appliedAt: "2026-07-20",
    about:
      "PMM focused on developer tools go-to-market, launch strategy, and lifecycle messaging.",
    currentCompany: "Vercel",
    location: "New York, NY",
    skills: ["Positioning", "Lifecycle Marketing", "Analytics"],
    resumeUrl: "#",
  },
  {
    id: "4",
    initials: "JK",
    name: "Jordan Kim",
    jobTitle: "Senior Product Designer",
    experienceYears: 4,
    match: 89,
    source: "Direct",
    status: "PENDING",
    appliedAt: "2026-07-19",
    about:
      "Designer who moved from agency work into product, with a focus on onboarding and growth surfaces.",
    currentCompany: "Notion",
    location: "Remote",
    skills: ["Figma", "Motion Design", "User Research"],
  },
];

const statusStyles: Record<ApplicationStatus, string> = {
  PENDING: "bg-(--border) text-(--text-secondary)",
  REVIEWED: "bg-(--primary-light) text-(--primary)",
  ADVANCED: "bg-(--success-bg) text-(--success)",
  REJECTED: "bg-(--danger-bg) text-(--danger)",
  HIRED: "bg-(--accent-light) text-(--accent)",
};

const statusLabel = (status: ApplicationStatus) =>
  status.charAt(0) + status.slice(1).toLowerCase();

const statusFilters: (ApplicationStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "REVIEWED",
  "ADVANCED",
  "REJECTED",
];

const formatAppliedAt = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

const ApplicantsPage = () => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">(
    "ALL",
  );
  const [selectedId, setSelectedId] = useState(applicants[0].id);
  const [localStatus, setLocalStatus] = useState<
    Record<string, ApplicationStatus>
  >({});

  const filtered = useMemo(() => {
    return applicants.filter((a) => {
      const status = localStatus[a.id] ?? a.status;
      const matchesStatus = statusFilter === "ALL" || status === statusFilter;
      const matchesQuery = a.name.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [query, statusFilter, localStatus]);

  const selected = applicants.find((a) => a.id === selectedId) ?? applicants[0];
  const selectedStatus = localStatus[selected.id] ?? selected.status;

  const setStatusFor = (id: string, status: ApplicationStatus) => {
    setLocalStatus((prev) => ({ ...prev, [id]: status }));
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-3 lg:col-span-1">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search applicants"
            className="w-full rounded-(--radius-md) border border-(--border) bg-(--card) py-2 pl-9 pr-3 text-sm text-(--text-primary) outline-none focus:border-(--primary)"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === s
                  ? "bg-(--primary) text-white"
                  : "border border-(--border) bg-(--card) text-(--text-secondary) hover:bg-(--bg)"
              }`}
            >
              {s === "ALL" ? "All" : statusLabel(s)}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {filtered.length === 0 && (
            <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-6 text-center text-sm text-(--text-secondary)">
              No applicants match your search.
            </div>
          )}

          {filtered.map((a) => {
            const status = localStatus[a.id] ?? a.status;
            const isActive = a.id === selectedId;
            return (
              <button
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className={`flex items-center gap-3 rounded-(--radius-lg) border p-3 text-left transition-colors ${
                  isActive
                    ? "border-(--primary) bg-(--primary-light)"
                    : "border-(--border) bg-(--card) hover:bg-(--bg)"
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--primary-light) text-xs font-semibold text-(--primary)">
                  {a.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-(--text-primary)">
                    {a.name}
                  </p>
                  <p className="truncate text-xs text-(--text-secondary)">
                    {a.jobTitle} · {a.match}% match
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyles[status]}`}
                >
                  {statusLabel(status)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-5 shadow-(--shadow-sm) sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-(--primary-light) text-lg font-semibold text-(--primary)">
                {selected.initials}
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-(--text-primary)">
                  {selected.name}
                </h2>
                <p className="text-sm text-(--text-secondary)">
                  {selected.jobTitle} · {selected.experienceYears} years
                </p>
                <p className="mt-1 text-sm font-semibold text-(--accent)">
                  {selected.match}% match
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-full bg-(--accent-light) px-3 py-1 text-xs font-semibold text-(--accent)">
              {selected.source}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFor(selected.id, "ADVANCED")}
              className="rounded-(--radius-md) bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:bg-(--primary-dark)"
            >
              Advance
            </button>
            <button
              onClick={() => setStatusFor(selected.id, "REJECTED")}
              className="rounded-(--radius-md) border border-(--border) bg-(--card) px-4 py-2 text-sm font-semibold text-(--danger) hover:bg-(--danger-bg)"
            >
              Reject
            </button>
            <button className="flex items-center gap-2 rounded-(--radius-md) border border-(--border) bg-(--card) px-4 py-2 text-sm font-semibold text-(--text-secondary) hover:bg-(--bg)">
              <Mail size={16} />
              Message candidate
            </button>
            {selected.resumeUrl && (
              <a
                href={selected.resumeUrl}
                className="ml-auto flex items-center gap-2 text-sm font-semibold text-(--primary) hover:text-(--primary-dark)"
              >
                <FileText size={16} />
                View resume
              </a>
            )}
          </div>

          <div className="mt-6 border-t border-(--border) pt-5">
            <h3 className="text-sm font-semibold text-(--text-primary)">
              About
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-(--text-secondary)">
              {selected.about}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-(--text-secondary)">
              <span>
                Currently:{" "}
                <span className="font-medium text-(--text-primary)">
                  {selected.currentCompany}
                </span>
              </span>
              <span>{selected.location}</span>
              <span>Applied {formatAppliedAt(selected.appliedAt)}</span>
            </div>
          </div>

          <div className="mt-6 border-t border-(--border) pt-5">
            <h3 className="text-sm font-semibold text-(--text-primary)">
              Skills
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {selected.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-(--bg) px-3 py-1 text-xs font-medium text-(--text-secondary)"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsPage;
