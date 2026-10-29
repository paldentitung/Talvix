import type { IconType } from "../../../../shared/types/ui.types";

const EmptyState = ({ icon: Icon, text }: { icon: IconType; text: string }) => (
  <div className="flex flex-col items-center gap-2 py-6 text-center">
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-(--bg) text-(--text-muted)">
      <Icon size={18} />
    </span>
    <p className="text-sm text-(--text-muted)">{text}</p>
  </div>
);

export default EmptyState;
