import { useLocation, Link } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Building2,
  Briefcase,
  ShieldAlert,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Logo from "../../components/layout/Logo";
import { useLogout } from "../../features/auth/hooks/useLogout";

type NavLink = {
  label: string;
  href: string;
  icon: typeof LayoutGrid;
  badge?: number;
};

const adminLinks: NavLink[] = [
  { label: "Dashboard", href: "/admin/overview", icon: LayoutGrid },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Companies", href: "/admin/companies", icon: Building2 },
  { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { label: "Reports", href: "/admin/reports", icon: ShieldAlert },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const NavSection = ({
  title,
  links,
  pathname,
  onNavigate,
}: {
  title: string;
  links: NavLink[];
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
          {badge !== undefined && badge > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-(--warning-bg) text-[11px] font-semibold text-(--warning)">
              {badge}
            </span>
          )}
        </Link>
      );
    })}
  </div>
);

const AdminSidebar = ({
  onNavigate,
  reportsCount,
}: {
  onNavigate?: () => void;
  reportsCount?: number;
}) => {
  const { pathname } = useLocation();
  const { mutate: logoutUser } = useLogout();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logoutUser();
    }
  };

  const links = adminLinks.map((link) =>
    link.label === "Reports" ? { ...link, badge: reportsCount } : link,
  );

  return (
    <aside className="flex h-full w-full flex-col border-r border-(--border) bg-(--card) shadow-(--shadow-sm) overflow-y-auto z-40">
      <div className="flex items-center gap-2 px-5 py-6">
        <Logo />
      </div>

      <nav className="flex flex-1 flex-col gap-6 px-3 pb-6">
        <NavSection
          title="Admin"
          links={links}
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

export default AdminSidebar;
