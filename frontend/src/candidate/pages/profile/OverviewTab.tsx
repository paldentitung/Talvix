import {
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
} from "lucide-react";
import { Title, cardCls, range } from "./shared";
import type { Entry, Tab } from "./shared";

/* Timeline used by Experience and Education (presentation only) */
function Timeline({ list }: { list: Entry[] }) {
  return (
    <ol className="ml-1.5 border-l border-[var(--border)]">
      {list.map((e, i) => {
        const description = (e as Entry & { description?: string }).description;
        return (
          <li
            key={e.id}
            className={`relative pl-6 ${i === list.length - 1 ? "" : "pb-8"}`}
          >
            <span
              aria-hidden="true"
              className={`absolute -left-[6px] top-1.5 h-3 w-3 rounded-full border-2 border-[var(--primary)] ${
                i === 0 ? "bg-[var(--primary)]" : "bg-[var(--card)]"
              }`}
            />
            <h3 className="text-base font-semibold leading-snug text-[var(--text-primary)]">
              {e.title}
            </h3>
            <p className="mt-0.5 text-sm font-medium text-[var(--text-secondary)]">
              {e.org}
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              {range(e.start, e.end)}
            </p>
            {description && (
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--text-secondary)]">
                {description}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function OverviewTab({
  user,
  experience,
  education,
  go,
}: {
  user: any;
  experience: Entry[];
  education: Entry[];
  go: (t: Tab) => void;
}) {
  const resumeUrl = user.resumeUrl ?? null;
  const resumeFullUrl = resumeUrl
    ? `${import.meta.env.VITE_API_BACKEND_URL}${resumeUrl}`
    : null;
  const skills: string[] = user.skills ?? [];

  const checks: { label: string; done: unknown; tab: Tab }[] = [
    { label: "First name", done: user.firstName, tab: "basic" },
    { label: "Last name", done: user.lastName, tab: "basic" },
    { label: "Headline", done: user.title, tab: "basic" },
    { label: "Location", done: user.location, tab: "basic" },
    { label: "Bio", done: user.bio, tab: "basic" },
    { label: "Phone", done: user.phone, tab: "basic" },
    { label: "Skills", done: skills.length, tab: "basic" },
    { label: "Experience", done: experience.length, tab: "experience" },
    { label: "Education", done: education.length, tab: "education" },
    { label: "Resume", done: resumeUrl, tab: "resume" },
  ];
  const pct = Math.round(
    (checks.filter((c) => c.done).length / checks.length) * 100,
  );
  const missing = checks.filter((c) => !c.done);

  const contact = [
    { icon: MapPin, value: user.location },
    { icon: Mail, value: user.email },
    { icon: Phone, value: user.phone },
  ].filter((c) => c.value);

  const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]";
  const addBtn = `inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] ${focusRing}`;

  return (
    <div className="space-y-6">
      {/* Profile completeness: compact status card */}
      <div className={`${cardCls} !py-4`}>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-medium text-[var(--text-primary)]">
            Profile completeness
          </span>
          <span className="font-semibold text-[var(--primary)]">{pct}%</span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Profile completeness"
          className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[var(--primary-light)]"
        >
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="text-xs text-[var(--text-secondary)]">
            {missing.length
              ? `${missing.length} ${missing.length === 1 ? "thing" : "things"} left to complete`
              : "Your profile is complete"}
          </p>
          {missing.map((m) => (
            <button
              key={m.label}
              type="button"
              onClick={() => go(m.tab)}
              className={`inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] ${focusRing}`}
            >
              <Plus className="h-3 w-3" />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* About: full width */}
      <section className={`${cardCls} w-full`}>
        <Title onEdit={() => go("basic")}>About</Title>
        <p
          className={`w-full text-base leading-7 ${
            user.bio ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
          }`}
        >
          {user.bio || "Tell employers a little about yourself."}
        </p>

        {contact.length > 0 && (
          <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-[var(--border)] pt-5 sm:grid-cols-2 lg:grid-cols-3">
            {contact.map(({ icon: Icon, value }) => (
              <li
                key={value}
                className="flex min-w-0 items-center gap-2.5 text-sm text-[var(--text-secondary)]"
              >
                <Icon className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                <span className="truncate">{value}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Skills */}
      <section className={cardCls}>
        <Title onEdit={() => go("basic")}>Skills</Title>
        {skills.length ? (
          <ul className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <li
                key={s}
                className="rounded-full bg-[var(--primary-light)] px-3.5 py-1.5 text-sm font-medium text-[var(--primary)]"
              >
                {s}
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-[var(--text-muted)]">
              Add the skills employers search for.
            </p>
            <button
              type="button"
              onClick={() => go("basic")}
              className={addBtn}
            >
              <Plus className="h-4 w-4" />
              Add skills
            </button>
          </div>
        )}
      </section>

      {/* Experience and Education */}
      {[
        {
          name: "Experience",
          list: experience,
          tab: "experience" as Tab,
          empty: "Add your work history.",
        },
        {
          name: "Education",
          list: education,
          tab: "education" as Tab,
          empty: "Add your studies and qualifications.",
        },
      ].map(({ name, list, tab, empty }) => (
        <section key={name} className={cardCls}>
          <Title onEdit={() => go(tab)}>{name}</Title>
          {list.length ? (
            <Timeline list={list} />
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-[var(--text-muted)]">{empty}</p>
              <button type="button" onClick={() => go(tab)} className={addBtn}>
                <Plus className="h-4 w-4" />
                Add {name.toLowerCase()}
              </button>
            </div>
          )}
        </section>
      ))}

      {/* Resume */}
      <section className={cardCls}>
        <Title onEdit={() => go("resume")}>Resume</Title>
        {resumeUrl ? (
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3 sm:max-w-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                {resumeUrl.split("/").pop()}
              </p>
              <p className="text-xs text-[var(--text-muted)]">PDF</p>
            </div>
            <a
              href={resumeFullUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary-light)] ${focusRing}`}
            >
              View
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-[var(--text-muted)]">
              Upload your resume so employers can review it.
            </p>
            <button
              type="button"
              onClick={() => go("resume")}
              className={addBtn}
            >
              <Plus className="h-4 w-4" />
              Upload resume
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
