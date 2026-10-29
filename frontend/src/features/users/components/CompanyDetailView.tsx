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
import VerifiedBadge from "../../company/components/VerifiedBadge";
import relativeTime from "../../../shared/utils/relativeTime";
import { tintFor } from "../../../shared/utils/avatarTint";
import { useCompanyById } from "../../company/hooks/useCompanyById";
import { assetUrl } from "../../../shared/utils/assetUrl";
import initials from "../../../shared/utils/getInitials";
import SectionCard from "../../../shared/components/SectionCard";
import { EmptyState, DetailError, DetailHeader, Chip, Count } from "./detail";
import DetailSkeleton from "../../../shared/components/DetailSkeleton";
import type { IconType } from "../../../shared/types/ui.types";
import { formatLabel as label } from "../../../shared/utils/formatLabel";

const chipTone: Record<string, string> = {
  REMOTE: "bg-emerald-50 text-emerald-700",
  HYBRID: "bg-sky-50 text-sky-700",
  ONSITE: "bg-slate-100 text-slate-600",
};

const StatTile = ({
  icon: Icon,
  label: statLabel,
  value,
  valueClass = "text-(--text-primary)",
  iconClass = "bg-(--primary)/10 text-(--primary)",
}: {
  icon: IconType;
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

const CompanyDetailView = ({ id }: { id: string }) => {
  const { data: c, isLoading, isError } = useCompanyById(id);

  if (isLoading) return <DetailSkeleton squareAvatar stats={3} />;
  if (isError || !c) return <DetailError message="Failed to load company." />;

  const recruiterName = `${c.firstName} ${c.lastName}`.trim();
  const name = c.companyName ?? recruiterName;
  const tint = tintFor(name);

  const logoSrc = assetUrl(c.companyLogo);
  const avatarSrc = assetUrl(c.avatar);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <DetailHeader
        squareAvatar
        avatar={
          logoSrc ? (
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
          )
        }
      >
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
          {c.location && <Chip icon={MapPin}>{c.location}</Chip>}
          <Chip icon={CalendarDays}>Joined {relativeTime(c.createdAt)}</Chip>
        </div>
      </DetailHeader>

      {/* Stat strip */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <StatTile icon={Briefcase} label="Open jobs" value={c.jobs.length} />
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
        badge={<Count n={c.jobs.length} />}
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
