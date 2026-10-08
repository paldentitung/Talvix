import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import NotificationButton from "../../shared/components/NotificationButton";
import initials from "../../shared/utils/getInitials";
import { useNotifications } from "../../features/notification/hooks/useNotifications";
import { useUnreadNotificationCount } from "../../features/notification/hooks/useUnreadNotificationCount";
import { useMarkNotificationRead } from "../../features/notification/hooks/useMarkNotificationRead";
import { useMarkAllNotificationsRead } from "../../features/notification/hooks/useMarkAllNotificationsRead";

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/candidate/dashboard": {
    title: "Dashboard",
    subtitle: "Overview of your job search activity",
  },
  "/candidate/jobs": {
    title: "Find Jobs",
    subtitle: "Browse and discover jobs that match your profile",
  },
  "/candidate/saved-jobs": {
    title: "Saved Jobs",
    subtitle: "Jobs you've bookmarked to review later",
  },
  "/candidate/applications": {
    title: "Applications",
    subtitle: "Track the status of jobs you've applied to",
  },
  "/candidate/profile": {
    title: "Profile",
    subtitle: "Manage your resume and personal details",
  },
  "/candidate/settings": {
    title: "Settings",
    subtitle: "Manage your account and preferences",
  },
};

const defaultMeta = pageMeta["/candidate/dashboard"];

// Match nested routes too, e.g. /candidate/jobs/123
const getMeta = (pathname: string) => {
  const key = Object.keys(pageMeta)
    .sort((a, b) => b.length - a.length)
    .find((p) => pathname === p || pathname.startsWith(`${p}/`));
  return key ? pageMeta[key] : defaultMeta;
};

const iconButton =
  "relative flex h-10 w-10 items-center justify-center rounded-full border border-(--border) bg-(--card) text-(--text-secondary) shadow-(--shadow-sm) transition-all hover:border-(--primary)/30 hover:text-(--primary) hover:shadow-(--shadow-md) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)";

type Props = {
  onMenuClick?: () => void;
  userName?: string;
  avatarUrl?: string | null;
};

const CandidateHeader = ({
  onMenuClick,
  userName = "User",
  avatarUrl,
}: Props) => {
  const { pathname } = useLocation();
  const { title, subtitle } = getMeta(pathname);

  const navigate = useNavigate();
  const { data: notifications = [] } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { mutate: markAsRead } = useMarkNotificationRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsRead();

  return (
    <header className="mb-6 flex items-center justify-between gap-3 border-b border-(--border) pb-5 ">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className={`${iconButton} shrink-0 lg:hidden`}
          >
            <Menu size={18} />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="truncate font-display text-xl font-bold text-(--text-primary) sm:text-2xl">
            {title}
          </h1>
          <p className="mt-0.5 truncate text-xs text-(--text-secondary) sm:text-sm">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <NotificationButton
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />

        <button
          aria-label="Account"
          onClick={() => navigate("/candidate/profile")}
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-(--primary) to-(--primary-dark) text-sm font-semibold text-white shadow-(--shadow-sm) ring-2 ring-transparent transition-all hover:ring-(--primary-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)"
        >
          {avatarUrl ? (
            <img
              src={`${import.meta.env.VITE_API_BACKEND_URL}${avatarUrl}`}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            initials(userName)
          )}
        </button>
      </div>
    </header>
  );
};

export default CandidateHeader;
