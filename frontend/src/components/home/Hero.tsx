import { useState, useEffect } from "react";
import { Search, MapPin, Bookmark, ArrowRight } from "lucide-react";
import type { Job } from "../../features/jobs/types/job.types";
import { useJobs } from "../../features/jobs/hooks/useJobs";
import Button from "../ui/Button";

import { Link } from "react-router-dom";
// Rotating accent palette for company initials when a job has no logo.
const ACCENT_COLORS = ["#4f46e5", "#0f172a", "#14b8a6", "#c026d3", "#0369a1"];

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
};

const EMPLOYMENT_LABELS: Record<Job["employmentType"], string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const WORK_MODE_LABELS: Record<Job["workMode"], string> = {
  REMOTE: "Remote",
  ONSITE: "On-site",
  HYBRID: "Hybrid",
};

function companyName(job: Job) {
  return (
    job.recruiter.companyName ??
    `${job.recruiter.firstName} ${job.recruiter.lastName}`
  );
}

function accentFor(name: string) {
  const sum = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return ACCENT_COLORS[sum % ACCENT_COLORS.length];
}

function formatSalary(job: Job) {
  if (job.salaryMin && job.salaryMax) {
    const symbol = CURRENCY_SYMBOLS[job.currency] ?? `${job.currency} `;
    const fmt = (n: number) => `${symbol}${Math.round(n / 1000)}k`;
    return `${fmt(job.salaryMin)}–${fmt(job.salaryMax)}`;
  }
  return null;
}

function JobCard({ job, index }: { job: Job; index: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 120);
    return () => clearTimeout(t);
  }, [index]);

  const salary = formatSalary(job);
  const company = companyName(job);
  const tags = [
    EMPLOYMENT_LABELS[job.employmentType],
    WORK_MODE_LABELS[job.workMode],
  ].filter(Boolean) as string[];
  const active = index === 0;

  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 transition-all duration-300 ease-out cursor-pointer
        ${active ? "border-indigo-200 bg-indigo-50" : "border-slate-200 bg-white"}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      {job.recruiter.companyLogo ? (
        <img
          src={job.recruiter.companyLogo}
          alt={company}
          className="h-9 w-9 shrink-0 rounded-[9px] object-cover"
        />
      ) : (
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] font-sora text-sm font-bold text-white"
          style={{ background: accentFor(company) }}
        >
          {company.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="min-w-0 flex-1 font-inter">
        <div className="truncate text-[13px] font-semibold text-slate-900">
          {job.title}
        </div>
        <div className="mb-1.5 truncate text-[11.5px] text-slate-500">
          {company} · {job.location}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10.5px] font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        {salary && (
          <span className="font-inter text-[11.5px] font-semibold text-indigo-600">
            {salary}
          </span>
        )}
        <Bookmark
          size={13}
          className={active ? "text-indigo-600" : "text-slate-300"}
          fill={active ? "#4f46e5" : "none"}
        />
      </div>
    </div>
  );
}

