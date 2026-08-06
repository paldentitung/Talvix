import { useEffect, useState } from "react";
import { useJobs } from "../features/jobs/hooks/useJobs";
import JobCard from "../components/jobs/JobCard";
import type { Job } from "../types/job.type";

const JobCardSkeleton = () => (
  <div className="rounded-lg border border-[var(--border)] p-4 animate-pulse">
    <div className="flex items-start justify-between gap-3">
      <div className="h-10 w-10 rounded-md bg-[var(--skeleton)]" />
      <div className="h-5 w-16 rounded bg-[var(--skeleton)]" />
    </div>
    <div className="mt-4 h-4 w-3/4 rounded bg-[var(--skeleton)]" />
    <div className="mt-2 h-3 w-1/2 rounded bg-[var(--skeleton)]" />
    <div className="mt-4 flex gap-2">
      <div className="h-3 w-14 rounded bg-[var(--skeleton)]" />
      <div className="h-3 w-14 rounded bg-[var(--skeleton)]" />
    </div>
    <div className="mt-4 h-8 w-full rounded bg-[var(--skeleton)]" />
  </div>
);

const JobsPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // debounce: only update `search` (which triggers the actual fetch)
  // 400ms after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // reset to page 1 whenever the search term changes
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useJobs(page, pageSize, search);

  const jobs = data?.jobs ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount;

  return (
    <section className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-0">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]"
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
            placeholder="Search jobs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-[var(--border)] bg-[var(--card)] pl-9 pr-9 py-2 rounded-md w-full text-sm outline-none focus:ring-2 focus:ring-[var(--ring)] transition "
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text)] transition"
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

        {!isLoading && !isError && typeof totalCount === "number" && (
          <p className="mt-3 text-xs text-[var(--text-secondary)]">
            {totalCount} {totalCount === 1 ? "job" : "jobs"} found
            {search && <> for “{search}”</>}
          </p>
        )}
      </div>

      <div className="bg-[var(--card)] max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {isError && (
          <div className="flex flex-col items-center justify-center text-center py-16">
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
          <div className="flex flex-col items-center justify-center text-center py-16">
            <svg
              className="h-10 w-10 text-[var(--text-secondary)] mb-3"
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
            <p className="text-sm font-medium">No jobs match your search.</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Try a different keyword or clear your filters.
            </p>
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
              className="px-3 py-1.5 border border-[var(--border)] rounded-md text-sm hover:bg-[var(--muted)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition"
            >
              Prev
            </button>
            <span className="text-sm text-[var(--text-secondary)] tabular-nums">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 border border-[var(--border)] rounded-md text-sm hover:bg-[var(--muted)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition"
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
