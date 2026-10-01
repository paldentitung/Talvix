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
      className={`mb-8 sm:mb-10 flex gap-4 sm:gap-6 ${
        isCenter
          ? "flex-col items-center text-center"
          : "flex-col items-start sm:flex-row sm:items-end sm:justify-between"
      }`}
    >
      <div className={isCenter ? "mx-auto" : ""}>
        {kicker && (
          <div className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wide mb-2">
            {kicker}
          </div>
        )}
        <h2 className="text-[26px] sm:text-[30px] lg:text-[32px] leading-tight font-extrabold font-display text-balance">
          {title}
        </h2>
        {description && (
          <p
            className={`text-[var(--text-secondary)] text-[15px] mt-1.5 max-w-[480px] ${
              isCenter ? "mx-auto" : ""
            }`}
          >
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
