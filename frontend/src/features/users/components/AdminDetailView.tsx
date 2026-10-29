import { CalendarDays, Mail, ShieldCheck } from "lucide-react";
import { useUserById } from "../hooks/useUserById";
import VerifiedBadge from "../../company/components/VerifiedBadge";
import StatusBadge from "../../../shared/components/StatusBadge";
import SectionCard from "../../../shared/components/SectionCard";
import DetailSkeleton from "../../../shared/components/DetailSkeleton";
import relativeTime from "../../../shared/utils/relativeTime";
import { tintFor } from "../../../shared/utils/avatarTint";
import initials from "../../../shared/utils/getInitials";
import { fullName } from "../../../shared/utils/getFullname";
import { assetUrl } from "../../../shared/utils/assetUrl";
import { DetailError, DetailHeader, Chip } from "./detail";

const AdminDetailView = ({ id }: { id: string }) => {
  const { data: u, isLoading, isError } = useUserById(id);

  if (isLoading) return <DetailSkeleton sections={1} />;
  if (isError || !u) return <DetailError message="Failed to load profile." />;

  const name = fullName(u);
  const tint = tintFor(name);
  const avatarSrc = assetUrl(u.avatar);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
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

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Chip icon={ShieldCheck}>Administrator</Chip>
          <Chip icon={CalendarDays}>Joined {relativeTime(u.createdAt)}</Chip>
        </div>
      </DetailHeader>

      <SectionCard icon={Mail} title="Contact">
        <dl className="text-sm">
          <div className="flex items-center gap-3">
            <Mail size={15} className="shrink-0 text-(--text-muted)" />
            <div className="min-w-0">
              <dt className="text-xs text-(--text-muted)">Email</dt>
              <dd className="truncate text-(--text-primary)">{u.email}</dd>
            </div>
          </div>
        </dl>
      </SectionCard>
    </div>
  );
};

export default AdminDetailView;
