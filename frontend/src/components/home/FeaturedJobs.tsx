import JobCard from "../jobs/JobCard";
import SectionHead from "../ui/SectionHead";
import { mockJobs } from "../../mocks/Job";

export default function FeaturedJobs() {
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}
