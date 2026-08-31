import { useLocation } from "react-router-dom";
import { Bell, User, Menu, Pencil } from "lucide-react";
import Button from "../../components/ui/Button";

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/recruiter/dashboard": {
    title: "Dashboard",
    subtitle: "Overview of your hiring activity",
  },
  "/recruiter/jobs": {
    title: "Manage Jobs",
    subtitle: "View, edit and track all your job postings",
  },
  "/recruiter/jobs/new": {
    title: "Post a Job",
    subtitle: "Create a new job listing",
  },
  "/recruiter/applicants": {
    title: "Applicants",
    subtitle: "Review and manage candidates for your jobs",
  },
  "/recruiter/company": {
    title: "Company Profile",
    subtitle: "Update your company details and branding",
  },
  "/recruiter/analytics": {
    title: "Analytics",
    subtitle: "Track performance across your job postings",
  },
  "/recruiter/settings": {
    title: "Settings",
    subtitle: "Manage your account and preferences",
  },
};

const defaultMeta = {
  title: "Dashboard",
  subtitle: "Overview of your hiring activity",
};
const getPageMeta = (pathname: string) => {
  // Exact match first
  if (pageMeta[pathname]) return pageMeta[pathname];

  // Fall back to the longest registered path that this pathname starts with
  const match = Object.keys(pageMeta)
    .filter((path) => pathname.startsWith(path))
    .sort((a, b) => b.length - a.length)[0];

  return match ? pageMeta[match] : defaultMeta;
};
const Header = ({ onMenuClick, openJobPostingModal }: any) => {
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

        <div>
          <Button
            variant="primary"
            className="hidden sm:inline-flex"
            onClick={openJobPostingModal}
            size="sm"
          >
            <Pencil size={12} />
            Post a Job
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