function AppScreenshot({
  jobs,
  isLoading,
}: {
  jobs: Job[];
  isLoading: boolean;
}) {
  return (
    <div className="relative z-[1] overflow-hidden rounded-[18px] bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.06),0_8px_16px_rgba(15,23,42,0.06),0_32px_80px_rgba(79,70,229,0.12)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-2.5 border-b border-slate-200 bg-slate-100 px-3.5 py-2.5">
        <div className="flex gap-[5px]">
          {["#f87171", "#fbbf24", "#34d399"].map((c) => (
            <div
              key={c}
              className="h-[9px] w-[9px] rounded-full"
              style={{ background: c }}
            />
          ))}
        </div>
        <div className="flex-1 rounded-md border border-slate-200 bg-white px-2.5 py-[3px] font-inter text-[10.5px] text-slate-400">
          app.talvix.com/jobs
        </div>
      </div>

      {/* App body */}
      <div className="bg-slate-50 px-[18px] pb-[22px] pt-[18px]">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-sora text-sm font-bold text-slate-900">
            talvix
          </span>
          <div className="flex gap-3">
            {["Jobs", "Saved", "Applied"].map((label, i) => (
              <span
                key={label}
                className={`font-inter text-[11px] cursor-pointer pb-px ${
                  i === 0
                    ? "border-b-[1.5px] border-indigo-600 font-semibold text-indigo-600"
                    : "font-normal text-slate-400"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-[5px]">
          {["All roles", "Remote", "Design", "Engineering", "Marketing"].map(
            (f, i) => (
              <span
                key={f}
                className={`cursor-pointer rounded-full px-2.5 py-[3px] font-inter text-[10.5px] font-medium ${
                  i === 0
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-white text-slate-500"
                }`}
              >
                {f}
              </span>
            ),
          )}
        </div>

        <div className="mb-2.5 font-inter text-[10.5px] text-slate-400">
          Open roles
        </div>

        <div className="flex flex-col gap-[7px]">
          {isLoading &&
            [0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[76px] animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          {!isLoading &&
            jobs
              .slice(0, 3)
              .map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
          {!isLoading && jobs.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center font-inter text-[11.5px] text-slate-400">
              No open roles right now
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [mounted, setMounted] = useState(false);

  const { data, isLoading } = useJobs(1, 3);
  const jobs = data?.jobs ?? [];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="relative overflow-hidden bg-slate-50 py-[88px] font-inter">
      {/* Dotted background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-45"
        style={{
          backgroundImage:
            "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none absolute -left-[120px] -top-20 z-0 h-[560px] w-[560px] bg-[radial-gradient(circle_at_40%_40%,rgba(79,70,229,0.13)_0%,rgba(79,70,229,0.04)_50%,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-[100px] -right-20 z-0 h-[480px] w-[480px] bg-[radial-gradient(circle_at_60%_60%,rgba(20,184,166,0.09)_0%,transparent_65%)]" />

      <div className="relative z-[1] mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1fr_1.35fr] md:gap-16">
        {/* LEFT */}
        <div
          className={`transition-all duration-500 ease-out motion-reduce:transition-none ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="mb-[22px] inline-flex items-center gap-[7px] rounded-full border border-indigo-600/15 bg-indigo-600/[0.07] px-[13px] py-[5px] text-xs font-semibold text-indigo-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-600" />
            3,200+ companies actively hiring
          </div>

          <h1 className="mb-5 font-sora text-[clamp(40px,4.8vw,58px)] font-extrabold leading-[1.08] tracking-[-0.028em] text-slate-900">
            Work <span className="text-indigo-600">worth</span>
            <br />
            showing up for.
          </h1>

          <p className="mb-9 max-w-[400px] text-base leading-[1.7] text-slate-600">
            Talvix connects you with roles from teams that actually respond. No
            black holes, no ghost listings — just real opportunities.
          </p>

          {/* Search bar */}
          <div className="mb-5 flex max-w-[480px] flex-wrap overflow-hidden rounded-2xl border-[1.5px] border-white/95 bg-white/80 shadow-[0_4px_6px_rgba(15,23,42,0.04),0_12px_32px_rgba(79,70,229,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md">
            <div className="flex min-w-[140px] flex-1 items-center gap-[9px] border-slate-100 px-4 py-3.5 sm:border-r sm:border-t-0">
              <Search size={15} className="shrink-0 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title or skill"
                className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="flex min-w-[140px] flex-1 items-center gap-[9px] border-t border-slate-100 px-4 py-3.5 sm:border-t-0">
              <MapPin size={15} className="shrink-0 text-slate-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or Remote"
                className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
            <button className="m-1.5 flex w-full items-center justify-center gap-1.5 rounded-[11px] bg-indigo-600 px-[18px] py-2.5 text-[13.5px] font-semibold text-white shadow-[0_2px_8px_rgba(79,70,229,0.3)] transition-all hover:-translate-y-px hover:bg-indigo-700 hover:shadow-[0_4px_16px_rgba(79,70,229,0.4)] active:translate-y-0 sm:w-auto">
              <Search size={13} />
              Search
            </button>
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-3.5">
            <Button>
              <Link to="/jobs">Browse jobs</Link>
            </Button>
            <Button variant="ghost" className="border">
              <Link to="/recruiter/jobs">For employers</Link>
            </Button>
          </div>
        </div>

        {/* RIGHT */}
        <div
          className={`relative hidden [perspective:1200px] md:block transition-all duration-700 ease-out delay-100 motion-reduce:transition-none motion-reduce:[transform:none] ${
            mounted ? "opacity-100" : "opacity-0"
          } hover:[transform:rotateY(-1deg)_rotateX(0.5deg)] [transform:rotateY(-4deg)_rotateX(2deg)]`}
        >
          <div className="pointer-events-none absolute inset-5 -z-10 translate-y-3 rounded-[18px] bg-indigo-600/[0.18] blur-[40px]" />
          <AppScreenshot jobs={jobs} isLoading={isLoading} />
        </div>
      </div>
    </header>
  );
}
