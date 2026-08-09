import { useLocation } from "react-router-dom";
import { Bell, User, Menu } from "lucide-react";

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

const defaultMeta = {
  title: "Dashboard",
  subtitle: "Overview of your job search activity",
};

const CandidateHeader = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { pathname } = useLocation();
  const { title, subtitle } = pageMeta[pathname] ?? defaultMeta;

  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius-md) text-(--text-secondary) hover:bg-(--card) lg:hidden"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="truncate font-display text-lg font-bold text-(--text-primary) sm:text-2xl">
            {title}
          </h1>
          <p className="mt-0.5 truncate text-xs text-(--text-secondary) sm:mt-1 sm:text-sm">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-(--radius-md) text-(--text-secondary) transition-colors hover:bg-(--card) hover:text-(--text-primary) sm:h-10 sm:w-10"
        >
          <Bell size={18} className="sm:hidden" />
          <Bell size={20} className="hidden sm:block" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-(--accent)" />
        </button>

        <button
          aria-label="Account"
          className="flex h-9 w-9 items-center justify-center rounded-(--radius-md) text-(--text-secondary) transition-colors hover:bg-(--card) hover:text-(--text-primary) sm:h-10 sm:w-10"
        >
          <User size={20} className="sm:hidden" />
          <User size={24} className="hidden sm:block" />
        </button>
      </div>
    </div>
  );
};

export default CandidateHeader;
