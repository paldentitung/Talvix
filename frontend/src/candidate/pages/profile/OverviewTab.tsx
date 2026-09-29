import { Title, cardCls, range } from "./shared";
import type { Entry, Tab } from "./shared";
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
  const checks = [
    user.firstName,
    user.lastName,
    user.title,
    user.location,
    user.bio,
    user.phone,
    skills.length,
    experience.length,
    education.length,
    resumeUrl,
  ];
  const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className={`${cardCls} lg:col-span-2`}>
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-[var(--text-primary)]">
            Profile completion
          </span>
          <span className="font-semibold text-[var(--primary)]">{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--primary-light)]">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className={`${cardCls} lg:col-span-2`}>
        <Title onEdit={() => go("basic")}>About</Title>
        <p className="text-sm text-[var(--text-secondary)]">
          {user.bio || "Tell employers a little about yourself."}
        </p>
        <p className="mt-3 text-sm text-[var(--text-muted)]">
          {[user.location, user.email, user.phone]
            .filter(Boolean)
            .join("  ·  ")}
        </p>
      </div>

      <div className={cardCls}>
        <Title onEdit={() => go("basic")}>Skills</Title>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s}
              className="rounded-full bg-[var(--primary-light)] px-3 py-1.5 text-sm font-medium text-[var(--primary)]"
            >
              {s}
            </span>
          ))}
          {!skills.length && (
            <p className="text-sm text-[var(--text-muted)]">
              No skills added yet.
            </p>
          )}
        </div>
      </div>

      <div className={cardCls}>
        <Title onEdit={() => go("resume")}>Resume</Title>
        {resumeUrl ? (
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                {resumeUrl.split("/").pop()}
              </p>
              <p className="text-xs text-[var(--text-muted)]">PDF</p>
            </div>
            <a
              href={resumeFullUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[var(--primary)] hover:underline"
            >
              View
            </a>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">
            No resume uploaded yet.
          </p>
        )}
      </div>

      {[
        { name: "Experience", list: experience, tab: "experience" as Tab },
        { name: "Education", list: education, tab: "education" as Tab },
      ].map(({ name, list, tab }) => (
        <div key={name} className={cardCls}>
          <Title onEdit={() => go(tab)}>{name}</Title>
          <div className="space-y-3">
            {list.map((e) => (
              <div key={e.id}>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {e.title}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {e.org} · {range(e.start, e.end)}
                </p>
              </div>
            ))}
            {!list.length && (
              <p className="text-sm text-[var(--text-muted)]">
                Nothing added yet.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
