import { CalendarDays, Mail, ShieldAlert, ShieldCheck } from "lucide-react";
import { useUserById } from "../hooks/useUserById";
import VerifiedBadge from "../../company/components/VerifiedBadge";
import StatusBadge from "../../../shared/components/StatusBadge";
import relativeTime from "../../../shared/utils/relativeTime";
import { tintFor } from "../../../shared/utils/avatarTint";
import initials from "../../../shared/utils/getInitials";
import { fullName } from "../../../shared/utils/getFullname";
import { assetUrl } from "../../../shared/utils/assetUrl";

const AdminDetailView = ({ id }: { id: string }) => {
  const { data: u, isLoading, isError } = useUserById(id);

  if (isLoading) {
    return (
      <div className="mx-auto h-48 max-w-3xl animate-pulse rounded-(--radius-lg) border border-(--border) bg-(--card)" />
    );
  }

  if (isError || !u) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <ShieldAlert size={18} className="text-(--danger)" />
        <p className="text-sm font-medium text-(--danger)">
          Failed to load profile.
        </p>
      </div>
    );
  }

  const name = fullName(u);
  const tint = tintFor(name);
  const avatarSrc = assetUrl(u.avatar);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <div className="rounded-(--radius-lg) border border-(--border) bg-(--card) p-6 shadow-(--shadow-sm)">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-full">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={name}
                className="h-16 w-16 object-cover"
              />
            ) : (
              <div
                className="flex h-16 w-16 items-center justify-center text-xl font-bold"
                style={{ background: tint.bg, color: tint.fg }}
              >
                {initials(name)}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl font-bold text-(--text-primary)">
                {name}
              </h2>
              <VerifiedBadge verified={u.isVerified} />
              <StatusBadge status={u.status} />
            </div>
            <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-(--text-secondary)">
              <ShieldCheck size={13} /> Administrator
            </span>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <Mail size={15} className="text-(--text-muted)" />
            <div className="min-w-0">
              <dt className="text-xs text-(--text-muted)">Email</dt>
              <dd className="truncate text-(--text-primary)">{u.email}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays size={15} className="text-(--text-muted)" />
            <div>
              <dt className="text-xs text-(--text-muted)">Joined</dt>
              <dd className="text-(--text-primary)">
                {relativeTime(u.createdAt)}
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default AdminDetailView;
