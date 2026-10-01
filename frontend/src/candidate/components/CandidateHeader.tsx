import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import initials from "../../shared/utils/getInitials";
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
  hasUnread?: boolean;
};

const CandidateHeader = ({
  onMenuClick,
  userName = "User",
  avatarUrl,
  hasUnread = true,
}: Props) => {
  const { pathname } = useLocation();
  const { title, subtitle } = getMeta(pathname);

  const navigate = useNavigate();

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
        <button aria-label="Notifications" className={iconButton}>
          <Bell size={18} />
          {hasUnread && (
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-(--accent) ring-2 ring-(--card)" />
          )}
        </button>

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
