import Button from "../ui/Button";

export default function CTASection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-[var(--text-primary)] p-12 flex items-center justify-between gap-8 flex-wrap">
          <div className="absolute w-[340px] h-[340px] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.25),transparent_70%)] -top-28 -right-20" />

          <div className="relative z-10">
            <h2 className="text-white text-[28px] font-extrabold max-w-[420px] font-display">
              Ready to find your next role — or your next hire?
            </h2>
            <p className="text-[#cbd5e1] mt-2 text-[14.5px]">
              Join thousands of job seekers and employers already using Talvix.
            </p>
          </div>

          <div className="relative z-10 flex gap-3">
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
