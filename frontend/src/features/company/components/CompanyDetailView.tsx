import {
  Briefcase,
  Building2,
  CalendarDays,
  ExternalLink,
  Info,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import VerifiedBadge from "./VerifiedBadge";
import relativeTime from "../../../shared/utils/relativeTime";
import { tintFor } from "../../../shared/utils/avatarTint";
import { useCompanyById } from "../hooks/useCompanyById";
import { assetUrl } from "../../../shared/utils/assetUrl";
import initials from "../../../shared/utils/getInitials";

const label = (v: string) =>
  v
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());

const chipTone: Record<string, string> = {
  REMOTE: "bg-emerald-50 text-emerald-700",
  HYBRID: "bg-sky-50 text-sky-700",
  ONSITE: "bg-slate-100 text-slate-600",
};

const Chip = ({
  children,
  className = "bg-slate-100 text-slate-600",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

const SectionCard = ({
  icon: Icon,
  title,
  badge,
  children,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="overflow-hidden rounded-(--radius-lg) border border-(--border) bg-(--card) shadow-(--shadow-sm)">
    <div className="flex items-center justify-between border-b border-(--border) px-5 py-3.5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-(--primary)/10 text-(--primary)">
          <Icon size={14} />
        </span>
        <h3 className="font-display text-sm font-bold text-(--text-primary)">
          {title}
        </h3>
      </div>
      {badge}
    </div>
    <div className="p-5">{children}</div>
  </section>
);

const StatTile = ({
  icon: Icon,
  label: statLabel,
  value,
  valueClass = "text-(--text-primary)",
  iconClass = "bg-(--primary)/10 text-(--primary)",
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: React.ReactNode;
  valueClass?: string;
  iconClass?: string;
}) => (
  <div className="flex items-center gap-3 rounded-(--radius-lg) border border-(--border) bg-(--card) p-4 shadow-(--shadow-sm)">
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClass}`}
    >
      <Icon size={16} />
    </span>
    <div className="min-w-0">
      <p className="text-xs text-(--text-muted)">{statLabel}</p>
      <p className={`truncate text-sm font-bold ${valueClass}`}>{value}</p>
    </div>
  </div>
);

const EmptyState = ({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ size?: number }>;
  text: string;
}) => (
  <div className="flex flex-col items-center gap-2 py-8 text-center">
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-(--bg) text-(--text-muted)">
      <Icon size={18} />
    </span>
    <p className="text-sm text-(--text-muted)">{text}</p>
  </div>
);

const DetailSkeleton = () => (
  <div
    className="mx-auto flex max-w-3xl animate-pulse flex-col gap-5"
    aria-busy="true"
  >
    <div className="overflow-hidden rounded-(--radius-lg) border border-(--border) bg-(--card)">
      <div className="h-28 bg-(--bg)" />
      <div className="px-6 pb-6">
        <div className="-mt-10 h-20 w-20 rounded-(--radius-lg) bg-(--border) ring-4 ring-(--card)" />
        <div className="mt-4 h-5 w-48 rounded bg-(--border)" />
        <div className="mt-2 h-4 w-32 rounded bg-(--border)" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-16 rounded-(--radius-lg) border border-(--border) bg-(--card)"
        />
      ))}
    </div>
    <div className="h-32 rounded-(--radius-lg) border border-(--border) bg-(--card)" />
    <div className="h-48 rounded-(--radius-lg) border border-(--border) bg-(--card)" />
  </div>
);

/* ---------- main view ---------- */

const CompanyDetailView = ({ id }: { id: string }) => {
  const { data: c, isLoading, isError } = useCompanyById(id);

  if (isLoading) return <DetailSkeleton />;

  if (isError || !c) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-(--danger)">
          <ShieldAlert size={18} />
        </span>
        <p className="text-sm font-medium text-(--danger)">
          Failed to load company.
        </p>
        <p className="text-xs text-(--text-muted)">
          Close this panel and try again.
        </p>
      </div>
    );
  }

  const recruiterName = `${c.firstName} ${c.lastName}`.trim();
  const name = c.companyName ?? recruiterName;
  const tint = tintFor(name);

  const logoSrc = assetUrl(c.companyLogo);
  const avatarSrc = assetUrl(c.avatar);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      {/* Header with banner */}
      <div className="overflow-hidden rounded-(--radius-lg) border border-(--border) bg-(--card) shadow-(--shadow-sm)">
        <div className="relative h-28 bg-gradient-to-br from-(--primary)/20 via-(--primary)/10 to-(--bg)">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
              backgroundSize: "14px 14px",
            }}
          />
        </div>

        <div className="px-6 pb-6">
          <div className="-mt-10 h-20 w-20 overflow-hidden rounded-(--radius-lg) bg-(--card) shadow-(--shadow-sm) ring-4 ring-(--card)">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={`${name} logo`}
                className="h-20 w-20 object-cover"
              />
            ) : (
              <div
                className="flex h-20 w-20 items-center justify-center"
                style={{ background: tint.bg, color: tint.fg }}
              >
                <Building2 size={30} />
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-bold leading-snug text-(--text-primary)">
              {name}
            </h2>
            <VerifiedBadge verified={c.isVerified} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {c.companyWebsite && (
              <a
                href={c.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-(--primary)/10 px-3 py-1 text-xs font-medium text-(--primary) transition-colors hover:bg-(--primary)/15"
              >
                {c.companyWebsite.replace(/^https?:\/\//, "")}
                <ExternalLink size={11} />
              </a>
            )}
            {c.location && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-(--bg) px-3 py-1 text-xs font-medium text-(--text-secondary)">
                <MapPin size={12} className="text-(--text-muted)" />
                {c.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-(--bg) px-3 py-1 text-xs font-medium text-(--text-secondary)">
              <CalendarDays size={12} className="text-(--text-muted)" />
              Joined {relativeTime(c.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile icon={Briefcase} label="Open jobs" value={c.jobs.length} />
        <StatTile
          icon={CalendarDays}
          label="Joined"
          value={relativeTime(c.createdAt)}
        />
        <StatTile
          icon={c.isVerified ? ShieldCheck : ShieldAlert}
          label="Status"
          value={c.isVerified ? "Verified" : "Unverified"}
          valueClass={c.isVerified ? "text-emerald-600" : "text-amber-600"}
          iconClass={
            c.isVerified
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600"
          }
        />
      </div>

      {/* About */}
      <SectionCard icon={Info} title="About">
        {c.companyDescription ? (
          <p className="whitespace-pre-line text-sm leading-relaxed text-(--text-secondary)">
            {c.companyDescription}
          </p>
        ) : (
          <EmptyState icon={Info} text="No description added." />
        )}
      </SectionCard>

      {/* Account */}
      <SectionCard icon={User} title="Account">
        <div className="flex items-center gap-3">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={recruiterName}
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--primary) text-sm font-bold text-white">
              {initials(recruiterName)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-(--text-primary)">
              {recruiterName || "—"}
            </p>
            <p className="text-xs text-(--text-muted)">
              Recruiter · joined {relativeTime(c.createdAt)}
            </p>
          </div>
        </div>
      </SectionCard>
      {/* Jobs */}
      <SectionCard
        icon={Briefcase}
        title="Open Jobs"
        badge={
          <Chip className="bg-(--bg) text-(--text-secondary)">
            {c.jobs.length}
          </Chip>
        }
      >
        {c.jobs.length === 0 ? (
          <EmptyState icon={Briefcase} text="No jobs posted yet." />
        ) : (
          <ul className="-mx-2 flex flex-col">
            {c.jobs.map((j) => (
              <li
                key={j.id}
                className="flex items-start justify-between gap-4 rounded-(--radius-md) px-2 py-3 transition-colors hover:bg-(--bg)"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-(--text-primary)">
                    {j.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-(--text-muted)">
                    <MapPin size={11} />
                    {j.location}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Chip className={chipTone[j.workMode]}>
                      {label(j.workMode)}
                    </Chip>
                    <Chip>{label(j.employmentType)}</Chip>
                    <Chip>{label(j.experienceLevel)}</Chip>
                  </div>
                </div>
                <span className="shrink-0 pt-0.5 text-xs text-(--text-muted)">
                  {relativeTime(j.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
};

export default CompanyDetailView;
