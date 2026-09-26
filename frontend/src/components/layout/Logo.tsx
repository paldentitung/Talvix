import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 font-bold text-[19px] font-display"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className="shrink-0"
      >
        {/* container so the mark never sits directly on the page bg */}
        <rect x="0" y="0" width="32" height="32" rx="8" fill="var(--primary)" />
        <path d="M18 16H28V22H18V16Z" fill="var(--accent)" />
        <path
          d="M9 12L13 16L20 8"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Talvix
    </Link>
  );
}
