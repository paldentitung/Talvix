import JobCard from "../../features/jobs/components/JobCard";
import SectionHead from "../ui/SectionHead";
import { useJobs } from "../../features/jobs/hooks/useJobs";
import type { Job } from "../../features/jobs/types/job.types";
import JobCardSkeleton from "../../shared/components/JobCardSkeleton";
import { AlertTriangle } from "lucide-react";
export default function FeaturedJobs() {
  const { data, isLoading, isError, error, refetch } = useJobs();

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--danger-bg)] flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-[var(--danger)]" />
        </div>
        <p className="text-sm font-medium text-[var(--text-primary)]">
          Couldn't load jobs
        </p>
        <p className="text-sm text-[var(--text-secondary)] max-w-sm">
          {error?.message || "Something went wrong. Please try again."}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-1 px-4 py-2 text-sm font-semibold rounded-[var(--radius-md)] bg-[var(--primary)] text-white hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <section id="jobs" className="py-16 bg-[var(--card)]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHead
          kicker="Fresh listings"
          title="Featured jobs this week"
          description="Hand-picked roles from teams actively interviewing right now."
          linkHref="/jobs"
          linkLabel="Browse all jobs"
        />

        <div className="w-full">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : data?.jobs?.length === 0 ? (
            <p className="text-sm text-(--text-secondary)">
              No featured jobs right now — check back soon.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.jobs?.map((job: Job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
