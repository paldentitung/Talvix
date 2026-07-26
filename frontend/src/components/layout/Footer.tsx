import { Link } from "react-router-dom";
import Logo from "./Logo";
import { FaLinkedin, FaInstagram, FaXTwitter } from "react-icons/fa6";
const FOOTER_COLUMNS = [
  {
    title: "For Job Seekers",
    links: [
      { label: "Browse jobs", href: "/jobs" },
      { label: "Browse companies", href: "/companies" },
      { label: "Career advice", href: "/advice" },
      { label: "Salary guide", href: "/salary-guide" },
    ],
  },
  {
    title: "For Employers",
    links: [
      { label: "Post a job", href: "/employers/post" },
      { label: "Pricing", href: "/employers/pricing" },
      { label: "Talent search", href: "/employers/search" },
      { label: "Employer branding", href: "/employers/branding" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
      { label: "Cookie settings", href: "/cookies" },
    ],
  },
];

const SOCIAL_ICONS = [FaXTwitter, FaLinkedin, FaInstagram];

export default function Footer() {
  return (
    <footer className="bg-[var(--card)] border-t border-[var(--border)] pt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-8 pb-10">
          <div>
            <Logo />
            <p className="text-[var(--text-muted)] text-[13.5px] mt-2.5 max-w-[220px]">
              Where ambitious careers take off. Built for job seekers and the
              teams trying to reach them.
            </p>
            <div className="flex gap-2.5 mt-4">
              {SOCIAL_ICONS.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-[34px] h-[34px] rounded-full bg-[var(--bg)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13.5px] font-bold mb-4">{col.title}</h4>
              {col.links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-[13.5px] text-[var(--text-secondary)] mb-2.5 hover:text-[var(--primary)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border)] py-6 text-[13px] text-[var(--text-muted)] flex-wrap gap-2.5">
          <span>© 2026 Talvix, Inc. All rights reserved.</span>
          <span>Made for people building real careers.</span>
        </div>
      </div>
    </footer>
  );
}
