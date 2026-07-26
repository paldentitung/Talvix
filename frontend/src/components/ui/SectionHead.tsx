import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface SectionHeadProps {
  kicker?: string;
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
  align?: "left" | "center";
}

/**
 * Reusable section header used by Featured Jobs, Testimonials, and future
 * sections on Job Search / Dashboard pages that need a heading + "view all" link.
 */
export default function SectionHead({
  kicker,
  title,
  description,
  linkHref,
  linkLabel,
  align = "left",
}: SectionHeadProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`flex items-end justify-between gap-6 flex-wrap mb-10 ${
        isCenter ? "flex-col items-center text-center" : ""
      }`}
    >
      <div>
        {kicker && (
          <div className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wide mb-2">
            {kicker}
          </div>
        )}
        <h2 className="text-[32px] font-extrabold font-display">{title}</h2>
        {description && (
          <p className="text-[var(--text-secondary)] text-[15px] mt-1.5 max-w-[480px]">
            {description}
          </p>
        )}
      </div>

      {linkHref && linkLabel && (
        <Link
          to={linkHref}
          className="inline-flex items-center gap-1.5 font-semibold text-[14.5px] text-[var(--primary)] group"
        >
          {linkLabel}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
