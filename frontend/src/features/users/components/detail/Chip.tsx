import type { IconType } from "../../../../shared/types/ui.types";

export const Chip = ({
  icon: Icon,
  className = "bg-(--bg) text-(--text-secondary)",
  children,
}: {
  icon?: IconType;
  className?: string;
  children: React.ReactNode;
}) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${className}`}
  >
    {Icon && <Icon size={12} />}
    {children}
  </span>
);

export const Count = ({ n }: { n: number }) => <Chip>{n}</Chip>;
