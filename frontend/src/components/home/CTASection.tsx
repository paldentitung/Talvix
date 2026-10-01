import Button from "../ui/Button";

export default function CTASection() {
  return (
    <section className="py-10 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-[var(--text-primary)] px-5 py-8 sm:px-8 sm:py-10 lg:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
          <div className="pointer-events-none absolute w-[240px] h-[240px] sm:w-[340px] sm:h-[340px] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.25),transparent_70%)] -top-20 -right-16 sm:-top-28 sm:-right-20" />

          <div className="relative z-10">
            <h2 className="text-white text-[22px] leading-snug sm:text-[26px] lg:text-[28px] font-extrabold max-w-[420px] text-balance font-display">
              Ready to find your next role — or your next hire?
            </h2>
            <p className="text-[#cbd5e1] mt-2 text-sm sm:text-[14.5px] max-w-[460px]">
              Join thousands of job seekers and employers already using Talvix.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 [&>*]:w-full sm:[&>*]:w-auto [&>*]:justify-center">
            <Button href="/register" variant="accent">
              Create free account
            </Button>
            <Button href="/recruiter/jobs" variant="white">
              Post a job
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
