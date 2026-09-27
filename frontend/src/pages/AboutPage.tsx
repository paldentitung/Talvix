import { Target, ShieldCheck, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";

const VALUES = [
  {
    icon: Target,
    title: "Real roles only",
    body: "Every listing on talvix comes from a team that's actively hiring — no ghost postings, no recruiter fishing.",
  },
  {
    icon: ShieldCheck,
    title: "Recruiters who respond",
    body: "We track reply rates behind the scenes and hold companies to a standard: if you post here, you show up for candidates.",
  },
  {
    icon: Users,
    title: "Built for both sides",
    body: "Job seekers get a clear, honest search. Recruiters get a pool of people who actually want to be found.",
  },
  {
    icon: Sparkles,
    title: "Kept simple",
    body: "No noisy feeds, no engagement games — just search, apply, and a straight line to the next step.",
  },
];

const STATS = [
  { value: "3,200+", label: "Companies hiring" },
  { value: "48k", label: "Roles filled" },
  { value: "92%", label: "Recruiter response rate" },
];

export default function AboutPage() {
  return (
    <>
      {/* Intro */}
      <header className="relative overflow-hidden bg-slate-50 py-20 font-inter">
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-45"
          style={{
            backgroundImage:
              "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="pointer-events-none absolute -left-[120px] -top-20 z-0 h-[560px] w-[560px] bg-[radial-gradient(circle_at_40%_40%,rgba(79,70,229,0.13)_0%,rgba(79,70,229,0.04)_50%,transparent_70%)]" />

        <div className="relative z-[1] mx-auto max-w-[720px] px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-[7px] rounded-full border border-indigo-600/15 bg-indigo-600/[0.07] px-[13px] py-[5px] text-xs font-semibold text-indigo-600">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            About talvix
          </div>

          <h1 className="mb-5 font-sora text-[clamp(32px,4.2vw,48px)] font-extrabold leading-[1.12] tracking-[-0.026em] text-slate-900">
            We built the job board we wished existed.
          </h1>

          <p className="mx-auto max-w-[520px] text-base leading-[1.7] text-slate-600">
            talvix started as a frustration: too many listings led nowhere. So
            we set out to build a search where every role is live, every
            recruiter is reachable, and applying doesn't feel like shouting into
            a void.
          </p>
        </div>
      </header>

      {/* Stats strip */}
      <section className="border-y border-slate-200 bg-white py-10 font-inter">
        <div className="mx-auto flex max-w-[900px] flex-wrap items-center justify-center gap-x-16 gap-y-6 px-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-sora text-[28px] font-bold text-slate-900">
                {s.value}
              </div>
              <div className="text-[13px] text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-slate-50 py-20 font-inter">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-start gap-12 px-6 md:grid-cols-2">
          <div>
            <h2 className="mb-4 font-sora text-[28px] font-bold leading-tight text-slate-900">
              Hiring shouldn't feel like a black hole.
            </h2>
            <p className="text-[15px] leading-[1.75] text-slate-600">
              Most job boards optimize for volume — more listings, more
              applicants, more noise. We optimize for the opposite: fewer,
              better-matched connections. Recruiters on talvix commit to keeping
              listings current and responding to applicants, and we built our
              search around helping the right people find each other quickly.
            </p>
          </div>
          <div>
            <h2 className="mb-4 font-sora text-[28px] font-bold leading-tight text-slate-900">
              What we're working toward.
            </h2>
            <p className="text-[15px] leading-[1.75] text-slate-600">
              A hiring market where a good application always gets a reply,
              where a job listing means the job is actually open, and where
              looking for work — or looking to hire — takes an afternoon, not a
              month.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20 font-inter">
        <div className="mx-auto max-w-[1100px] px-6">
          <h2 className="mb-10 max-w-[480px] font-sora text-[28px] font-bold leading-tight text-slate-900">
            The principles behind every part of talvix.
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[10px] bg-indigo-600/10 text-indigo-600">
                  <Icon size={18} />
                </div>
                <div className="mb-1.5 font-sora text-[15px] font-bold text-slate-900">
                  {title}
                </div>
                <p className="text-[13.5px] leading-[1.65] text-slate-600">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-slate-900 py-16 font-inter">
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.35)_0%,transparent_70%)]" />
        <div className="relative z-[1] mx-auto flex max-w-[900px] flex-col items-center gap-6 px-6 text-center">
          <h2 className="font-sora text-[26px] font-bold text-white sm:text-[30px]">
            Ready to find work worth showing up for?
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Button>
              <Link to="/jobs">Browse jobs</Link>
            </Button>
            <Button
              variant="ghost"
              className="border border-white/20 text-white"
            >
              <Link to="/recruiter/jobs">For employers</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
