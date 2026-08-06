import JobCard from "../jobs/JobCard";
import SectionHead from "../ui/SectionHead";
import { useJobs } from "../../features/jobs/hooks/useJobs";
import type { Job } from "../../types/job.type";

export default function FeaturedJobs() {
  const { data, isLoading, isError, error } = useJobs();

  if (isLoading) {
    return <p>Loading jobs...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
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
          {data?.jobs?.length === 0 ? (
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
