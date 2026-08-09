import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Bookmark,
  FileText,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Logo from "../../components/layout/Logo";
import { useLogout } from "../../features/auth/hooks/useLogout";

const jobLinks = [
  { label: "Dashboard", href: "/candidate/dashboard", icon: LayoutDashboard },
  { label: "Find Jobs", href: "/candidate/jobs", icon: Search },
  {
    label: "Saved Jobs",
    href: "/candidate/saved-jobs",
    icon: Bookmark,
    badge: 12,
  },
  {
    label: "Applications",
    href: "/candidate/applications",
    icon: FileText,
    badge: 4,
  },
];

const accountLinks = [
  { label: "Profile", href: "/candidate/profile", icon: User },
  { label: "Settings", href: "/candidate/settings", icon: Settings },
];

const NavSection = ({
  title,
  links,
  pathname,
  onNavigate,
}: {
  title: string;
  links: typeof jobLinks;
  pathname: string;
  onNavigate?: () => void;
}) => (
  <div className="flex flex-col gap-1">
    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-(--text-muted) mb-1">
      {title}
    </p>
    {links.map(({ label, href, icon: Icon, badge }) => {
      const isActive = pathname === href;
      return (
        <Link
          key={href}
          to={href}
          onClick={onNavigate}
          className={`group flex items-center justify-between gap-3 rounded-(--radius-md) px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive
              ? "bg-(--primary-light) text-(--primary)"
              : "text-(--text-secondary) hover:bg-(--bg) hover:text-(--text-primary)"
          }`}
        >
          <span className="flex items-center gap-3">
            <Icon
              size={18}
              className={
                isActive
                  ? "text-(--primary)"
                  : "text-(--text-muted) group-hover:text-(--text-secondary)"
              }
            />
            {label}
          </span>
          {badge !== undefined && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-(--primary) text-[11px] font-semibold text-white">
              {badge}
            </span>
          )}
        </Link>
      );
    })}
  </div>
);

const CandidateSidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { pathname } = useLocation();
  const { mutate: logoutUser } = useLogout();
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logoutUser();
    }
  };

  return (
    <aside className="flex h-full w-full flex-col border-r border-(--border) bg-(--card) shadow-(--shadow-sm) overflow-y-auto">
      <div className="flex items-center gap-2 px-5 py-6">
        <Logo />
      </div>

      <nav className="flex flex-1 flex-col gap-6 px-3 pb-6">
        <NavSection
          title="Jobs"
          links={jobLinks}
          pathname={pathname}
          onNavigate={onNavigate}
        />
        <NavSection
          title="Account"
          links={accountLinks}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      </nav>
      <div className="border-t border-(--border) px-3 py-4">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-(--radius-md) px-3 py-2.5 text-sm font-medium text-(--text-secondary) transition-colors hover:bg-(--danger-bg) hover:text-(--danger)"
        >
          <LogOut
            size={18}
            className="text-(--text-muted) transition-colors group-hover:text-(--danger)"
          />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default CandidateSidebar;
