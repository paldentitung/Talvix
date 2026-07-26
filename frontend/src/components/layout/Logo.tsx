import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 font-bold text-[19px] font-display"
    >
      <span className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white flex items-center justify-center text-base">
        T
      </span>
      Talvix
    </Link>
  );
}
