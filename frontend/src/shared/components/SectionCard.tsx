import type { IconType } from "../types/ui.types";

type Props = {
  icon: IconType;
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  flush?: boolean; // remove body padding (tables, lists)
};

const SectionCard = ({
  icon: Icon,
  title,
  badge,
  children,
  className = "",
  flush = false,
}: Props) => (
  <section
    className={`overflow-hidden rounded-(--radius-lg) border border-(--border) bg-(--card) shadow-(--shadow-sm) ${className}`}
  >
    <div className="flex items-center justify-between border-b border-(--border) px-5 py-3.5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-(--primary)/10 text-(--primary)">
          <Icon size={14} />
        </span>
        <h3 className="font-display text-sm font-bold text-(--text-primary)">
          {title}
        </h3>
      </div>
      {badge}
    </div>
    <div className={flush ? "" : "p-5"}>{children}</div>
  </section>
);

export default SectionCard;
