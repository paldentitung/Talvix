import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Bookmark,
  ChevronRight,
  X,
  SlidersHorizontal,
} from "lucide-react";
import type {
  JobFilters,
  WorkMode,
  EmploymentType,
  ExperienceLevel,
} from "../../features/jobs/types/job.types";
import CandidateJobCard from "../components/CandidateJobCard";
import { useJobSaveActions } from "../../features/jobs/hooks/useJobSaveActions";
import { useJobs } from "../../features/jobs/hooks/useJobs";

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

const PAGE_SIZE = 10;

type LocalFilters = JobFilters & { featuredOnly?: boolean };

const EMPTY_FILTERS: LocalFilters = {};

/** Debounce a fast-changing value (e.g. keystrokes) before it hits an API call. */
function useDebouncedValue<T>(value: T, delayMs = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

// ---------------------------------------------------------------------------
// Small pieces
// ---------------------------------------------------------------------------

function RadioRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
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
    </label>
  );
}

const CandidateJobsPage = () => {
  const [keyword, setKeyword] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [filters, setFilters] = useState<LocalFilters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);

  // Debounce the free-text inputs so we don't fire a request per keystroke.
  const debouncedKeyword = useDebouncedValue(keyword);
  const debouncedLocation = useDebouncedValue(locationQuery);

  // Reset back to page 1 whenever the search/filter criteria change —
  // otherwise you can get stuck on page 4 of a filtered set that only has 2 pages.
  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, debouncedLocation, filters]);

  const apiFilters: JobFilters = useMemo(
    () => ({
      location: debouncedLocation || undefined,
      workMode: filters.workMode,
      employmentType: filters.employmentType,
      experienceLevel: filters.experienceLevel,
      minSalary: filters.minSalary,
      maxSalary: filters.maxSalary,
    }),
    [debouncedLocation, filters],
  );

  const {
    data: jobsData,
    isLoading,
    isError,
  } = useJobs(page, PAGE_SIZE, debouncedKeyword || undefined, apiFilters);

  const jobs = jobsData?.jobs ?? [];
  const total = jobsData?.total ?? 0;
  const totalPages = jobsData?.totalPages ?? 1;

  const { isJobSaved, isSavingJob, toggleSave } = useJobSaveActions();

  // `featuredOnly` isn't wired into the API yet — apply it client-side over
  // the current page as a stopgap. If featured filtering needs to apply
  // across the whole catalog (not just the current page), add it to
  // JobFilters/getJobs on the backend instead.
  const visibleJobs = filters.featuredOnly
    ? jobs.filter((job) => job.featured)
    : jobs;

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

            {/*
              Note: these facet lists used to show a count next to each
              option, computed from the currently loaded jobs. Now that
              jobs are paginated server-side, that count would only reflect
              the current page (misleading), so it's been removed rather
              than shipped wrong. If you want real counts back, add a
              facets/aggregate endpoint (e.g. GET /jobs/facets) that returns
              counts across the whole filtered set, independent of page.
            */}
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
                {visibleJobs.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-(--text-primary)">
                {total}
              </span>{" "}
              jobs
            </p>
            <select className="rounded-(--radius-sm) border border-(--border) bg-(--card) px-3 py-1.5 text-sm text-(--text-secondary) focus:outline-none">
              <option>Most relevant</option>
              <option>Newest</option>
              <option>Salary: high to low</option>
            </select>
          </div>

          {isLoading ? (
            <div className="rounded-(--radius-lg) border border-dashed border-(--border) p-10 text-center text-sm text-(--text-muted)">
              Loading jobs…
            </div>
          ) : isError ? (
            <div className="rounded-(--radius-lg) border border-dashed border-(--border) p-10 text-center text-sm text-(--text-muted)">
              Couldn't load jobs. Please try again.
            </div>
          ) : visibleJobs.length === 0 ? (
            <div className="rounded-(--radius-lg) border border-dashed border-(--border) p-10 text-center text-sm text-(--text-muted)">
              No roles match your filters yet. Try clearing a filter or
              broadening your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {visibleJobs.map((job) => (
                <CandidateJobCard
                  job={job}
                  isSaved={isJobSaved(job.id)}
                  onToggleSave={toggleSave}
                  isSaving={isSavingJob(job.id)}
                  key={job.id}
                />
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
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              // Keep the pager compact: show up to 5 page numbers around the current one.
              .filter((p) => Math.abs(p - page) <= 2)
              .map((p) => (
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
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex items-center gap-1 rounded-(--radius-sm) border border-(--border) px-3 py-1.5 text-sm font-medium text-(--text-secondary) hover:bg-slate-50 disabled:opacity-40"
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
