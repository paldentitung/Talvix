import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import Button from "../ui/Button";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Find Jobs", href: "/jobs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Close automatically when the viewport grows to desktop size
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-[var(--bg)]/75 backdrop-blur-lg border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Logo />

        {/* Desktop links */}
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

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <Button href="/login" variant="ghost" size="sm">
            Log in
          </Button>
          <Button href="/register" variant="primary" size="sm">
            Sign up free
          </Button>
        </div>

        {/* Hamburger (mobile only) */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="md:hidden -mr-2 flex h-10 w-10 items-center justify-center rounded-lg text-[var(--text-primary)] transition-colors hover:bg-[var(--card)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute inset-x-0 top-full overflow-hidden border-b border-[var(--border)] bg-[var(--bg)] shadow-lg transition-all duration-200 ease-out ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/"}
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--card)] hover:text-[var(--text-primary)]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div
            onClick={closeMenu}
            className="mt-3 flex flex-col gap-2.5 border-t border-[var(--border)] pt-4 [&>*]:w-full [&>*]:justify-center"
          >
            <Button href="/login" variant="ghost" size="sm">
              Log in
            </Button>
            <Button href="/register" variant="primary" size="sm">
              Sign up free
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
