import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Bookmark,
  Clock,
  DollarSign,
  ChevronRight,
  X,
  SlidersHorizontal,
  Star,
} from "lucide-react";
// Adjust this import to wherever your Job / filter types actually live,
// e.g. "@/types/job" or "../types/job"
import type {
  Job,
  JobFilters,
  WorkMode,
  EmploymentType,
  ExperienceLevel,
} from "../../features/jobs/types/job.types";

// ---------------------------------------------------------------------------
// Label maps for the enum values coming back from the API
// ---------------------------------------------------------------------------

const WORK_MODE_LABEL: Record<WorkMode, string> = {
  REMOTE: "Remote",
  ONSITE: "On-site",
  HYBRID: "Hybrid",
};

const EMPLOYMENT_TYPE_LABEL: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const EXPERIENCE_LEVEL_LABEL: Record<ExperienceLevel, string> = {
  ENTRY: "Entry",
  MID: "Mid",
  SENIOR: "Senior",
  LEAD: "Lead",
};

// ---------------------------------------------------------------------------
// Mock data — shaped exactly like the real `Job` type. Swap for your
// react-query / fetch call once the jobs endpoint is wired up.
// ---------------------------------------------------------------------------

const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Product Designer",
    description: "Own end-to-end design for our core workflow.",
    salaryMin: 140000,
    salaryMax: 180000,
    currency: "USD",
    location: "Remote · US",
    workMode: "REMOTE",
    employmentType: "FULL_TIME",
    experienceLevel: "SENIOR",
    skills: ["Figma", "Design Systems", "SaaS"],
    openings: 1,
    deadline: null,
    featured: true,
    status: "OPEN",
    recruiterId: "r1",
    recruiter: {
      id: "r1",
      firstName: "Jamie",
      lastName: "Cho",
      companyName: "Linear",
      companyLogo: null,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Staff Software Engineer, Platform",
    description: "Build the edge runtime powering our deployments.",
    salaryMin: 210000,
    salaryMax: 260000,
    currency: "USD",
    location: "San Francisco, CA",
    workMode: "ONSITE",
    employmentType: "FULL_TIME",
    experienceLevel: "LEAD",
    skills: ["TypeScript", "Node", "Edge"],
    openings: 2,
    deadline: null,
    featured: true,
    status: "OPEN",
    recruiterId: "r2",
    recruiter: {
      id: "r2",
      firstName: "Priya",
      lastName: "Nair",
      companyName: "Vercel",
      companyLogo: null,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Product Marketing Manager",
    description: "Lead positioning and launch for our B2B suite.",
    salaryMin: 130000,
    salaryMax: 160000,
    currency: "USD",
    location: "New York, NY",
    workMode: "ONSITE",
    employmentType: "FULL_TIME",
    experienceLevel: "MID",
    skills: ["B2B", "Growth", "Content"],
    openings: 1,
    deadline: null,
    featured: false,
    status: "OPEN",
    recruiterId: "r3",
    recruiter: {
      id: "r3",
      firstName: "Sam",
      lastName: "Diallo",
      companyName: "Notion",
      companyLogo: null,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Frontend Engineer",
    description: "Ship accessible UI for the payments dashboard.",
    salaryMin: 90000,
    salaryMax: 120000,
    currency: "EUR",
    location: "Remote · EU",
    workMode: "REMOTE",
    employmentType: "CONTRACT",
    experienceLevel: "MID",
    skills: ["React", "Payments", "A11y"],
    openings: 1,
    deadline: null,
    featured: false,
    status: "OPEN",
    recruiterId: "r4",
    recruiter: {
      id: "r4",
      firstName: "Lea",
      lastName: "Fischer",
      companyName: "Stripe",
      companyLogo: null,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatSalary(job: Job) {
  if (job.salaryMin == null && job.salaryMax == null) return "Not disclosed";
  const fmt = (n: number) => `${Math.round(n / 1000)}k`;
  const symbol =
    job.currency === "EUR" ? "€" : job.currency === "GBP" ? "£" : "$";
  if (job.salaryMin != null && job.salaryMax != null) {
    return `${symbol}${fmt(job.salaryMin)} – ${symbol}${fmt(job.salaryMax)}`;
  }
  return `${symbol}${fmt((job.salaryMin ?? job.salaryMax) as number)}+`;
}

function formatPostedAgo(createdAt: string) {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function companyInitials(name: string | null) {
  if (!name) return "—";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

// ---------------------------------------------------------------------------
// Filter state
// ---------------------------------------------------------------------------

type LocalFilters = JobFilters & { featuredOnly?: boolean };

const EMPTY_FILTERS: LocalFilters = {};

function countBy<T extends string>(jobs: Job[], key: keyof Job) {
  return jobs.reduce<Record<string, number>>((acc, job) => {
    const value = job[key] as unknown as T;
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

// ---------------------------------------------------------------------------
// Small pieces
// ---------------------------------------------------------------------------

function RadioRow({
  checked,
  label,
  count,
  onChange,
}: {
  checked: boolean;
  label: string;
  count: number;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between text-sm text-(--text-secondary) cursor-pointer">
      <span className="flex items-center gap-2">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          className="h-3.5 w-3.5 accent-(--primary)"
        />
        {label}
      </span>
      <span className="text-xs text-(--text-muted)">{count}</span>
    </label>
  );
}

function JobCard({ job }: { job: Job }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex flex-col rounded-(--radius-lg) border border-(--border) bg-(--card) p-4 shadow-(--shadow-sm) transition-shadow hover:shadow-(--shadow-md)">
      {job.featured && (
        <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-(--accent-light) px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-(--accent)">
          <Star size={10} className="fill-current" /> Featured
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-(--radius-md) bg-(--primary-light) text-xs font-bold text-(--primary)">
            {job.recruiter.companyLogo ? (
              <img
                src={job.recruiter.companyLogo}
                alt={job.recruiter.companyName ?? "Company logo"}
                className="h-full w-full object-cover"
              />
            ) : (
              companyInitials(job.recruiter.companyName)
            )}
          </div>
          <div>
            <h3 className="text-[15px] font-semibold leading-tight text-(--text-primary)">
              {job.title}
            </h3>
            <p className="text-sm text-(--text-secondary)">
              {job.recruiter.companyName ??
                `${job.recruiter.firstName} ${job.recruiter.lastName}`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setSaved((s) => !s)}
          aria-label="Save job"
          className="shrink-0 text-(--text-muted) hover:text-(--primary)"
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-(--text-secondary)">
        <span className="flex items-center gap-1">
          <MapPin size={13} /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={13} /> {EMPLOYMENT_TYPE_LABEL[job.employmentType]}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign size={13} /> {formatSalary(job)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-(--text-secondary)"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-(--border) pt-3">
        <span className="text-xs text-(--text-muted)">
          Posted {formatPostedAgo(job.createdAt)}
        </span>
        <button className="rounded-(--radius-sm) bg-(--primary) px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-(--primary-dark)">
          Apply
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const CandidateJobsPage = () => {
  const [keyword, setKeyword] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [filters, setFilters] = useState<LocalFilters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);

  const jobs = MOCK_JOBS; // replace with data from your jobs query

  const employmentCounts = useMemo(
    () => countBy<EmploymentType>(jobs, "employmentType"),
    [jobs],
  );
  const experienceCounts = useMemo(
    () => countBy<ExperienceLevel>(jobs, "experienceLevel"),
    [jobs],
  );
  const workModeCounts = useMemo(
    () => countBy<WorkMode>(jobs, "workMode"),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (keyword && !job.title.toLowerCase().includes(keyword.toLowerCase()))
        return false;
      if (
        locationQuery &&
        !job.location.toLowerCase().includes(locationQuery.toLowerCase())
      )
        return false;
      if (filters.workMode && job.workMode !== filters.workMode) return false;
      if (
        filters.employmentType &&
        job.employmentType !== filters.employmentType
      )
        return false;
      if (
        filters.experienceLevel &&
        job.experienceLevel !== filters.experienceLevel
      )
        return false;
      if (filters.featuredOnly && !job.featured) return false;
      return true;
    });
  }, [jobs, keyword, locationQuery, filters]);

  const activeChips: { key: keyof LocalFilters; label: string }[] = [
    filters.workMode && {
      key: "workMode",
      label: WORK_MODE_LABEL[filters.workMode],
    },
    filters.employmentType && {
      key: "employmentType",
      label: EMPLOYMENT_TYPE_LABEL[filters.employmentType],
    },
    filters.experienceLevel && {
      key: "experienceLevel",
      label: EXPERIENCE_LEVEL_LABEL[filters.experienceLevel],
    },
    filters.featuredOnly && { key: "featuredOnly", label: "Featured" },
  ].filter(Boolean) as { key: keyof LocalFilters; label: string }[];

  const clearFilter = (key: keyof LocalFilters) =>
    setFilters((f) => ({ ...f, [key]: undefined }));

  return (
    <div>
      {/* Search panel */}
      <div className="mb-6 rounded-(--radius-lg) border border-(--border) bg-(--card) p-4 shadow-(--shadow-sm) sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
            />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              type="text"
              placeholder="Job title, skill, or company"
              className="w-full rounded-(--radius-md) border border-(--border) py-2.5 pl-9 pr-3 text-sm placeholder:text-(--text-muted) focus:border-(--primary) focus:outline-none focus:ring-2 focus:ring-(--primary-light)"
            />
          </div>
          <div className="relative flex-1">
            <MapPin
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
            />
            <input
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              type="text"
              placeholder="City, state, or remote"
              className="w-full rounded-(--radius-md) border border-(--border) py-2.5 pl-9 pr-3 text-sm placeholder:text-(--text-muted) focus:border-(--primary) focus:outline-none focus:ring-2 focus:ring-(--primary-light)"
            />
          </div>
          <button className="rounded-(--radius-md) bg-(--primary) px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-(--primary-dark)">
            Search
          </button>
        </div>

        {activeChips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-(--text-muted)">Active:</span>
            {activeChips.map((chip) => (
              <span
                key={chip.key}
                className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white"
              >
                {chip.label}
                <X
                  size={12}
                  className="cursor-pointer opacity-70 hover:opacity-100"
                  onClick={() => clearFilter(chip.key)}
                />
              </span>
            ))}
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="ml-1 text-xs font-medium text-(--primary) hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Filters */}
        <aside className="hidden w-[260px] shrink-0 lg:block">
          <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-4 shadow-(--shadow-sm)">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold text-(--text-primary)">
                <SlidersHorizontal size={15} />
                Filters
              </span>
              <button
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="text-xs font-medium text-(--primary) hover:underline"
              >
                Reset
              </button>
            </div>

            <div className="mb-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
                Job type
              </p>
              <div className="flex flex-col gap-2">
                {(Object.keys(EMPLOYMENT_TYPE_LABEL) as EmploymentType[]).map(
                  (type) => (
                    <RadioRow
                      key={type}
                      checked={filters.employmentType === type}
                      label={EMPLOYMENT_TYPE_LABEL[type]}
                      count={employmentCounts[type] ?? 0}
                      onChange={() =>
                        setFilters((f) => ({
                          ...f,
                          employmentType:
                            f.employmentType === type ? undefined : type,
                        }))
                      }
                    />
                  ),
                )}
              </div>
            </div>

            <div className="mb-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
                Experience
              </p>
              <div className="flex flex-col gap-2">
                {(Object.keys(EXPERIENCE_LEVEL_LABEL) as ExperienceLevel[]).map(
                  (level) => (
                    <RadioRow
                      key={level}
                      checked={filters.experienceLevel === level}
                      label={EXPERIENCE_LEVEL_LABEL[level]}
                      count={experienceCounts[level] ?? 0}
                      onChange={() =>
                        setFilters((f) => ({
                          ...f,
                          experienceLevel:
                            f.experienceLevel === level ? undefined : level,
                        }))
                      }
                    />
                  ),
                )}
              </div>
            </div>

            <div className="mb-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
                Work mode
              </p>
              <div className="flex flex-col gap-2">
                {(Object.keys(WORK_MODE_LABEL) as WorkMode[]).map((mode) => (
                  <RadioRow
                    key={mode}
                    checked={filters.workMode === mode}
                    label={WORK_MODE_LABEL[mode]}
                    count={workModeCounts[mode] ?? 0}
                    onChange={() =>
                      setFilters((f) => ({
                        ...f,
                        workMode: f.workMode === mode ? undefined : mode,
                      }))
                    }
                  />
                ))}
              </div>
            </div>

            <label className="mb-5 flex items-center gap-2 text-sm text-(--text-secondary) cursor-pointer">
              <input
                type="checkbox"
                checked={!!filters.featuredOnly}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    featuredOnly: e.target.checked || undefined,
                  }))
                }
                className="h-3.5 w-3.5 accent-(--primary)"
              />
              Featured roles only
            </label>

            <div className="mb-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
                Salary range
              </p>
              <input
                type="range"
                min={60000}
                max={260000}
                step={10000}
                value={filters.minSalary ?? 60000}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    minSalary: Number(e.target.value),
                  }))
                }
                className="w-full accent-(--primary)"
              />
              <div className="mt-1 flex justify-between text-xs text-(--text-muted)">
                <span>$60k</span>
                <span>$260k+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Job list */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-(--text-secondary)">
              Showing{" "}
              <span className="font-semibold text-(--text-primary)">
                {filteredJobs.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-(--text-primary)">
                {jobs.length}
              </span>{" "}
              jobs
            </p>
            <select className="rounded-(--radius-sm) border border-(--border) bg-(--card) px-3 py-1.5 text-sm text-(--text-secondary) focus:outline-none">
              <option>Most relevant</option>
              <option>Newest</option>
              <option>Salary: high to low</option>
            </select>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="rounded-(--radius-lg) border border-dashed border-(--border) p-10 text-center text-sm text-(--text-muted)">
              No roles match your filters yet. Try clearing a filter or
              broadening your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-1.5">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-(--radius-sm) border border-(--border) px-3 py-1.5 text-sm font-medium text-(--text-secondary) hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-(--radius-sm) text-sm font-medium ${
                  p === page
                    ? "bg-(--primary) text-white"
                    : "text-(--text-secondary) hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1 rounded-(--radius-sm) border border-(--border) px-3 py-1.5 text-sm font-medium text-(--text-secondary) hover:bg-slate-50"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateJobsPage;
