import { useEffect, useState } from "react";
import { useJobs } from "../features/jobs/hooks/useJobs";
import JobCard from "../components/jobs/JobCard";
import type {
  JobFilters,
  Job,
  ExperienceLevel,
  WorkMode,
  EmploymentType,
} from "../features/jobs/types/job.types";

const WORK_MODES: WorkMode[] = ["ONSITE", "REMOTE", "HYBRID"];
const EMPLOYMENT_TYPES: EmploymentType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
];
const EXPERIENCE_LEVELS: ExperienceLevel[] = ["ENTRY", "MID", "SENIOR", "LEAD"];

const FILTER_LABELS: Record<keyof JobFilters, string> = {
  location: "Location",
  workMode: "Work mode",
  employmentType: "Employment type",
  experienceLevel: "Experience level",
  skills: "Skills",
  minSalary: "Min salary",
  maxSalary: "Max salary",
  currency: "Currency",
};

const formatEnumLabel = (value: string) =>
  value
    .split("_")
    .map((w) => w[0] + w.slice(1).toLowerCase())
    .join(" ");

const JobCardSkeleton = () => (
  <div
    className="border border-[var(--border)] p-4 animate-pulse"
    style={{ borderRadius: "var(--radius-md)" }}
  >
    <div className="flex items-start justify-between gap-3">
      <div
        className="h-10 w-10 bg-[var(--border)]"
        style={{ borderRadius: "var(--radius-sm)" }}
      />
      <div className="h-5 w-16 rounded-full bg-[var(--border)]" />
    </div>
    <div className="mt-4 h-4 w-3/4 rounded bg-[var(--border)]" />
    <div className="mt-2 h-3 w-1/2 rounded bg-[var(--border)]" />
    <div className="mt-4 flex gap-2">
      <div className="h-3 w-14 rounded bg-[var(--border)]" />
      <div className="h-3 w-14 rounded bg-[var(--border)]" />
    </div>
    <div
      className="mt-4 h-8 w-full bg-[var(--border)]"
      style={{ borderRadius: "var(--radius-sm)" }}
    />
  </div>
);

const selectClass =
  "border border-[var(--border)] bg-[var(--card)] text-sm px-3 py-2 pr-8 outline-none transition appearance-none cursor-pointer text-[var(--text-primary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)] hover:border-[var(--primary)]";

const SelectWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    {children}
    <svg
      className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </div>
);

const JobsPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<JobFilters>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const updateFilter = <K extends keyof JobFilters>(
    key: K,
    value: JobFilters[K] | "",
  ) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value === "" || value === undefined) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
    setPage(1);
  };

  const removeFilter = (key: keyof JobFilters) => {
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const activeFilterEntries = Object.entries(filters).filter(
    ([, v]) => v !== undefined && v !== "",
  ) as [keyof JobFilters, JobFilters[keyof JobFilters]][];

  const { data, isLoading, isError } = useJobs(page, pageSize, search, filters);

  const jobs = data?.jobs ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount;

  return (
    <section className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-0">
        <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
          Find your next job
        </h1>

        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 1 1 4 10.5a6.5 6.5 0 0 1 13 0Z"
            />
          </svg>
          <input
            type="search"
            placeholder="Search by title, skill, or company..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-[var(--border)] bg-[var(--card)] pl-9 pr-9 py-2.5 w-full text-sm outline-none text-[var(--text-primary)] transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]"
            style={{
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-sm)",
            }}
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <SelectWrapper>
            <select
              className={selectClass}
              style={{ borderRadius: "var(--radius-sm)" }}
              value={filters.workMode ?? ""}
              onChange={(e) =>
                updateFilter(
                  "workMode",
                  (e.target.value || undefined) as WorkMode,
                )
              }
            >
              <option value="">Work mode</option>
              {WORK_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {formatEnumLabel(mode)}
                </option>
              ))}
            </select>
          </SelectWrapper>

          <SelectWrapper>
            <select
              className={selectClass}
              style={{ borderRadius: "var(--radius-sm)" }}
              value={filters.employmentType ?? ""}
              onChange={(e) =>
                updateFilter(
                  "employmentType",
                  (e.target.value || undefined) as EmploymentType,
                )
              }
            >
              <option value="">Employment type</option>
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatEnumLabel(type)}
                </option>
              ))}
            </select>
          </SelectWrapper>

          <SelectWrapper>
            <select
              className={selectClass}
              style={{ borderRadius: "var(--radius-sm)" }}
              value={filters.experienceLevel ?? ""}
              onChange={(e) =>
                updateFilter(
                  "experienceLevel",
                  (e.target.value || undefined) as ExperienceLevel,
                )
              }
            >
              <option value="">Experience level</option>
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {formatEnumLabel(level)}
                </option>
              ))}
            </select>
          </SelectWrapper>
        </div>

        {/* Active filter chips */}
        {activeFilterEntries.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {activeFilterEntries.map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 bg-[var(--primary-light)] text-[var(--primary-dark)] pl-3 pr-2 py-1 text-xs rounded-full"
              >
                <span className="opacity-70">{FILTER_LABELS[key]}:</span>
                <span className="font-medium">
                  {Array.isArray(value) ? value.join(", ") : String(value)}
                </span>
                <button
                  type="button"
                  onClick={() => removeFilter(key)}
                  aria-label={`Remove ${FILTER_LABELS[key]} filter`}
                  className="hover:text-[var(--danger)] transition"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--primary)] underline transition"
            >
              Clear all
            </button>
          </div>
        )}

        {!isLoading && !isError && typeof totalCount === "number" && (
          <p className="mt-3 text-xs text-[var(--text-secondary)]">
            {totalCount} {totalCount === 1 ? "job" : "jobs"} found
            {search && <> for “{search}”</>}
          </p>
        )}
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {isError && (
          <div
            className="flex flex-col items-center justify-center text-center py-12 bg-[var(--danger-bg)] border border-[var(--danger)]/20"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <p className="text-sm text-[var(--danger)] font-medium">
              Something went wrong loading jobs.
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Please try again in a moment.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: pageSize }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !isError && jobs.length === 0 && (
          <div
            className="flex flex-col items-center justify-center text-center py-16 bg-[var(--card)] border border-[var(--border)]"
            style={{
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <svg
              className="h-10 w-10 text-[var(--text-muted)] mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 13.5V7a2 2 0 0 0-2-2h-3.28a2 2 0 0 1-1.42-.59l-1.3-1.3a2 2 0 0 0-1.42-.59H9.42a2 2 0 0 0-1.42.59l-1.3 1.3A2 2 0 0 1 5.28 5H2M3 13.5V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3.5M3 13.5h5.25a1 1 0 0 1 .95.68l.6 1.64a1 1 0 0 0 .95.68h2.5a1 1 0 0 0 .95-.68l.6-1.64a1 1 0 0 1 .95-.68H21"
              />
            </svg>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              No jobs match your filters.
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Try a different keyword or clear your filters.
            </p>
            {(activeFilterEntries.length > 0 || search) && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-sm px-4 py-1.5 border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition"
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {!isLoading && !isError && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job: Job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 border border-[var(--border)] text-sm text-[var(--text-primary)] hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[var(--border)] disabled:hover:text-[var(--text-primary)] transition"
              style={{ borderRadius: "var(--radius-sm)" }}
            >
              Prev
            </button>
            <span className="text-sm text-[var(--text-secondary)] tabular-nums">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 border border-[var(--border)] text-sm text-[var(--text-primary)] hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[var(--border)] disabled:hover:text-[var(--text-primary)] transition"
              style={{ borderRadius: "var(--radius-sm)" }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobsPage;
