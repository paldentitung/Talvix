import { useLocation } from "react-router-dom";
import { MessageSquare, Bell, Menu } from "lucide-react";

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/admin/overview": {
    title: "Platform overview",
    subtitle: "Everything happening across Hirely.",
  },
  "/admin/users": {
    title: "Users",
    subtitle: "Manage job seekers and employers on the platform",
  },
  "/admin/companies": {
    title: "Companies",
    subtitle: "Review and manage registered companies",
  },
  "/admin/jobs": {
    title: "Jobs",
    subtitle: "Monitor job postings across all companies",
  },
  "/admin/reports": {
    title: "Reports",
    subtitle: "Review flagged content and open reports",
  },
  "/admin/settings": {
    title: "Settings",
    subtitle: "Manage platform-wide configuration",
  },
};

const defaultMeta = {
  title: "Dashboard",
  subtitle: "Everything happening across Hirely.",
};

const getPageMeta = (pathname: string) => {
  if (pageMeta[pathname]) return pageMeta[pathname];
  const match = Object.keys(pageMeta)
    .filter((path) => pathname.startsWith(path))
    .sort((a, b) => b.length - a.length)[0];
  return match ? pageMeta[match] : defaultMeta;
};

const AdminHeader = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { pathname } = useLocation();
  const { title, subtitle } = getPageMeta(pathname);

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
          aria-label="Messages"
          className="flex h-9 w-9 items-center justify-center rounded-(--radius-md) text-(--text-secondary) transition-colors hover:bg-(--card) hover:text-(--text-primary) sm:h-10 sm:w-10"
        >
          <MessageSquare size={20} />
        </button>

        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-(--radius-md) text-(--text-secondary) transition-colors hover:bg-(--card) hover:text-(--text-primary) sm:h-10 sm:w-10"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-(--accent)" />
        </button>

        <button className="flex items-center gap-2 rounded-(--radius-md) py-1 pl-1 pr-2 transition-colors hover:bg-(--card)">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-(--primary-light) text-xs font-semibold text-(--primary)">
            AM
          </span>
          <span className="hidden text-sm font-medium text-(--text-primary) sm:inline">
            Alex
          </span>
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
