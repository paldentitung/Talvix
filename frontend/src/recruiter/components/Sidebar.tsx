import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import Logo from "../../components/layout/Logo";
import { useLogout } from "../../features/auth/hooks/useLogout";

const hiringLinks = [
  { label: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
  { label: "Manage Jobs", href: "/recruiter/jobs", icon: Briefcase },
  {
    label: "Applicants",
    href: "/recruiter/applicants",
    icon: Users,
    badge: 23,
  },
];

const companyLinks = [
  { label: "Company Profile", href: "/recruiter/company", icon: Building2 },
  { label: "Analytics", href: "/recruiter/analytics", icon: BarChart3 },
  { label: "Settings", href: "/recruiter/settings", icon: Settings },
];

const NavSection = ({
  title,
  links,
  pathname,
  onNavigate,
}: {
  title: string;
  links: typeof hiringLinks;
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

const Sidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { pathname } = useLocation();
  const { mutate: logoutUser } = useLogout();
  const handleLogout = () => {
    window.confirm("are you sure");
    logoutUser();
  };

  return (
    <aside className="flex h-full w-full flex-col border-r border-(--border) bg-(--card) shadow-(--shadow-sm) overflow-y-auto">
      <div className="flex items-center gap-2 px-5 py-6">
        <Logo />
      </div>
      <nav className="flex flex-1 flex-col gap-6 px-3 pb-6">
        <NavSection
          title="Hiring"
          links={hiringLinks}
          pathname={pathname}
          onNavigate={onNavigate}
        />
        <NavSection
          title="Company"
          links={companyLinks}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      </nav>{" "}
      <div>
        <button className="flex gap-1" onClick={handleLogout}>
          <LogOut />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
