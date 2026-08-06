import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import Button from "../ui/Button";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Find Jobs", href: "/jobs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[var(--bg)]/75 backdrop-blur-lg border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/"}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[var(--primary)] underline underline-offset-6 underline-3 decoration-[var(--primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <Button href="/login" variant="ghost" size="sm">
            Log in
          </Button>
          <Button href="/register" variant="primary" size="sm">
            Sign up free
          </Button>
        </div>
      </div>
    </nav>
  );
}
