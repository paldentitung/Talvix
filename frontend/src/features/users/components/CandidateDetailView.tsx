import {
  Briefcase,
  CalendarDays,
  FileText,
  GraduationCap,
  Info,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useUserById } from "../hooks/useUserById";
import VerifiedBadge from "../../company/components/VerifiedBadge";
import StatusBadge from "../../../shared/components/StatusBadge";
import relativeTime from "../../../shared/utils/relativeTime";
import { tintFor } from "../../../shared/utils/avatarTint";
import initials from "../../../shared/utils/getInitials";
import { fullName } from "../../../shared/utils/getFullname";
import { assetUrl } from "../../../shared/utils/assetUrl";
import SectionCard from "../../../shared/components/SectionCard";
import { EmptyState, DetailError, DetailHeader, Chip, Count } from "./detail";
import DetailSkeleton from "../../../shared/components/DetailSkeleton";

const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });

const range = (start: string, end: string | null) =>
  `${monthYear(start)} – ${end ? monthYear(end) : "Present"}`;

const Timeline = ({
  items,
}: {
  items: {
    key: string;
    title: string;
    subtitle: string;
    dates: string;
    description?: string | null;
  }[];
}) => (
  <ol className="relative flex flex-col gap-5 border-l border-(--border) pl-5">
    {items.map((it) => (
      <li key={it.key} className="relative">
        <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-(--primary) ring-4 ring-(--card)" />
        <p className="text-sm font-semibold text-(--text-primary)">
          {it.title}
        </p>
        <p className="text-sm text-(--text-secondary)">{it.subtitle}</p>
        <p className="mt-0.5 text-xs text-(--text-muted)">{it.dates}</p>
        {it.description && (
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-(--text-secondary)">
            {it.description}
          </p>
        )}
      </li>
    ))}
  </ol>
);

const CandidateDetailView = ({ id }: { id: string }) => {
  const { data: u, isLoading, isError } = useUserById(id);

  if (isLoading) return <DetailSkeleton sections={3} />;
  if (isError || !u) return <DetailError message="Failed to load profile." />;

  const name = fullName(u);
  const tint = tintFor(name);
  const avatarSrc = assetUrl(u.avatar);
  const resumeSrc = assetUrl(u.resumeUrl);
  const educations = u.educations ?? [];
  const experiences = [...(u.experiences ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <DetailHeader
        avatar={
          avatarSrc ? (
            <img
              src={avatarSrc}
              alt={name}
              className="h-20 w-20 object-cover"
            />
          ) : (
            <div
              className="flex h-20 w-20 items-center justify-center text-2xl font-bold"
              style={{ background: tint.bg, color: tint.fg }}
            >
              {initials(name)}
            </div>
          )
        }
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <h2 className="font-display text-xl font-bold leading-snug text-(--text-primary)">
            {name}
          </h2>
          <VerifiedBadge verified={u.isVerified} />
          <StatusBadge status={u.status} />
        </div>

        {u.title && (
          <p className="mt-1 text-sm text-(--text-secondary)">{u.title}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {u.location && <Chip icon={MapPin}>{u.location}</Chip>}
          <Chip icon={CalendarDays}>Joined {relativeTime(u.createdAt)}</Chip>
        </div>
      </DetailHeader>

      {/* Contact */}
      <SectionCard icon={Mail} title="Contact">
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <Mail size={15} className="shrink-0 text-(--text-muted)" />
            <div className="min-w-0">
              <dt className="text-xs text-(--text-muted)">Email</dt>
              <dd className="truncate text-(--text-primary)">{u.email}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={15} className="shrink-0 text-(--text-muted)" />
            <div className="min-w-0">
              <dt className="text-xs text-(--text-muted)">Phone</dt>
              <dd className="truncate text-(--text-primary)">
                {u.phone || (
                  <span className="text-(--text-muted)">Not provided</span>
                )}
              </dd>
            </div>
          </div>
        </dl>
      </SectionCard>

      {/* About */}
      <SectionCard icon={Info} title="About">
        {u.bio ? (
          <p className="whitespace-pre-line text-sm leading-relaxed text-(--text-secondary)">
            {u.bio}
          </p>
        ) : (
          <EmptyState icon={Info} text="No bio added." />
        )}
      </SectionCard>

      {/* Skills */}
      <SectionCard
        icon={Sparkles}
        title="Skills"
        badge={<Count n={u.skills.length} />}
      >
        {u.skills.length === 0 ? (
          <EmptyState icon={Sparkles} text="No skills listed." />
        ) : (
          <div className="flex flex-wrap gap-2">
            {u.skills.map((s) => (
              <span
                key={s}
                className="rounded-full bg-(--primary)/10 px-3 py-1 text-xs font-medium text-(--primary)"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Experience */}
      <SectionCard
        icon={Briefcase}
        title="Experience"
        badge={<Count n={experiences.length} />}
      >
        {experiences.length === 0 ? (
          <EmptyState icon={Briefcase} text="No experience added." />
        ) : (
          <Timeline
            items={experiences.map((e) => ({
              key: e.id,
              title: e.title,
              subtitle: e.company,
              dates: range(e.startDate, e.endDate),
              description: e.description,
            }))}
          />
        )}
      </SectionCard>

      {/* Education */}
      <SectionCard
        icon={GraduationCap}
        title="Education"
        badge={<Count n={educations.length} />}
      >
        {educations.length === 0 ? (
          <EmptyState icon={GraduationCap} text="No education added." />
        ) : (
          <Timeline
            items={educations.map((e) => ({
              key: e.id,
              title: e.degree,
              subtitle: e.school,
              dates: range(e.startDate, e.endDate),
            }))}
          />
        )}
      </SectionCard>

      {/* Resume */}
      <SectionCard icon={FileText} title="Resume">
        {resumeSrc ? (
          <a
            href={resumeSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-(--primary)/10 px-4 py-2 text-sm font-medium text-(--primary) transition-colors hover:bg-(--primary)/15"
          >
            <FileText size={15} />
            View resume
            <ExternalLink size={12} />
          </a>
        ) : (
          <EmptyState icon={FileText} text="No resume uploaded." />
        )}
      </SectionCard>
    </div>
  );
};

export default CandidateDetailView;
