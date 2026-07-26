import { Link } from "react-router-dom";
import Logo from "./Logo";
import Button from "../ui/Button";

const NAV_LINKS = [
  { label: "Find Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "For Employers", href: "/employers" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[var(--bg)]/75 backdrop-blur-lg border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {link.label}
            </Link>
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
